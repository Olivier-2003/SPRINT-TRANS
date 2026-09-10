import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SectionWaveDivider } from "@/components/animations/SectionWaveDivider";

/**
 * Hero strony /o-firmie — ten sam granatowy, kompaktowy, wyśrodkowany wzorzec
 * co Flota/Oferta/Rozkład jazdy/Wycieczki/Kontakt. Zdjęcie firmy jest osobnym
 * blokiem zaraz pod hero (patrz `app/(public)/o-firmie/page.tsx`), nie tutaj.
 */
export function AboutHeroSection() {
  return (
    <section className="relative overflow-visible bg-brand-navy py-8 text-white md:py-12">
      <SectionWaveDivider position="bottom" fill="var(--color-brand-navy)" />
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/5 size-72 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute right-1/4 bottom-0 size-56 translate-y-1/3 rounded-full bg-primary/15 blur-3xl"
      />
      <div className="relative mx-auto flex max-w-[1600px] flex-col items-center gap-4 px-6 text-center lg:px-8">
        <ScrollReveal className="flex flex-col items-center gap-4">
          <h1 className="max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">Poznaj SPRINT-TRANS</h1>
          <p className="max-w-2xl text-base leading-relaxed text-brand-navy-muted">
            Przewóz osób autobusami — linie regularne, wynajem autokarów i wycieczki, zawsze
            bezpiecznie i punktualnie.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
