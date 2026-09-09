import Link from "next/link";
import { ArrowRight, Bus, MapPinned, Route, CalendarClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ServiceOfferGrid } from "@/components/sections/ServiceOfferGrid";
import { ContactCta } from "@/components/sections/ContactCta";
import { SectionWaveDivider } from "@/components/animations/SectionWaveDivider";
import { CountUp } from "@/components/animations/CountUp";
import { getPublicLines } from "@/lib/data/lines";
import { getPublicTrips } from "@/lib/data/trips";
import { getPublicBuses } from "@/lib/data/buses";

export const dynamic = "force-dynamic";

const STEPS = [
  {
    icon: MapPinned,
    title: "Zapytanie",
    description: "Wysyłasz zapytanie przez formularz lub kalkulator — podajesz trasę, termin i liczbę pasażerów.",
  },
  {
    icon: CalendarClock,
    title: "Wycena",
    description: "Przygotowujemy indywidualną wycenę i kontaktujemy się, aby ustalić szczegóły przejazdu.",
  },
  {
    icon: Route,
    title: "Potwierdzenie",
    description: "Po akceptacji wyceny rezerwujemy termin i przydzielamy autobus oraz kierowcę.",
  },
  {
    icon: Bus,
    title: "Realizacja",
    description: "W ustalonym dniu odbieramy grupę i realizujemy przejazd zgodnie z trasą.",
  },
];

export default async function OfferPage() {
  const [lines, trips, buses] = await Promise.all([
    getPublicLines(),
    getPublicTrips(),
    getPublicBuses(),
  ]);

  return (
    <div className="flex-1">
      <section className="relative overflow-visible bg-brand-navy py-16 text-white md:py-24">
        <SectionWaveDivider position="bottom" fill="var(--color-brand-navy)" />
        <div className="relative mx-auto grid max-w-[1600px] items-center gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8">
          <div>
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
              Oferta przewozów SPRINT-TRANS
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-brand-navy-muted">
              Linie regularne, wynajem autobusów oraz zorganizowane wycieczki —
              wszystko w jednym miejscu.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 transition-colors duration-300 hover:bg-white/10">
                <div className="text-3xl font-bold">
                  <CountUp target={buses.length} />
                </div>
                <div className="text-sm text-brand-navy-muted">autobusów we flocie</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 transition-colors duration-300 hover:bg-white/10">
                <div className="text-3xl font-bold">
                  <CountUp target={lines.length} />
                </div>
                <div className="text-sm text-brand-navy-muted">
                  {lines.length === 1 ? "linia regularna" : "linii regularnych"}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 transition-colors duration-300 hover:bg-white/10">
                <div className="text-3xl font-bold">
                  <CountUp target={trips.length} />
                </div>
                <div className="text-sm text-brand-navy-muted">
                  {trips.length === 1 ? "aktywna wycieczka" : "aktywnych wycieczek"}
                </div>
              </div>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm lg:mx-0 lg:ml-auto lg:max-w-md">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-[linear-gradient(135deg,color-mix(in_oklch,var(--color-primary),white_18%),var(--color-primary))] opacity-20 blur-2xl" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/oferta/oferta-hero-bus.png"
              alt="Autobus SPRINT-TRANS w trasie"
              className="aspect-4/3 w-full rounded-2xl object-cover shadow-2xl ring-1 ring-white/15"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-14 md:py-20 lg:px-8">
        <ScrollReveal className="mb-10 flex flex-col items-center gap-3 text-center">
          <span className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Co robimy</span>
          <h2 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">Nasze usługi</h2>
        </ScrollReveal>
        <ServiceOfferGrid />
      </section>

      <section className="mx-auto max-w-[1600px] px-6 pb-14 md:pb-20 lg:px-8">
        <ScrollReveal className="mb-10 flex flex-col items-center gap-3 text-center">
          <span className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Jak to działa</span>
          <h2 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">Cztery proste kroki</h2>
        </ScrollReveal>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <ScrollReveal key={step.title} delay={i * 90} className="flex flex-col gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <step.icon className="size-7" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight">
                {i + 1}. {step.title}
              </h3>
              <p className="text-base leading-relaxed text-muted-foreground">{step.description}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 pb-14 md:pb-20 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/rozklad-jazdy">
            <Card className="h-full transition-colors hover:border-primary">
              <CardHeader>
                <CardTitle className="text-base">Linie regularne</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                Sprawdź rozkład jazdy
                <ArrowRight className="size-4" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/kalkulator">
            <Card className="h-full transition-colors hover:border-primary">
              <CardHeader>
                <CardTitle className="text-base">Wynajem autobusów</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                Oblicz orientacyjną cenę
                <ArrowRight className="size-4" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/wycieczki">
            <Card className="h-full transition-colors hover:border-primary">
              <CardHeader>
                <CardTitle className="text-base">Wycieczki</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                Zobacz aktualną ofertę
                <ArrowRight className="size-4" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      <ContactCta />
    </div>
  );
}
