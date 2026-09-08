import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarGrid } from "@/components/admin/calendar/CalendarGrid";
import { ResourceAvailabilityGrid } from "@/components/admin/calendar/ResourceAvailabilityGrid";
import { DayScheduleView } from "@/components/admin/calendar/DayScheduleView";
import { WeekScheduleView } from "@/components/admin/calendar/WeekScheduleView";
import { getCalendarEntriesOverlapping } from "@/lib/data/calendar";
import { db } from "@/lib/db";
import { getDriverResourceGrid, getBusResourceGrid } from "@/lib/resource-calendar";
import { getScheduleEntries } from "@/lib/schedule-view";
import {
  buildMonthGrid,
  getDaysInMonth,
  addMonths,
  MONTH_NAMES_PL,
  parseDateParam,
  formatDateParam,
  addDays,
  getWeekDays,
} from "@/lib/calendar-grid";

export const dynamic = "force-dynamic";

function parseParam(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : fallback;
}

const VIEWS = [
  { value: "dzien", label: "Dzień" },
  { value: "tydzien", label: "Tydzień" },
  { value: "miesiac", label: "Miesiąc" },
  { value: "kierowcy", label: "Kierowcy" },
  { value: "autobusy", label: "Autobusy" },
] as const;
type ViewValue = (typeof VIEWS)[number]["value"];

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string; date?: string; view?: string }>;
}) {
  const params = await searchParams;
  const today = new Date();
  const year = parseParam(params.year, today.getFullYear());
  const month = parseParam(params.month, today.getMonth() + 1);
  const date = parseDateParam(params.date);
  const view: ViewValue = VIEWS.some((v) => v.value === params.view) ? (params.view as ViewValue) : "dzien";

  const isDateView = view === "dzien" || view === "tydzien";

  const monthPrev = addMonths(year, month, -1);
  const monthNext = addMonths(year, month, 1);
  const dateStep = view === "tydzien" ? 7 : 1;
  const datePrev = addDays(date, -dateStep);
  const dateNext = addDays(date, dateStep);

  const linkFor = (overrides: { year?: number; month?: number; date?: string; view?: ViewValue }) => {
    const v = overrides.view ?? view;
    const params = new URLSearchParams();
    params.set("view", v);
    if (v === "dzien" || v === "tydzien") {
      params.set("date", overrides.date ?? formatDateParam(date));
    } else {
      params.set("year", String(overrides.year ?? year));
      params.set("month", String(overrides.month ?? month));
    }
    return `/admin/kalendarz?${params.toString()}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Kalendarz</h1>
          <p className="text-sm text-muted-foreground">
            Zlecenia, przypisani kierowcy i autobusy, godziny oraz konflikty i ostrzeżenia.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button render={<Link href="/admin/kalendarz/generator" />} nativeButton={false} variant="outline" size="sm">
            Generator propozycji grafiku
          </Button>
          <Button render={<Link href="/admin/zlecenia/nowy" />} nativeButton={false} size="sm">
            Nowe zlecenie
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {VIEWS.map((v) => (
          <Button
            key={v.value}
            render={<Link href={linkFor({ view: v.value })} />}
            nativeButton={false}
            variant={view === v.value ? "default" : "outline"}
            size="sm"
          >
            {v.label}
          </Button>
        ))}
      </div>

      {isDateView ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              render={<Link href={linkFor({ date: formatDateParam(datePrev) })} />}
              nativeButton={false}
              variant="outline"
              size="sm"
            >
              ← Poprzedni
            </Button>
            <Button
              render={<Link href={linkFor({ date: formatDateParam(today) })} />}
              nativeButton={false}
              variant="outline"
              size="sm"
            >
              Dziś
            </Button>
            <Button
              render={<Link href={linkFor({ date: formatDateParam(dateNext) })} />}
              nativeButton={false}
              variant="outline"
              size="sm"
            >
              Następny →
            </Button>
          </div>
          <span className="text-lg font-medium">
            {view === "tydzien"
              ? `Tydzień od ${getWeekDays(date)[0].toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" })}`
              : date.toLocaleDateString("pl-PL", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              render={<Link href={linkFor({ year: monthPrev.year, month: monthPrev.month })} />}
              nativeButton={false}
              variant="outline"
              size="sm"
            >
              ← Poprzedni
            </Button>
            <Button
              render={<Link href={linkFor({ year: today.getFullYear(), month: today.getMonth() + 1 })} />}
              nativeButton={false}
              variant="outline"
              size="sm"
            >
              Dziś
            </Button>
            <Button
              render={<Link href={linkFor({ year: monthNext.year, month: monthNext.month })} />}
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
      )}

      {view === "dzien" && <DayView date={date} />}
      {view === "tydzien" && <WeekView date={date} />}
      {view === "miesiac" && <BookingsView year={year} month={month} today={today} />}
      {view === "kierowcy" && <DriversView year={year} month={month} />}
      {view === "autobusy" && <BusesView year={year} month={month} />}
    </div>
  );
}

async function DayView({ date }: { date: Date }) {
  const rangeStart = date;
  const rangeEnd = addDays(date, 1);
  const entries = await getScheduleEntries(rangeStart, rangeEnd);
  return <DayScheduleView date={date} bookings={entries} />;
}

async function WeekView({ date }: { date: Date }) {
  const days = getWeekDays(date);
  const rangeStart = days[0];
  const rangeEnd = addDays(days[6], 1);
  const entries = await getScheduleEntries(rangeStart, rangeEnd);
  return <WeekScheduleView days={days} bookings={entries} />;
}

async function BookingsView({ year, month, today }: { year: number; month: number; today: Date }) {
  const days = buildMonthGrid(year, month);
  const rangeStart = days[0].date;
  const rangeEnd = new Date(days[41].date.getTime() + 24 * 60 * 60 * 1000);
  const [{ bookings, lineRuns }, drivers, buses, lines] = await Promise.all([
    getCalendarEntriesOverlapping(rangeStart, rangeEnd),
    db.driver.findMany({
      where: { employmentStatus: "ACTIVE" },
      select: { id: true, firstName: true, lastName: true },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    }),
    db.bus.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, registrationNumber: true, brandModel: true },
      orderBy: { registrationNumber: "asc" },
    }),
    db.regularLine.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        originLabel: true,
        destinationLabel: true,
        schedules: {
          select: { daysOfWeek: true, departureTime: true, arrivalTime: true, price: true },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  // Decimal (LineSchedule.price) nie może przekroczyć granicy server/client.
  const serializableLines = lines.map((line) => ({
    ...line,
    schedules: line.schedules.map((s) => ({ ...s, price: Number(s.price) })),
  }));

  // CalendarGrid jest komponentem klienckim — Prisma Decimal (finalPrice, plannedHours)
  // nie może przekroczyć granicy server/client, więc mapujemy do zwykłych obiektów.
  const serializableBookings = bookings.map((booking) => ({
    id: booking.id,
    startAt: booking.startAt,
    endAt: booking.endAt,
    customerName: booking.customerName,
    status: booking.status,
    drivers: booking.drivers.map((d) => ({ driverId: d.driverId, driver: d.driver })),
    buses: booking.buses.map((b) => ({ busId: b.busId, bus: b.bus })),
  }));

  return (
    <CalendarGrid
      days={days}
      bookings={serializableBookings}
      lineRuns={lineRuns}
      today={today}
      drivers={drivers.map((d) => ({ id: d.id, label: `${d.firstName} ${d.lastName}` }))}
      buses={buses.map((b) => ({ id: b.id, label: `${b.registrationNumber} — ${b.brandModel}` }))}
      lines={serializableLines}
    />
  );
}

async function DriversView({ year, month }: { year: number; month: number }) {
  const resources = await getDriverResourceGrid(year, month);
  return <ResourceAvailabilityGrid days={getDaysInMonth(year, month)} resources={resources} />;
}

async function BusesView({ year, month }: { year: number; month: number }) {
  const resources = await getBusResourceGrid(year, month);
  return <ResourceAvailabilityGrid days={getDaysInMonth(year, month)} resources={resources} />;
}
