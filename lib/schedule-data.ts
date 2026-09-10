/**
 * Rozkłady jazdy linii regularnej Barcin — Inowrocław, w obie strony.
 * Dane przepisane z oficjalnych plików PDF SPRINT-TRANS (ważne od 01.01.2026):
 *   - Kierunek Inowrocław: https://sprinttrans.pl/wp-content/uploads/2026/03/kierunek-inowroclaw.pdf
 *   - Kierunek Barcin:     https://sprinttrans.pl/wp-content/uploads/2026/03/kierunek-barcin.pdf
 *
 * Każdy przystanek to fizycznie osobne miejsce (numeracja I/II/III/IV oznacza
 * stronę drogi/kierunek) — tylko 4 przystanki występują pod tą samą nazwą w
 * obu kierunkach (bo to te same słupki obsługujące ruch w obie strony).
 *
 * Aktualizacja rozkładu = podmiana danych poniżej (i w razie potrzeby PDF-ów
 * pod adresami w `lib/timetables.ts`) — bez zmian w reszcie kodu.
 */

export interface StopSchedule {
  /** Nazwa przystanku dokładnie jak w oficjalnym rozkładzie PDF. */
  name: string;
  /** Godziny odjazdu w dni robocze (poniedziałek–piątek), z ewent. kodem z legendy. */
  weekday: string[];
  /** Godziny odjazdu w sobotę. Brak kursów w niedziele i święta. */
  saturday: string[];
}

export interface DirectionSchedule {
  id: "inowroclaw" | "barcin";
  /** Etykieta do wyświetlenia, np. "Kierunek Inowrocław". */
  label: string;
  /** Link do oficjalnego PDF z tym rozkładem. */
  pdfPath: string;
  stops: StopSchedule[];
}

export const SCHEDULE_LEGEND: Record<string, string> = {
  A: "kursuje tylko do Pakości",
  B: "nie wjeżdża na ulicę Jankowską w Pakości",
  C: "kursuje tylko w dni nauki szkolnej",
  S: "kursuje tylko w dni nauki szkolnej",
  G: "kursuje w dni nauki szkolnej od 01.09 do 30.04",
  J: "wjeżdża na ulicę Jankowską w Pakości tylko w dni wolne od nauki szkolnej",
  W: "kursuje tylko w dni wolne od nauki szkolnej",
  P: "kursuje tylko do Piechcina",
  F: "kursuje w dni nauki szkolnej od 01.09 do 30.04 tylko do Pakości",
  KC: "kursuje w dni nauki szkolnej przez Kościelec",
  MC: "kursuje w dni nauki szkolnej do Mątew przez ulice: Staszica, Poznańska/Szpital, Mątwy",
  AC: "kursuje w dni nauki szkolnej tylko do Pakości",
};

/** Rozbija np. "07:09MC" na czas "07:09" i kod "MC" (jeśli występuje). */
export function splitTimeCode(entry: string): { time: string; code: string | null } {
  const match = entry.match(/^(\d{1,2}:\d{2})([A-Z]*)$/);
  if (!match) return { time: entry, code: null };
  return { time: match[1], code: match[2] || null };
}

const INOWROCLAW_STOPS: StopSchedule[] = [
  { name: "Barcin ulica Pakoska", weekday: ["05:11", "05:45", "06:48MC", "06:55KC", "07:00J", "07:45J", "08:50", "09:45", "10:40B", "12:10", "13:55B", "14:35", "15:10B", "15:50", "16:15P", "16:37P", "17:30", "18:25P", "19:15", "21:15P"], saturday: ["05:45", "07:45", "10:40", "12:30", "14:15", "16:15P"] },
  { name: "Barcin ulica Dworcowa", weekday: ["05:10", "05:46", "06:45MC", "06:56KC", "07:01J", "07:47J", "08:52", "09:47", "10:42B", "12:12", "13:57B", "14:37", "15:08B", "15:52", "17:32", "19:17"], saturday: ["05:46", "07:47", "10:42", "12:28", "14:10", "14:17", "16:10P"] },
  { name: "Krotoszyn I", weekday: ["05:14", "05:48", "06:51MC", "06:58KC", "07:03J", "07:49J", "08:54", "09:49", "10:44B", "12:14", "13:59B", "14:39", "15:14B", "15:54", "16:17P", "16:39P", "17:34", "18:27P", "19:19", "21:17P"], saturday: ["05:48", "07:49", "10:44", "12:34", "14:19", "16:17P"] },
  { name: "Wapienno I", weekday: ["05:17", "05:51", "06:54MC", "07:01KC", "07:05J", "07:52J", "08:57", "09:52", "10:47B", "12:17", "14:02B", "14:42", "15:17B", "15:57", "16:19P", "16:41P", "17:37", "18:29P", "19:22", "21:19P"], saturday: ["05:51", "07:52", "10:47", "12:37", "14:22", "16:19P"] },
  { name: "Wapienno III Bielawy", weekday: ["05:19", "05:53", "06:56MC", "07:03KC", "07:06J", "07:54J", "08:59", "09:54", "10:49B", "12:19", "14:04B", "14:44", "15:19B", "15:59", "16:20P", "16:42P", "17:39", "18:30P", "19:24", "21:21P"], saturday: ["05:53", "07:54", "10:49", "12:39", "14:24", "16:20P"] },
  { name: "Sadłogoszcz I", weekday: ["05:20", "05:55", "06:57MC", "07:04KC", "07:07J", "07:56J", "09:01", "09:56", "10:51B", "12:21", "14:06B", "14:46", "15:21B", "16:01", "16:21P", "16:43P", "17:41", "18:31P", "19:26", "21:23P"], saturday: ["05:55", "07:56", "10:51", "12:41", "14:26", "16:21P"] },
  { name: "Zalesie Barcińskie II", weekday: ["05:22", "05:57", "06:59MC", "07:06KC", "07:09J", "07:58J", "09:03", "09:58", "10:53B", "12:23", "14:08B", "14:48", "15:23B", "16:03", "16:23P", "16:45P", "17:43", "18:33P", "19:28", "21:25P"], saturday: ["05:57", "07:58", "10:53", "12:43", "14:28", "16:23P"] },
  { name: "Piechcin ulica 11 Listopada", weekday: ["05:24", "05:59", "07:01MC", "07:07KC", "07:11J", "08:00J", "09:05", "10:00", "10:55B", "12:25", "14:10B", "14:50", "15:25B", "16:05", "16:25P", "16:47P", "17:45", "18:35P", "19:30", "21:27P"], saturday: ["05:59", "08:00", "10:55", "12:45", "14:30", "16:25P"] },
  { name: "Piechcin ulica Dworcowa", weekday: ["05:26", "06:01", "07:03MC", "07:07G", "07:09KC", "07:12J", "08:02J", "09:07", "10:02", "10:57B", "12:27", "14:12B", "14:52", "15:27B", "16:07", "17:47", "19:32"], saturday: ["06:01", "08:02", "10:57", "12:47", "14:32"] },
  { name: "Piechcin I", weekday: ["05:28", "06:03", "07:05MC", "07:09G", "07:11KC", "07:14J", "08:04J", "09:09", "10:04", "10:59B", "12:29", "14:14B", "14:54", "15:29B", "16:09", "17:49", "19:34"], saturday: ["06:03", "08:04", "10:59", "12:49", "14:34"] },
  { name: "Pakość I ulica Barcińska", weekday: ["05:30", "06:05", "07:07MC", "07:11G", "07:13KC", "07:16J", "08:06J", "09:11", "10:06", "11:01B", "12:31", "14:16B", "14:56", "15:31B", "16:11", "17:51", "19:36"], saturday: ["06:05", "08:06", "11:01", "12:51", "14:36"] },
  { name: "Pakość Przystanek Główny - ulica Barcińska", weekday: ["05:32", "06:07", "07:04", "07:09MC", "07:13G", "07:15KC", "07:18J", "08:04C", "08:08J", "09:04C", "09:13", "10:08", "11:03B", "11:19", "12:32", "13:39C", "14:18B", "14:44", "14:58", "15:33B", "16:13", "17:53", "19:38"], saturday: ["06:07", "08:08", "11:03", "12:53", "14:38"] },
  { name: "Pakość ulica Jankowska", weekday: ["05:34", "06:09", "07:00", "07:11MC", "07:15G", "07:17KC", "07:20J", "08:00C", "08:10J", "09:00C", "09:15", "10:10", "11:15", "12:34", "13:35C", "14:40", "15:00", "16:15", "17:55", "19:40"], saturday: ["06:09", "08:10", "11:05", "12:55", "14:40"] },
  { name: "Pakość III ulica Inowrocławska", weekday: ["05:36", "06:11", "07:07", "07:13MC", "07:18G", "07:19KC", "07:22", "08:07C", "08:12", "09:07C", "09:18", "10:13", "11:08", "11:22", "12:37", "13:42C", "14:23", "14:47", "15:03", "15:38", "16:18", "17:58", "19:43"], saturday: ["06:11", "08:12", "11:08", "12:58", "14:43"] },
  { name: "Wielowieś I", weekday: ["05:38", "06:13", "07:09", "07:15MC", "07:20G", "07:21KC", "07:25", "08:09C", "08:15", "09:09C", "09:20", "10:15", "11:10", "11:24", "12:39", "13:44C", "14:25", "14:49", "15:05", "15:40", "16:20", "18:00", "19:45"], saturday: ["06:13", "08:15", "11:10", "13:00", "14:45"] },
  { name: "Rycerzewo I", weekday: ["05:40", "06:15", "07:12", "07:17MC", "07:22G", "07:23KC", "07:27", "08:12C", "08:17", "09:12C", "09:22", "10:17", "11:12", "11:27", "12:41", "13:47C", "14:27", "14:52", "15:07", "15:42", "16:22", "18:02", "19:47"], saturday: ["06:15", "08:17", "11:12", "13:02", "14:47"] },
  { name: "Kościelec I / Skrzyżowanie", weekday: ["05:42", "06:17", "07:14", "07:19MC", "07:24G", "07:27KC", "07:29", "08:14C", "08:18", "09:14C", "09:23", "10:18", "11:13", "11:29", "12:42", "13:49C", "14:28", "14:54", "15:08", "15:43", "16:23", "18:03", "19:48"], saturday: ["06:17", "08:18", "11:13", "13:03", "14:48"] },
  { name: "Cieślin I", weekday: ["05:44", "06:19", "07:16", "07:21MC", "07:26G", "07:29", "07:31", "08:16C", "08:20", "09:16C", "09:25", "10:20", "11:15", "11:31", "12:44", "13:51C", "14:30", "14:56", "15:10", "15:45", "16:25", "18:05", "19:50"], saturday: ["06:19", "08:20", "11:15", "13:05", "14:50"] },
  { name: "Cieślin III", weekday: ["05:46", "06:21", "07:18", "07:23MC", "07:28G", "07:31", "07:33", "08:18C", "08:22", "09:18C", "09:27", "10:22", "11:17", "11:33", "12:46", "13:53C", "14:32", "14:58", "15:12", "15:47", "16:27", "18:07", "19:52"], saturday: ["06:21", "08:22", "11:17", "13:07", "14:52"] },
  { name: "Inowrocław II ulica Kruśliwiecka", weekday: ["05:48", "06:23", "07:20", "07:25MC", "07:30G", "07:33", "07:35", "08:20C", "08:24", "09:20C", "09:29", "10:24", "11:19", "11:35", "12:48", "13:55C", "14:34", "15:00", "15:14", "15:49", "16:29", "18:09", "19:54"], saturday: ["06:23", "08:24", "11:19", "13:09", "14:54"] },
];

const BARCIN_STOPS: StopSchedule[] = [
  { name: "INOWROCŁAW aleja Niepodległości / Miechowicka", weekday: ["06:05", "06:50", "07:30A", "07:50B", "08:30AC", "08:55", "09:45", "10:45AC", "11:15", "11:50A", "12:45", "13:20", "14:10AC", "14:20B", "14:50", "15:15F", "15:20", "15:45", "16:30", "17:30", "18:20", "20:15"], saturday: ["06:50", "08:55", "11:40", "13:20", "15:20"] },
  { name: "INOWROCŁAW aleja Niepodległości / Krzymińskiego", weekday: ["06:07", "06:53", "07:32A", "07:52B", "08:32AC", "08:57", "09:47", "10:47AC", "11:17", "11:52A", "12:47", "13:22", "14:12AC", "14:22B", "14:52", "15:17F", "15:22", "15:47", "16:32", "17:32", "18:22", "20:17"], saturday: ["06:53", "08:57", "11:42", "13:22", "15:22"] },
  { name: "INOWROCŁAW aleja Ratuszowa / ulica Solankowa", weekday: ["06:10", "06:56", "07:35A", "07:55B", "08:35AC", "09:00", "09:50", "10:50AC", "11:20", "11:55A", "12:50", "13:25", "14:15AC", "14:25B", "14:54", "15:20F", "15:25", "15:50", "16:35", "17:35", "18:25", "20:20"], saturday: ["06:56", "09:00", "11:45", "13:25", "15:25"] },
  { name: "INOWROCŁAW aleja Kopernika / ulica Dworcowa", weekday: ["06:13", "07:00", "07:38A", "07:58B", "08:38AC", "09:03", "09:53", "10:53AC", "11:23", "11:58A", "12:53", "13:28", "14:18AC", "14:28B", "14:59", "15:23F", "15:28", "15:53", "16:38", "17:38", "18:28", "20:23"], saturday: ["07:00", "09:03", "11:48", "13:28", "15:28"] },
  { name: "INOWROCŁAW ulica Kruśliwiecka", weekday: ["06:16", "07:03", "07:41A", "08:01B", "08:41AC", "09:06", "09:56", "10:56AC", "11:26", "12:01A", "12:56", "13:31", "14:21AC", "14:31B", "15:01", "15:26F", "15:31", "15:56", "16:41", "17:41", "18:31", "20:26"], saturday: ["07:03", "09:06", "11:51", "13:31", "15:31"] },
  { name: "Cieślin IV", weekday: ["06:18", "07:04", "07:43A", "08:03B", "08:43AC", "09:08", "09:58", "10:58AC", "11:28", "12:03A", "12:58", "13:33", "14:23AC", "14:33B", "15:03", "15:28F", "15:33", "15:58", "16:43", "17:43", "18:33", "20:28"], saturday: ["07:04", "09:08", "11:53", "13:33", "15:33"] },
  { name: "Cieślin II", weekday: ["06:20", "07:06", "07:45A", "08:05B", "08:45AC", "09:10", "10:00", "11:00AC", "11:30", "12:05A", "13:00", "13:35", "14:25AC", "14:35B", "15:05", "15:30F", "15:35", "16:00", "16:45", "17:45", "18:35", "20:30"], saturday: ["07:06", "09:10", "11:55", "13:35", "15:35"] },
  { name: "Kościelec II / Skrzyżowanie", weekday: ["06:22", "07:09", "07:47A", "08:07B", "08:47AC", "09:12", "10:02", "11:02AC", "11:32", "12:07A", "13:02", "13:37", "14:27AC", "14:37B", "15:07", "15:32F", "15:37", "16:02", "16:47", "17:47", "18:37", "20:32"], saturday: ["07:09", "09:12", "11:57", "13:37", "15:37"] },
  { name: "Rycerzewo II", weekday: ["06:23", "07:10", "07:49A", "08:08B", "08:49AC", "09:13", "10:03", "11:04AC", "11:33", "12:09A", "13:03", "13:38", "14:29AC", "14:38B", "15:08", "15:34F", "15:38", "16:03", "16:48", "17:48", "18:38", "20:33"], saturday: ["07:10", "09:13", "11:58", "13:38", "15:38"] },
  { name: "Wielowieś II", weekday: ["06:25", "07:12", "07:51A", "08:10B", "08:51AC", "09:15", "10:05", "11:06AC", "11:35", "12:11A", "13:05", "13:40", "14:31AC", "14:40B", "15:10", "15:36F", "15:40", "16:05", "16:50", "17:50", "18:40", "20:35"], saturday: ["07:12", "09:15", "12:00", "13:40", "15:40"] },
  { name: "Pakość IV / ulica Inowrocławska", weekday: ["06:27", "07:14", "07:53A", "08:12B", "08:53AC", "09:17", "10:07", "11:08AC", "11:37", "12:13A", "13:07", "13:42", "14:33AC", "14:42B", "15:12", "15:38F", "15:42", "16:07", "16:52", "17:52", "18:42", "20:37"], saturday: ["07:14", "09:17", "12:02", "13:42", "15:42"] },
  { name: "Pakość ulica Jankowska", weekday: ["06:30", "07:17", "09:20", "10:10", "11:40", "13:09", "13:45", "14:45W", "15:14", "15:45", "16:10", "16:55", "17:55", "18:45", "20:40"], saturday: ["07:17", "09:20", "12:05", "13:45", "15:45"] },
  { name: "Pakość Przystanek Główny - ulica Barcińska", weekday: ["06:32", "07:19", "07:55A", "08:17", "08:55AC", "09:22", "10:12", "11:10AC", "11:42", "12:15A", "13:11", "13:47", "14:35AC", "14:47", "15:16", "15:40F", "15:47", "16:12", "16:57", "17:57", "18:47", "20:42"], saturday: ["07:19", "09:22", "12:07", "13:47", "15:47"] },
  { name: "Pakość II - ulica Barcińska", weekday: ["06:34", "07:21", "08:19", "09:24", "10:14", "11:44", "13:13", "13:49", "14:49", "15:18", "15:49", "16:14", "16:59", "17:59", "18:49", "20:44"], saturday: ["07:21", "09:24", "12:09", "13:49", "15:49"] },
  { name: "Piechcin ulica 11 Listopada", weekday: ["06:36", "07:23", "08:21", "09:26", "10:16", "11:46", "13:15", "13:51", "14:51", "15:20", "15:51", "16:16", "17:01", "18:01", "18:51", "20:46"], saturday: ["07:23", "09:26", "12:11", "13:51", "15:51"] },
  { name: "Piechcin ulica Dworcowa", weekday: ["05:00", "05:25", "06:33S", "06:38", "07:25", "08:23", "09:28", "10:18", "11:48", "13:17", "13:53", "14:53", "15:22", "15:53", "16:18", "17:03", "18:03", "18:53", "20:48"], saturday: ["05:25", "07:25", "09:28", "12:13", "13:53", "15:53"] },
  { name: "Piechcin II", weekday: ["05:01", "05:26", "06:34S", "06:40", "07:27", "08:25", "09:30", "10:20", "11:50", "13:19", "13:55", "14:55", "15:25", "15:55", "16:20", "17:05", "18:05", "18:55", "20:50"], saturday: ["05:26", "07:27", "09:30", "12:15", "13:55", "15:55"] },
  { name: "Zalesie Barcińskie I", weekday: ["05:03", "05:28", "06:36S", "06:42", "07:29", "08:27", "09:32", "10:22", "11:52", "13:21", "13:57", "14:57", "15:27", "15:57", "16:22", "17:07", "18:07", "18:57", "20:52"], saturday: ["05:28", "07:29", "09:32", "12:17", "13:57", "15:57"] },
  { name: "Sadłogoszcz II", weekday: ["05:04", "05:29", "06:39S", "06:44", "07:31", "08:29", "09:34", "10:24", "11:54", "13:23", "13:59", "14:59", "15:29", "15:59", "16:24", "17:09", "18:09", "18:59", "20:54"], saturday: ["05:29", "07:31", "09:34", "12:19", "13:59", "15:59"] },
  { name: "Wapienno IV - Bielawy", weekday: ["05:05", "05:30", "06:40S", "06:46", "07:33", "08:31", "09:36", "10:26", "11:56", "13:25", "14:01", "15:01", "15:31", "16:01", "16:26", "17:11", "18:11", "19:01", "20:56"], saturday: ["05:30", "07:33", "09:36", "12:21", "14:01", "16:01"] },
  { name: "Wapienno II", weekday: ["05:06", "05:31", "06:41S", "06:48", "07:35", "08:33", "09:38", "10:28", "11:58", "13:27", "14:03", "15:03", "15:33", "16:03", "16:28", "17:13", "18:13", "19:03", "20:58"], saturday: ["05:31", "07:35", "09:38", "12:23", "14:03", "16:03"] },
  { name: "Krotoszyn II", weekday: ["05:08", "05:33", "06:43S", "06:51", "07:38", "08:36", "09:41", "10:31", "12:01", "13:30", "14:06", "15:06", "15:36", "16:06", "16:31", "17:16", "18:16", "19:06", "21:01"], saturday: ["05:33", "07:38", "09:41", "12:26", "14:06", "16:06"] },
];

export const DIRECTION_SCHEDULES: DirectionSchedule[] = [
  {
    id: "inowroclaw",
    label: "Kierunek Inowrocław",
    pdfPath: "https://sprinttrans.pl/wp-content/uploads/2026/03/kierunek-inowroclaw.pdf",
    stops: INOWROCLAW_STOPS,
  },
  {
    id: "barcin",
    label: "Kierunek Barcin",
    pdfPath: "https://sprinttrans.pl/wp-content/uploads/2026/03/kierunek-barcin.pdf",
    stops: BARCIN_STOPS,
  },
];

/** Lista wszystkich nazw przystanków (z obu kierunków, bez duplikatów), do podpowiedzi w wyszukiwarce. */
export const ALL_STOP_NAMES: string[] = Array.from(
  new Set(DIRECTION_SCHEDULES.flatMap((d) => d.stops.map((s) => s.name)))
).sort((a, b) => a.localeCompare(b, "pl"));

/** Zwraca rozkład (w każdym kierunku, w którym ten przystanek istnieje) dla podanej dokładnej nazwy. */
export function getStopSchedules(stopName: string): { direction: DirectionSchedule; stop: StopSchedule }[] {
  const results: { direction: DirectionSchedule; stop: StopSchedule }[] = [];
  for (const direction of DIRECTION_SCHEDULES) {
    const stop = direction.stops.find((s) => s.name === stopName);
    if (stop) results.push({ direction, stop });
  }
  return results;
}
