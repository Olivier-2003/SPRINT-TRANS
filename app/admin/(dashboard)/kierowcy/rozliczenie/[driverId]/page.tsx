import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PrintButton } from "@/components/forms/PrintButton";
import { getDriverMonthlySummary } from "@/lib/driver-timesheet";
import { addMonths, MONTH_NAMES_PL } from "@/lib/calendar-grid";
import { DRIVER_AVAILABILITY_TYPE_LABELS } from "@/lib/driver-availability-labels";

export const dynamic = "force-dynamic";

function parseParam(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : fallback;
}

export default async function DriverTimesheetDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ driverId: string }>;
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const { driverId } = await params;
  const query = await searchParams;
  const today = new Date();
  const year = parseParam(query.year, today.getFullYear());
  const month = parseParam(query.month, today.getMonth() + 1);

  const summary = await getDriverMonthlySummary(driverId, year, month);
  if (!summary) notFound();

  const prev = addMonths(year, month, -1);
  const next = addMonths(year, month, 1);
  const linkFor = (y: number, m: number) => `/admin/kierowcy/rozliczenie/${driverId}?year=${y}&month=${m}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Czas pracy: {summary.driverName}</h1>
          <p className="text-sm text-muted-foreground">
            Rozpiska dzień po dniu na podstawie przypisanych zleceń i zarejestrowanej niedostępności.
          </p>
        </div>
        <PrintButton />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <Button render={<Link href={linkFor(prev.year, prev.month)} />} nativeButton={false} variant="outline" size="sm">
            ← Poprzedni
          </Button>
          <Button
            render={<Link href={linkFor(today.getFullYear(), today.getMonth() + 1)} />}
            nativeButton={false}
            variant="outline"
            size="sm"
          >
            Bieżący miesiąc
          </Button>
          <Button render={<Link href={linkFor(next.year, next.month)} />} nativeButton={false} variant="outline" size="sm">
            Następny →
          </Button>
        </div>
        <span className="text-lg font-medium">
          {MONTH_NAMES_PL[month - 1]} {year}
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Podsumowanie miesiąca</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-3 md:grid-cols-4">
          <div>
            <div className="text-muted-foreground">Godziny pracy</div>
            <div className="font-medium">{summary.totalWorkHours.toFixed(1)} h</div>
          </div>
          <div>
            <div className="text-muted-foreground">Dni pracy</div>
            <div className="font-medium">{summary.workDaysCount}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Zlecenia</div>
            <div className="font-medium">
              {summary.totalBookings} ({summary.completedBookings} zakończ.)
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Godziny nocne</div>
            <div className="font-medium">{summary.nightHours.toFixed(1)} h</div>
          </div>
          <div>
            <div className="text-muted-foreground">Wymiar miesięczny</div>
            <div className="font-medium">{summary.monthlyNorm != null ? `${summary.monthlyNorm.toFixed(1)} h` : "brak"}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Bilans</div>
            <div className={`font-medium ${summary.balanceHours != null && summary.balanceHours > 0 ? "text-destructive" : ""}`}>
              {summary.balanceHours != null
                ? `${summary.balanceHours > 0 ? "+" : ""}${summary.balanceHours.toFixed(1)} h`
                : "—"}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Nadgodziny</div>
            <div className="font-medium">{summary.overtimeHours != null ? `${summary.overtimeHours.toFixed(1)} h` : "—"}</div>
          </div>
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Godziny pracy</TableHead>
            <TableHead>Godziny nocne</TableHead>
            <TableHead>Zlecenia</TableHead>
            <TableHead>Nieobecność</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {summary.days.map((day) => (
            <TableRow key={day.date.toISOString()}>
              <TableCell className="whitespace-nowrap">
                {day.date.toLocaleDateString("pl-PL", { weekday: "short", day: "2-digit", month: "2-digit" })}
              </TableCell>
              <TableCell>{day.workHours > 0 ? `${day.workHours.toFixed(1)} h` : "—"}</TableCell>
              <TableCell>{day.nightHours > 0 ? `${day.nightHours.toFixed(1)} h` : "—"}</TableCell>
              <TableCell className="text-sm">
                {day.bookings.length === 0
                  ? "—"
                  : day.bookings
                      .map(
                        (b) =>
                          `${b.customerName} (${b.startAt.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}–${b.endAt.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })})`
                      )
                      .join(", ")}
              </TableCell>
              <TableCell className="text-sm">
                {day.absences.length === 0
                  ? "—"
                  : day.absences.map((a) => DRIVER_AVAILABILITY_TYPE_LABELS[a.type]).join(", ")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
