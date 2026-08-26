"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import {
  bookingNotesSchema,
  bookingStatusSchema,
  type BookingNotesInput,
  type BookingStatusInput,
} from "@/lib/validation/inquiry-admin";
import {
  assignDriverSchema,
  assignBusSchema,
  swapDriverSchema,
  swapBusSchema,
  bookingRouteSchema,
  bookingScheduleSchema,
  createBookingSchema,
  type AssignDriverInput,
  type AssignBusInput,
  type SwapDriverInput,
  type SwapBusInput,
  type BookingRouteInput,
  type BookingScheduleInput,
  type CreateBookingInput,
} from "@/lib/validation/booking-admin";

export type ActionState = { error?: string; success?: boolean } | undefined;

function detailPath(id: string) {
  return `/admin/zlecenia/${id}`;
}

async function currentAdminId(): Promise<string | undefined> {
  const session = await auth();
  return session?.user?.id;
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

  const [existing, driver] = await Promise.all([
    db.bookingDriver.findUnique({
      where: { bookingId_driverId: { bookingId, driverId: parsed.data.driverId } },
    }),
    db.driver.findUnique({ where: { id: parsed.data.driverId } }),
  ]);
  if (existing) {
    return { error: "Ten kierowca jest już przypisany do tego zlecenia." };
  }
  if (!driver) {
    return { error: "Nie znaleziono kierowcy." };
  }

  const changedById = await currentAdminId();
  await db.$transaction([
    db.bookingDriver.create({
      data: {
        bookingId,
        driverId: parsed.data.driverId,
        roleOnTrip: parsed.data.roleOnTrip || null,
      },
    }),
    db.bookingAssignmentHistory.create({
      data: {
        bookingId,
        resourceType: "KIEROWCA",
        resourceId: driver.id,
        resourceLabel: `${driver.firstName} ${driver.lastName}`,
        changeType: "PRZYPISANO",
        changedById,
      },
    }),
  ]);

  revalidatePath(detailPath(bookingId));
  revalidatePath("/admin/kalendarz");
  return { success: true };
}

export async function removeDriver(bookingId: string, driverId: string): Promise<ActionState> {
  const driver = await db.driver.findUnique({ where: { id: driverId } });
  const changedById = await currentAdminId();

  await db.$transaction([
    db.bookingDriver.delete({ where: { bookingId_driverId: { bookingId, driverId } } }),
    db.bookingAssignmentHistory.create({
      data: {
        bookingId,
        resourceType: "KIEROWCA",
        resourceId: driverId,
        resourceLabel: driver ? `${driver.firstName} ${driver.lastName}` : "(usunięty kierowca)",
        changeType: "USUNIETO",
        changedById,
      },
    }),
  ]);

  revalidatePath(detailPath(bookingId));
  revalidatePath("/admin/kalendarz");
  return { success: true };
}

/** Szybka zmiana obsady — zastępuje kierowcę innym w jednej akcji, bez usuwania zlecenia. */
export async function swapDriver(
  bookingId: string,
  oldDriverId: string,
  data: SwapDriverInput
): Promise<ActionState> {
  const parsed = swapDriverSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Popraw dane zmiany przydziału." };
  }
  if (parsed.data.newDriverId === oldDriverId) {
    return { error: "Wybierz innego kierowcę niż obecnie przypisany." };
  }

  const [existingNew, oldDriver, newDriver] = await Promise.all([
    db.bookingDriver.findUnique({
      where: { bookingId_driverId: { bookingId, driverId: parsed.data.newDriverId } },
    }),
    db.driver.findUnique({ where: { id: oldDriverId } }),
    db.driver.findUnique({ where: { id: parsed.data.newDriverId } }),
  ]);
  if (existingNew) {
    return { error: "Ten kierowca jest już przypisany do tego zlecenia." };
  }
  if (!newDriver) {
    return { error: "Nie znaleziono nowego kierowcy." };
  }

  const changedById = await currentAdminId();
  const oldLabel = oldDriver ? `${oldDriver.firstName} ${oldDriver.lastName}` : "(usunięty kierowca)";
  const newLabel = `${newDriver.firstName} ${newDriver.lastName}`;

  await db.$transaction([
    db.bookingDriver.delete({ where: { bookingId_driverId: { bookingId, driverId: oldDriverId } } }),
    db.bookingDriver.create({
      data: {
        bookingId,
        driverId: parsed.data.newDriverId,
        roleOnTrip: parsed.data.roleOnTrip || null,
      },
    }),
    db.bookingAssignmentHistory.create({
      data: {
        bookingId,
        resourceType: "KIEROWCA",
        resourceId: newDriver.id,
        resourceLabel: newLabel,
        changeType: "ZMIENIONO",
        note: `Zastąpiono: ${oldLabel} → ${newLabel}`,
        changedById,
      },
    }),
  ]);

  revalidatePath(detailPath(bookingId));
  revalidatePath("/admin/kalendarz");
  return { success: true };
}

export async function assignBus(bookingId: string, data: AssignBusInput): Promise<ActionState> {
  const parsed = assignBusSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Popraw dane przypisania." };
  }

  const [existing, bus] = await Promise.all([
    db.bookingBus.findUnique({
      where: { bookingId_busId: { bookingId, busId: parsed.data.busId } },
    }),
    db.bus.findUnique({ where: { id: parsed.data.busId } }),
  ]);
  if (existing) {
    return { error: "Ten autobus jest już przypisany do tego zlecenia." };
  }
  if (!bus) {
    return { error: "Nie znaleziono autobusu." };
  }

  const changedById = await currentAdminId();
  await db.$transaction([
    db.bookingBus.create({ data: { bookingId, busId: parsed.data.busId } }),
    db.bookingAssignmentHistory.create({
      data: {
        bookingId,
        resourceType: "AUTOBUS",
        resourceId: bus.id,
        resourceLabel: `${bus.registrationNumber} — ${bus.brandModel}`,
        changeType: "PRZYPISANO",
        changedById,
      },
    }),
  ]);

  revalidatePath(detailPath(bookingId));
  revalidatePath("/admin/kalendarz");
  return { success: true };
}

export async function removeBus(bookingId: string, busId: string): Promise<ActionState> {
  const bus = await db.bus.findUnique({ where: { id: busId } });
  const changedById = await currentAdminId();

  await db.$transaction([
    db.bookingBus.delete({ where: { bookingId_busId: { bookingId, busId } } }),
    db.bookingAssignmentHistory.create({
      data: {
        bookingId,
        resourceType: "AUTOBUS",
        resourceId: busId,
        resourceLabel: bus ? `${bus.registrationNumber} — ${bus.brandModel}` : "(usunięty autobus)",
        changeType: "USUNIETO",
        changedById,
      },
    }),
  ]);

  revalidatePath(detailPath(bookingId));
  revalidatePath("/admin/kalendarz");
  return { success: true };
}

/** Szybka zmiana obsady — zastępuje autobus innym w jednej akcji, bez usuwania zlecenia. */
export async function swapBus(bookingId: string, oldBusId: string, data: SwapBusInput): Promise<ActionState> {
  const parsed = swapBusSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Popraw dane zmiany przydziału." };
  }
  if (parsed.data.newBusId === oldBusId) {
    return { error: "Wybierz inny autobus niż obecnie przypisany." };
  }

  const [existingNew, oldBus, newBus] = await Promise.all([
    db.bookingBus.findUnique({ where: { bookingId_busId: { bookingId, busId: parsed.data.newBusId } } }),
    db.bus.findUnique({ where: { id: oldBusId } }),
    db.bus.findUnique({ where: { id: parsed.data.newBusId } }),
  ]);
  if (existingNew) {
    return { error: "Ten autobus jest już przypisany do tego zlecenia." };
  }
  if (!newBus) {
    return { error: "Nie znaleziono nowego autobusu." };
  }

  const changedById = await currentAdminId();
  const oldLabel = oldBus ? `${oldBus.registrationNumber} — ${oldBus.brandModel}` : "(usunięty autobus)";
  const newLabel = `${newBus.registrationNumber} — ${newBus.brandModel}`;

  await db.$transaction([
    db.bookingBus.delete({ where: { bookingId_busId: { bookingId, busId: oldBusId } } }),
    db.bookingBus.create({ data: { bookingId, busId: parsed.data.newBusId } }),
    db.bookingAssignmentHistory.create({
      data: {
        bookingId,
        resourceType: "AUTOBUS",
        resourceId: newBus.id,
        resourceLabel: newLabel,
        changeType: "ZMIENIONO",
        note: `Zastąpiono: ${oldLabel} → ${newLabel}`,
        changedById,
      },
    }),
  ]);

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

/**
 * Ręczne utworzenie zlecenia bez powiązanego zapytania — dla przypadków
 * umówionych telefonicznie/mailowo poza formularzem na stronie publicznej.
 * W przeciwieństwie do createBookingFromInquiry, sourceInquiryId jest null.
 */
export async function createManualBooking(data: CreateBookingInput): Promise<ActionState> {
  const parsed = createBookingSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Popraw dane zlecenia." };
  }

  const session = await auth();
  const {
    customerName,
    customerEmail,
    customerPhone,
    startAt,
    endAt,
    finalPrice,
    status,
    points,
  } = parsed.data;

  const booking = await db.booking.create({
    data: {
      sourceInquiryId: null,
      customerName,
      customerEmail,
      customerPhone,
      startAt: new Date(startAt),
      endAt: new Date(endAt),
      finalPrice: Number(finalPrice),
      status,
      createdById: session?.user?.id,
      routePoints: {
        create: points.map((point, index) => ({
          sequence: index,
          pointType: point.pointType,
          label: point.label,
        })),
      },
    },
  });

  revalidatePath("/admin/zlecenia");
  revalidatePath("/admin/kalendarz");
  revalidatePath("/admin");
  redirect(`/admin/zlecenia/${booking.id}`);
}
