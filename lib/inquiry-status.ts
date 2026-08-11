import type { InquiryStatus } from "@/lib/generated/prisma/client";

/**
 * Centralne źródło prawdy o statusach zapytania — kolejność, etykiety PL i które
 * statusy są końcowe. Dodanie nowego statusu w przyszłości: nowa wartość enuma
 * InquiryStatus w schema.prisma + wpis tutaj. Kolejność w INQUIRY_STATUSES to
 * sugerowany workflow (NOWE -> DO_KONTAKTU -> WYCENIONE -> OCZEKUJE_NA_KLIENTA ->
 * ZAAKCEPTOWANE | ODRZUCONE | ANULOWANE) — nieegzekwowana na poziomie bazy, admin
 * może ustawić dowolny status w dowolnym momencie.
 */
export const INQUIRY_STATUSES: InquiryStatus[] = [
  "NOWE",
  "DO_KONTAKTU",
  "WYCENIONE",
  "OCZEKUJE_NA_KLIENTA",
  "ZAAKCEPTOWANE",
  "ODRZUCONE",
  "ANULOWANE",
];

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  NOWE: "Nowe",
  DO_KONTAKTU: "Do kontaktu",
  WYCENIONE: "Wycenione",
  OCZEKUJE_NA_KLIENTA: "Oczekuje na klienta",
  ZAAKCEPTOWANE: "Zaakceptowane",
  ODRZUCONE: "Odrzucone",
  ANULOWANE: "Anulowane",
};

/** Statusy końcowe — zapytanie nie wymaga już dalszej obsługi. */
export const INQUIRY_STATUS_FINAL: InquiryStatus[] = ["ODRZUCONE", "ANULOWANE"];

export const INQUIRY_STATUS_BADGE_VARIANT: Record<
  InquiryStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  NOWE: "default",
  DO_KONTAKTU: "outline",
  WYCENIONE: "outline",
  OCZEKUJE_NA_KLIENTA: "secondary",
  ZAAKCEPTOWANE: "default",
  ODRZUCONE: "destructive",
  ANULOWANE: "destructive",
};
