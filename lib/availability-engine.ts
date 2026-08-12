import { db } from "@/lib/db";
import { getDriverAvailabilityOverlapping } from "@/lib/data/driver-availability";
import { getBusAvailabilityOverlapping } from "@/lib/data/bus-availability";
import { DRIVER_AVAILABILITY_BLOCKING_TYPES, DRIVER_AVAILABILITY_TYPE_LABELS } from "@/lib/driver-availability-labels";
import { BUS_AVAILABILITY_BLOCKING_TYPES, BUS_AVAILABILITY_TYPE_LABELS } from "@/lib/bus-availability-labels";
import type { InquiryType } from "@/lib/generated/prisma/client";

/**
 * Silnik statusu dostępności — łączy zajętość wynikającą ze zleceń (Booking/BookingDriver/
 * BookingBus) z ręcznie wprowadzoną niedostępnością (DriverAvailability/BusAvailability).
 * Nigdy nie blokuje twardo samej akcji przypisania — zwraca wyłącznie czytelny status
 * i listę powodów, na podstawie których administrator podejmuje ostateczną decyzję.
 * Podstawa pod przyszły automatyczny algorytm przydziału (Etap 9).
 */

export type IssueSeverity = "blocker" | "warning";
export type OverallStatus = "DOSTEPNY" | "OSTRZEZENIE" | "KONFLIKT";

export type DriverIssueType =
  | "KONFLIKT_ZLECENIE"
  | "NIEDOSTEPNOSC"
  | "PROBLEM_ODPOCZYNEK"
  | "OGRANICZENIE_RODZAJU_PRACY"
  | "DOSTEPNOSC_CZESCIOWA";

export type BusIssueType = "KONFLIKT_ZLECENIE" | "NIEDOSTEPNOSC";

export interface AvailabilityIssue<T extends string> {
  type: T;
  severity: IssueSeverity;
  message: string;
}

export interface DriverAvailabilityResult {
  driverId: string;
  status: OverallStatus;
  issues: AvailabilityIssue<DriverIssueType>[];
}

export interface BusAvailabilityResult {
  busId: string;
  status: OverallStatus;
  issues: AvailabilityIssue<BusIssueType>[];
}

const REST_LOOKAROUND_HOURS = 72;

function overallStatus<T extends string>(issues: AvailabilityIssue<T>[]): OverallStatus {
  if (issues.some((issue) => issue.severity === "blocker")) return "KONFLIKT";
  if (issues.length > 0) return "OSTRZEZENIE";
  return "DOSTEPNY";
}

function formatRange(start: Date, end: Date): string {
  const fmt = (d: Date) =>
    d.toLocaleString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  return `${fmt(start)}–${fmt(end)}`;
}

interface ComputeDriverAvailabilityParams {
  startAt: Date;
  endAt: Date;
  excludeBookingId?: string;
  inquiryType?: InquiryType | null;
  driverIds?: string[];
}

export async function computeDriverAvailability(
  params: ComputeDriverAvailabilityParams
): Promise<Map<string, DriverAvailabilityResult>> {
  const { startAt, endAt, excludeBookingId, inquiryType, driverIds } = params;

  const drivers = await db.driver.findMany({
    where: driverIds ? { id: { in: driverIds } } : {},
    select: { id: true, restingHoursRequired: true, restrictedWorkTypes: true },
  });

  const paddedStart = new Date(startAt.getTime() - REST_LOOKAROUND_HOURS * 60 * 60 * 1000);
  const paddedEnd = new Date(endAt.getTime() + REST_LOOKAROUND_HOURS * 60 * 60 * 1000);

  const nearbyBookings = await db.booking.findMany({
    where: {
      status: { not: "ANULOWANE" },
      startAt: { lt: paddedEnd },
      endAt: { gt: paddedStart },
      ...(excludeBookingId ? { id: { not: excludeBookingId } } : {}),
    },
    select: {
      id: true,
      customerName: true,
      startAt: true,
      endAt: true,
      drivers: { select: { driverId: true } },
    },
  });

  const availabilityRecords = await getDriverAvailabilityOverlapping(
    startAt,
    endAt,
    driverIds
  );

  const results = new Map<string, DriverAvailabilityResult>();

  for (const driver of drivers) {
    const issues: AvailabilityIssue<DriverIssueType>[] = [];
    const driverBookings = nearbyBookings.filter((b) =>
      b.drivers.some((d) => d.driverId === driver.id)
    );

    // Bezpośredni konflikt terminowy z innym zleceniem.
    for (const booking of driverBookings) {
      const overlaps = booking.startAt.getTime() < endAt.getTime() && booking.endAt.getTime() > startAt.getTime();
      if (overlaps) {
        issues.push({
          type: "KONFLIKT_ZLECENIE",
          severity: "blocker",
          message: `Konflikt ze zleceniem: ${booking.customerName} (${formatRange(booking.startAt, booking.endAt)})`,
        });
      }
    }

    // Ręcznie wprowadzona niedostępność / częściowa dostępność.
    for (const record of availabilityRecords) {
      if (record.driverId !== driver.id) continue;
      const label = DRIVER_AVAILABILITY_TYPE_LABELS[record.type];
      const range = formatRange(record.startAt, record.endAt);
      const detail = record.note ? `${label}: ${record.note} (${range})` : `${label} (${range})`;
      if (DRIVER_AVAILABILITY_BLOCKING_TYPES.includes(record.type)) {
        issues.push({ type: "NIEDOSTEPNOSC", severity: "blocker", message: detail });
      } else {
        issues.push({ type: "DOSTEPNOSC_CZESCIOWA", severity: "warning", message: detail });
      }
    }

    // Problem z odpoczynkiem — luka do najbliższego zlecenia przed/po jest krótsza
    // niż wymagany minimalny odpoczynek tego kierowcy.
    const restingHours = Number(driver.restingHoursRequired);
    const nonOverlapping = driverBookings.filter(
      (b) => b.endAt.getTime() <= startAt.getTime() || b.startAt.getTime() >= endAt.getTime()
    );
    const before = nonOverlapping
      .filter((b) => b.endAt.getTime() <= startAt.getTime())
      .sort((a, b) => b.endAt.getTime() - a.endAt.getTime())[0];
    const after = nonOverlapping
      .filter((b) => b.startAt.getTime() >= endAt.getTime())
      .sort((a, b) => a.startAt.getTime() - b.startAt.getTime())[0];

    if (before) {
      const gapHours = (startAt.getTime() - before.endAt.getTime()) / (1000 * 60 * 60);
      if (gapHours < restingHours) {
        issues.push({
          type: "PROBLEM_ODPOCZYNEK",
          severity: "warning",
          message: `Tylko ${gapHours.toFixed(1)} h odpoczynku po zleceniu "${before.customerName}" (wymagane ${restingHours} h).`,
        });
      }
    }
    if (after) {
      const gapHours = (after.startAt.getTime() - endAt.getTime()) / (1000 * 60 * 60);
      if (gapHours < restingHours) {
        issues.push({
          type: "PROBLEM_ODPOCZYNEK",
          severity: "warning",
          message: `Tylko ${gapHours.toFixed(1)} h odpoczynku przed zleceniem "${after.customerName}" (wymagane ${restingHours} h).`,
        });
      }
    }

    // Ograniczenie rodzaju pracy.
    if (inquiryType && driver.restrictedWorkTypes.includes(inquiryType)) {
      issues.push({
        type: "OGRANICZENIE_RODZAJU_PRACY",
        severity: "warning",
        message: "Kierowca ma ustawione ograniczenie dla tego rodzaju zlecenia.",
      });
    }

    results.set(driver.id, { driverId: driver.id, status: overallStatus(issues), issues });
  }

  return results;
}

interface ComputeBusAvailabilityParams {
  startAt: Date;
  endAt: Date;
  excludeBookingId?: string;
  busIds?: string[];
}

export async function computeBusAvailability(
  params: ComputeBusAvailabilityParams
): Promise<Map<string, BusAvailabilityResult>> {
  const { startAt, endAt, excludeBookingId, busIds } = params;

  const buses = await db.bus.findMany({
    where: busIds ? { id: { in: busIds } } : {},
    select: { id: true },
  });

  const overlappingBookings = await db.booking.findMany({
    where: {
      status: { not: "ANULOWANE" },
      startAt: { lt: endAt },
      endAt: { gt: startAt },
      ...(excludeBookingId ? { id: { not: excludeBookingId } } : {}),
    },
    select: {
      customerName: true,
      startAt: true,
      endAt: true,
      buses: { select: { busId: true } },
    },
  });

  const availabilityRecords = await getBusAvailabilityOverlapping(startAt, endAt, busIds);

  const results = new Map<string, BusAvailabilityResult>();

  for (const bus of buses) {
    const issues: AvailabilityIssue<BusIssueType>[] = [];

    for (const booking of overlappingBookings) {
      if (booking.buses.some((b) => b.busId === bus.id)) {
        issues.push({
          type: "KONFLIKT_ZLECENIE",
          severity: "blocker",
          message: `Konflikt ze zleceniem: ${booking.customerName} (${formatRange(booking.startAt, booking.endAt)})`,
        });
      }
    }

    for (const record of availabilityRecords) {
      if (record.busId !== bus.id) continue;
      if (!BUS_AVAILABILITY_BLOCKING_TYPES.includes(record.type)) continue;
      const label = BUS_AVAILABILITY_TYPE_LABELS[record.type];
      const range = formatRange(record.startAt, record.endAt);
      const detail = record.note ? `${label}: ${record.note} (${range})` : `${label} (${range})`;
      issues.push({ type: "NIEDOSTEPNOSC", severity: "blocker", message: detail });
    }

    results.set(bus.id, { busId: bus.id, status: overallStatus(issues), issues });
  }

  return results;
}
