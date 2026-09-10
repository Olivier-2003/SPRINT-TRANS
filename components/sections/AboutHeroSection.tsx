import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SectionWaveDivider } from "@/components/animations/SectionWaveDivider";
import { publicAssetExists } from "@/lib/public-assets";

const HERO_IMAGE_PATH = "o-firmie/hero.jpg";

/**
 * Hero strony /o-firmie — ten sam granatowy, kompaktowy wzorzec co pozostałe
 * podstrony, z małym zdjęciem obok tekstu (przeskalowanym proporcjonalnie do
 * skróconego tekstu, a nie pełnowymiarowym jak w treści strony).
 */
export function AboutHeroSection() {
  const hasHeroImage = publicAssetExists(HERO_IMAGE_PATH);

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
      <div className="relative mx-auto flex max-w-[1600px] flex-wrap items-center justify-center gap-6 px-6 text-center lg:flex-nowrap lg:justify-between lg:gap-10 lg:text-left lg:px-8">
        <ScrollReveal className="flex flex-col items-center gap-4 lg:items-start">
          <h1 className="max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">Poznaj SPRINT-TRANS</h1>
          <p className="max-w-2xl text-base leading-relaxed text-brand-navy-muted">
            Przewóz osób autobusami — linie regularne, wynajem autokarów i wycieczki, zawsze
            bezpiecznie i punktualnie.
          </p>
        </ScrollReveal>

        {hasHeroImage && (
          <ScrollReveal
            delay={150}
            className="relative aspect-4/3 w-32 shrink-0 overflow-hidden rounded-xl shadow-xl ring-1 ring-white/15 sm:w-40 lg:w-48"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/${HERO_IMAGE_PATH}`} alt="SPRINT-TRANS" className="h-full w-full object-cover" />
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
