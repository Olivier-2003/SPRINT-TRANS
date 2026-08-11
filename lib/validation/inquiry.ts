import { z } from "zod";

export const routeStopSchema = z.object({
  label: z.string().trim().min(1, "Podaj nazwę punktu pośredniego."),
});

/** Podzbiór pól potrzebny wyłącznie do wyliczenia orientacyjnej ceny (bez zapisu). */
export const inquiryPreviewSchema = z.object({
  origin: z.string().trim().min(1, "Podaj miejsce rozpoczęcia podróży."),
  stops: z.array(routeStopSchema),
  destination: z.string().trim().min(1, "Podaj miejsce docelowe."),
  passengerCount: z.number().int().min(1, "Podaj liczbę pasażerów.").max(200),
  requestedDepartureAt: z.string().min(1, "Podaj datę i godzinę wyjazdu."),
  requestedReturnAt: z.string().optional(),
});

export type InquiryPreviewInput = z.infer<typeof inquiryPreviewSchema>;

/** Pełny formularz — wysyłany dopiero przy złożeniu zapytania. */
export const inquirySchema = inquiryPreviewSchema.extend({
  additionalInfo: z.string().trim(),
  customerName: z.string().trim().min(1, "Podaj imię i nazwisko."),
  customerEmail: z.string().trim().email("Nieprawidłowy adres e-mail."),
  customerPhone: z.string().trim().min(1, "Podaj numer telefonu."),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
