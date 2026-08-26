import Link from "next/link";
import { Plus } from "lucide-react";
import { WEEKDAY_NAMES_PL, bookingCoversDay, formatDateParam, type CalendarGridDay } from "@/lib/calendar-grid";
import { BOOKING_STATUS_BADGE_VARIANT } from "@/lib/booking-status";
import { Badge } from "@/components/ui/badge";
import type { Booking, BookingDriver, BookingBus, Driver, Bus } from "@/lib/generated/prisma/client";

type CalendarBooking = Booking & {
  drivers: (BookingDriver & { driver: Pick<Driver, "firstName" | "lastName"> })[];
  buses: (BookingBus & { bus: Pick<Bus, "registrationNumber"> })[];
};

interface CalendarGridProps {
  days: CalendarGridDay[];
  bookings: CalendarBooking[];
  today: Date;
}

export function CalendarGrid({ days, bookings, today }: CalendarGridProps) {
  return (
    <div className="grid grid-cols-7 gap-px overflow-hidden rounded-md border bg-border text-sm">
      {WEEKDAY_NAMES_PL.map((label) => (
        <div key={label} className="bg-muted px-2 py-1 text-center text-xs font-medium text-muted-foreground">
          {label}
        </div>
      ))}
      {days.map((day) => {
        const dayBookings = bookings.filter((b) => bookingCoversDay(b.startAt, b.endAt, day.date));
        const isToday = day.date.toDateString() === today.toDateString();

        return (
          <div
            key={day.date.toISOString()}
            className={`flex min-h-28 flex-col gap-1 bg-background p-1.5 ${
              day.inCurrentMonth ? "" : "text-muted-foreground/50"
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className={`text-xs ${isToday ? "font-semibold text-primary" : ""}`}>
                {day.date.getDate()}
              </span>
              {dayBookings.length === 0 && (
                <Link
                  href={`/admin/zlecenia/nowy?date=${formatDateParam(day.date)}`}
                  aria-label={`Nowe zlecenie na ${formatDateParam(day.date)}`}
                  className="flex size-4 shrink-0 items-center justify-center rounded text-muted-foreground/50 transition-colors hover:bg-muted hover:text-primary"
                >
                  <Plus className="size-3" />
                </Link>
              )}
            </div>
            <div className="flex flex-col gap-1">
              {dayBookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/admin/zlecenia/${booking.id}`}
                  className="flex flex-col gap-0.5 rounded border px-1.5 py-1 text-xs hover:bg-muted"
                >
                  <span className="flex items-center justify-between gap-1">
                    <span className="truncate font-medium">{booking.customerName}</span>
                    <Badge
                      variant={BOOKING_STATUS_BADGE_VARIANT[booking.status]}
                      className="shrink-0 px-1 py-0 text-[10px]"
                    >
                      {booking.status}
                    </Badge>
                  </span>
                  {(booking.buses.length > 0 || booking.drivers.length > 0) && (
                    <span className="truncate text-muted-foreground">
                      {booking.buses.map((b) => b.bus.registrationNumber).join(", ")}
                      {booking.buses.length > 0 && booking.drivers.length > 0 ? " · " : ""}
                      {booking.drivers.map((d) => `${d.driver.firstName} ${d.driver.lastName}`).join(", ")}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
