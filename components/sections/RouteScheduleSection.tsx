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
    <section className="relative overflow-hidden border-t border-white/10 bg-brand-navy py-20 text-white md:py-28">
      <div className="relative mx-auto max-w-[1600px] px-6 lg:px-8">
        <ScrollReveal className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-sm font-semibold tracking-[0.2em] text-brand-navy-muted uppercase">
              Trasa przejazdu
            </span>
            <h2 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
              Linia łącząca Barcin z Inowrocławiem
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-brand-navy-muted">
              Nasza regularna linia pokonuje trasę między Barcinem a Inowrocławiem,
              zatrzymując się po drodze na 13 przystankach.
            </p>
          </div>
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
          {/* Mobile/tablet (< lg): pionowy stepper — bez przewijania w bok, więc
              nic nigdy nie jest "ucięte" krawędzią ekranu. Poziomy układ na całą
              szerokość zostaje zarezerwowany dla lg: i większych ekranów, gdzie
              1600px kontenera mieści wszystkie 13 przystanków bez scrolla. */}
          <ol className="relative flex flex-col lg:hidden">
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

          <ol className="relative hidden items-start justify-between gap-2 lg:flex">
            <div aria-hidden="true" className="absolute top-6 right-6 left-6 h-px bg-white/15" />
            {stops.map((stop, i) => {
              const endpoint = i === 0 || i === stops.length - 1;
              return (
                <li key={stop} className="relative flex flex-1 flex-col items-center gap-3 text-center">
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
        </ScrollReveal>
      </div>
    </section>
  );
}
