"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  bookingNotesSchema,
  bookingStatusSchema,
  type BookingNotesInput,
  type BookingStatusInput,
} from "@/lib/validation/inquiry-admin";
import {
  assignDriverSchema,
  assignBusSchema,
  bookingRouteSchema,
  bookingScheduleSchema,
  type AssignDriverInput,
  type AssignBusInput,
  type BookingRouteInput,
  type BookingScheduleInput,
} from "@/lib/validation/booking-admin";

export type ActionState = { error?: string; success?: boolean } | undefined;

function detailPath(id: string) {
  return `/admin/zlecenia/${id}`;
}

export async function updateBookingNotes(id: string, data: BookingNotesInput): Promise<ActionState> {
  const parsed = bookingNotesSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Popraw treść notatek." };
  }

  await db.booking.update({ where: { id }, data: { notes: parsed.data.notes || null } });

  revalidatePath(detailPath(id));
  return { success: true };
}

export async function updateBookingStatus(id: string, data: BookingStatusInput): Promise<ActionState> {
  const parsed = bookingStatusSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Nieprawidłowy status." };
  }

  await db.booking.update({ where: { id }, data: { status: parsed.data.status } });

  revalidatePath(detailPath(id));
  revalidatePath("/admin/zlecenia");
  revalidatePath("/admin");
  return { success: true };
}

export async function assignDriver(bookingId: string, data: AssignDriverInput): Promise<ActionState> {
  const parsed = assignDriverSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Popraw dane przypisania." };
  }

  const existing = await db.bookingDriver.findUnique({
    where: { bookingId_driverId: { bookingId, driverId: parsed.data.driverId } },
  });
  if (existing) {
    return { error: "Ten kierowca jest już przypisany do tego zlecenia." };
  }

  await db.bookingDriver.create({
    data: {
      bookingId,
      driverId: parsed.data.driverId,
      roleOnTrip: parsed.data.roleOnTrip || null,
    },
  });

  revalidatePath(detailPath(bookingId));
  revalidatePath("/admin/kalendarz");
  return { success: true };
}

export async function removeDriver(bookingId: string, driverId: string): Promise<ActionState> {
  await db.bookingDriver.delete({
    where: { bookingId_driverId: { bookingId, driverId } },
  });

  revalidatePath(detailPath(bookingId));
  revalidatePath("/admin/kalendarz");
  return { success: true };
}

export async function assignBus(bookingId: string, data: AssignBusInput): Promise<ActionState> {
  const parsed = assignBusSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Popraw dane przypisania." };
  }

  const existing = await db.bookingBus.findUnique({
    where: { bookingId_busId: { bookingId, busId: parsed.data.busId } },
  });
  if (existing) {
    return { error: "Ten autobus jest już przypisany do tego zlecenia." };
  }

  await db.bookingBus.create({
    data: { bookingId, busId: parsed.data.busId },
  });

  revalidatePath(detailPath(bookingId));
  revalidatePath("/admin/kalendarz");
  return { success: true };
}

export async function removeBus(bookingId: string, busId: string): Promise<ActionState> {
  await db.bookingBus.delete({
    where: { bookingId_busId: { bookingId, busId } },
  });

  revalidatePath(detailPath(bookingId));
  revalidatePath("/admin/kalendarz");
  return { success: true };
}

export async function updateBookingRoute(bookingId: string, data: BookingRouteInput): Promise<ActionState> {
  const parsed = bookingRouteSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Popraw punkty trasy." };
  }

  await db.$transaction([
    db.routePoint.deleteMany({ where: { bookingId } }),
    db.routePoint.createMany({
      data: parsed.data.points.map((point, index) => ({
        bookingId,
        sequence: index,
        pointType: point.pointType,
        label: point.label,
      })),
    }),
  ]);

  revalidatePath(detailPath(bookingId));
  return { success: true };
}

export async function updateBookingSchedule(
  bookingId: string,
  data: BookingScheduleInput
): Promise<ActionState> {
  const parsed = bookingScheduleSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Popraw termin zlecenia." };
  }

  await db.booking.update({
    where: { id: bookingId },
    data: {
      startAt: new Date(parsed.data.startAt),
      endAt: new Date(parsed.data.endAt),
    },
  });

  revalidatePath(detailPath(bookingId));
  revalidatePath("/admin/zlecenia");
  revalidatePath("/admin/kalendarz");
  return { success: true };
}
