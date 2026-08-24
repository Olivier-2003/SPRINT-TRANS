import { ShieldCheck, UserCheck, Sparkles, HeartHandshake } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { cn } from "@/lib/utils";

const REASONS = [
  {
    icon: ShieldCheck,
    title: "Pełne bezpieczeństwo",
    description: "Regularne przeglądy techniczne autobusów i przestrzeganie przepisów bezpieczeństwa to dla nas priorytet.",
    highlighted: true,
  },
  {
    icon: UserCheck,
    title: "Profesjonalni kierowcy",
    description: "Nasi kierowcy to doświadczeni profesjonaliści, dbający o komfort i bezpieczeństwo pasażerów.",
    highlighted: false,
  },
  {
    icon: Sparkles,
    title: "Indywidualne podejście",
    description: "Każde zlecenie traktujemy indywidualnie, dopasowując ofertę do potrzeb klienta.",
    highlighted: false,
  },
  {
    icon: HeartHandshake,
    title: "Priorytetem jest zadowolenie",
    description: "Zależy nam na pełnej satysfakcji klientów z każdego zrealizowanego przejazdu.",
    highlighted: false,
  },
];

export function WhyTrustUsSection() {
  return (
    <section className="relative mx-auto max-w-[1600px] px-6 py-14 md:py-20 lg:px-8">
      <ScrollReveal className="mb-10 flex flex-col gap-3">
        <span className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Nasze atuty</span>
        <h2 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Dlaczego warto nam zaufać?
        </h2>
      </ScrollReveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {REASONS.map((reason, i) => (
          <ScrollReveal
            key={reason.title}
            delay={i * 90}
            className={cn(
              "flex flex-col gap-4 rounded-2xl p-7 shadow-sm",
              reason.highlighted
                ? "bg-brand-navy text-white"
                : "border border-border/60 bg-card text-foreground"
            )}
          >
            <div
              className={cn(
                "flex size-14 items-center justify-center rounded-xl",
                reason.highlighted ? "bg-white/15 text-white" : "bg-primary text-primary-foreground"
              )}
            >
              <reason.icon className="size-6" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight">{reason.title}</h3>
            <p
              className={cn(
                "text-base leading-relaxed",
                reason.highlighted ? "text-brand-navy-muted" : "text-muted-foreground"
              )}
            >
              {reason.description}
            </p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
