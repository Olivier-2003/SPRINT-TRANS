import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DAY_OPTIONS } from "@/lib/validation/line";
import type { RegularLine, LineStop, LineSchedule } from "@/lib/generated/prisma/client";

type LineWithDetails = RegularLine & { stops: LineStop[]; schedules: LineSchedule[] };

function formatDays(days: number[]): string {
  return DAY_OPTIONS.filter((day) => days.includes(day.value))
    .map((day) => day.label)
    .join(", ");
}

function formatDate(date: Date | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("pl-PL");
}

export function LineTimetable({ line }: { line: LineWithDetails }) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{line.name}</h1>
        <p className="text-muted-foreground">
          {line.originLabel} → {line.destinationLabel}
        </p>
        {line.description && <p className="mt-2 text-muted-foreground">{line.description}</p>}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Przystanki</h2>
        {line.stops.length === 0 ? (
          <p className="text-sm text-muted-foreground">Trasa zostanie uzupełniona wkrótce.</p>
        ) : (
          <ol className="flex flex-col gap-1">
            {line.stops.map((stop, index) => (
              <li key={stop.id} className="flex items-center gap-3 text-sm">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs">
                  {index + 1}
                </span>
                <span>{stop.stopName}</span>
                <span className="text-muted-foreground">
                  ({stop.arrivalOffsetMinutes} min od wyjazdu)
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Harmonogram kursów</h2>
        {line.schedules.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Rozkład godzin zostanie uzupełniony wkrótce.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dni kursowania</TableHead>
                <TableHead>Wyjazd</TableHead>
                <TableHead>Przyjazd</TableHead>
                <TableHead>Cena</TableHead>
                <TableHead>Obowiązuje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {line.schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>{formatDays(schedule.daysOfWeek)}</TableCell>
                  <TableCell>{schedule.departureTime}</TableCell>
                  <TableCell>{schedule.arrivalTime}</TableCell>
                  <TableCell>{Number(schedule.price).toFixed(2)} zł</TableCell>
                  <TableCell>
                    {formatDate(schedule.validFrom)}
                    {schedule.validTo ? ` – ${formatDate(schedule.validTo)}` : ""}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
