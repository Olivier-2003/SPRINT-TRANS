"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
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
    <section className="relative overflow-hidden bg-brand-navy py-16 text-white md:py-24">
      <div className="relative mx-auto grid max-w-[1600px] gap-12 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16 lg:px-8">
        <ScrollReveal className="flex flex-col gap-6">
          <span className="text-sm font-semibold tracking-[0.2em] text-brand-navy-muted uppercase">
            Trasa przejazdu
          </span>
          <h2 className="max-w-lg text-4xl font-bold tracking-tight sm:text-5xl">
            Linia łącząca Barcin z Inowrocławiem
          </h2>
          <p className="max-w-lg text-lg leading-relaxed text-brand-navy-muted">
            Nasza regularna linia pokonuje trasę między Barcinem a Inowrocławiem,
            zatrzymując się po drodze na 13 przystankach. Poniżej pełny przebieg
            trasy — sprawdź kolejność przystanków w obu kierunkach.
          </p>
          <Button
            type="button"
            onClick={() => setReversed((v) => !v)}
            variant="outline"
            size="lg"
            className="w-fit gap-1.5 rounded-full border-white/20 bg-transparent px-6 text-base text-white hover:bg-white/10 hover:text-white"
          >
            <ArrowLeftRight className="size-4" />
            Odwróć kolejność
          </Button>
        </ScrollReveal>

        <ScrollReveal delay={150} className="relative">
          <ol className="relative flex flex-col">
            <div aria-hidden="true" className="absolute top-5 bottom-5 left-5 w-px bg-white/15" />
            {stops.map((stop, i) => {
              const endpoint = i === 0 || i === stops.length - 1;
              return (
                <li key={stop} className="relative flex items-center gap-4 py-2.5">
                  <span
                    className={cn(
                      "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                      endpoint ? "bg-primary text-primary-foreground" : "bg-white/10 text-white"
                    )}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-4 py-2 text-sm",
                      endpoint ? "bg-primary font-semibold text-primary-foreground" : "bg-white/8 font-medium text-brand-navy-muted"
                    )}
                  >
                    {stop}
                  </span>
                </li>
              );
            })}
          </ol>
        </ScrollReveal>
      </div>
    </section>
  );
}
