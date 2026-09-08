"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import {
  WEEKDAY_NAMES_PL,
  bookingCoversDay,
  lineRunIsOnDay,
  formatDateParam,
  type CalendarGridDay,
} from "@/lib/calendar-grid";
import { BOOKING_STATUS_BADGE_VARIANT } from "@/lib/booking-status";
import { Badge } from "@/components/ui/badge";
import { CreateBookingDialog } from "@/components/admin/calendar/CreateBookingDialog";
import type { BookingStatus } from "@/lib/generated/prisma/client";
import type { LineRunOccurrence } from "@/lib/line-schedule-projection";

// Kształt jawnie serializowalny (bez Prisma Decimal) — CalendarGrid jest komponentem
// klienckim, a Next.js nie pozwala przekazywać instancji klas (np. Decimal) przez
// granicę server/client. Zawiera tylko pola faktycznie używane w renderze.
export interface CalendarBooking {
  id: string;
  startAt: Date;
  endAt: Date;
  customerName: string;
  status: BookingStatus;
  drivers: { driverId: string; driver: { firstName: string; lastName: string } }[];
  buses: { busId: string; bus: { registrationNumber: string } }[];
}

interface ResourceOption {
  id: string;
  label: string;
}

export interface LineOption {
  id: string;
  name: string;
  originLabel: string;
  destinationLabel: string;
  schedules: { daysOfWeek: number[]; departureTime: string; arrivalTime: string; price: number }[];
}

interface CalendarGridProps {
  days: CalendarGridDay[];
  bookings: CalendarBooking[];
  lineRuns: LineRunOccurrence[];
  today: Date;
  drivers: ResourceOption[];
  buses: ResourceOption[];
  lines: LineOption[];
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
}

export function CalendarGrid({ days, bookings, lineRuns, today, drivers, buses, lines }: CalendarGridProps) {
  const [dialogState, setDialogState] = useState<{ open: boolean; date: Date | null }>({
    open: false,
    date: null,
  });

  return (
    <div className="grid grid-cols-7 gap-px overflow-hidden rounded-md border bg-border text-sm">
      {WEEKDAY_NAMES_PL.map((label) => (
        <div key={label} className="bg-muted px-2 py-1 text-center text-xs font-medium text-muted-foreground">
          {label}
        </div>
      ))}
      {days.map((day) => {
        const dayBookings = bookings.filter((b) => bookingCoversDay(b.startAt, b.endAt, day.date));
        const dayLineRuns = lineRuns.filter((run) => lineRunIsOnDay(run.date, day.date));
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
              <button
                type="button"
                aria-label={`Nowe zlecenie na ${formatDateParam(day.date)}`}
                className="flex size-4 shrink-0 items-center justify-center rounded text-muted-foreground/50 transition-colors hover:bg-muted hover:text-primary"
                onClick={() => setDialogState({ open: true, date: day.date })}
              >
                <Plus className="size-3" />
              </button>
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
              {dayLineRuns.map((run) => (
                <div
                  key={`${run.scheduleId}-${run.date.toISOString()}`}
                  className="flex flex-col gap-0.5 rounded border border-dashed px-1.5 py-1 text-xs text-muted-foreground"
                >
                  <span className="truncate">{run.lineName}</span>
                  <span className="truncate">
                    {formatTime(run.departureAt)}–{formatTime(run.arrivalAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <CreateBookingDialog
        open={dialogState.open}
        date={dialogState.date}
        onOpenChange={(open) => setDialogState((s) => ({ ...s, open }))}
        drivers={drivers}
        buses={buses}
        lines={lines}
      />
    </div>
  );
}
