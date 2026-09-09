import { Route, School, Handshake, Users } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

/**
 * Współdzielona lista 4 kategorii usług SPRINT-TRANS — używana zarówno w
 * `OfferBand` (strona główna) jak i na `/o-firmie` ("Nasze usługi"), żeby nie
 * duplikować treści/kodu karty w dwóch miejscach.
 */
export const OFFER_ITEMS = [
  {
    icon: Route,
    title: "Przewozy liniowe",
    description: "Regularne kursy na wybranych trasach [trasy do uzupełnienia].",
  },
  {
    icon: School,
    title: "Dowozy szkolne",
    description: "Bezpieczny, punktualny dowóz uczniów [szczegóły oferty do uzupełnienia].",
  },
  {
    icon: Handshake,
    title: "Przewozy okazjonalne",
    description: "Wynajem autokaru na wydarzenia i wyjazdy okolicznościowe [zakres do uzupełnienia].",
  },
  {
    icon: Users,
    title: "Grupy zorganizowane",
    description: "Przewóz grup zorganizowanych — wycieczki, delegacje, eventy [warunki do uzupełnienia].",
  },
] as const;

export function ServiceOfferGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {OFFER_ITEMS.map((item, i) => (
        <ScrollReveal
          key={item.title}
          delay={i * 90}
          className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border/60 bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl"
        >
          {/* Pasek akcentu "wjeżdżający" przy hover — czysto dekoracyjny. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[linear-gradient(90deg,color-mix(in_oklch,var(--color-primary),white_18%),var(--color-primary))] transition-transform duration-300 group-hover:scale-x-100"
          />
          {/* Duży, wyciszony numer w tle — akcent edytorski wypełniający puste
              miejsce w karcie, wyraźniejszy przy hover. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-3 right-3 text-8xl font-black text-foreground/[0.04] transition-all duration-500 select-none group-hover:scale-110 group-hover:text-primary/10"
          >
            {String(i + 1).padStart(2, "0")}
          </span>

          <div className="icon-float relative w-fit">
            <div className="flex size-14 items-center justify-center rounded-xl bg-[linear-gradient(135deg,color-mix(in_oklch,var(--color-primary),white_18%)_0%,var(--color-primary)_60%,color-mix(in_oklch,var(--color-primary),black_20%)_100%)] text-primary-foreground shadow-[0_8px_16px_-6px_color-mix(in_oklch,var(--color-primary),transparent_35%)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <item.icon className="size-6" />
            </div>
          </div>
          <h3 className="relative text-xl font-semibold tracking-tight text-foreground">{item.title}</h3>
          <p className="relative text-base leading-relaxed text-muted-foreground">{item.description}</p>
        </ScrollReveal>
      ))}
    </div>
  );
}
