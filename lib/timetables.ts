export interface TimetableEntry {
  id: string;
  name: string;
  description: string;
  pdfPath: string;
}

/**
 * Statyczna konfiguracja rozkładów jazdy (NIE dane z bazy) — dokładnie 2 pozycje,
 * zgodnie z ustaleniem, że publiczna strona pokazuje tylko realne, gotowe rozkłady.
 * Aktualizacja rozkładu to wyłącznie podmiana pliku PDF pod wskazaną ścieżką w
 * `public/timetables/`, bez zmian w kodzie strony. Nazwy/opisy poniżej są jawnymi
 * placeholderami do uzupełnienia przez SPRINT-TRANS — nie zawierają wymyślonych
 * godzin ani tras.
 */
export const TIMETABLES: TimetableEntry[] = [
  {
    id: "linia-1",
    name: "Rozkład jazdy — Linia 1 (nazwa do uzupełnienia)",
    description: "Kierunek i opis trasy zostaną uzupełnione przez SPRINT-TRANS.",
    pdfPath: "/timetables/linia-1.pdf",
  },
  {
    id: "linia-2",
    name: "Rozkład jazdy — Linia 2 (nazwa do uzupełnienia)",
    description: "Kierunek i opis trasy zostaną uzupełnione przez SPRINT-TRANS.",
    pdfPath: "/timetables/linia-2.pdf",
  },
];

export function getTimetable(id: string): TimetableEntry | undefined {
  return TIMETABLES.find((timetable) => timetable.id === id);
}
