import { db } from "@/lib/db";
import {
  computeDriverAvailability,
  type OverallStatus,
  type AvailabilityIssue,
  type DriverIssueType,
  type VirtualAssignment,
} from "@/lib/availability-engine";
import { getDriverMonthlySummaries } from "@/lib/driver-timesheet";
import type { InquiryType, DriverLineRole } from "@/lib/generated/prisma/client";

/**
 * Silnik rekomendacji obsady kierowców — WYŁĄCZNIE sugestia z jawnym uzasadnieniem,
 * nigdy automatyczny przydział. Administrator zawsze podejmuje ostateczną, ręczną
 * decyzję o tym, kto jedzie. Scoring jest celowo prosty i w pełni wyjaśnialny (suma
 * czytelnych czynników), żeby każdą pozycję rankingu dało się uzasadnić przed
 * administratorem — to fundament pod przyszły automatyczny algorytm (Etap 9), który
 * będzie mógł korzystać z tych samych danych i sygnałów.
 */

export interface DriverRecommendation {
  driverId: string;
  driverName: string;
  licenseCategories: string;
  status: OverallStatus;
  issues: AvailabilityIssue<DriverIssueType>[];
  reasons: string[];
  monthlyHours: number;
  monthlyBalanceHours: number | null;
  lineRole: DriverLineRole | null;
  lineHistoryCount: number;
}

interface GetDriverRecommendationsParams {
  startAt: Date;
  endAt: Date;
  excludeBookingId?: string;
  inquiryType?: InquiryType | null;
  lineId?: string | null;
  driverIds?: string[];
  /** Jeszcze niezapisane propozycje z tego samego przebiegu generatora grafiku (Etap 9) —
   *  brane pod uwagę przy liczeniu konfliktów/odpoczynku tak samo jak realne zlecenia. */
  virtualAssignments?: VirtualAssignment[];
  /** Dodatkowe godziny w bieżącym miesiącu wynikające z wcześniejszych propozycji tego
   *  samego przebiegu generowania — doliczane do bilansu miesięcznego przed scoringiem,
   *  żeby generator równomiernie rozkładał godziny zamiast oceniać każde zlecenie osobno. */
  extraMonthlyHoursByDriver?: Map<string, number>;
}

export async function getDriverRecommendations(
  params: GetDriverRecommendationsParams
): Promise<DriverRecommendation[]> {
  const { startAt, endAt, excludeBookingId, inquiryType, lineId, driverIds, virtualAssignments, extraMonthlyHoursByDriver } =
    params;

  const drivers = await db.driver.findMany({
    where: { employmentStatus: "ACTIVE", ...(driverIds ? { id: { in: driverIds } } : {}) },
    select: { id: true, firstName: true, lastName: true, licenseCategories: true, preferredWorkTypes: true },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });
  const activeDriverIds = drivers.map((d) => d.id);
  if (activeDriverIds.length === 0) return [];

  const [availability, lineAssignments, historyBookings, monthlySummaries] = await Promise.all([
    computeDriverAvailability({ startAt, endAt, excludeBookingId, inquiryType, driverIds: activeDriverIds, virtualAssignments }),
    lineId
      ? db.driverLineAssignment.findMany({ where: { lineId, driverId: { in: activeDriverIds } } })
      : Promise.resolve([]),
    lineId
      ? db.booking.findMany({
          where: { sourceInquiry: { relatedLineId: lineId } },
          select: { drivers: { select: { driverId: true } } },
        })
      : Promise.resolve([]),
    getDriverMonthlySummaries(startAt.getFullYear(), startAt.getMonth() + 1, activeDriverIds),
  ]);

  const monthlyByDriver = new Map(monthlySummaries.map((s) => [s.driverId, s]));
  const lineRoleByDriver = new Map(lineAssignments.map((a) => [a.driverId, a.role]));
  const lineHistoryByDriver = new Map<string, number>();
  for (const booking of historyBookings) {
    for (const assignment of booking.drivers) {
      lineHistoryByDriver.set(assignment.driverId, (lineHistoryByDriver.get(assignment.driverId) ?? 0) + 1);
    }
  }

  const scored: { recommendation: DriverRecommendation; score: number }[] = drivers.map((driver) => {
    const avail = availability.get(driver.id) ?? { status: "DOSTEPNY" as OverallStatus, issues: [] };
    const monthly = monthlyByDriver.get(driver.id);
    const extraHours = extraMonthlyHoursByDriver?.get(driver.id) ?? 0;
    const monthlyHours = (monthly?.totalWorkHours ?? 0) + extraHours;
    const monthlyBalanceHours = monthly?.balanceHours != null ? monthly.balanceHours + extraHours : null;
    const lineRole = lineRoleByDriver.get(driver.id) ?? null;
    const lineHistoryCount = lineHistoryByDriver.get(driver.id) ?? 0;

    let score = 0;
    const reasons: string[] = [];

    if (avail.status === "DOSTEPNY") {
      score += 100;
      reasons.push("Brak konfliktów terminowych, pełna dostępność");
    } else if (avail.status === "OSTRZEZENIE") {
      score += 40;
      reasons.push("Dostępny z zastrzeżeniem — sprawdź ostrzeżenia poniżej");
    } else {
      score -= 1000;
    }

    if (lineRole === "GLOWNY") {
      score += 50;
      reasons.push("Kierowca główny tej linii");
    } else if (lineRole === "PREFEROWANY") {
      score += 30;
      reasons.push("Kierowca preferowany dla tej linii");
    } else if (lineRole === "REZERWOWY") {
      score += 10;
      reasons.push("Kierowca rezerwowy dla tej linii");
    }

    if (lineHistoryCount > 0) {
      score += Math.min(lineHistoryCount * 2, 20);
      reasons.push(`Jeździł tą linią ${lineHistoryCount}× wcześniej — zna trasę`);
    }

    if (inquiryType && driver.preferredWorkTypes.includes(inquiryType)) {
      score += 10;
      reasons.push("Preferowany rodzaj zlecenia");
    }

    if (monthlyBalanceHours != null) {
      if (monthlyBalanceHours < 0) {
        score += Math.min(-monthlyBalanceHours, 15);
        reasons.push(
          `Poniżej miesięcznego wymiaru godzin (bilans ${monthlyBalanceHours.toFixed(1)} h) — wyrównanie obciążenia`
        );
      } else if (monthlyBalanceHours > 0) {
        score -= Math.min(monthlyBalanceHours, 15);
      }
    }

    const recommendation: DriverRecommendation = {
      driverId: driver.id,
      driverName: `${driver.firstName} ${driver.lastName}`,
      licenseCategories: driver.licenseCategories,
      status: avail.status,
      issues: avail.issues,
      reasons,
      monthlyHours,
      monthlyBalanceHours,
      lineRole,
      lineHistoryCount,
    };
    return { recommendation, score };
  });

  return scored
    .sort((a, b) => {
      const scoreDiff = b.score - a.score;
      if (scoreDiff !== 0) return scoreDiff;
      return a.recommendation.driverName.localeCompare(b.recommendation.driverName, "pl");
    })
    .map((entry) => entry.recommendation);
}
