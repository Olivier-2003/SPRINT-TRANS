import Link from "next/link";
import { Ticket, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

/**
 * Niewielki, elegancki teaser biletów miesięcznych na stronie głównej — celowo
 * nie jest osobną dużą sekcją. Pełny opis (4 karty + CTA) znajduje się na
 * /rozklad-jazdy#bilety-miesieczne, dokąd prowadzi ten pasek.
 */
export function MonthlyTicketsTeaser() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 lg:px-8">
      <ScrollReveal>
        <Link
          href="/rozklad-jazdy#bilety-miesieczne"
          className="group flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-muted/40 px-6 py-6 transition-colors hover:border-primary/40 hover:bg-muted/70 sm:flex-row sm:items-center"
        >
          <span className="flex items-center gap-3 text-base font-medium sm:text-lg">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Ticket className="size-5" />
            </span>
            Regularnie dojeżdżasz? Sprawdź bilety miesięczne.
          </span>
          <span className="flex items-center gap-1.5 text-sm font-semibold text-primary">
            Zobacz szczegóły
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </ScrollReveal>
    </section>
  );
}
