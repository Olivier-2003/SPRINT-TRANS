import { db } from "@/lib/db";

/**
 * Zajętość kierowców/autobusów jest zawsze wyliczana z przedziałów startAt–endAt
 * istniejących zleceń (status != ANULOWANE), nigdy przechowywana osobno. To samo
 * zapytanie będzie rdzeniem przyszłego automatycznego algorytmu przydziału (Etap 9).
 */
export async function getResourceConflicts(
  startAt: Date,
  endAt: Date,
  excludeBookingId?: string
): Promise<{ busyDriverIds: Set<string>; busyBusIds: Set<string> }> {
  const overlapping = await db.booking.findMany({
    where: {
      status: { not: "ANULOWANE" },
      startAt: { lt: endAt },
      endAt: { gt: startAt },
      ...(excludeBookingId ? { id: { not: excludeBookingId } } : {}),
    },
    select: {
      drivers: { select: { driverId: true } },
      buses: { select: { busId: true } },
    },
  });

  const busyDriverIds = new Set<string>();
  const busyBusIds = new Set<string>();
  for (const booking of overlapping) {
    for (const d of booking.drivers) busyDriverIds.add(d.driverId);
    for (const b of booking.buses) busyBusIds.add(b.busId);
  }

  return { busyDriverIds, busyBusIds };
}
