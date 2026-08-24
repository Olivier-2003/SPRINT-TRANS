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
          className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-7 shadow-sm transition-shadow duration-300 hover:shadow-md"
        >
          <div className="flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <item.icon className="size-6" />
          </div>
          <h3 className="text-xl font-semibold tracking-tight text-foreground">{item.title}</h3>
          <p className="text-base leading-relaxed text-muted-foreground">{item.description}</p>
        </ScrollReveal>
      ))}
    </div>
  );
}
