import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const FACEBOOK_URL = "https://www.facebook.com/sprinttranspiechcin";

export function FacebookCta() {
  return (
    <section className="relative overflow-hidden bg-brand-navy py-16 text-white md:py-20">
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl"
      />
      <div className="relative mx-auto flex max-w-[1600px] flex-col items-center gap-7 px-6 text-center lg:px-8">
        <ScrollReveal className="flex flex-col items-center gap-7">
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Zobacz więcej na naszym Facebook&apos;u
          </h2>
          <Button
            render={<Link href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" />}
            nativeButton={false}
            size="lg"
            className="gap-1.5 rounded-full px-7 text-base"
          >
            Facebook
            <ArrowUpRight />
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
