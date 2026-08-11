import type { RoutePointType } from "@/lib/generated/prisma/client";

export const ROUTE_POINT_TYPES: RoutePointType[] = [
  "BAZA_WYJAZD",
  "ODBIOR",
  "PRZYSTANEK",
  "ZWROT",
  "BAZA_POWROT",
];

export const ROUTE_POINT_TYPE_LABELS: Record<RoutePointType, string> = {
  BAZA_WYJAZD: "Baza (wyjazd)",
  ODBIOR: "Odbiór",
  PRZYSTANEK: "Przystanek",
  ZWROT: "Zwrot",
  BAZA_POWROT: "Baza (powrót)",
};
