import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarGrid } from "@/components/admin/calendar/CalendarGrid";
import { getBookingsOverlapping } from "@/lib/data/calendar";
import { buildMonthGrid, addMonths, MONTH_NAMES_PL } from "@/lib/calendar-grid";

export const dynamic = "force-dynamic";

function parseParam(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : fallback;
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const params = await searchParams;
  const today = new Date();
  const year = parseParam(params.year, today.getFullYear());
  const month = parseParam(params.month, today.getMonth() + 1);

  const days = buildMonthGrid(year, month);
  const rangeStart = days[0].date;
  const rangeEnd = new Date(days[41].date.getTime() + 24 * 60 * 60 * 1000);

  const bookings = await getBookingsOverlapping(rangeStart, rangeEnd);

  const prev = addMonths(year, month, -1);
  const next = addMonths(year, month, 1);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Kalendarz</h1>
        <p className="text-sm text-muted-foreground">
          Zlecenia w wybranym miesiącu wraz z przypisanymi autobusami i kierowcami.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            render={<Link href={`/admin/kalendarz?year=${prev.year}&month=${prev.month}`} />}
            nativeButton={false}
            variant="outline"
            size="sm"
          >
            ← Poprzedni
          </Button>
          <Button
            render={<Link href={`/admin/kalendarz?year=${today.getFullYear()}&month=${today.getMonth() + 1}`} />}
            nativeButton={false}
            variant="outline"
            size="sm"
          >
            Dziś
          </Button>
          <Button
            render={<Link href={`/admin/kalendarz?year=${next.year}&month=${next.month}`} />}
            nativeButton={false}
            variant="outline"
            size="sm"
          >
            Następny →
          </Button>
        </div>
        <span className="text-lg font-medium">
          {MONTH_NAMES_PL[month - 1]} {year}
        </span>
      </div>

      <CalendarGrid days={days} bookings={bookings} today={today} />
    </div>
  );
}
