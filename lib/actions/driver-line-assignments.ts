"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  driverLineAssignmentSchema,
  type DriverLineAssignmentInput,
} from "@/lib/validation/availability-admin";
import type { DriverLineRole } from "@/lib/generated/prisma/client";

export type ActionState = { error?: string; success?: boolean } | undefined;

function detailPath(driverId: string) {
  return `/admin/kierowcy/${driverId}`;
}

export async function assignDriverToLine(
  driverId: string,
  data: DriverLineAssignmentInput
): Promise<ActionState> {
  const parsed = driverLineAssignmentSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Popraw dane przypisania." };
  }

  const existing = await db.driverLineAssignment.findUnique({
    where: { driverId_lineId: { driverId, lineId: parsed.data.lineId } },
  });
  if (existing) {
    return { error: "Kierowca jest już przypisany do tej linii." };
  }

  await db.driverLineAssignment.create({
    data: {
      driverId,
      lineId: parsed.data.lineId,
      role: parsed.data.role as DriverLineRole,
      note: parsed.data.note || null,
    },
  });

  revalidatePath(detailPath(driverId));
  return { success: true };
}

export async function removeDriverLineAssignment(driverId: string, lineId: string): Promise<ActionState> {
  await db.driverLineAssignment.delete({
    where: { driverId_lineId: { driverId, lineId } },
  });

  revalidatePath(detailPath(driverId));
  return { success: true };
}
