import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ServiceOfferGrid } from "@/components/sections/ServiceOfferGrid";

export function OfferBand() {
  return (
    <section className="relative mx-auto max-w-[1600px] px-6 pt-10 pb-14 md:pt-14 md:pb-20 lg:px-8">
      <ScrollReveal className="mb-8 flex flex-col items-center gap-3 text-center">
        <span className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Nasza oferta</span>
        <h2 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">Przewóz na każdą okazję</h2>
      </ScrollReveal>

      <ScrollReveal className="mb-10 flex justify-center">
        <Button
          render={<Link href="/oferta" />}
          nativeButton={false}
          variant="outline"
          size="lg"
          className="h-11 gap-1.5 rounded-full px-6 text-base"
        >
          Sprawdź ofertę
          <ArrowRight />
        </Button>
      </ScrollReveal>

      <ServiceOfferGrid />
    </section>
  );
}
