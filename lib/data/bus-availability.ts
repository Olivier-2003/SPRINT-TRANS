import { db } from "@/lib/db";

export function getBusAvailabilityRecords(busId: string) {
  return db.busAvailability.findMany({
    where: { busId },
    orderBy: { startAt: "desc" },
  });
}

/** Rekordy nakładające się na podany zakres — dla dowolnego zbioru autobusów lub wszystkich, gdy busIds pominięte. */
export function getBusAvailabilityOverlapping(startAt: Date, endAt: Date, busIds?: string[]) {
  return db.busAvailability.findMany({
    where: {
      startAt: { lt: endAt },
      endAt: { gt: startAt },
      ...(busIds ? { busId: { in: busIds } } : {}),
    },
  });
}
