import { db } from "@/lib/db";
import { isoWeekday } from "@/lib/calendar-grid";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface LineRunOccurrence {
  lineId: string;
  lineName: string;
  originLabel: string;
  destinationLabel: string;
  scheduleId: string;
  date: Date;
  departureAt: Date;
  arrivalAt: Date;
  price: number;
}

function parseTimeOnDate(day: Date, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hours || 0, minutes || 0);
}

/**
 * Rzutuje tygodniowe rozkłady linii regularnych (LineSchedule) na konkretne wystąpienia
 * (data + godzina) w podanym zakresie dat. To wyłącznie informacyjne "kursy" — nie są
 * powiązane z żadnym Booking, dopóki administrator nie utworzy dla nich realnego zlecenia.
 */
export async function getLineRunsOverlapping(rangeStart: Date, rangeEnd: Date): Promise<LineRunOccurrence[]> {
  const lines = await db.regularLine.findMany({
    where: { active: true, schedules: { some: {} } },
    include: { schedules: true },
  });

  const occurrences: LineRunOccurrence[] = [];
  const dayCount = Math.ceil((rangeEnd.getTime() - rangeStart.getTime()) / MS_PER_DAY);

  for (const line of lines) {
    for (const schedule of line.schedules) {
      for (let i = 0; i < dayCount; i++) {
        const day = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate() + i);

        if (day.getTime() < schedule.validFrom.getTime()) continue;
        if (schedule.validTo && day.getTime() > schedule.validTo.getTime()) continue;
        if (!schedule.daysOfWeek.includes(isoWeekday(day))) continue;

        const departureAt = parseTimeOnDate(day, schedule.departureTime);
        let arrivalAt = parseTimeOnDate(day, schedule.arrivalTime);
        if (arrivalAt.getTime() <= departureAt.getTime()) {
          // Przejazd przez północ — założenie, bo LineSchedule nie ma osobnej daty przyjazdu.
          arrivalAt = new Date(arrivalAt.getTime() + MS_PER_DAY);
        }

        occurrences.push({
          lineId: line.id,
          lineName: line.name,
          originLabel: line.originLabel,
          destinationLabel: line.destinationLabel,
          scheduleId: schedule.id,
          date: day,
          departureAt,
          arrivalAt,
          price: Number(schedule.price),
        });
      }
    }
  }

  return occurrences.sort((a, b) => a.departureAt.getTime() - b.departureAt.getTime());
}
