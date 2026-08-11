"use server";

import { db } from "@/lib/db";
import { getRouteDistanceKm, RoutingConfigError, RoutingLookupError } from "@/lib/routing";
import { calculatePrice, PricingConfigError } from "@/lib/pricing";
import { sendInquiryEmails } from "@/lib/email";
import {
  inquiryPreviewSchema,
  inquirySchema,
  type InquiryPreviewInput,
  type InquiryInput,
} from "@/lib/validation/inquiry";
import type { PriceBreakdown } from "@/lib/pricing";

function routeLabels(origin: string, stops: { label: string }[], destination: string): string[] {
  return [origin, ...stops.map((stop) => stop.label), destination];
}

async function computeBreakdown(
  data: InquiryPreviewInput
): Promise<{ breakdown: PriceBreakdown } | { error: string }> {
  const labels = routeLabels(data.origin, data.stops, data.destination);

  try {
    const distanceKm = await getRouteDistanceKm(labels);
    const breakdown = await calculatePrice({
      distanceKm,
      departureAt: new Date(data.requestedDepartureAt),
      returnAt: data.requestedReturnAt ? new Date(data.requestedReturnAt) : null,
    });
    return { breakdown };
  } catch (error) {
    if (error instanceof RoutingConfigError || error instanceof PricingConfigError) {
      return { error: "Kalkulator jest chwilowo niedostępny. Skontaktuj się z nami bezpośrednio." };
    }
    if (error instanceof RoutingLookupError) {
      return { error: error.message };
    }
    throw error;
  }
}

export type PreviewState =
  | { status: "success"; breakdown: PriceBreakdown }
  | { status: "error"; message: string };

/** Liczy orientacyjną cenę na podstawie trasy i dat — NIE zapisuje niczego w bazie. */
export async function previewInquiryPrice(data: InquiryPreviewInput): Promise<PreviewState> {
  const parsed = inquiryPreviewSchema.safeParse(data);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Popraw dane trasy." };
  }

  const result = await computeBreakdown(parsed.data);
  if ("error" in result) return { status: "error", message: result.error };
  return { status: "success", breakdown: result.breakdown };
}

export type SubmitState = { error?: string; success?: boolean } | undefined;

/**
 * Zapisuje niewiążące zapytanie: Inquiry + RoutePoint[] + PriceQuote (snapshot),
 * w jednej transakcji, i wysyła e-maile (best-effort). Cena jest przeliczana od
 * nowa po stronie serwera — nigdy nie ufamy wartości wyliczonej wcześniej po
 * stronie klienta.
 */
export async function submitInquiry(data: InquiryInput): Promise<SubmitState> {
  const parsed = inquirySchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Popraw błędy w formularzu." };
  }

  const {
    origin,
    stops,
    destination,
    passengerCount,
    requestedDepartureAt,
    requestedReturnAt,
    additionalInfo,
    customerName,
    customerEmail,
    customerPhone,
  } = parsed.data;

  const result = await computeBreakdown(parsed.data);
  if ("error" in result) return { error: result.error };
  const { breakdown } = result;

  const routePointsData = [
    { sequence: 0, pointType: "ODBIOR" as const, label: origin },
    ...stops.map((stop, index) => ({
      sequence: index + 1,
      pointType: "PRZYSTANEK" as const,
      label: stop.label,
    })),
    { sequence: stops.length + 1, pointType: "ZWROT" as const, label: destination },
  ];

  const inquiry = await db.inquiry.create({
    data: {
      type: "WYNAJEM",
      customerName,
      customerEmail,
      customerPhone,
      requestedDepartureAt: new Date(requestedDepartureAt),
      requestedReturnAt: requestedReturnAt ? new Date(requestedReturnAt) : null,
      passengerCount,
      additionalInfo: additionalInfo || null,
      status: "NOWE",
      routePoints: { create: routePointsData },
      priceQuotes: {
        create: {
          distanceKmAuto: breakdown.distanceKm,
          ratePerKmAtQuote: breakdown.ratePerKm,
          baseFeeAtQuote: breakdown.baseFee,
          distanceCost: breakdown.distanceCost,
          tripDays: breakdown.tripDays,
          overnightStays: breakdown.overnightStays,
          driverCount: breakdown.driverCount,
          driverOvernightRateAtQuote: breakdown.driverOvernightRate,
          overnightCost: breakdown.overnightCost,
          averageSpeedKmhAtQuote: breakdown.averageSpeedKmh,
          estimatedWaitingHours: breakdown.estimatedWaitingHours,
          hourlyWaitingRateAtQuote: breakdown.hourlyWaitingRate,
          waitingCost: breakdown.waitingCost,
          calculatedPrice: breakdown.calculatedPrice,
          isCurrent: true,
        },
      },
    },
  });

  await sendInquiryEmails({ inquiryId: inquiry.id, customerName, customerEmail });

  return { success: true };
}
