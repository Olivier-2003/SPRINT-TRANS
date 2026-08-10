"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RegularLine } from "@/lib/generated/prisma/client";

type LineWithScheduleCount = RegularLine & { _count: { schedules: number } };

export function LineSearchList({ lines }: { lines: LineWithScheduleCount[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return lines;
    return lines.filter((line) =>
      [line.name, line.originLabel, line.destinationLabel]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [lines, query]);

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Szukaj po nazwie lub trasie (np. „Miasto A”)"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="max-w-sm"
      />

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Brak linii spełniających kryteria wyszukiwania.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((line) => (
            <Link key={line.id} href={`/rozklad-jazdy/${line.id}`} className="block">
              <Card className="h-full transition-colors hover:border-primary">
                <CardHeader>
                  <CardTitle className="text-base">{line.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <span>
                    {line.originLabel} → {line.destinationLabel}
                  </span>
                  <span>
                    {line._count.schedules} {line._count.schedules === 1 ? "kurs" : "kursy/ów"} w
                    rozkładzie
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
