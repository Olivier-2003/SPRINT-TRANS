import { db } from "@/lib/db";

export function getBuses() {
  return db.bus.findMany({
    include: { photos: { orderBy: { sortOrder: "asc" } } },
    orderBy: { registrationNumber: "asc" },
  });
}

export function getBus(id: string) {
  return db.bus.findUnique({
    where: { id },
    include: { photos: { orderBy: { sortOrder: "asc" } } },
  });
}

/** Widoczne na stronie publicznej — tylko autobusy oznaczone jako aktywne. */
export function getPublicBuses() {
  return db.bus.findMany({
    where: { status: "ACTIVE" },
    include: { photos: { orderBy: { sortOrder: "asc" } } },
    orderBy: { registrationNumber: "asc" },
  });
}

export function getPublicBus(id: string) {
  return db.bus.findFirst({
    where: { id, status: "ACTIVE" },
    include: { photos: { orderBy: { sortOrder: "asc" } } },
  });
}
