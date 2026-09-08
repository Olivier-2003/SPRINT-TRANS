import { db } from "@/lib/db";
import { getLineRunsOverlapping } from "@/lib/line-schedule-projection";

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

/** Zlecenia oraz kursy linii regularnych (informacyjnie) nakładające się na podany zakres dat. */
export async function getCalendarEntriesOverlapping(rangeStart: Date, rangeEnd: Date) {
  const [bookings, lineRuns] = await Promise.all([
    getBookingsOverlapping(rangeStart, rangeEnd),
    getLineRunsOverlapping(rangeStart, rangeEnd),
  ]);
  return { bookings, lineRuns };
}
