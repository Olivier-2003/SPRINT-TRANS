import Link from "next/link";
import { Ticket, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

/**
 * Kompaktowy, ale wizualnie istotny moduł biletów miesięcznych na stronie
 * głównej — celowo nie jest osobną dużą sekcją jak Flota/Oferta. Pełny opis
 * (4 karty + CTA) znajduje się na /rozklad-jazdy#bilety-miesieczne, dokąd
 * prowadzi ten baner.
 */
export function MonthlyTicketsTeaser() {
  return (
    <section className="relative mx-auto my-2 max-w-[1600px] px-6 md:my-4 lg:px-8">
      <ScrollReveal>
        <Link
          href="/rozklad-jazdy#bilety-miesieczne"
          className="group relative flex flex-col items-start gap-5 overflow-hidden rounded-2xl bg-brand-navy px-7 py-8 text-white shadow-[0_20px_45px_-25px_rgba(8,15,35,0.5)] transition-transform duration-300 hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between sm:px-9"
        >
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-1.5 bg-primary"
          />
          <div
            aria-hidden="true"
            className="absolute -top-10 -right-10 size-40 rounded-full bg-primary/20 blur-2xl"
          />
          <span className="relative flex items-center gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
              <Ticket className="size-6" />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold tracking-[0.2em] text-brand-navy-muted uppercase">
                Dojazdy regularne
              </span>
              <span className="text-xl font-bold sm:text-2xl">Regularnie dojeżdżasz? Sprawdź bilety miesięczne.</span>
            </span>
          </span>
          <span className="relative flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold transition-colors group-hover:bg-primary">
            Zobacz szczegóły
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </ScrollReveal>
    </section>
  );
}
