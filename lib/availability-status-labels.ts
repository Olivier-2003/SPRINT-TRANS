import type { OverallStatus, DriverIssueType, BusIssueType } from "@/lib/availability-engine";

export const OVERALL_STATUS_LABELS: Record<OverallStatus, string> = {
  DOSTEPNY: "Dostępny",
  OSTRZEZENIE: "Dostępny z zastrzeżeniem",
  KONFLIKT: "Konflikt",
};

export const OVERALL_STATUS_BADGE_VARIANT: Record<
  OverallStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  DOSTEPNY: "default",
  OSTRZEZENIE: "secondary",
  KONFLIKT: "destructive",
};

export const DRIVER_ISSUE_TYPE_LABELS: Record<DriverIssueType, string> = {
  KONFLIKT_ZLECENIE: "Konflikt z innym zleceniem",
  NIEDOSTEPNOSC: "Niedostępność / urlop",
  PROBLEM_ODPOCZYNEK: "Problem z odpoczynkiem",
  OGRANICZENIE_RODZAJU_PRACY: "Ograniczenie rodzaju pracy",
  DOSTEPNOSC_CZESCIOWA: "Dostępność częściowa",
  PRZEKROCZONY_DZIENNY_CZAS_PRACY: "Przekroczony dzienny czas pracy",
};

export const BUS_ISSUE_TYPE_LABELS: Record<BusIssueType, string> = {
  KONFLIKT_ZLECENIE: "Konflikt z innym zleceniem",
  NIEDOSTEPNOSC: "Niedostępność / serwis",
};
