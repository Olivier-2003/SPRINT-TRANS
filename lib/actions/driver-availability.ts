"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import {
  driverAvailabilitySchema,
  type DriverAvailabilityInput,
} from "@/lib/validation/availability-admin";

export type ActionState = { error?: string; success?: boolean } | undefined;

function detailPath(driverId: string) {
  return `/admin/kierowcy/${driverId}`;
}

export async function createDriverAvailability(
  driverId: string,
  data: DriverAvailabilityInput
): Promise<ActionState> {
  const parsed = driverAvailabilitySchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Popraw dane niedostępności." };
  }

  const session = await auth();

  await db.driverAvailability.create({
    data: {
      driverId,
      type: parsed.data.type,
      startAt: new Date(parsed.data.startAt),
      endAt: new Date(parsed.data.endAt),
      note: parsed.data.note || null,
      createdById: session?.user?.id,
    },
  });

  revalidatePath(detailPath(driverId));
  revalidatePath("/admin/kalendarz");
  return { success: true };
}

export async function deleteDriverAvailability(driverId: string, id: string): Promise<ActionState> {
  await db.driverAvailability.delete({ where: { id } });

  revalidatePath(detailPath(driverId));
  revalidatePath("/admin/kalendarz");
  return { success: true };
}
