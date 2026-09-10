import Link from "next/link";
import { ArrowRight, Bus, MapPinned, Route, CalendarClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ServiceOfferGrid } from "@/components/sections/ServiceOfferGrid";
import { ContactCta } from "@/components/sections/ContactCta";
import { SectionWaveDivider } from "@/components/animations/SectionWaveDivider";
import { CountUp } from "@/components/animations/CountUp";
import { getPublicLines } from "@/lib/data/lines";
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
  const [lines, buses] = await Promise.all([getPublicLines(), getPublicBuses()]);

  return (
    <div className="flex-1">
      <section className="relative overflow-visible bg-brand-navy py-8 text-white md:py-12">
        <SectionWaveDivider position="bottom" fill="var(--color-brand-navy)" />
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/5 size-72 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute right-1/4 bottom-0 size-56 translate-y-1/3 rounded-full bg-primary/15 blur-3xl"
        />
        <div className="relative mx-auto flex max-w-[1600px] flex-col items-center gap-4 px-6 text-center lg:px-8">
          <h1 className="max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
            Oferta przewozów SPRINT-TRANS
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-brand-navy-muted">
            Linie regularne, wynajem autobusów oraz zorganizowane wycieczki — wszystko w jednym
            miejscu.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 transition-colors duration-300 hover:bg-white/10">
              <div className="text-xl font-bold">
                <CountUp target={buses.length} />
              </div>
              <div className="text-xs text-brand-navy-muted">autobusów we flocie</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 transition-colors duration-300 hover:bg-white/10">
              <div className="text-xl font-bold">
                <CountUp target={lines.length} />
              </div>
              <div className="text-xs text-brand-navy-muted">
                {lines.length === 1 ? "linia regularna" : "linii regularnych"}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1600px] px-6 pt-14 pb-4 md:pt-20 lg:px-8">
        <ScrollReveal className="relative mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-3xl shadow-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/oferta/oferta-hero-bus.png"
            alt="Autobus SPRINT-TRANS w trasie"
            className="h-full w-full object-cover"
          />
        </ScrollReveal>
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
