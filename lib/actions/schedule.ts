"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { generateScheduleProposal, type ScheduleGenerationResult } from "@/lib/schedule-proposal";

/**
 * Akcje serwerowe generatora grafiku (Etap 9). Świadomie rozdzielone na dwa etapy:
 * generateScheduleAction WYŁĄCZNIE oblicza i zwraca propozycję — nie zapisuje niczego.
 * approveScheduleAction jest jedynym miejscem, które zapisuje przydziały do bazy, i robi
 * to transakcyjnie (wszystko albo nic) na podstawie decyzji przekazanych przez
 * administratora (które mogą być propozycją generatora 1:1 albo ręcznie skorygowane).
 */

export async function generateScheduleAction(
  startDateStr: string,
  endDateStr: string
): Promise<{ error?: string; data?: ScheduleGenerationResult }> {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { error: "Podaj poprawny zakres dat." };
  }
  if (end.getTime() <= start.getTime()) {
    return { error: "Data końcowa musi być późniejsza niż początkowa." };
  }

  const data = await generateScheduleProposal(start, end);
  return { data };
}

export interface ScheduleDecision {
  bookingId: string;
  driverId: string | null;
  busId: string | null;
}

export type ApproveScheduleState =
  | { error?: string; success?: boolean; updatedCount?: number; unchangedCount?: number }
  | undefined;

export async function approveScheduleAction(decisions: ScheduleDecision[]): Promise<ApproveScheduleState> {
  if (!decisions || decisions.length === 0) {
    return { error: "Brak decyzji do zatwierdzenia." };
  }

  const session = await auth();
  const changedById = session?.user?.id;
  let updatedCount = 0;
  let unchangedCount = 0;

  try {
    await db.$transaction(async (tx) => {
      for (const decision of decisions) {
        const booking = await tx.booking.findUnique({
          where: { id: decision.bookingId },
          include: {
            drivers: { include: { driver: { select: { firstName: true, lastName: true } } } },
            buses: { include: { bus: { select: { registrationNumber: true, brandModel: true } } } },
          },
        });
        if (!booking) {
          throw new Error(`Nie znaleziono zlecenia (${decision.bookingId}).`);
        }

        const currentDriver = booking.drivers.find((d) => d.roleOnTrip === "GLOWNY") ?? booking.drivers[0] ?? null;
        const currentBus = booking.buses[0] ?? null;

        // --- Kierowca ---
        if (decision.driverId !== (currentDriver?.driverId ?? null)) {
          if (currentDriver) {
            await tx.bookingDriver.delete({ where: { id: currentDriver.id } });
          }
          if (decision.driverId) {
            const driver = await tx.driver.findUnique({ where: { id: decision.driverId } });
            if (!driver) throw new Error("Nie znaleziono wybranego kierowcy.");
            await tx.bookingDriver.create({
              data: {
                bookingId: booking.id,
                driverId: decision.driverId,
                roleOnTrip: currentDriver?.roleOnTrip ?? "GLOWNY",
              },
            });
            await tx.bookingAssignmentHistory.create({
              data: {
                bookingId: booking.id,
                resourceType: "KIEROWCA",
                resourceId: decision.driverId,
                resourceLabel: `${driver.firstName} ${driver.lastName}`,
                changeType: currentDriver ? "ZMIENIONO" : "PRZYPISANO",
                note: "Zatwierdzono z generatora propozycji grafiku.",
                changedById,
              },
            });
          } else if (currentDriver) {
            await tx.bookingAssignmentHistory.create({
              data: {
                bookingId: booking.id,
                resourceType: "KIEROWCA",
                resourceId: currentDriver.driverId,
                resourceLabel: `${currentDriver.driver.firstName} ${currentDriver.driver.lastName}`,
                changeType: "USUNIETO",
                note: "Zatwierdzono z generatora propozycji grafiku — pozostawiono bez obsady.",
                changedById,
              },
            });
          }
          updatedCount++;
        } else {
          unchangedCount++;
        }

        // --- Autobus ---
        if (decision.busId !== (currentBus?.busId ?? null)) {
          if (currentBus) {
            await tx.bookingBus.delete({ where: { id: currentBus.id } });
          }
          if (decision.busId) {
            const bus = await tx.bus.findUnique({ where: { id: decision.busId } });
            if (!bus) throw new Error("Nie znaleziono wybranego autobusu.");
            await tx.bookingBus.create({ data: { bookingId: booking.id, busId: decision.busId } });
            await tx.bookingAssignmentHistory.create({
              data: {
                bookingId: booking.id,
                resourceType: "AUTOBUS",
                resourceId: decision.busId,
                resourceLabel: `${bus.registrationNumber} — ${bus.brandModel}`,
                changeType: currentBus ? "ZMIENIONO" : "PRZYPISANO",
                note: "Zatwierdzono z generatora propozycji grafiku.",
                changedById,
              },
            });
          } else if (currentBus) {
            await tx.bookingAssignmentHistory.create({
              data: {
                bookingId: booking.id,
                resourceType: "AUTOBUS",
                resourceId: currentBus.busId,
                resourceLabel: `${currentBus.bus.registrationNumber} — ${currentBus.bus.brandModel}`,
                changeType: "USUNIETO",
                note: "Zatwierdzono z generatora propozycji grafiku — pozostawiono bez obsady.",
                changedById,
              },
            });
          }
          updatedCount++;
        } else {
          unchangedCount++;
        }
      }
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Nie udało się zatwierdzić grafiku." };
  }

  revalidatePath("/admin/zlecenia");
  revalidatePath("/admin/kalendarz");
  revalidatePath("/admin/kierowcy/rozliczenie");

  return { success: true, updatedCount, unchangedCount };
}
