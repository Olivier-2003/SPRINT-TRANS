import Link from "next/link";
import { MapPinned, Briefcase, PlaneTakeoff, Globe2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const OFFER_ITEMS = [
  {
    icon: PlaneTakeoff,
    title: "Wycieczki i wyjazdy",
    description: "Organizujemy wycieczki szkolne, wyjazdy integracyjne, pielgrzymki i wyjazdy okolicznościowe.",
  },
  {
    icon: Briefcase,
    title: "Przewozy pracownicze",
    description: "Regularne przewozy pracowników do zakładów pracy — bezpiecznie i na czas.",
  },
  {
    icon: MapPinned,
    title: "Transfery i przejazdy okazjonalne",
    description: "Transfery lotniskowe, przewozy na dworzec oraz obsługa eventów i konferencji.",
  },
  {
    icon: Globe2,
    title: "Przewozy krajowe i zagraniczne",
    description: "Realizujemy zlecenia na terenie kraju oraz całej Europy.",
  },
];

export function OfferBand() {
  return (
    <section className="relative bg-brand-navy py-16 text-white md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-sm font-semibold tracking-[0.2em] text-brand-navy-muted uppercase">
              Nasza oferta
            </span>
            <h2 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
              Przewóz na każdą okazję
            </h2>
          </div>
          <Button
            render={<Link href="/oferta" />}
            nativeButton={false}
            variant="outline"
            size="lg"
            className="gap-1.5 rounded-full border-white/20 bg-transparent px-6 text-base text-white hover:bg-white/10 hover:text-white"
          >
            Sprawdź ofertę
            <ArrowRight />
          </Button>
        </ScrollReveal>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {OFFER_ITEMS.map((item, i) => (
            <ScrollReveal
              key={item.title}
              delay={i * 90}
              className="group flex flex-col gap-4 rounded-2xl p-2 transition-colors duration-300 hover:bg-white/5"
            >
              <div className="flex size-16 items-center justify-center rounded-2xl bg-white/10 text-white transition-colors duration-300 group-hover:bg-primary">
                <item.icon className="size-7" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
              <p className="max-w-xs text-base leading-relaxed text-brand-navy-muted">{item.description}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
