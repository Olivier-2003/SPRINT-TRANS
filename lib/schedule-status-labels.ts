import type { SlotStatus } from "@/lib/schedule-proposal";

export const SLOT_STATUS_LABELS: Record<SlotStatus, string> = {
  POPRAWNE: "Poprawne",
  OSTRZEZENIE: "Ostrzeżenie",
  KONFLIKT: "Konflikt",
  BRAK_OBSADY: "Brak obsady",
};

export const SLOT_STATUS_BADGE_VARIANT: Record<SlotStatus, "default" | "secondary" | "outline" | "destructive"> = {
  POPRAWNE: "default",
  OSTRZEZENIE: "secondary",
  KONFLIKT: "destructive",
  BRAK_OBSADY: "outline",
};
