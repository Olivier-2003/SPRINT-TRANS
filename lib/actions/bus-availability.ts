"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { busAvailabilitySchema, type BusAvailabilityInput } from "@/lib/validation/availability-admin";

export type ActionState = { error?: string; success?: boolean } | undefined;

function detailPath(busId: string) {
  return `/admin/autobusy/${busId}`;
}

export async function createBusAvailability(
  busId: string,
  data: BusAvailabilityInput
): Promise<ActionState> {
  const parsed = busAvailabilitySchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Popraw dane niedostępności." };
  }

  const session = await auth();

  await db.busAvailability.create({
    data: {
      busId,
      type: parsed.data.type,
      startAt: new Date(parsed.data.startAt),
      endAt: new Date(parsed.data.endAt),
      note: parsed.data.note || null,
      createdById: session?.user?.id,
    },
  });

  revalidatePath(detailPath(busId));
  revalidatePath("/admin/kalendarz");
  return { success: true };
}

export async function deleteBusAvailability(busId: string, id: string): Promise<ActionState> {
  await db.busAvailability.delete({ where: { id } });

  revalidatePath(detailPath(busId));
  revalidatePath("/admin/kalendarz");
  return { success: true };
}
