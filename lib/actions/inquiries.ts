"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import {
  inquiryStatusSchema,
  contactLogSchema,
  manualPriceQuoteSchema,
  type InquiryStatusInput,
  type ContactLogInput,
  type ManualPriceQuoteInput,
} from "@/lib/validation/inquiry-admin";

export type ActionState = { error?: string; success?: boolean } | undefined;

function detailPath(id: string) {
  return `/admin/zapytania/${id}`;
}

export async function updateInquiryStatus(
  id: string,
  data: InquiryStatusInput
): Promise<ActionState> {
  const parsed = inquiryStatusSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Nieprawidłowy status." };
  }

  await db.inquiry.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  revalidatePath(detailPath(id));
  revalidatePath("/admin/zapytania");
  revalidatePath("/admin");
  return { success: true };
}

export async function addContactLogEntry(
  id: string,
  data: ContactLogInput
): Promise<ActionState> {
  const parsed = contactLogSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Popraw dane wpisu." };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Sesja wygasła. Zaloguj się ponownie." };
  }

  await db.inquiryContactLog.create({
    data: {
      inquiryId: id,
      adminUserId: session.user.id,
      contactType: parsed.data.contactType,
      note: parsed.data.note,
    },
  });

  revalidatePath(detailPath(id));
  return { success: true };
}

/**
 * Ręczna korekta wyceny — tworzy NOWY, niemutowalny wpis PriceQuote (poprzedni
 * "current" zostaje oznaczony isCurrent=false). Automatyczne pola poprzedniego
 * wpisu (distanceKmAuto, stawki *AtQuote, calculatedPrice) są kopiowane bez zmian —
 * oryginalna wycena klienta nigdy nie jest nadpisywana ani przeliczana wstecz.
 */
export async function createManualPriceQuote(
  inquiryId: string,
  data: ManualPriceQuoteInput
): Promise<ActionState> {
  const parsed = manualPriceQuoteSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Popraw błędy w formularzu wyceny." };
  }

  const session = await auth();
  const currentQuote = await db.priceQuote.findFirst({
    where: { inquiryId, isCurrent: true },
    orderBy: { createdAt: "desc" },
  });
  if (!currentQuote) {
    return { error: "Brak istniejącej wyceny do skorygowania." };
  }

  const { distanceKm, tripDays, overnightStays, driverCount, waitingHours, extraCosts, extraCostsNote, finalPrice, note } =
    parsed.data;

  await db.$transaction([
    db.priceQuote.update({ where: { id: currentQuote.id }, data: { isCurrent: false } }),
    db.priceQuote.create({
      data: {
        inquiryId,
        // Pola automatyczne — skopiowane z poprzedniego wpisu, nigdy nie przeliczane.
        distanceKmAuto: currentQuote.distanceKmAuto,
        ratePerKmAtQuote: currentQuote.ratePerKmAtQuote,
        baseFeeAtQuote: currentQuote.baseFeeAtQuote,
        hourlyWaitingRateAtQuote: currentQuote.hourlyWaitingRateAtQuote,
        driverOvernightRateAtQuote: currentQuote.driverOvernightRateAtQuote,
        averageSpeedKmhAtQuote: currentQuote.averageSpeedKmhAtQuote,
        tripDays: currentQuote.tripDays,
        overnightStays: currentQuote.overnightStays,
        driverCount: currentQuote.driverCount,
        estimatedWaitingHours: currentQuote.estimatedWaitingHours,
        distanceCost: currentQuote.distanceCost,
        waitingCost: currentQuote.waitingCost,
        overnightCost: currentQuote.overnightCost,
        calculatedPrice: currentQuote.calculatedPrice,
        // Korekta ręczna administratora.
        manualDistanceKm: Number(distanceKm),
        manualTripDays: Number(tripDays),
        manualOvernightStays: Number(overnightStays),
        manualDriverCount: Number(driverCount),
        manualWaitingHours: Number(waitingHours),
        manualExtraCosts: extraCosts ? Number(extraCosts) : null,
        manualExtraCostsNote: extraCostsNote || null,
        manualPrice: Number(finalPrice),
        isCurrent: true,
        createdById: session?.user?.id,
        note: note || null,
      },
    }),
  ]);

  revalidatePath(detailPath(inquiryId));
  return { success: true };
}

/**
 * Tworzy zlecenie (Booking) z zaakceptowanego zapytania — bez ponownego
 * przepisywania danych: kopiuje dane klienta i trasę, przejmuje obowiązującą
 * cenę z bieżącej wyceny. Zlecenie zachowuje powiązanie z pierwotnym zapytaniem
 * (sourceInquiryId) i pełną historią wycen (dostępną przez to powiązanie).
 * Przypisanie konkretnego autobusu/kierowców do zlecenia — Etap 6.
 */
export async function createBookingFromInquiry(inquiryId: string): Promise<ActionState> {
  const inquiry = await db.inquiry.findUnique({
    where: { id: inquiryId },
    include: {
      routePoints: { orderBy: { sequence: "asc" } },
      priceQuotes: { where: { isCurrent: true }, take: 1 },
      booking: { select: { id: true } },
    },
  });

  if (!inquiry) return { error: "Nie znaleziono zapytania." };
  if (inquiry.status !== "ZAAKCEPTOWANE") {
    return { error: "Zlecenie można utworzyć wyłącznie z zaakceptowanego zapytania." };
  }
  if (inquiry.booking) {
    return { error: "Z tego zapytania zostało już utworzone zlecenie." };
  }
  const currentQuote = inquiry.priceQuotes[0];
  if (!currentQuote) {
    return { error: "Brak wyceny dla tego zapytania — nie można utworzyć zlecenia." };
  }

  const session = await auth();
  const finalPrice = currentQuote.manualPrice ?? currentQuote.calculatedPrice;
  const startAt = inquiry.requestedDepartureAt;
  const endAt = inquiry.requestedReturnAt ?? inquiry.requestedDepartureAt;

  const booking = await db.booking.create({
    data: {
      sourceInquiryId: inquiry.id,
      customerName: inquiry.customerName,
      customerEmail: inquiry.customerEmail,
      customerPhone: inquiry.customerPhone,
      startAt,
      endAt,
      finalPrice,
      status: "ZAPLANOWANE",
      createdById: session?.user?.id,
      routePoints: {
        create: inquiry.routePoints.map((point) => ({
          sequence: point.sequence,
          pointType: point.pointType,
          label: point.label,
          lat: point.lat,
          lng: point.lng,
        })),
      },
    },
  });

  revalidatePath(detailPath(inquiryId));
  revalidatePath("/admin/zlecenia");
  revalidatePath("/admin");
  redirect(`/admin/zlecenia/${booking.id}`);
}
