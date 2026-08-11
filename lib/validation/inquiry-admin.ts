import { z } from "zod";

// Literały zsynchronizowane z enumem InquiryStatus w schema.prisma oraz z listą
// INQUIRY_STATUSES w lib/inquiry-status.ts (tam etykiety PL i kolejność workflow).
const INQUIRY_STATUS_VALUES = [
  "NOWE",
  "DO_KONTAKTU",
  "WYCENIONE",
  "OCZEKUJE_NA_KLIENTA",
  "ZAAKCEPTOWANE",
  "ODRZUCONE",
  "ANULOWANE",
] as const;

export const inquiryStatusSchema = z.object({
  status: z.enum(INQUIRY_STATUS_VALUES),
});
export type InquiryStatusInput = z.infer<typeof inquiryStatusSchema>;

const CONTACT_TYPES = [
  "PROBA_KONTAKTU",
  "ROZMOWA_TELEFONICZNA",
  "EMAIL",
  "BRAK_ODPOWIEDZI",
  "PROSBA_O_PONOWNY_KONTAKT",
  "USTALENIE_CENY",
  "AKCEPTACJA_KLIENTA",
  "NOTATKA",
] as const;

export const contactLogSchema = z.object({
  contactType: z.enum(CONTACT_TYPES),
  note: z.string().trim().min(1, "Podaj treść notatki."),
});
export type ContactLogInput = z.infer<typeof contactLogSchema>;

const numericField = (message: string) =>
  z
    .string()
    .min(1, message)
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, message);

export const manualPriceQuoteSchema = z.object({
  distanceKm: numericField("Podaj poprawny dystans."),
  tripDays: numericField("Podaj poprawną liczbę dni.").refine(
    (value) => Number.isInteger(Number(value)) && Number(value) >= 1,
    "Liczba dni musi być całkowita i większa od zera."
  ),
  overnightStays: numericField("Podaj poprawną liczbę noclegów.").refine(
    (value) => Number.isInteger(Number(value)),
    "Liczba noclegów musi być liczbą całkowitą."
  ),
  driverCount: numericField("Podaj poprawną liczbę kierowców.").refine(
    (value) => Number.isInteger(Number(value)) && Number(value) >= 1,
    "Liczba kierowców musi być całkowita i co najmniej równa 1."
  ),
  waitingHours: numericField("Podaj poprawną liczbę godzin postoju."),
  extraCosts: z
    .string()
    .refine((value) => value === "" || !Number.isNaN(Number(value)), "Podaj poprawną kwotę."),
  extraCostsNote: z.string().trim(),
  finalPrice: numericField("Podaj ostateczną cenę."),
  note: z.string().trim(),
});
export type ManualPriceQuoteInput = z.infer<typeof manualPriceQuoteSchema>;

export const bookingNotesSchema = z.object({
  notes: z.string().trim(),
});
export type BookingNotesInput = z.infer<typeof bookingNotesSchema>;

const BOOKING_STATUSES = ["ZAPLANOWANE", "W_TRAKCIE", "ZAKONCZONE", "ANULOWANE"] as const;

export const bookingStatusSchema = z.object({
  status: z.enum(BOOKING_STATUSES),
});
export type BookingStatusInput = z.infer<typeof bookingStatusSchema>;
