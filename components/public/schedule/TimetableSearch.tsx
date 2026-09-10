"use client";

import { useMemo, useState } from "react";
import { Search, Clock, ExternalLink } from "lucide-react";
import { ALL_STOP_NAMES, getStopSchedules, splitTimeCode, SCHEDULE_LEGEND } from "@/lib/schedule-data";
import { cn } from "@/lib/utils";

/**
 * Wyszukiwarka połączeń — dane wpisane na sztywno w `lib/schedule-data.ts`
 * (przepisane z oficjalnych PDF-ów obu kierunków). Wybór przystanku pokazuje
 * godziny odjazdu z tego miejsca, we wszystkich kierunkach, w których dany
 * przystanek występuje.
 */
export function TimetableSearch() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const suggestions = useMemo(() => {
    if (!query || selected === query) return [];
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ALL_STOP_NAMES.filter((name) => name.toLowerCase().includes(q)).slice(0, 8);
  }, [query, selected]);

  const results = useMemo(() => (selected ? getStopSchedules(selected) : []), [selected]);

  const usedCodes = useMemo(() => {
    const codes = new Set<string>();
    for (const { stop } of results) {
      for (const entry of [...stop.weekday, ...stop.saturday]) {
        const { code } = splitTimeCode(entry);
        if (code) codes.add(code);
      }
    }
    return [...codes].filter((c) => c in SCHEDULE_LEGEND);
  }, [results]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(null);
          }}
          placeholder="Wpisz nazwę przystanku, np. Piechcin"
          className="h-14 w-full rounded-2xl border border-border bg-card pr-4 pl-12 text-base shadow-sm outline-none focus:border-primary focus:ring-3 focus:ring-primary/20"
        />
        {suggestions.length > 0 && (
          <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            {suggestions.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  setSelected(name);
                  setQuery(name);
                }}
                className="block w-full border-b border-border/60 px-5 py-3 text-left text-base last:border-0 hover:bg-muted"
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && results.length === 0 && (
        <p className="text-center text-base text-muted-foreground">
          Nie znaleziono przystanku o tej nazwie. Sprawdź pisownię lub przejrzyj pełny rozkład PDF poniżej.
        </p>
      )}

      {results.map(({ direction, stop }) => (
        <div key={direction.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-xl font-semibold tracking-tight">{direction.label}</h3>
            <a
              href={direction.pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Pełny rozkład PDF
              <ExternalLink className="size-3.5" />
            </a>
          </div>
          <TimeGroup label="Poniedziałek – piątek" times={stop.weekday} />
          <TimeGroup label="Sobota" times={stop.saturday} className="mt-5" />
        </div>
      ))}

      {results.length > 0 && (
        <div className="rounded-2xl bg-muted/50 p-5 text-sm text-muted-foreground">
          <p className="mb-2 font-medium text-foreground">Brak kursów w niedziele i święta.</p>
          {usedCodes.length > 0 && (
            <ul className="flex flex-col gap-1">
              {usedCodes.map((code) => (
                <li key={code}>
                  <span className="font-semibold text-foreground">{code}</span> — {SCHEDULE_LEGEND[code]}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function TimeGroup({ label, times, className }: { label: string; times: string[]; className?: string }) {
  return (
    <div className={className}>
      <div className="mb-2.5 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        <Clock className="size-4" />
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {times.map((entry, i) => {
          const { time, code } = splitTimeCode(entry);
          return (
            <span
              key={i}
              className={cn(
                "inline-flex items-center gap-0.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-foreground",
                code && "pr-2"
              )}
            >
              {time}
              {code && <sup className="ml-0.5 text-[0.7em] font-bold text-primary">{code}</sup>}
            </span>
          );
        })}
      </div>
    </div>
  );
}
