import { db } from "@/lib/db";
import type { DriverAvailabilityType } from "@/lib/generated/prisma/client";

/**
 * Ewidencja i miesięczne rozliczenie czasu pracy kierowców — wyliczane automatycznie
 * z przypisań do zleceń (Booking/BookingDriver) oraz zarejestrowanej niedostępności
 * (DriverAvailability). Godziny "przepracowane" = przedziały startAt–endAt zleceń,
 * do których kierowca jest przypisany (uproszczenie świadome na tym etapie — system
 * nie ma jeszcze osobnej rejestracji faktycznego rozpoczęcia/zakończenia zmiany).
 * To ewidencja pod przyszłe rozszerzenie, nie pełny system płacowy.
 */

const NIGHT_START_HOUR = 22;
const NIGHT_END_HOUR = 6;
const MS_PER_HOUR = 60 * 60 * 1000;

export interface DailyWorkEntry {
  date: Date;
  workHours: number;
  nightHours: number;
  bookings: {
    bookingId: string;
    customerName: string;
    startAt: Date;
    endAt: Date;
    plannedHours: number | null;
  }[];
  absences: { type: DriverAvailabilityType; note: string | null }[];
}

export interface DriverMonthlySummary {
  driverId: string;
  driverName: string;
  totalWorkHours: number;
  workDaysCount: number;
  totalBookings: number;
  completedBookings: number;
  nightHours: number;
  absenceDayCounts: Partial<Record<DriverAvailabilityType, number>>;
  monthlyNorm: number | null;
  balanceHours: number | null;
  overtimeHours: number | null;
  days: DailyWorkEntry[];
}

export function overlapHours(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): number {
  const start = Math.max(aStart.getTime(), bStart.getTime());
  const end = Math.min(aEnd.getTime(), bEnd.getTime());
  return end > start ? (end - start) / MS_PER_HOUR : 0;
}

function nightOverlapHours(segStart: Date, segEnd: Date, dayStart: Date): number {
  const morningEnd = new Date(dayStart.getTime() + NIGHT_END_HOUR * MS_PER_HOUR);
  const eveningStart = new Date(dayStart.getTime() + NIGHT_START_HOUR * MS_PER_HOUR);
  const dayEnd = new Date(dayStart.getTime() + 24 * MS_PER_HOUR);
  return (
    overlapHours(segStart, segEnd, dayStart, morningEnd) +
    overlapHours(segStart, segEnd, eveningStart, dayEnd)
  );
}

export async function getDriverMonthlySummaries(
  year: number,
  month: number,
  driverIds?: string[]
): Promise<DriverMonthlySummary[]> {
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 1);
  const daysInMonth = Math.round((monthEnd.getTime() - monthStart.getTime()) / (24 * MS_PER_HOUR));

  const [drivers, bookings, absences] = await Promise.all([
    db.driver.findMany({
      where: driverIds ? { id: { in: driverIds } } : {},
      select: {
        id: true,
        firstName: true,
        lastName: true,
        monthlyWorkHoursNorm: true,
        weeklyWorkHoursNorm: true,
      },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    }),
    db.booking.findMany({
      where: {
        status: { not: "ANULOWANE" },
        startAt: { lt: monthEnd },
        endAt: { gt: monthStart },
      },
      include: { drivers: { select: { driverId: true, plannedHours: true } } },
    }),
    db.driverAvailability.findMany({
      where: {
        startAt: { lt: monthEnd },
        endAt: { gt: monthStart },
        ...(driverIds ? { driverId: { in: driverIds } } : {}),
      },
    }),
  ]);

  return drivers.map((driver) => {
    const driverBookings = bookings.filter((b) => b.drivers.some((d) => d.driverId === driver.id));
    const driverAbsences = absences.filter((a) => a.driverId === driver.id);

    const days: DailyWorkEntry[] = [];
    for (let i = 0; i < daysInMonth; i++) {
      const dayStart = new Date(year, month - 1, 1 + i);
      const dayEnd = new Date(dayStart.getTime() + 24 * MS_PER_HOUR);

      let workHours = 0;
      let nightHours = 0;
      const dayBookings: DailyWorkEntry["bookings"] = [];
      for (const booking of driverBookings) {
        const segHours = overlapHours(booking.startAt, booking.endAt, dayStart, dayEnd);
        if (segHours > 0) {
          // Ręczna liczba godzin (jeśli ustawiona) zastępuje wyliczenie automatyczne, ale jako
          // wartość CAŁKOWITA za zlecenie — przypisywana wyłącznie dniu jego rozpoczęcia, żeby
          // nie rozbijać jednej ręcznie wpisanej liczby na kilka dni w sposób arbitralny.
          const driverBookingRow = booking.drivers.find((d) => d.driverId === driver.id);
          const plannedHours =
            driverBookingRow?.plannedHours != null ? Number(driverBookingRow.plannedHours) : null;
          const isStartDay = booking.startAt.getTime() >= dayStart.getTime() && booking.startAt.getTime() < dayEnd.getTime();
          const effectiveHours = plannedHours != null ? (isStartDay ? plannedHours : 0) : segHours;

          workHours += effectiveHours;
          const segStart = new Date(Math.max(booking.startAt.getTime(), dayStart.getTime()));
          const segEnd = new Date(Math.min(booking.endAt.getTime(), dayEnd.getTime()));
          nightHours += nightOverlapHours(segStart, segEnd, dayStart);
          if (effectiveHours > 0) {
            dayBookings.push({
              bookingId: booking.id,
              customerName: booking.customerName,
              startAt: booking.startAt,
              endAt: booking.endAt,
              plannedHours,
            });
          }
        }
      }

      const dayAbsences = driverAbsences
        .filter((a) => a.startAt.getTime() < dayEnd.getTime() && a.endAt.getTime() > dayStart.getTime())
        .map((a) => ({ type: a.type, note: a.note }));

      days.push({ date: dayStart, workHours, nightHours, bookings: dayBookings, absences: dayAbsences });
    }

    const totalWorkHours = days.reduce((sum, d) => sum + d.workHours, 0);
    const nightHoursTotal = days.reduce((sum, d) => sum + d.nightHours, 0);
    const workDaysCount = days.filter((d) => d.workHours > 0).length;

    const absenceDayCounts: Partial<Record<DriverAvailabilityType, number>> = {};
    for (const day of days) {
      const typesToday = new Set(day.absences.map((a) => a.type));
      for (const type of typesToday) {
        absenceDayCounts[type] = (absenceDayCounts[type] ?? 0) + 1;
      }
    }

    const monthlyNorm =
      driver.monthlyWorkHoursNorm != null
        ? Number(driver.monthlyWorkHoursNorm)
        : driver.weeklyWorkHoursNorm != null
          ? (Number(driver.weeklyWorkHoursNorm) * daysInMonth) / 7
          : null;
    const balanceHours = monthlyNorm != null ? totalWorkHours - monthlyNorm : null;
    const overtimeHours = balanceHours != null ? Math.max(0, balanceHours) : null;

    return {
      driverId: driver.id,
      driverName: `${driver.firstName} ${driver.lastName}`,
      totalWorkHours,
      workDaysCount,
      totalBookings: driverBookings.length,
      completedBookings: driverBookings.filter((b) => b.status === "ZAKONCZONE").length,
      nightHours: nightHoursTotal,
      absenceDayCounts,
      monthlyNorm,
      balanceHours,
      overtimeHours,
      days,
    };
  });
}

export async function getDriverMonthlySummary(
  driverId: string,
  year: number,
  month: number
): Promise<DriverMonthlySummary | null> {
  const [summary] = await getDriverMonthlySummaries(year, month, [driverId]);
  return summary ?? null;
}
