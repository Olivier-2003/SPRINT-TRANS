import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PrintButton } from "@/components/forms/PrintButton";
import { getDriverMonthlySummaries } from "@/lib/driver-timesheet";
import { addMonths, MONTH_NAMES_PL } from "@/lib/calendar-grid";
import { DRIVER_AVAILABILITY_TYPE_LABELS } from "@/lib/driver-availability-labels";

export const dynamic = "force-dynamic";

function parseParam(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : fallback;
}

function formatAbsences(counts: Partial<Record<string, number>>): string {
  const entries = Object.entries(counts).filter(([, count]) => (count ?? 0) > 0);
  if (entries.length === 0) return "—";
  return entries
    .map(([type, count]) => `${DRIVER_AVAILABILITY_TYPE_LABELS[type as keyof typeof DRIVER_AVAILABILITY_TYPE_LABELS]}: ${count}`)
    .join(", ");
}

export default async function DriverTimesheetPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const params = await searchParams;
  const today = new Date();
  const year = parseParam(params.year, today.getFullYear());
  const month = parseParam(params.month, today.getMonth() + 1);

  const summaries = await getDriverMonthlySummaries(year, month);
  const prev = addMonths(year, month, -1);
  const next = addMonths(year, month, 1);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Czas pracy kierowców</h1>
          <p className="text-sm text-muted-foreground">
            Ewidencja wyliczana automatycznie z przypisań do zleceń i zarejestrowanej niedostępności —
            nie jest to jeszcze pełny system płacowy.
          </p>
        </div>
        <PrintButton />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <Button
            render={<Link href={`/admin/kierowcy/rozliczenie?year=${prev.year}&month=${prev.month}`} />}
            nativeButton={false}
            variant="outline"
            size="sm"
          >
            ← Poprzedni
          </Button>
          <Button
            render={
              <Link
                href={`/admin/kierowcy/rozliczenie?year=${today.getFullYear()}&month=${today.getMonth() + 1}`}
              />
            }
            nativeButton={false}
            variant="outline"
            size="sm"
          >
            Bieżący miesiąc
          </Button>
          <Button
            render={<Link href={`/admin/kierowcy/rozliczenie?year=${next.year}&month=${next.month}`} />}
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

      {summaries.length === 0 ? (
        <p className="text-sm text-muted-foreground">Brak kierowców.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kierowca</TableHead>
              <TableHead>Godziny pracy</TableHead>
              <TableHead>Dni pracy</TableHead>
              <TableHead>Zlecenia</TableHead>
              <TableHead>Godziny nocne</TableHead>
              <TableHead>Wymiar</TableHead>
              <TableHead>Bilans</TableHead>
              <TableHead>Nadgodziny</TableHead>
              <TableHead>Nieobecności</TableHead>
              <TableHead className="text-right print:hidden">Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summaries.map((summary) => (
              <TableRow key={summary.driverId}>
                <TableCell className="font-medium">{summary.driverName}</TableCell>
                <TableCell>{summary.totalWorkHours.toFixed(1)} h</TableCell>
                <TableCell>{summary.workDaysCount}</TableCell>
                <TableCell>
                  {summary.totalBookings} ({summary.completedBookings} zakończ.)
                </TableCell>
                <TableCell>{summary.nightHours.toFixed(1)} h</TableCell>
                <TableCell>{summary.monthlyNorm != null ? `${summary.monthlyNorm.toFixed(1)} h` : "—"}</TableCell>
                <TableCell
                  className={
                    summary.balanceHours != null && summary.balanceHours > 0
                      ? "text-destructive"
                      : undefined
                  }
                >
                  {summary.balanceHours != null
                    ? `${summary.balanceHours > 0 ? "+" : ""}${summary.balanceHours.toFixed(1)} h`
                    : "—"}
                </TableCell>
                <TableCell>{summary.overtimeHours != null ? `${summary.overtimeHours.toFixed(1)} h` : "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatAbsences(summary.absenceDayCounts)}
                </TableCell>
                <TableCell className="text-right print:hidden">
                  <Button
                    render={
                      <Link href={`/admin/kierowcy/rozliczenie/${summary.driverId}?year=${year}&month=${month}`} />
                    }
                    nativeButton={false}
                    variant="ghost"
                    size="sm"
                  >
                    Szczegóły
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
