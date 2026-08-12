import { DayScheduleView } from "@/components/admin/calendar/DayScheduleView";
import { bookingCoversDay } from "@/lib/calendar-grid";
import type { ScheduleBookingEntry } from "@/lib/schedule-view";

const WEEKDAY_FULL_PL = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];

export function WeekScheduleView({ days, bookings }: { days: Date[]; bookings: ScheduleBookingEntry[] }) {
  return (
    <div className="flex flex-col gap-6">
      {days.map((day, index) => {
        const dayBookings = bookings.filter((b) => bookingCoversDay(b.startAt, b.endAt, day));
        return (
          <div key={day.toISOString()}>
            <h3 className="mb-2 text-sm font-semibold">
              {WEEKDAY_FULL_PL[index]}, {day.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" })}
            </h3>
            <DayScheduleView bookings={dayBookings} />
          </div>
        );
      })}
    </div>
  );
}
