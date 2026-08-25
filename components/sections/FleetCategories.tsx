import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { cn } from "@/lib/utils";
import { FLEET_CATEGORIES } from "@/components/sections/fleet-categories-data";

export function FleetCategories() {
  return (
    <div className="flex flex-col gap-8">
      {FLEET_CATEGORIES.map((category, i) => {
        const reversed = i % 2 === 1;
        return (
          <ScrollReveal key={category.title} delay={i * 90}>
            <div
              className={cn(
                "flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-shadow duration-300 hover:shadow-md lg:flex-row lg:items-stretch",
                reversed && "lg:flex-row-reverse"
              )}
            >
              <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden lg:aspect-auto lg:w-2/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={category.photo} alt={category.title} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-center gap-4 p-7 sm:p-9">
                <span className="w-fit rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                  {category.badge}
                </span>
                <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">{category.title}</h3>
                <p className="text-base leading-relaxed text-muted-foreground">{category.description}</p>
                <Button
                  render={<Link href="/kalkulator" />}
                  nativeButton={false}
                  variant="outline"
                  className="mt-2 w-fit gap-1.5 rounded-full"
                >
                  Zapytaj o wycenę
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
