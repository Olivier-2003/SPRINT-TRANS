import { db } from "@/lib/db";

/** Kalkulator nie ma jeszcze zapisanych stawek w bazie (brak CalculatorSettings). */
export class PricingConfigError extends Error {}

export interface PriceBreakdown {
  distanceKm: number;
  ratePerKm: number;
  baseFee: number;
  distanceCost: number;

  tripDays: number;
  overnightStays: number;
  driverCount: number;
  driverOvernightRate: number;
  overnightCost: number;

  averageSpeedKmh: number;
  estimatedWaitingHours: number;
  hourlyWaitingRate: number;
  waitingCost: number;

  calculatedPrice: number;
}

interface CalculatePriceInput {
  distanceKm: number;
  departureAt: Date;
  returnAt: Date | null;
  /** Liczba kierowców uwzględniona w koszcie noclegów — domyślnie 1. */
  driverCount?: number;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Liczba dni kalendarzowych obejmujących wyjazd i powrót (ten sam dzień = 1). */
function calendarDaySpan(from: Date, to: Date): number {
  const start = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const end = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
}

/**
 * Automatyczna, orientacyjna kalkulacja ceny — nie tylko dystans, ale pełny
 * czas i charakter realizacji zlecenia:
 *   - dystans × stawka/km + opłata bazowa,
 *   - szacowany czas postoju kierowcy (różnica czasu wyjazd/powrót minus
 *     szacowany czas jazdy przy założonej średniej prędkości) × stawka/h,
 *   - noclegi kierowcy przy wyjazdach wielodniowych × liczba kierowców.
 *
 * To pierwsze, uproszczone przybliżenie (stąd "orientacyjna" cena dla klienta).
 * Dokładne reguły naliczania postoju/noclegów/dodatkowych kierowców oraz
 * ręczna korekta każdego składnika i ceny końcowej — do zaimplementowania
 * w panelu administratora (Etap 5), korzystając z tych samych, już
 * zapisanych w PriceQuote wartości.
 */
export async function calculatePrice({
  distanceKm,
  departureAt,
  returnAt,
  driverCount = 1,
}: CalculatePriceInput): Promise<PriceBreakdown> {
  const settings = await db.calculatorSettings.findFirst({ orderBy: { updatedAt: "desc" } });
  if (!settings) {
    throw new PricingConfigError("Kalkulator nie jest jeszcze skonfigurowany. Spróbuj ponownie później.");
  }

  const ratePerKm = Number(settings.ratePerKm);
  const baseFee = Number(settings.baseFee);
  const hourlyWaitingRate = Number(settings.hourlyWaitingRate);
  const driverOvernightRate = Number(settings.driverOvernightRate);
  const averageSpeedKmh = Number(settings.averageSpeedKmh) || 55;

  const distanceCost = round2(distanceKm * ratePerKm);

  const tripDays = returnAt ? calendarDaySpan(departureAt, returnAt) : 1;
  const overnightStays = Math.max(0, tripDays - 1);
  const overnightCost = round2(overnightStays * driverOvernightRate * driverCount);

  let estimatedWaitingHours = 0;
  if (returnAt) {
    const totalHours = Math.max(0, (returnAt.getTime() - departureAt.getTime()) / (1000 * 60 * 60));
    const drivingHours = averageSpeedKmh > 0 ? distanceKm / averageSpeedKmh : 0;
    estimatedWaitingHours = round2(Math.max(0, totalHours - drivingHours));
  }
  const waitingCost = round2(estimatedWaitingHours * hourlyWaitingRate);

  const calculatedPrice = round2(baseFee + distanceCost + waitingCost + overnightCost);

  return {
    distanceKm,
    ratePerKm,
    baseFee,
    distanceCost,
    tripDays,
    overnightStays,
    driverCount,
    driverOvernightRate,
    overnightCost,
    averageSpeedKmh,
    estimatedWaitingHours,
    hourlyWaitingRate,
    waitingCost,
    calculatedPrice,
  };
}
