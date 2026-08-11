import { db } from "@/lib/db";
import type { InquiryStatus } from "@/lib/generated/prisma/client";

export function getInquiries(status?: InquiryStatus) {
  return db.inquiry.findMany({
    where: status ? { status } : undefined,
    include: {
      priceQuotes: { where: { isCurrent: true }, take: 1 },
      booking: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function getInquiry(id: string) {
  return db.inquiry.findUnique({
    where: { id },
    include: {
      routePoints: { orderBy: { sequence: "asc" } },
      priceQuotes: { orderBy: { createdAt: "desc" }, include: { createdBy: { select: { name: true } } } },
      contactLogs: { orderBy: { createdAt: "desc" }, include: { adminUser: { select: { name: true } } } },
      booking: { select: { id: true, status: true } },
      relatedLine: { select: { id: true, name: true } },
      relatedTrip: { select: { id: true, title: true } },
    },
  });
}
