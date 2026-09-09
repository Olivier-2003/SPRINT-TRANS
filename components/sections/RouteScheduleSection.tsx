"use client";

import { useState } from "react";
import { ArrowLeftRight, MoveHorizontal, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { CountUp } from "@/components/animations/CountUp";
import { SectionWaveDivider } from "@/components/animations/SectionWaveDivider";
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
    <section className="relative overflow-visible bg-brand-navy py-20 text-white md:py-28">
      <SectionWaveDivider position="top" fill="var(--color-brand-navy)" />
      <SectionWaveDivider position="bottom" fill="var(--color-brand-navy)" />
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-0 size-80 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute right-0 bottom-1/4 size-72 translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
      />
      <div className="relative mx-auto max-w-[1600px] px-6 lg:px-8">
        <ScrollReveal className="mb-16 flex flex-col items-center gap-7 text-center">
          <span className="text-base font-semibold tracking-[0.2em] text-brand-navy-muted uppercase">
            Trasa przejazdu
          </span>
          <h2 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">
            Linia łącząca Barcin z Inowrocławiem
          </h2>
          <p className="max-w-3xl text-xl leading-relaxed text-brand-navy-muted">
            Nasza regularna linia pokonuje trasę między Barcinem a Inowrocławiem, zatrzymując się po drodze na wielu
            przystankach.
          </p>
          <div className="flex items-center gap-5 rounded-2xl bg-white/5 px-8 py-5 ring-1 ring-white/10">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Route className="size-7" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-4xl font-extrabold tracking-tight text-white">
                <CountUp target={STOPS.length} />
              </span>
              <span className="text-base font-medium text-brand-navy-muted">przystanków na trasie</span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal className="mb-10 flex justify-center">
          <Button
            type="button"
            onClick={() => setReversed((v) => !v)}
            variant="outline"
            size="lg"
            className="h-12 w-fit gap-1.5 rounded-full border-white/20 bg-transparent px-7 text-base text-white hover:bg-white/10 hover:text-white"
          >
            <ArrowLeftRight className="size-4" />
            Odwróć kolejność
          </Button>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={150} className="relative">
        <div className="relative -mx-6 px-6 sm:px-10 md:px-16 lg:mx-0 lg:px-20 xl:px-28">
          <div className="snap-x snap-mandatory overflow-x-auto pb-4 lg:snap-none lg:overflow-visible lg:pb-0">
            <ol className="relative flex min-w-max items-start justify-between gap-5 lg:min-w-0 lg:gap-0">
              <div
                aria-hidden="true"
                className="absolute top-10 right-10 left-10 h-px bg-white/15"
              />
              {/* Kropka sugerująca kurs autobusu wzdłuż trasy — czysto dekoracyjna. */}
              <div
                aria-hidden="true"
                className="route-travel-dot pointer-events-none absolute top-10 z-10 size-3.5 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_14px_3px_var(--color-primary)]"
              />
              {stops.map((stop, i) => {
                const endpoint = i === 0 || i === stops.length - 1;
                return (
                  <li
                    key={stop}
                    className="relative flex w-32 shrink-0 snap-start flex-col items-center gap-4 text-center lg:w-auto lg:flex-1 lg:shrink"
                  >
                    <span
                      className={cn(
                        "relative z-10 flex size-20 shrink-0 items-center justify-center rounded-full text-xl font-bold ring-4 ring-brand-navy",
                        endpoint ? "bg-primary text-primary-foreground" : "bg-white/10 text-white"
                      )}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={cn(
                        "text-lg leading-snug",
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
        <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-brand-navy-muted lg:hidden">
          <MoveHorizontal className="size-4 shrink-0" />
          Przesuń palcem, aby zobaczyć całą trasę
        </p>
      </ScrollReveal>
    </section>
  );
}
