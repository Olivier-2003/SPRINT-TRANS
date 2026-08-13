import { db } from "@/lib/db";

export function getLines() {
  return db.regularLine.findMany({
    include: { _count: { select: { stops: true, schedules: true } } },
    orderBy: { name: "asc" },
  });
}

export function getLine(id: string) {
  return db.regularLine.findUnique({
    where: { id },
    include: {
      stops: { orderBy: { sortOrder: "asc" } },
      schedules: { orderBy: { validFrom: "asc" } },
    },
  });
}

/**
 * Widoczne na stronie publicznej — tylko linie oznaczone jako aktywne.
 * Celowo zwraca tylko liczbę kursów (_count), nie pełne rekordy LineSchedule:
 * ta lista trafia do komponentu klienckiego (wyszukiwarka), a pole `price` w
 * LineSchedule jest typu Prisma Decimal — obiektu nieserializowalnego przez
 * granicę Server → Client Component.
 */
export function getPublicLines() {
  return db.regularLine.findMany({
    where: { active: true },
    include: { _count: { select: { schedules: true } } },
    orderBy: { name: "asc" },
  });
}
