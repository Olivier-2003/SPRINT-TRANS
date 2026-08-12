import { db } from "@/lib/db";
import {
  computeDriverAvailability,
  computeBusAvailability,
  type OverallStatus,
  type AvailabilityIssue,
  type DriverIssueType,
  type BusIssueType,
  type VirtualAssignment,
} from "@/lib/availability-engine";
import { getDriverRecommendations, type DriverRecommendation } from "@/lib/driver-recommendation";
import { getDriverMonthlySummaries, overlapHours } from "@/lib/driver-timesheet";
import { DRIVER_AVAILABILITY_BLOCKING_TYPES } from "@/lib/driver-availability-labels";
import { BUS_AVAILABILITY_BLOCKING_TYPES } from "@/lib/bus-availability-labels";
import type { DriverLineRole } from "@/lib/generated/prisma/client";

/**
 * Generator propozycji grafiku (Etap 9) — rozwija fundament z Etapu 8 (getScheduleProposal)
 * w pełny mechanizm analizujący CAŁY wybrany okres naraz, a nie każde zlecenie z osobna.
 *
 * WYŁĄCZNIE REKOMENDACJA: ta funkcja nigdy nie zapisuje niczego do bazy danych. Zwraca
 * kompletną, w pełni opisaną propozycję, którą administrator przegląda, może ręcznie
 * skorygować i dopiero świadomą, osobną akcją "Zatwierdź grafik" (lib/actions/schedule.ts)
 * zamienia w rzeczywiste przypisania.
 *
 * ALGORYTM (uproszczony, nie jest to solver optymalizacyjny — celowo, zgodnie z ustaleniami):
 * 1. Zlecenia z już poprawnym, bezkonfliktowym przydziałem są zachowywane bez zmian.
 * 2. Pozostałe zlecenia (brak kierowcy/autobusu lub konflikt obecnego przydziału) trafiają
 *    do "konkurencyjnej" puli i są rozwiązywane iteracyjnie metodą "najpierw najbardziej
 *    ograniczone" (ang. most-constrained-first): w każdej iteracji wybierane jest zlecenie
 *    mające obecnie NAJMNIEJ wykonalnych kandydatów spośród pozostałych nierozwiązanych,
 *    dostaje ono swojego najlepszego kandydata, a ten kandydat staje się "zajęty" (wirtualne
 *    przypisanie) dla wszystkich kolejnych ocen w tym samym przebiegu. Dzięki temu kierowca,
 *    który jest jedynym sensownym wyborem dla zlecenia B, nie zostaje "zabrany" wcześniej
 *    przez mniej wymagające zlecenie A — dokładnie efekt opisany w wymaganiach Etapu 9.
 * 3. Ranking "ograniczenia" (do samego wyboru KOLEJNOŚCI rozwiązywania) liczony jest tanim,
 *    wyłącznie w pamięci wskaźnikiem zajętości/blokad — pełna, dokładna ocena z powodami
 *    (silnik lib/driver-recommendation.ts) wywoływana jest tylko raz, dla faktycznie
 *    wybranego zlecenia, żeby uniknąć wykonania tysięcy zapytań do bazy przy większych
 *    zakresach dat.
 * 4. Kierowcy i autobusy są dwiema niezależnymi pulami zasobów — rozwiązywane osobno.
 */

export type SlotStatus = "POPRAWNE" | "OSTRZEZENIE" | "KONFLIKT" | "BRAK_OBSADY";

export interface DriverCandidateOption {
  driverId: string;
  driverName: string;
  status: OverallStatus;
  issues: AvailabilityIssue<DriverIssueType>[];
  reason: string;
  lineRole: DriverLineRole | null;
  monthlyHours: number;
}

export interface BusCandidateOption {
  busId: string;
  label: string;
  status: OverallStatus;
  issues: AvailabilityIssue<BusIssueType>[];
  reason: string;
}

export interface DriverSlotProposal {
  status: SlotStatus;
  driverId: string | null;
  driverName: string | null;
  reason: string;
  changed: boolean;
  alternatives: DriverCandidateOption[];
}

export interface BusSlotProposal {
  status: SlotStatus;
  busId: string | null;
  busLabel: string | null;
  reason: string;
  changed: boolean;
  alternatives: BusCandidateOption[];
}

export interface ScheduleBookingSlot {
  bookingId: string;
  customerName: string;
  startAt: Date;
  endAt: Date;
  lineName: string | null;
  currentDriverId: string | null;
  currentDriverNames: string[];
  currentBusId: string | null;
  currentBusLabels: string[];
  driverProposal: DriverSlotProposal;
  busProposal: BusSlotProposal;
}

export interface DriverMonthlyForecastEntry {
  driverId: string;
  driverName: string;
  year: number;
  month: number;
  monthlyNorm: number | null;
  currentPlannedHours: number;
  proposedDeltaHours: number;
  projectedTotalHours: number;
  projectedOvertimeHours: number | null;
  projectedDeficitHours: number | null;
}

export interface StatusTally {
  total: number;
  poprawne: number;
  ostrzezenie: number;
  konflikt: number;
  brakObsady: number;
}

export interface ScheduleGenerationResult {
  rangeStart: Date;
  rangeEnd: Date;
  slots: ScheduleBookingSlot[];
  driverForecast: DriverMonthlyForecastEntry[];
  /** Zliczenie per pozycja (kierowca + autobus osobno dla każdego zlecenia). */
  slotSummary: StatusTally;
  /** Zliczenie per zlecenie (najgorszy z dwóch statusów: kierowca/autobus) — do
   *  podsumowania przed zatwierdzeniem grafiku (punkt 8 wymagań Etapu 9). */
  bookingSummary: StatusTally;
}

const REST_PADDING_HOURS = 72;
const MS_PER_HOUR = 60 * 60 * 1000;

function toSlotStatus(status: OverallStatus): SlotStatus {
  return status === "DOSTEPNY" ? "POPRAWNE" : status;
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}`;
}

function monthsInRange(start: Date, end: Date): { year: number; month: number }[] {
  const months: { year: number; month: number }[] = [];
  let cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  const last = new Date(end.getFullYear(), end.getMonth(), 1);
  while (cursor.getTime() <= last.getTime()) {
    months.push({ year: cursor.getFullYear(), month: cursor.getMonth() + 1 });
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }
  return months;
}

/** Rejestruje godziny wynikające z jednego przypisania w odpowiednich miesięcznych "kubełkach". */
function addTrackedHours(
  tracker: Map<string, Map<string, number>>,
  driverId: string,
  startAt: Date,
  endAt: Date
) {
  let byMonth = tracker.get(driverId);
  if (!byMonth) {
    byMonth = new Map();
    tracker.set(driverId, byMonth);
  }
  for (const { year, month } of monthsInRange(startAt, endAt)) {
    const mStart = new Date(year, month - 1, 1);
    const mEnd = new Date(year, month, 1);
    const hours = overlapHours(startAt, endAt, mStart, mEnd);
    if (hours > 0) {
      const key = `${year}-${month}`;
      byMonth.set(key, (byMonth.get(key) ?? 0) + hours);
    }
  }
}

function extraHoursForMonth(tracker: Map<string, Map<string, number>>, date: Date): Map<string, number> {
  const key = monthKey(date);
  const result = new Map<string, number>();
  for (const [driverId, byMonth] of tracker) {
    const hours = byMonth.get(key);
    if (hours) result.set(driverId, hours);
  }
  return result;
}

function buildDriverReason(rec: DriverRecommendation): string {
  const norm = rec.monthlyBalanceHours != null ? rec.monthlyHours - rec.monthlyBalanceHours : null;
  const hoursPart = norm != null ? `${rec.monthlyHours.toFixed(0)}/${norm.toFixed(0)} h w miesiącu` : null;
  const parts = [...rec.reasons];
  if (hoursPart) parts.push(hoursPart);
  // Dla OSTRZEZENIE/KONFLIKT ogólnikowy wpis z rec.reasons ("sprawdź ostrzeżenia poniżej")
  // nie wystarcza, bo generator grafiku nie ma osobnej listy ostrzeżeń pod spodem —
  // powód musi samodzielnie tłumaczyć, na czym polega problem.
  if (rec.status !== "DOSTEPNY" && rec.issues.length > 0) {
    parts.push(...rec.issues.map((i) => i.message));
  }
  return parts.length > 0 ? parts.join("; ") + "." : "Brak szczególnych wyróżników.";
}

function buildBusReason(status: OverallStatus, issues: AvailabilityIssue<BusIssueType>[]): string {
  if (status === "DOSTEPNY") return "Brak konfliktów terminowych, autobus dostępny.";
  return issues.map((i) => i.message).join("; ") || "Sprawdź szczegóły dostępności.";
}

interface BookingForGeneration {
  id: string;
  customerName: string;
  startAt: Date;
  endAt: Date;
  inquiryType: import("@/lib/generated/prisma/client").InquiryType | null;
  lineId: string | null;
  lineName: string | null;
  primaryDriverId: string | null;
  primaryDriverName: string | null;
  primaryBusId: string | null;
  primaryBusLabel: string | null;
}

export async function generateScheduleProposal(
  rangeStart: Date,
  rangeEnd: Date
): Promise<ScheduleGenerationResult> {
  const rawBookings = await db.booking.findMany({
    where: {
      status: { in: ["ZAPLANOWANE", "W_TRAKCIE"] },
      startAt: { lt: rangeEnd },
      endAt: { gt: rangeStart },
    },
    include: {
      drivers: { include: { driver: { select: { firstName: true, lastName: true } } } },
      buses: { include: { bus: { select: { registrationNumber: true, brandModel: true } } } },
      sourceInquiry: { select: { type: true, relatedLineId: true, relatedLine: { select: { name: true } } } },
    },
    orderBy: { startAt: "asc" },
  });

  const bookings: BookingForGeneration[] = rawBookings.map((b) => {
    const mainDriver = b.drivers.find((d) => d.roleOnTrip === "GLOWNY") ?? b.drivers[0] ?? null;
    const mainBus = b.buses[0] ?? null;
    return {
      id: b.id,
      customerName: b.customerName,
      startAt: b.startAt,
      endAt: b.endAt,
      inquiryType: b.sourceInquiry?.type ?? null,
      lineId: b.sourceInquiry?.relatedLineId ?? null,
      lineName: b.sourceInquiry?.relatedLine?.name ?? null,
      primaryDriverId: mainDriver?.driverId ?? null,
      primaryDriverName: mainDriver ? `${mainDriver.driver.firstName} ${mainDriver.driver.lastName}` : null,
      primaryBusId: mainBus?.busId ?? null,
      primaryBusLabel: mainBus ? `${mainBus.bus.registrationNumber} — ${mainBus.bus.brandModel}` : null,
    };
  });

  // --- Tani, w pełni pamięciowy podgląd zajętości (wyłącznie do ustalania kolejności) ---
  const paddedStart = new Date(rangeStart.getTime() - REST_PADDING_HOURS * MS_PER_HOUR);
  const paddedEnd = new Date(rangeEnd.getTime() + REST_PADDING_HOURS * MS_PER_HOUR);

  const [allActiveDrivers, allActiveBuses, nearbyBookingsRaw, driverBlocks, busBlocks] = await Promise.all([
    db.driver.findMany({ where: { employmentStatus: "ACTIVE" }, select: { id: true } }),
    db.bus.findMany({ where: { status: "ACTIVE" }, select: { id: true } }),
    db.booking.findMany({
      where: { status: { not: "ANULOWANE" }, startAt: { lt: paddedEnd }, endAt: { gt: paddedStart } },
      select: {
        id: true,
        startAt: true,
        endAt: true,
        drivers: { select: { driverId: true } },
        buses: { select: { busId: true } },
      },
    }),
    db.driverAvailability.findMany({ where: { startAt: { lt: paddedEnd }, endAt: { gt: paddedStart } } }),
    db.busAvailability.findMany({ where: { startAt: { lt: paddedEnd }, endAt: { gt: paddedStart } } }),
  ]);

  const driverVirtual: VirtualAssignment[] = [];
  const busVirtual: VirtualAssignment[] = [];

  function quickDriverFree(driverId: string, startAt: Date, endAt: Date, excludeBookingId: string): boolean {
    const overlapsReal = nearbyBookingsRaw.some(
      (b) =>
        b.id !== excludeBookingId &&
        b.startAt.getTime() < endAt.getTime() &&
        b.endAt.getTime() > startAt.getTime() &&
        b.drivers.some((d) => d.driverId === driverId)
    );
    if (overlapsReal) return false;
    const overlapsVirtual = driverVirtual.some(
      (v) => v.driverId === driverId && v.startAt.getTime() < endAt.getTime() && v.endAt.getTime() > startAt.getTime()
    );
    if (overlapsVirtual) return false;
    const blocked = driverBlocks.some(
      (r) =>
        r.driverId === driverId &&
        DRIVER_AVAILABILITY_BLOCKING_TYPES.includes(r.type) &&
        r.startAt.getTime() < endAt.getTime() &&
        r.endAt.getTime() > startAt.getTime()
    );
    return !blocked;
  }

  function quickBusFree(busId: string, startAt: Date, endAt: Date, excludeBookingId: string): boolean {
    const overlapsReal = nearbyBookingsRaw.some(
      (b) =>
        b.id !== excludeBookingId &&
        b.startAt.getTime() < endAt.getTime() &&
        b.endAt.getTime() > startAt.getTime() &&
        b.buses.some((x) => x.busId === busId)
    );
    if (overlapsReal) return false;
    const overlapsVirtual = busVirtual.some(
      (v) => v.busId === busId && v.startAt.getTime() < endAt.getTime() && v.endAt.getTime() > startAt.getTime()
    );
    if (overlapsVirtual) return false;
    const blocked = busBlocks.some(
      (r) =>
        r.busId === busId &&
        BUS_AVAILABILITY_BLOCKING_TYPES.includes(r.type) &&
        r.startAt.getTime() < endAt.getTime() &&
        r.endAt.getTime() > startAt.getTime()
    );
    return !blocked;
  }

  // --- Rozwiązywanie przydziałów kierowców ---
  const driverProposals = new Map<string, DriverSlotProposal>();
  const driverHoursTracker = new Map<string, Map<string, number>>();
  const driverNeedsResolution: BookingForGeneration[] = [];

  for (const booking of bookings) {
    if (!booking.primaryDriverId) {
      driverNeedsResolution.push(booking);
      continue;
    }
    const status = await computeDriverAvailability({
      startAt: booking.startAt,
      endAt: booking.endAt,
      excludeBookingId: booking.id,
      inquiryType: booking.inquiryType,
      driverIds: [booking.primaryDriverId],
    });
    const result = status.get(booking.primaryDriverId);
    if (!result || result.status === "KONFLIKT") {
      driverNeedsResolution.push(booking);
    } else {
      driverProposals.set(booking.id, {
        status: toSlotStatus(result.status),
        driverId: booking.primaryDriverId,
        driverName: booking.primaryDriverName,
        reason:
          result.issues.length > 0
            ? `Obecne przypisanie: ${result.issues.map((i) => i.message).join("; ")}.`
            : "Obecne przypisanie bez zastrzeżeń.",
        changed: false,
        alternatives: [],
      });
      addTrackedHours(driverHoursTracker, booking.primaryDriverId, booking.startAt, booking.endAt);
    }
  }

  const remainingDrivers = [...driverNeedsResolution];
  while (remainingDrivers.length > 0) {
    let bestIndex = 0;
    let bestCount = Infinity;
    for (let i = 0; i < remainingDrivers.length; i++) {
      const b = remainingDrivers[i];
      const freeCount = allActiveDrivers.filter((d) => quickDriverFree(d.id, b.startAt, b.endAt, b.id)).length;
      if (freeCount < bestCount || (freeCount === bestCount && b.startAt.getTime() < remainingDrivers[bestIndex].startAt.getTime())) {
        bestCount = freeCount;
        bestIndex = i;
      }
    }
    const booking = remainingDrivers.splice(bestIndex, 1)[0];

    const recommendations = await getDriverRecommendations({
      startAt: booking.startAt,
      endAt: booking.endAt,
      excludeBookingId: booking.id,
      inquiryType: booking.inquiryType,
      lineId: booking.lineId,
      virtualAssignments: driverVirtual,
      extraMonthlyHoursByDriver: extraHoursForMonth(driverHoursTracker, booking.startAt),
    });

    const alternatives: DriverCandidateOption[] = recommendations.map((r) => ({
      driverId: r.driverId,
      driverName: r.driverName,
      status: r.status,
      issues: r.issues,
      reason: buildDriverReason(r),
      lineRole: r.lineRole,
      monthlyHours: r.monthlyHours,
    }));

    const top = recommendations[0];
    let proposal: DriverSlotProposal;

    if (!top) {
      proposal = {
        status: "BRAK_OBSADY",
        driverId: null,
        driverName: null,
        reason: "Brak aktywnych kierowców w systemie.",
        changed: booking.primaryDriverId !== null,
        alternatives,
      };
    } else if (top.status === "KONFLIKT") {
      if (booking.primaryDriverId) {
        const currentIssue = recommendations.find((r) => r.driverId === booking.primaryDriverId);
        proposal = {
          status: "KONFLIKT",
          driverId: booking.primaryDriverId,
          driverName: booking.primaryDriverName,
          reason: `Obecny przydział ma konflikt, brak lepszej alternatywy: ${
            currentIssue?.issues.map((i) => i.message).join("; ") ?? "sprawdź szczegóły."
          }`,
          changed: false,
          alternatives,
        };
        addTrackedHours(driverHoursTracker, booking.primaryDriverId, booking.startAt, booking.endAt);
      } else {
        proposal = {
          status: "BRAK_OBSADY",
          driverId: null,
          driverName: null,
          reason: "Brak rekomendacji: pozostali kierowcy są na urlopie lub mają konflikt z innym zleceniem.",
          changed: false,
          alternatives,
        };
      }
    } else {
      const wasReplacement = booking.primaryDriverId && booking.primaryDriverId !== top.driverId;
      proposal = {
        status: toSlotStatus(top.status),
        driverId: top.driverId,
        driverName: top.driverName,
        reason: wasReplacement
          ? `Wykryto konflikt obecnego przydziału (${booking.primaryDriverName ?? "poprzedni kierowca"}) — zaproponowano zastępcę. ${buildDriverReason(top)}`
          : buildDriverReason(top),
        changed: booking.primaryDriverId !== top.driverId,
        alternatives,
      };
      driverVirtual.push({
        driverId: top.driverId,
        startAt: booking.startAt,
        endAt: booking.endAt,
        label: `Propozycja: ${booking.customerName}`,
      });
      addTrackedHours(driverHoursTracker, top.driverId, booking.startAt, booking.endAt);
    }

    driverProposals.set(booking.id, proposal);
  }

  // --- Rozwiązywanie przydziałów autobusów ---
  const busProposals = new Map<string, BusSlotProposal>();
  const busNeedsResolution: BookingForGeneration[] = [];

  for (const booking of bookings) {
    if (!booking.primaryBusId) {
      busNeedsResolution.push(booking);
      continue;
    }
    const status = await computeBusAvailability({
      startAt: booking.startAt,
      endAt: booking.endAt,
      excludeBookingId: booking.id,
      busIds: [booking.primaryBusId],
    });
    const result = status.get(booking.primaryBusId);
    if (!result || result.status === "KONFLIKT") {
      busNeedsResolution.push(booking);
    } else {
      busProposals.set(booking.id, {
        status: toSlotStatus(result.status),
        busId: booking.primaryBusId,
        busLabel: booking.primaryBusLabel,
        reason:
          result.issues.length > 0
            ? `Obecne przypisanie: ${result.issues.map((i) => i.message).join("; ")}.`
            : "Obecne przypisanie bez zastrzeżeń.",
        changed: false,
        alternatives: [],
      });
    }
  }

  const remainingBuses = [...busNeedsResolution];
  while (remainingBuses.length > 0) {
    let bestIndex = 0;
    let bestCount = Infinity;
    for (let i = 0; i < remainingBuses.length; i++) {
      const b = remainingBuses[i];
      const freeCount = allActiveBuses.filter((bus) => quickBusFree(bus.id, b.startAt, b.endAt, b.id)).length;
      if (freeCount < bestCount || (freeCount === bestCount && b.startAt.getTime() < remainingBuses[bestIndex].startAt.getTime())) {
        bestCount = freeCount;
        bestIndex = i;
      }
    }
    const booking = remainingBuses.splice(bestIndex, 1)[0];

    const [buses, busStatuses] = await Promise.all([
      db.bus.findMany({ where: { status: "ACTIVE" }, orderBy: { registrationNumber: "asc" } }),
      computeBusAvailability({
        startAt: booking.startAt,
        endAt: booking.endAt,
        excludeBookingId: booking.id,
        virtualAssignments: busVirtual,
      }),
    ]);

    const ranked = buses
      .map((bus) => {
        const result = busStatuses.get(bus.id) ?? { busId: bus.id, status: "DOSTEPNY" as const, issues: [] };
        return {
          busId: bus.id,
          label: `${bus.registrationNumber} — ${bus.brandModel}`,
          status: result.status,
          issues: result.issues,
          reason: buildBusReason(result.status, result.issues),
        };
      })
      .sort((a, b) => {
        const order = { DOSTEPNY: 0, OSTRZEZENIE: 1, KONFLIKT: 2 };
        return order[a.status] - order[b.status] || a.label.localeCompare(b.label, "pl");
      });

    const top = ranked[0];
    let proposal: BusSlotProposal;

    if (!top) {
      proposal = {
        status: "BRAK_OBSADY",
        busId: null,
        busLabel: null,
        reason: "Brak aktywnych autobusów w systemie.",
        changed: booking.primaryBusId !== null,
        alternatives: ranked,
      };
    } else if (top.status === "KONFLIKT") {
      if (booking.primaryBusId) {
        const currentOption = ranked.find((r) => r.busId === booking.primaryBusId);
        proposal = {
          status: "KONFLIKT",
          busId: booking.primaryBusId,
          busLabel: booking.primaryBusLabel,
          reason: `Obecny przydział ma konflikt, brak lepszej alternatywy: ${
            currentOption?.issues.map((i) => i.message).join("; ") ?? "sprawdź szczegóły."
          }`,
          changed: false,
          alternatives: ranked,
        };
      } else {
        proposal = {
          status: "BRAK_OBSADY",
          busId: null,
          busLabel: null,
          reason: "Brak rekomendacji: pozostałe autobusy są w serwisie, mają awarię lub konflikt terminu.",
          changed: false,
          alternatives: ranked,
        };
      }
    } else {
      const wasReplacement = booking.primaryBusId && booking.primaryBusId !== top.busId;
      proposal = {
        status: toSlotStatus(top.status),
        busId: top.busId,
        busLabel: top.label,
        reason: wasReplacement
          ? `Wykryto konflikt obecnego przydziału (${booking.primaryBusLabel ?? "poprzedni autobus"}) — zaproponowano zastępcę. ${top.reason}`
          : top.reason,
        changed: booking.primaryBusId !== top.busId,
        alternatives: ranked,
      };
      busVirtual.push({
        busId: top.busId,
        startAt: booking.startAt,
        endAt: booking.endAt,
        label: `Propozycja: ${booking.customerName}`,
      });
    }

    busProposals.set(booking.id, proposal);
  }

  // --- Złożenie wyników per zlecenie ---
  const slots: ScheduleBookingSlot[] = bookings.map((b) => ({
    bookingId: b.id,
    customerName: b.customerName,
    startAt: b.startAt,
    endAt: b.endAt,
    lineName: b.lineName,
    currentDriverId: b.primaryDriverId,
    currentDriverNames: b.primaryDriverName ? [b.primaryDriverName] : [],
    currentBusId: b.primaryBusId,
    currentBusLabels: b.primaryBusLabel ? [b.primaryBusLabel] : [],
    driverProposal: driverProposals.get(b.id)!,
    busProposal: busProposals.get(b.id)!,
  }));

  function emptyTally(total: number): StatusTally {
    return { total, poprawne: 0, ostrzezenie: 0, konflikt: 0, brakObsady: 0 };
  }
  function bump(tally: StatusTally, status: SlotStatus) {
    if (status === "POPRAWNE") tally.poprawne++;
    else if (status === "OSTRZEZENIE") tally.ostrzezenie++;
    else if (status === "KONFLIKT") tally.konflikt++;
    else tally.brakObsady++;
  }
  const statusRank: Record<SlotStatus, number> = { POPRAWNE: 0, OSTRZEZENIE: 1, KONFLIKT: 2, BRAK_OBSADY: 3 };
  function worstStatus(a: SlotStatus, b: SlotStatus): SlotStatus {
    return statusRank[a] >= statusRank[b] ? a : b;
  }

  const slotSummary = emptyTally(slots.length * 2);
  const bookingSummary = emptyTally(slots.length);
  for (const slot of slots) {
    bump(slotSummary, slot.driverProposal.status);
    bump(slotSummary, slot.busProposal.status);
    bump(bookingSummary, worstStatus(slot.driverProposal.status, slot.busProposal.status));
  }

  // --- Prognoza bilansu miesięcznego (punkt 9) ---
  const touchedMonths = monthsInRange(rangeStart, rangeEnd);
  const driverForecast: DriverMonthlyForecastEntry[] = [];
  for (const { year, month } of touchedMonths) {
    const baseline = await getDriverMonthlySummaries(year, month);
    const key = `${year}-${month}`;
    for (const b of baseline) {
      const delta = driverHoursTracker.get(b.driverId)?.get(key) ?? 0;
      // Godziny z zachowanych bez zmian przydziałów są już częścią baseline (realne
      // dane z bazy) — odejmujemy je, żeby "proposedDeltaHours" pokazywało wyłącznie
      // efekt REALNYCH zmian wprowadzanych przez tę propozycję, a nie duplikowało
      // godzin już policzonych w "currentPlannedHours".
      let keptHours = 0;
      for (const slot of slots) {
        if (slot.driverProposal.driverId === b.driverId && !slot.driverProposal.changed) {
          const mStart = new Date(year, month - 1, 1);
          const mEnd = new Date(year, month, 1);
          keptHours += overlapHours(slot.startAt, slot.endAt, mStart, mEnd);
        }
      }
      const proposedDeltaHours = delta - keptHours;
      const projectedTotalHours = b.totalWorkHours + proposedDeltaHours;
      const projectedOvertimeHours = b.monthlyNorm != null ? Math.max(0, projectedTotalHours - b.monthlyNorm) : null;
      const projectedDeficitHours = b.monthlyNorm != null ? Math.max(0, b.monthlyNorm - projectedTotalHours) : null;
      driverForecast.push({
        driverId: b.driverId,
        driverName: b.driverName,
        year,
        month,
        monthlyNorm: b.monthlyNorm,
        currentPlannedHours: b.totalWorkHours,
        proposedDeltaHours,
        projectedTotalHours,
        projectedOvertimeHours,
        projectedDeficitHours,
      });
    }
  }

  return { rangeStart, rangeEnd, slots, driverForecast, slotSummary, bookingSummary };
}
