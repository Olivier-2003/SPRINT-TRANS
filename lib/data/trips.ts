import { db } from "@/lib/db";

export function getTrips() {
  return db.trip.findMany({
    include: { photos: { orderBy: { sortOrder: "asc" } } },
    orderBy: { title: "asc" },
  });
}

export function getTrip(id: string) {
  return db.trip.findUnique({
    where: { id },
    include: { photos: { orderBy: { sortOrder: "asc" } } },
  });
}

/** Widoczne na stronie publicznej — tylko wycieczki oznaczone jako aktywne. */
export function getPublicTrips() {
  return db.trip.findMany({
    where: { active: true },
    include: { photos: { orderBy: { sortOrder: "asc" } } },
    orderBy: { title: "asc" },
  });
}

export function getPublicTrip(id: string) {
  return db.trip.findFirst({
    where: { id, active: true },
    include: { photos: { orderBy: { sortOrder: "asc" } } },
  });
}
