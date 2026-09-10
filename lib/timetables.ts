export interface TimetableEntry {
  id: string;
  name: string;
  description: string;
  pdfPath: string;
}

/**
 * Statyczna konfiguracja rozkładów jazdy (NIE dane z bazy) — dokładnie 2 pozycje,
 * zgodnie z ustaleniem, że publiczna strona pokazuje tylko realne, gotowe rozkłady.
 * `pdfPath` wskazuje na realne pliki PDF hostowane na sprinttrans.pl.
 */
export const TIMETABLES: TimetableEntry[] = [
  {
    id: "kierunek-inowroclaw",
    name: "Rozkład jazdy — Kierunek Inowrocław",
    description: "Aktualny rozkład jazdy linii regularnej w kierunku Inowrocławia.",
    pdfPath: "https://sprinttrans.pl/wp-content/uploads/2026/03/kierunek-inowroclaw.pdf",
  },
  {
    id: "kierunek-barcin",
    name: "Rozkład jazdy — Kierunek Barcin",
    description: "Aktualny rozkład jazdy linii regularnej w kierunku Barcina.",
    pdfPath: "https://sprinttrans.pl/wp-content/uploads/2026/03/kierunek-barcin.pdf",
  },
];

export function getTimetable(id: string): TimetableEntry | undefined {
  return TIMETABLES.find((timetable) => timetable.id === id);
}
