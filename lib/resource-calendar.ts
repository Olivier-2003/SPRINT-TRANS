import { db } from "@/lib/db";
import { getDaysInMonth, bookingCoversDay } from "@/lib/calendar-grid";
import { DRIVER_AVAILABILITY_BLOCKING_TYPES, DRIVER_AVAILABILITY_TYPE_LABELS } from "@/lib/driver-availability-labels";
import { BUS_AVAILABILITY_BLOCKING_TYPES, BUS_AVAILABILITY_TYPE_LABELS } from "@/lib/bus-availability-labels";

/**
 * Siatka dzień-po-dniu zajętości/dostępności zasobów (kierowcy, autobusy) dla
 * widoków kalendarza — łączy zlecenia (Booking) z ręcznie wprowadzoną
 * niedostępnością, tak samo jak silnik statusu (lib/availability-engine.ts),
 * ale w formie jednego przebiegu na cały miesiąc zamiast pojedynczego okna czasu.
 */

export type ResourceDayStatus = "ZAJETY" | "NIEDOSTEPNY" | "CZESCIOWO" | "WOLNY";

export interface ResourceDay {
  status: ResourceDayStatus;
  title: string;
}

export interface ResourceRow {
  id: string;
  label: string;
  href: string;
  days: ResourceDay[];
}

export async function getDriverResourceGrid(year: number, month: number): Promise<ResourceRow[]> {
  const days = getDaysInMonth(year, month);
  const monthStart = days[0];
  const monthEnd = new Date(days[days.length - 1].getTime() + 24 * 60 * 60 * 1000);

  const [drivers, bookings, availability] = await Promise.all([
    db.driver.findMany({ orderBy: [{ lastName: "asc" }, { firstName: "asc" }] }),
    db.booking.findMany({
      where: { status: { not: "ANULOWANE" }, startAt: { lt: monthEnd }, endAt: { gt: monthStart } },
      select: { customerName: true, startAt: true, endAt: true, drivers: { select: { driverId: true } } },
    }),
    db.driverAvailability.findMany({
      where: { startAt: { lt: monthEnd }, endAt: { gt: monthStart } },
    }),
  ]);

  return drivers.map((driver) => {
    const driverBookings = bookings.filter((b) => b.drivers.some((d) => d.driverId === driver.id));
    const driverAvailability = availability.filter((a) => a.driverId === driver.id);

    const dayStatuses: ResourceDay[] = days.map((day) => {
      const blocking = driverAvailability.find(
        (a) => DRIVER_AVAILABILITY_BLOCKING_TYPES.includes(a.type) && bookingCoversDay(a.startAt, a.endAt, day)
      );
      if (blocking) {
        return { status: "NIEDOSTEPNY", title: DRIVER_AVAILABILITY_TYPE_LABELS[blocking.type] };
      }
      const partial = driverAvailability.find(
        (a) => a.type === "DOSTEPNY_CZESCIOWO" && bookingCoversDay(a.startAt, a.endAt, day)
      );
      if (partial) {
        return { status: "CZESCIOWO", title: DRIVER_AVAILABILITY_TYPE_LABELS[partial.type] };
      }
      const booking = driverBookings.find((b) => bookingCoversDay(b.startAt, b.endAt, day));
      if (booking) {
        return { status: "ZAJETY", title: `Zlecenie: ${booking.customerName}` };
      }
      return { status: "WOLNY", title: "Wolny" };
    });

    return {
      id: driver.id,
      label: `${driver.firstName} ${driver.lastName}`,
      href: `/admin/kierowcy/${driver.id}`,
      days: dayStatuses,
    };
  });
}

export async function getBusResourceGrid(year: number, month: number): Promise<ResourceRow[]> {
  const days = getDaysInMonth(year, month);
  const monthStart = days[0];
  const monthEnd = new Date(days[days.length - 1].getTime() + 24 * 60 * 60 * 1000);

  const [buses, bookings, availability] = await Promise.all([
    db.bus.findMany({ orderBy: { registrationNumber: "asc" } }),
    db.booking.findMany({
      where: { status: { not: "ANULOWANE" }, startAt: { lt: monthEnd }, endAt: { gt: monthStart } },
      select: { customerName: true, startAt: true, endAt: true, buses: { select: { busId: true } } },
    }),
    db.busAvailability.findMany({
      where: { startAt: { lt: monthEnd }, endAt: { gt: monthStart } },
    }),
  ]);

  return buses.map((bus) => {
    const busBookings = bookings.filter((b) => b.buses.some((x) => x.busId === bus.id));
    const busAvailability = availability.filter((a) => a.busId === bus.id);

    const dayStatuses: ResourceDay[] = days.map((day) => {
      const blocking = busAvailability.find(
        (a) => BUS_AVAILABILITY_BLOCKING_TYPES.includes(a.type) && bookingCoversDay(a.startAt, a.endAt, day)
      );
      if (blocking) {
        return { status: "NIEDOSTEPNY", title: BUS_AVAILABILITY_TYPE_LABELS[blocking.type] };
      }
      const booking = busBookings.find((b) => bookingCoversDay(b.startAt, b.endAt, day));
      if (booking) {
        return { status: "ZAJETY", title: `Zlecenie: ${booking.customerName}` };
      }
      return { status: "WOLNY", title: "Wolny" };
    });

    return {
      id: bus.id,
      label: `${bus.registrationNumber} — ${bus.brandModel}`,
      href: `/admin/autobusy/${bus.id}`,
      days: dayStatuses,
    };
  });
}
