import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateParam } from "@/lib/calendar-grid";
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_BADGE_VARIANT } from "@/lib/booking-status";
import type { ScheduleBookingEntry } from "@/lib/schedule-view";

const DRIVER_ROLE_LABELS: Record<string, string> = {
  GLOWNY: "główny",
  POMOCNICZY: "pomocniczy",
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
}

interface DayScheduleViewProps {
  date: Date;
  bookings: ScheduleBookingEntry[];
}

export function DayScheduleView({ date, bookings }: DayScheduleViewProps) {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-dashed p-3 text-sm text-muted-foreground">
        <span>Brak zleceń w tym dniu.</span>
        <Button
          render={<Link href={`/admin/zlecenia/nowy?date=${formatDateParam(date)}`} />}
          nativeButton={false}
          variant="outline"
          size="sm"
          className="gap-1.5"
        >
          <Plus className="size-3.5" />
          Nowe zlecenie
        </Button>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {bookings.map((booking) => (
        <li key={booking.id} className={`rounded-md border p-3 text-sm ${booking.hasWarning ? "border-destructive/40" : ""}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">
                {formatTime(booking.startAt)}–{formatTime(booking.endAt)}
              </span>
              <Link href={`/admin/zlecenia/${booking.id}`} className="underline underline-offset-2">
                {booking.customerName}
              </Link>
              <Badge variant={BOOKING_STATUS_BADGE_VARIANT[booking.status]}>
                {BOOKING_STATUS_LABELS[booking.status]}
              </Badge>
              {booking.hasWarning && <Badge variant="destructive">Wymaga uwagi</Badge>}
            </div>
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div>
              <div className="text-xs text-muted-foreground">Kierowcy</div>
              {booking.missingDriver ? (
                <div className="text-xs text-destructive">Brak przypisanego kierowcy</div>
              ) : (
                <ul className="flex flex-col gap-1">
                  {booking.drivers.map((driver) => (
                    <li key={driver.id} className="text-xs">
                      {driver.name}
                      {driver.roleOnTrip ? ` (${DRIVER_ROLE_LABELS[driver.roleOnTrip]})` : ""}
                      {driver.issues.length > 0 && (
                        <span className="text-destructive"> — {driver.issues[0].message}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Autobusy</div>
              {booking.missingBus ? (
                <div className="text-xs text-destructive">Brak przypisanego autobusu</div>
              ) : (
                <ul className="flex flex-col gap-1">
                  {booking.buses.map((bus) => (
                    <li key={bus.id} className="text-xs">
                      {bus.label}
                      {bus.issues.length > 0 && <span className="text-destructive"> — {bus.issues[0].message}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
