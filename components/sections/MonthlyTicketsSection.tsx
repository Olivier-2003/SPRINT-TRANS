import Link from "next/link";
import { Percent, Ticket, RefreshCw, Copy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const TICKET_ITEMS = [
  {
    icon: Percent,
    title: "Ulgi ustawowe",
    description: "Honorujemy odpowiednie ulgi ustawowe przysługujące pasażerom.",
  },
  {
    icon: Ticket,
    title: "Zakup biletu miesięcznego",
    description: "Możliwość zakupu biletu miesięcznego na regularne dojazdy.",
  },
  {
    icon: RefreshCw,
    title: "Przedłużenie / doładowanie",
    description: "Bilet miesięczny można przedłużyć na kolejny miesiąc.",
  },
  {
    icon: Copy,
    title: "Zgubiony bilet / duplikat",
    description: "W razie zgubienia biletu skontaktuj się w sprawie duplikatu.",
  },
];

/**
 * Pełna sekcja "Bilety miesięczne" — używana na stronie /rozklad-jazdy. Celowo
 * bez cen/regulaminu (dane nieuzupełnione przez SPRINT-TRANS); wyłącznie opis
 * dostępnych opcji + jedno jasne CTA do kontaktu.
 */
export function MonthlyTicketsSection() {
  return (
    <section id="bilety-miesieczne" className="relative bg-brand-navy py-16 text-white md:py-24">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-8">
        <ScrollReveal className="mb-12 flex flex-col gap-3">
          <span className="text-sm font-semibold tracking-[0.2em] text-brand-navy-muted uppercase">
            Dojazdy regularne
          </span>
          <h2 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">Bilety miesięczne</h2>
          <p className="max-w-2xl text-lg text-brand-navy-muted">
            Regularnie korzystasz z naszych linii? Sprawdź dostępne opcje biletu miesięcznego.
          </p>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TICKET_ITEMS.map((item, i) => (
            <ScrollReveal
              key={item.title}
              delay={i * 90}
              className="flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors duration-300 hover:bg-white/10"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl bg-white/10 text-white">
                <item.icon className="size-6" />
              </div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-brand-navy-muted">{item.description}</p>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={360} className="mt-10 flex justify-center">
          <Button
            render={<Link href="/kontakt" />}
            nativeButton={false}
            size="lg"
            className="gap-1.5 rounded-full px-7 text-base"
          >
            Zapytaj o bilet miesięczny
            <ArrowRight />
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
