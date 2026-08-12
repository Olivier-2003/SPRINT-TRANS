import { db } from "@/lib/db";
import { computeDriverAvailability, computeBusAvailability } from "@/lib/availability-engine";
import type { DriverIssueType, BusIssueType, AvailabilityIssue } from "@/lib/availability-engine";
import type { BookingStatus } from "@/lib/generated/prisma/client";

/**
 * Wspólna warstwa danych dla widoku dziennego/tygodniowego kalendarza — dla każdego
 * zlecenia w zadanym zakresie dat oblicza status dostępności przypisanych kierowców
 * i autobusów (ten sam silnik co strona szczegółów zlecenia), tak aby konflikty i
 * ostrzeżenia były widoczne bez wchodzenia w każde zlecenie osobno.
 */

export interface ScheduleDriverEntry {
  id: string;
  name: string;
  roleOnTrip: string | null;
  issues: AvailabilityIssue<DriverIssueType>[];
}

export interface ScheduleBusEntry {
  id: string;
  label: string;
  issues: AvailabilityIssue<BusIssueType>[];
}

export interface ScheduleBookingEntry {
  id: string;
  customerName: string;
  startAt: Date;
  endAt: Date;
  status: BookingStatus;
  drivers: ScheduleDriverEntry[];
  buses: ScheduleBusEntry[];
  hasWarning: boolean;
  missingDriver: boolean;
  missingBus: boolean;
}

export async function getScheduleEntries(rangeStart: Date, rangeEnd: Date): Promise<ScheduleBookingEntry[]> {
  const bookings = await db.booking.findMany({
    where: {
      status: { not: "ANULOWANE" },
      startAt: { lt: rangeEnd },
      endAt: { gt: rangeStart },
    },
    include: {
      drivers: { include: { driver: { select: { firstName: true, lastName: true } } } },
      buses: { include: { bus: { select: { registrationNumber: true, brandModel: true } } } },
      sourceInquiry: { select: { type: true } },
    },
    orderBy: { startAt: "asc" },
  });

  const entries: ScheduleBookingEntry[] = [];
  for (const booking of bookings) {
    const driverIds = booking.drivers.map((d) => d.driverId);
    const busIds = booking.buses.map((b) => b.busId);

    const [driverStatuses, busStatuses] = await Promise.all([
      driverIds.length > 0
        ? computeDriverAvailability({
            startAt: booking.startAt,
            endAt: booking.endAt,
            excludeBookingId: booking.id,
            inquiryType: booking.sourceInquiry?.type ?? null,
            driverIds,
          })
        : Promise.resolve(new Map()),
      busIds.length > 0
        ? computeBusAvailability({
            startAt: booking.startAt,
            endAt: booking.endAt,
            excludeBookingId: booking.id,
            busIds,
          })
        : Promise.resolve(new Map()),
    ]);

    const drivers: ScheduleDriverEntry[] = booking.drivers.map((d) => ({
      id: d.driverId,
      name: `${d.driver.firstName} ${d.driver.lastName}`,
      roleOnTrip: d.roleOnTrip,
      issues: driverStatuses.get(d.driverId)?.issues ?? [],
    }));
    const buses: ScheduleBusEntry[] = booking.buses.map((b) => ({
      id: b.busId,
      label: `${b.bus.registrationNumber} — ${b.bus.brandModel}`,
      issues: busStatuses.get(b.busId)?.issues ?? [],
    }));

    const missingDriver = drivers.length === 0;
    const missingBus = buses.length === 0;
    const hasWarning =
      missingDriver || missingBus || drivers.some((d) => d.issues.length > 0) || buses.some((b) => b.issues.length > 0);

    entries.push({
      id: booking.id,
      customerName: booking.customerName,
      startAt: booking.startAt,
      endAt: booking.endAt,
      status: booking.status,
      drivers,
      buses,
      hasWarning,
      missingDriver,
      missingBus,
    });
  }

  return entries;
}
