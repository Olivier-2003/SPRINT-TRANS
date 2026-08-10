"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { lineSchema, type LineInput } from "@/lib/validation/line";
import { isForeignKeyConstraintError } from "@/lib/prisma-errors";

export type LineFormState = { error?: string } | undefined;

const LIST_PATH = "/admin/linie";

function buildScheduleCreateInput(schedules: LineInput["schedules"]) {
  return schedules.map((schedule) => ({
    daysOfWeek: schedule.daysOfWeek,
    departureTime: schedule.departureTime,
    arrivalTime: schedule.arrivalTime,
    price: schedule.price,
    validFrom: new Date(schedule.validFrom),
    validTo: schedule.validTo ? new Date(schedule.validTo) : null,
  }));
}

export async function createLine(data: LineInput): Promise<LineFormState> {
  const parsed = lineSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Popraw błędy w formularzu." };
  }

  const { stops, schedules, description, ...rest } = parsed.data;

  await db.regularLine.create({
    data: {
      ...rest,
      description: description || null,
      stops: { create: stops.map((stop, index) => ({ ...stop, sortOrder: index })) },
      schedules: { create: buildScheduleCreateInput(schedules) },
    },
  });

  revalidatePath(LIST_PATH);
  redirect(LIST_PATH);
}

export async function updateLine(id: string, data: LineInput): Promise<LineFormState> {
  const parsed = lineSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Popraw błędy w formularzu." };
  }

  const { stops, schedules, description, ...rest } = parsed.data;

  await db.$transaction([
    db.lineStop.deleteMany({ where: { lineId: id } }),
    db.lineSchedule.deleteMany({ where: { lineId: id } }),
    db.regularLine.update({
      where: { id },
      data: {
        ...rest,
        description: description || null,
        stops: { create: stops.map((stop, index) => ({ ...stop, sortOrder: index })) },
        schedules: { create: buildScheduleCreateInput(schedules) },
      },
    }),
  ]);

  revalidatePath(LIST_PATH);
  redirect(LIST_PATH);
}

export async function deleteLine(formData: FormData) {
  const id = formData.get("id") as string;

  try {
    await db.regularLine.delete({ where: { id } });
  } catch (error) {
    if (isForeignKeyConstraintError(error)) {
      redirect(
        `${LIST_PATH}?error=${encodeURIComponent(
          "Nie można usunąć linii — jest powiązana z istniejącymi zapytaniami."
        )}`
      );
    }
    throw error;
  }

  revalidatePath(LIST_PATH);
  redirect(LIST_PATH);
}
