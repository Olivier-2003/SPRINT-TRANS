import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { FLEET_CATEGORIES } from "@/components/sections/fleet-categories-data";

export function FleetPreview() {
  return (
    <section className="relative mx-auto max-w-[1600px] px-6 py-14 md:py-20 lg:px-8">
      <ScrollReveal className="mb-10 flex flex-col items-start gap-3">
        <span className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Nasza flota</span>
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Komfort i bezpieczeństwo</h2>
      </ScrollReveal>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {FLEET_CATEGORIES.map((category, i) => (
          <ScrollReveal key={category.title} delay={i * 80}>
            <Link href="/flota" className="group block h-full">
              <Card className="h-full gap-0 overflow-hidden rounded-2xl border border-border/60 py-0 shadow-sm ring-0 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-2xl">
                <div className="relative aspect-4/3 overflow-hidden bg-brand-navy">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={category.photo}
                    alt={category.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/0" />
                  <span className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold tracking-wide text-brand-navy uppercase shadow-sm backdrop-blur">
                    {category.badge}
                  </span>
                  <span className="absolute bottom-4 left-5 text-2xl font-bold text-white drop-shadow-sm">
                    {category.title}
                  </span>
                </div>
              </Card>
            </Link>
          </ScrollReveal>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button
          render={<Link href="/flota" />}
          nativeButton={false}
          variant="outline"
          size="lg"
          className="gap-1.5 rounded-full px-6 text-base"
        >
          Zobacz całą flotę
          <ArrowRight />
        </Button>
      </div>
    </section>
  );
}
