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

/** Kolejne dni danego miesiąca (bez dopełnienia do pełnych tygodni) — do widoków tabelarycznych. */
export function getDaysInMonth(year: number, month: number): Date[] {
  const daysCount = new Date(year, month, 0).getDate();
  return Array.from({ length: daysCount }, (_, i) => new Date(year, month - 1, i + 1));
}

export function addMonths(year: number, month: number, delta: number): { year: number; month: number } {
  const total = (month - 1) + delta;
  const newYear = year + Math.floor(total / 12);
  const newMonth = ((total % 12) + 12) % 12;
  return { year: newYear, month: newMonth + 1 };
}

/** Parsuje "YYYY-MM-DD" na lokalną datę (północ). Zwraca dziś, jeśli wartość nieprawidłowa. */
export function parseDateParam(value: string | undefined): Date {
  if (value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (match) {
      const [, y, m, d] = match;
      return new Date(Number(y), Number(m) - 1, Number(d));
    }
  }
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

export function formatDateParam(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function addDays(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + delta);
}

/** Poniedziałek tygodnia zawierającego podaną datę. */
export function startOfWeek(date: Date): Date {
  const weekday = (date.getDay() + 6) % 7; // 0 = poniedziałek
  return addDays(date, -weekday);
}

/** Kolejne 7 dni tygodnia (poniedziałek–niedziela) zawierającego podaną datę. */
export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}
