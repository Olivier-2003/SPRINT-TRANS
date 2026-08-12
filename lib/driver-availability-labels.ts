import type { DriverAvailabilityType } from "@/lib/generated/prisma/client";

export const DRIVER_AVAILABILITY_TYPES: DriverAvailabilityType[] = [
  "URLOP",
  "CHOROBOWE",
  "SZKOLENIE",
  "NIEDOSTEPNY",
  "DOSTEPNY_CZESCIOWO",
];

export const DRIVER_AVAILABILITY_TYPE_LABELS: Record<DriverAvailabilityType, string> = {
  URLOP: "Urlop",
  CHOROBOWE: "Zwolnienie chorobowe",
  SZKOLENIE: "Szkolenie",
  NIEDOSTEPNY: "Niedostępny",
  DOSTEPNY_CZESCIOWO: "Dostępny częściowo",
};

/** Typy traktowane jako pełna nieobecność (blokada) — DOSTEPNY_CZESCIOWO jest wyłączony. */
export const DRIVER_AVAILABILITY_BLOCKING_TYPES: DriverAvailabilityType[] = [
  "URLOP",
  "CHOROBOWE",
  "SZKOLENIE",
  "NIEDOSTEPNY",
];
