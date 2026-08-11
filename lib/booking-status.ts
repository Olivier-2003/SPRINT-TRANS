import type { BookingStatus } from "@/lib/generated/prisma/client";

export const BOOKING_STATUSES: BookingStatus[] = [
  "ZAPLANOWANE",
  "W_TRAKCIE",
  "ZAKONCZONE",
  "ANULOWANE",
];

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  ZAPLANOWANE: "Zaplanowane",
  W_TRAKCIE: "W trakcie",
  ZAKONCZONE: "Zakończone",
  ANULOWANE: "Anulowane",
};

export const BOOKING_STATUS_BADGE_VARIANT: Record<
  BookingStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  ZAPLANOWANE: "default",
  W_TRAKCIE: "secondary",
  ZAKONCZONE: "outline",
  ANULOWANE: "destructive",
};
