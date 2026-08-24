"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Calculator, MapPin, Navigation, CalendarDays, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

/**
 * Skrócony formularz na stronie głównej — nie liczy ceny samodzielnie, tylko
 * przekazuje wpisane dane (przez query params) do prawdziwego kalkulatora
 * (/kalkulator), gdzie InquiryForm wypełnia nimi swoje pola startowe. Cała
 * logika wyceny pozostaje w jednym miejscu — lib/pricing.ts.
 */
export function CalculatorTeaser() {
  const router = useRouter();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (origin) params.set("origin", origin);
    if (destination) params.set("destination", destination);
    if (date) params.set("departureAt", `${date}T09:00`);
    if (passengers) params.set("passengers", passengers);
    router.push(`/kalkulator${params.size > 0 ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="relative z-10 mx-auto -mt-28 max-w-[1600px] px-6 sm:-mt-32 lg:px-8">
      <ScrollReveal>
        <form
          onSubmit={onSubmit}
          className="relative grid gap-6 overflow-hidden rounded-[28px] bg-card p-8 text-card-foreground shadow-[0_50px_100px_-28px_rgba(8,15,35,0.55)] ring-1 ring-foreground/10 sm:p-10 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end lg:gap-5"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-primary/70 to-primary/30"
          />
          <div className="flex items-center gap-4 lg:col-span-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Calculator className="size-6" />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Kalkulator przejazdu</p>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Sprawdź orientacyjną cenę w 30 sekund</h2>
            </div>
          </div>
          <div className="h-px bg-border lg:col-span-5" />
          <div className="flex flex-col gap-2">
            <Label htmlFor="teaser-origin" className="text-sm">
              Skąd?
            </Label>
            <div className="relative">
              <Navigation className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="teaser-origin"
                placeholder="Miejscowość wyjazdu"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="h-12 pl-10 text-base"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="teaser-destination" className="text-sm">
              Dokąd?
            </Label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="teaser-destination"
                placeholder="Miejscowość docelowa"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="h-12 pl-10 text-base"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="teaser-date" className="text-sm">
              Data wyjazdu
            </Label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="teaser-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-12 pl-10 text-base"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="teaser-passengers" className="text-sm">
              Liczba osób
            </Label>
            <div className="relative">
              <Users className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="teaser-passengers"
                type="number"
                min={1}
                placeholder="np. 40"
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className="h-12 pl-10 text-base"
              />
            </div>
          </div>
          <Button
            type="submit"
            size="lg"
            className="h-12 gap-1.5 rounded-full px-8 text-base shadow-[0_18px_35px_-12px_rgba(37,99,235,0.55)] lg:w-fit"
          >
            Oblicz cenę
            <ArrowRight />
          </Button>
        </form>
      </ScrollReveal>
    </div>
  );
}
