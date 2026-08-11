import { db } from "@/lib/db";

/** Zlecenia, których przedział startAt–endAt zachodzi na podany zakres dat. */
export function getBookingsOverlapping(rangeStart: Date, rangeEnd: Date) {
  return db.booking.findMany({
    where: {
      startAt: { lt: rangeEnd },
      endAt: { gt: rangeStart },
    },
    include: {
      drivers: { include: { driver: { select: { firstName: true, lastName: true } } } },
      buses: { include: { bus: { select: { registrationNumber: true } } } },
    },
    orderBy: { startAt: "asc" },
  });
}
