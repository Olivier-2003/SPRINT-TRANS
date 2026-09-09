import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SectionWaveDivider } from "@/components/animations/SectionWaveDivider";

export function ContactCta() {
  return (
    <section className="relative overflow-visible bg-brand-navy py-16 text-white md:py-20">
      <SectionWaveDivider position="top" fill="var(--color-brand-navy)" />
      <SectionWaveDivider position="bottom" fill="var(--background)" />
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl"
      />
      <div className="relative mx-auto flex max-w-[1600px] flex-col items-center gap-7 px-6 text-center lg:px-8">
        <ScrollReveal className="flex flex-col items-center gap-7">
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Potrzebujesz wynająć autokar? Skontaktuj się
          </h2>
          <Button
            render={<Link href="/kontakt" />}
            nativeButton={false}
            size="lg"
            className="h-11 gap-1.5 rounded-full px-7 text-base"
          >
            Skontaktuj się
            <ArrowRight />
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
