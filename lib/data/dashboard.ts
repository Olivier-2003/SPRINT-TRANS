import { db } from "@/lib/db";

export async function getDashboardStats() {
  const [newInquiries, awaitingDecision, upcomingBookings] = await Promise.all([
    db.inquiry.count({ where: { status: "NOWE" } }),
    db.inquiry.count({ where: { status: { in: ["WYCENIONE", "OCZEKUJE_NA_KLIENTA"] } } }),
    db.booking.count({
      where: { startAt: { gte: new Date() }, status: { not: "ANULOWANE" } },
    }),
  ]);

  return { newInquiries, awaitingDecision, upcomingBookings };
}
