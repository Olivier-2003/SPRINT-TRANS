"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
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
    <div className="relative z-10 mx-auto -mt-28 max-w-7xl px-6 sm:-mt-32 lg:px-8">
      <ScrollReveal>
        <form
          onSubmit={onSubmit}
          className="grid gap-5 rounded-3xl bg-card p-7 text-card-foreground shadow-[0_30px_60px_-20px_rgba(8,15,35,0.35)] ring-1 ring-foreground/10 sm:p-8 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end lg:gap-5"
        >
          <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase lg:col-span-5">
            Kalkulator przejazdu
          </p>
          <div className="flex flex-col gap-2">
            <Label htmlFor="teaser-origin" className="text-sm">
              Skąd?
            </Label>
            <Input
              id="teaser-origin"
              placeholder="Miejscowość wyjazdu"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="h-12 text-base"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="teaser-destination" className="text-sm">
              Dokąd?
            </Label>
            <Input
              id="teaser-destination"
              placeholder="Miejscowość docelowa"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="h-12 text-base"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="teaser-date" className="text-sm">
              Data wyjazdu
            </Label>
            <Input
              id="teaser-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 text-base"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="teaser-passengers" className="text-sm">
              Liczba osób
            </Label>
            <Input
              id="teaser-passengers"
              type="number"
              min={1}
              placeholder="np. 40"
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              className="h-12 text-base"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 gap-1.5 rounded-full px-7 text-base lg:w-fit">
            Oblicz cenę
            <ArrowRight />
          </Button>
        </form>
      </ScrollReveal>
    </div>
  );
}
