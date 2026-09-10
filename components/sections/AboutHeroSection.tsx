import { Building2 } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { SectionWaveDivider } from "@/components/animations/SectionWaveDivider";
import { publicAssetExists } from "@/lib/public-assets";

const HERO_IMAGE_PATH = "o-firmie/hero.jpg";

/**
 * Hero strony /o-firmie — ten sam granatowy, kompaktowy wzorzec co pozostałe
 * podstrony (Oferta/Flota/Rozkład jazdy/Wycieczki/Kontakt). Docelowe zdjęcie
 * firmy/floty pochodzi z `public/o-firmie/hero.jpg` — dopóki pliku nie ma w
 * repo, renderowany jest premium placeholder w tej samej kompozycji.
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
      <div className="relative mx-auto grid max-w-[1600px] gap-12 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16 lg:px-8">
        <ScrollReveal className="flex flex-col gap-4">
          <h1 className="max-w-xl text-2xl font-bold tracking-tight sm:text-3xl">Poznaj SPRINT-TRANS</h1>
          <p className="max-w-xl text-base leading-relaxed text-brand-navy-muted">
            SPRINT-TRANS zajmuje się przewozem osób autobusami — obsługujemy linie regularne,
            wynajem autokarów na wycieczki oraz przewozy okazjonalne i grupowe. Naszym celem jest
            zapewnienie pasażerom bezpiecznego i komfortowego przejazdu, niezależnie od trasy.
          </p>
          <p className="max-w-xl text-base leading-relaxed text-brand-navy-muted">
            Stawiamy na punktualność, sprawną obsługę i indywidualne podejście do każdego zlecenia
            — od pojedynczego przejazdu po regularną współpracę z firmami i instytucjami. [Pełna
            historia i szczegóły firmy zostaną uzupełnione przez SPRINT-TRANS.]
          </p>
        </ScrollReveal>

        <ScrollReveal
          delay={150}
          className="relative mx-auto w-full max-w-2xl lg:mx-0 lg:ml-auto lg:max-w-none"
        >
          <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[linear-gradient(135deg,color-mix(in_oklch,var(--color-primary),white_18%),var(--color-primary))] opacity-20 blur-3xl" />
          {hasHeroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/${HERO_IMAGE_PATH}`}
              alt="SPRINT-TRANS"
              className="aspect-4/3 w-full rounded-2xl object-cover shadow-2xl ring-1 ring-white/15"
            />
          ) : (
            <div className="relative flex aspect-4/3 w-full flex-col items-center justify-center gap-3 rounded-2xl bg-white/5 text-brand-navy-muted ring-1 ring-white/15">
              <Building2 className="relative size-14 text-white/70" strokeWidth={1.5} />
              <span className="relative text-sm font-medium text-white/60">Zdjęcie firmy wkrótce</span>
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
