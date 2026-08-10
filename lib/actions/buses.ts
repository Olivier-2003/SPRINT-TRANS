"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { busSchema, type BusInput } from "@/lib/validation/bus";
import { isForeignKeyConstraintError, isUniqueConstraintError } from "@/lib/prisma-errors";

export type BusFormState = { error?: string } | undefined;

const LIST_PATH = "/admin/autobusy";

function parseFeatures(text: string): string[] {
  return text
    .split(",")
    .map((feature) => feature.trim())
    .filter(Boolean);
}

export async function createBus(data: BusInput): Promise<BusFormState> {
  const parsed = busSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Popraw błędy w formularzu." };
  }

  const { photos, featuresText, productionYear, description, ...rest } = parsed.data;

  try {
    await db.bus.create({
      data: {
        ...rest,
        productionYear: productionYear ?? null,
        description: description || null,
        features: parseFeatures(featuresText),
        photos: { create: photos.map((photo, index) => ({ url: photo.url, sortOrder: index })) },
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { error: "Autobus z takim numerem rejestracyjnym już istnieje." };
    }
    throw error;
  }

  revalidatePath(LIST_PATH);
  redirect(LIST_PATH);
}

export async function updateBus(id: string, data: BusInput): Promise<BusFormState> {
  const parsed = busSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Popraw błędy w formularzu." };
  }

  const { photos, featuresText, productionYear, description, ...rest } = parsed.data;

  try {
    await db.$transaction([
      db.busPhoto.deleteMany({ where: { busId: id } }),
      db.bus.update({
        where: { id },
        data: {
          ...rest,
          productionYear: productionYear ?? null,
          description: description || null,
          features: parseFeatures(featuresText),
          photos: {
            create: photos.map((photo, index) => ({ url: photo.url, sortOrder: index })),
          },
        },
      }),
    ]);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { error: "Autobus z takim numerem rejestracyjnym już istnieje." };
    }
    throw error;
  }

  revalidatePath(LIST_PATH);
  redirect(LIST_PATH);
}

export async function deleteBus(formData: FormData) {
  const id = formData.get("id") as string;

  try {
    await db.bus.delete({ where: { id } });
  } catch (error) {
    if (isForeignKeyConstraintError(error)) {
      redirect(
        `${LIST_PATH}?error=${encodeURIComponent(
          "Nie można usunąć autobusu — jest przypisany do istniejącego zlecenia."
        )}`
      );
    }
    throw error;
  }

  revalidatePath(LIST_PATH);
  redirect(LIST_PATH);
}
