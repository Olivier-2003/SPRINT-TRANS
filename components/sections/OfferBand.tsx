import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ServiceOfferGrid } from "@/components/sections/ServiceOfferGrid";

export function OfferBand() {
  return (
    <section className="relative mx-auto max-w-[1600px] px-6 py-14 md:py-20 lg:px-8">
      <ScrollReveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Nasza oferta</span>
          <h2 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Przewóz na każdą okazję
          </h2>
        </div>
        <Button
          render={<Link href="/oferta" />}
          nativeButton={false}
          variant="outline"
          size="lg"
          className="gap-1.5 rounded-full px-6 text-base"
        >
          Sprawdź ofertę
          <ArrowRight />
        </Button>
      </ScrollReveal>

      <ServiceOfferGrid />
    </section>
  );
}
