export interface CalendarGridDay {
  date: Date;
  inCurrentMonth: boolean;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const MONTH_NAMES_PL = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
];

export const WEEKDAY_NAMES_PL = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"];

/** Siatka pełnych tygodni (poniedziałek–niedziela) obejmująca dany miesiąc. month: 1-12. */
export function buildMonthGrid(year: number, month: number): CalendarGridDay[] {
  const firstOfMonth = new Date(year, month - 1, 1);
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7; // 0 = poniedziałek
  const gridStart = new Date(year, month - 1, 1 - firstWeekday);

  const days: CalendarGridDay[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
    days.push({ date, inCurrentMonth: date.getMonth() === month - 1 });
  }
  return days;
}

/** Czy przedział [start, end) zlecenia obejmuje dany dzień kalendarzowy. */
export function bookingCoversDay(start: Date, end: Date, day: Date): boolean {
  const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
  const dayEnd = new Date(dayStart.getTime() + MS_PER_DAY);
  return start.getTime() < dayEnd.getTime() && end.getTime() > dayStart.getTime();
}

export function addMonths(year: number, month: number, delta: number): { year: number; month: number } {
  const total = (month - 1) + delta;
  const newYear = year + Math.floor(total / 12);
  const newMonth = ((total % 12) + 12) % 12;
  return { year: newYear, month: newMonth + 1 };
}
