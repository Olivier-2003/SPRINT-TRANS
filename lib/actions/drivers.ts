"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { driverSchema, type DriverInput } from "@/lib/validation/driver";
import { isForeignKeyConstraintError } from "@/lib/prisma-errors";

export type DriverFormState = { error?: string } | undefined;

const LIST_PATH = "/admin/kierowcy";

export async function createDriver(data: DriverInput): Promise<DriverFormState> {
  const parsed = driverSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Popraw błędy w formularzu." };
  }

  await db.driver.create({
    data: {
      ...parsed.data,
      email: parsed.data.email || null,
      notes: parsed.data.notes || null,
    },
  });

  revalidatePath(LIST_PATH);
  redirect(LIST_PATH);
}

export async function updateDriver(
  id: string,
  data: DriverInput
): Promise<DriverFormState> {
  const parsed = driverSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Popraw błędy w formularzu." };
  }

  await db.driver.update({
    where: { id },
    data: {
      ...parsed.data,
      email: parsed.data.email || null,
      notes: parsed.data.notes || null,
    },
  });

  revalidatePath(LIST_PATH);
  redirect(LIST_PATH);
}

export async function deleteDriver(formData: FormData) {
  const id = formData.get("id") as string;

  try {
    await db.driver.delete({ where: { id } });
  } catch (error) {
    if (isForeignKeyConstraintError(error)) {
      redirect(
        `${LIST_PATH}?error=${encodeURIComponent(
          "Nie można usunąć kierowcy — jest przypisany do istniejącego zlecenia."
        )}`
      );
    }
    throw error;
  }

  revalidatePath(LIST_PATH);
  redirect(LIST_PATH);
}
