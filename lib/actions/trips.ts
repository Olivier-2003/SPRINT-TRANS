"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { tripSchema, type TripInput } from "@/lib/validation/trip";
import { isForeignKeyConstraintError } from "@/lib/prisma-errors";

export type TripFormState = { error?: string } | undefined;

const LIST_PATH = "/admin/wycieczki";

export async function createTrip(data: TripInput): Promise<TripFormState> {
  const parsed = tripSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Popraw błędy w formularzu." };
  }

  const { photos, description, priceInfo, ...rest } = parsed.data;

  await db.trip.create({
    data: {
      ...rest,
      description: description || null,
      priceInfo: priceInfo || null,
      photos: { create: photos.map((photo, index) => ({ url: photo.url, sortOrder: index })) },
    },
  });

  revalidatePath(LIST_PATH);
  redirect(LIST_PATH);
}

export async function updateTrip(id: string, data: TripInput): Promise<TripFormState> {
  const parsed = tripSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Popraw błędy w formularzu." };
  }

  const { photos, description, priceInfo, ...rest } = parsed.data;

  await db.$transaction([
    db.tripPhoto.deleteMany({ where: { tripId: id } }),
    db.trip.update({
      where: { id },
      data: {
        ...rest,
        description: description || null,
        priceInfo: priceInfo || null,
        photos: {
          create: photos.map((photo, index) => ({ url: photo.url, sortOrder: index })),
        },
      },
    }),
  ]);

  revalidatePath(LIST_PATH);
  redirect(LIST_PATH);
}

export async function deleteTrip(formData: FormData) {
  const id = formData.get("id") as string;

  try {
    await db.trip.delete({ where: { id } });
  } catch (error) {
    if (isForeignKeyConstraintError(error)) {
      redirect(
        `${LIST_PATH}?error=${encodeURIComponent(
          "Nie można usunąć wycieczki — jest powiązana z istniejącymi zapytaniami."
        )}`
      );
    }
    throw error;
  }

  revalidatePath(LIST_PATH);
  redirect(LIST_PATH);
}
