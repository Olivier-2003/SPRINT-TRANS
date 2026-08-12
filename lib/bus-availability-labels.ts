import type { BusAvailabilityType } from "@/lib/generated/prisma/client";

export const BUS_AVAILABILITY_TYPES: BusAvailabilityType[] = [
  "DOSTEPNY",
  "SERWIS",
  "PRZEGLAD",
  "AWARIA",
  "NIEDOSTEPNY",
];

export const BUS_AVAILABILITY_TYPE_LABELS: Record<BusAvailabilityType, string> = {
  DOSTEPNY: "Dostępny",
  SERWIS: "Serwis",
  PRZEGLAD: "Przegląd techniczny",
  AWARIA: "Awaria",
  NIEDOSTEPNY: "Niedostępny",
};

/** Typy traktowane jako blokada dostępności — DOSTEPNY jest wyłączony (to notatka, nie blokada). */
export const BUS_AVAILABILITY_BLOCKING_TYPES: BusAvailabilityType[] = [
  "SERWIS",
  "PRZEGLAD",
  "AWARIA",
  "NIEDOSTEPNY",
];
