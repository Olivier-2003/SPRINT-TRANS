import { Building2 } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { publicAssetExists } from "@/lib/public-assets";

const HERO_IMAGE_PATH = "o-firmie/hero.jpg";

/**
 * Hero strony /o-firmie. Docelowe zdjęcie firmy/floty pochodzi z
 * `public/o-firmie/hero.jpg` — dopóki pliku nie ma w repo, renderowany jest
 * premium placeholder w tej samej kompozycji (patrz `lib/public-assets.ts`).
 */
export function AboutHeroSection() {
  const hasHeroImage = publicAssetExists(HERO_IMAGE_PATH);

  return (
    <section className="relative mx-auto max-w-[1600px] px-6 pt-14 pb-10 md:pt-20 md:pb-14 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
        <ScrollReveal className="flex flex-col gap-6">
          <span className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">O firmie</span>
          <h1 className="max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">
            Poznaj SPRINT-TRANS
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            SPRINT-TRANS zajmuje się przewozem osób autobusami — obsługujemy linie regularne,
            wynajem autokarów na wycieczki oraz przewozy okazjonalne i grupowe. Naszym celem jest
            zapewnienie pasażerom bezpiecznego i komfortowego przejazdu, niezależnie od trasy.
          </p>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            Stawiamy na punktualność, sprawną obsługę i indywidualne podejście do każdego zlecenia
            — od pojedynczego przejazdu po regularną współpracę z firmami i instytucjami. [Pełna
            historia i szczegóły firmy zostaną uzupełnione przez SPRINT-TRANS.]
          </p>
        </ScrollReveal>

        <ScrollReveal delay={150} className="relative aspect-4/3 w-full overflow-hidden rounded-3xl shadow-xl">
          {hasHeroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/${HERO_IMAGE_PATH}`} alt="SPRINT-TRANS" className="h-full w-full object-cover" />
          ) : (
            <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-brand-navy-card to-brand-navy text-brand-navy-muted">
              <div
                aria-hidden="true"
                className="absolute size-40 rounded-full bg-primary/20 blur-3xl"
              />
              <Building2 className="relative size-14 text-white/70" strokeWidth={1.5} />
              <span className="relative text-sm font-medium text-white/60">Zdjęcie firmy wkrótce</span>
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
