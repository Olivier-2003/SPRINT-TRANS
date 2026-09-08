"use client";

import { useState } from "react";
import { ArrowLeftRight, MoveHorizontal, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { CountUp } from "@/components/animations/CountUp";
import { cn } from "@/lib/utils";

// Prawdziwe przystanki linii SPRINT-TRANS Barcin — Inowrocław, w kolejności trasy.
const STOPS = [
  "Barcin",
  "Krotoszyn",
  "Wapienno",
  "Sadłogoszcz",
  "Zalesie Barcińskie",
  "Piechcin",
  "Pakość",
  "Wielowieś",
  "Rycerzewo",
  "Kościelec",
  "Cieślin",
  "Kruśliwiec",
  "Inowrocław",
];

export function RouteScheduleSection() {
  const [reversed, setReversed] = useState(false);
  const stops = reversed ? [...STOPS].reverse() : STOPS;

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(to_bottom,var(--background)_0%,var(--color-brand-navy)_10%,var(--color-brand-navy)_90%,var(--background)_100%)] py-20 text-white md:py-28">
      <div className="relative mx-auto max-w-[1600px] px-6 lg:px-8">
        <ScrollReveal className="mb-14 flex flex-wrap items-end justify-between gap-8">
          <div>
            <span className="text-sm font-semibold tracking-[0.2em] text-brand-navy-muted uppercase">
              Trasa przejazdu
            </span>
            <h2 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
              Linia łącząca Barcin z Inowrocławiem
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-brand-navy-muted">
              Nasza regularna linia pokonuje trasę między Barcinem a Inowrocławiem, zatrzymując się po drodze na
              wielu przystankach.
            </p>
          </div>
          <div className="flex items-center gap-4 rounded-2xl bg-white/5 px-6 py-4 ring-1 ring-white/10">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Route className="size-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-extrabold tracking-tight text-white">
                <CountUp target={STOPS.length} />
              </span>
              <span className="text-sm font-medium text-brand-navy-muted">przystanków na trasie</span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal className="mb-8 flex justify-end">
          <Button
            type="button"
            onClick={() => setReversed((v) => !v)}
            variant="outline"
            size="lg"
            className="h-11 w-fit gap-1.5 rounded-full border-white/20 bg-transparent px-6 text-base text-white hover:bg-white/10 hover:text-white"
          >
            <ArrowLeftRight className="size-4" />
            Odwróć kolejność
          </Button>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <div className="relative -mx-6 px-6 lg:mx-0 lg:px-0">
            <div className="snap-x snap-mandatory overflow-x-auto pb-4 lg:snap-none lg:overflow-visible lg:pb-0">
              <ol className="relative flex min-w-max items-start justify-between gap-2 lg:min-w-0 lg:gap-0">
                <div
                  aria-hidden="true"
                  className="absolute top-6 right-6 left-6 h-px bg-white/15"
                />
                {/* Kropka sugerująca kurs autobusu wzdłuż trasy — czysto dekoracyjna. */}
                <div
                  aria-hidden="true"
                  className="route-travel-dot pointer-events-none absolute top-6 z-10 size-2.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_2px_var(--color-primary)]"
                />
                {stops.map((stop, i) => {
                  const endpoint = i === 0 || i === stops.length - 1;
                  return (
                    <li
                      key={stop}
                      className="relative flex w-24 shrink-0 snap-start flex-col items-center gap-3 text-center lg:w-auto lg:flex-1 lg:shrink"
                    >
                      <span
                        className={cn(
                          "relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-bold ring-4 ring-brand-navy",
                          endpoint ? "bg-primary text-primary-foreground" : "bg-white/10 text-white"
                        )}
                      >
                        {i + 1}
                      </span>
                      <span
                        className={cn(
                          "text-sm leading-snug",
                          endpoint ? "font-semibold text-white" : "font-medium text-brand-navy-muted"
                        )}
                      >
                        {stop}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/70 via-black/25 to-transparent lg:hidden"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/70 via-black/25 to-transparent lg:hidden"
            />
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-sm text-brand-navy-muted lg:hidden">
            <MoveHorizontal className="size-4 shrink-0" />
            Przesuń palcem, aby zobaczyć całą trasę
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
