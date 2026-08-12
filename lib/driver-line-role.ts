import type { DriverLineRole } from "@/lib/generated/prisma/client";

export const DRIVER_LINE_ROLES: DriverLineRole[] = ["GLOWNY", "PREFEROWANY", "REZERWOWY"];

export const DRIVER_LINE_ROLE_LABELS: Record<DriverLineRole, string> = {
  GLOWNY: "Główny",
  PREFEROWANY: "Preferowany",
  REZERWOWY: "Rezerwowy",
};
