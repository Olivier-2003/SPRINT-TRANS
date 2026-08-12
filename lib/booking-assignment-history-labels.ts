import type { AssignmentResourceType, AssignmentChangeType } from "@/lib/generated/prisma/client";

export const ASSIGNMENT_RESOURCE_TYPE_LABELS: Record<AssignmentResourceType, string> = {
  KIEROWCA: "Kierowca",
  AUTOBUS: "Autobus",
};

export const ASSIGNMENT_CHANGE_TYPE_LABELS: Record<AssignmentChangeType, string> = {
  PRZYPISANO: "Przypisano",
  ZMIENIONO: "Zmieniono",
  USUNIETO: "Usunięto",
};
