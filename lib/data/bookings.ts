import { db } from "@/lib/db";

export function getBookings() {
  return db.booking.findMany({
    include: {
      drivers: { include: { driver: { select: { firstName: true, lastName: true } } } },
      buses: { include: { bus: { select: { registrationNumber: true, brandModel: true } } } },
    },
    orderBy: { startAt: "desc" },
  });
}

export function getBooking(id: string) {
  return db.booking.findUnique({
    where: { id },
    include: {
      sourceInquiry: {
        include: {
          priceQuotes: { orderBy: { createdAt: "desc" } },
        },
      },
      routePoints: { orderBy: { sequence: "asc" } },
      drivers: { include: { driver: true } },
      buses: { include: { bus: true } },
      createdBy: { select: { name: true } },
      assignmentHistory: {
        orderBy: { changedAt: "desc" },
        include: { changedBy: { select: { name: true } } },
      },
    },
  });
}
