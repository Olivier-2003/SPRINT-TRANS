import type { PriceQuote } from "@/lib/generated/prisma/client";

/**
 * Efektywne wartości wyceny: ręczna korekta administratora, jeśli ustawiona,
 * w przeciwnym razie wartość automatyczna. Współdzielone między widokiem
 * historii wycen (panel) a formularzem ręcznej korekty (pre-wypełnienie).
 */
export function getEffectiveQuoteValues(quote: PriceQuote) {
  return {
    distanceKm: Number(quote.manualDistanceKm ?? quote.distanceKmAuto ?? 0),
    tripDays: quote.manualTripDays ?? quote.tripDays,
    overnightStays: quote.manualOvernightStays ?? quote.overnightStays,
    driverCount: quote.manualDriverCount ?? quote.driverCount,
    waitingHours: Number(quote.manualWaitingHours ?? quote.estimatedWaitingHours),
    extraCosts: Number(quote.manualExtraCosts ?? 0),
    price: Number(quote.manualPrice ?? quote.calculatedPrice),
    isManuallyAdjusted: quote.manualPrice !== null,
  };
}
