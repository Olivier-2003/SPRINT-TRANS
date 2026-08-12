import { db } from "@/lib/db";

export function getDriverAvailabilityRecords(driverId: string) {
  return db.driverAvailability.findMany({
    where: { driverId },
    orderBy: { startAt: "desc" },
  });
}

/** Rekordy nakładające się na podany zakres — dla dowolnego zbioru kierowców lub wszystkich, gdy driverIds pominięte. */
export function getDriverAvailabilityOverlapping(startAt: Date, endAt: Date, driverIds?: string[]) {
  return db.driverAvailability.findMany({
    where: {
      startAt: { lt: endAt },
      endAt: { gt: startAt },
      ...(driverIds ? { driverId: { in: driverIds } } : {}),
    },
  });
}
