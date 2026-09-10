import { AboutHeroSection } from "@/components/sections/AboutHeroSection";
import { ServiceOfferGrid } from "@/components/sections/ServiceOfferGrid";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ReferencesSection } from "@/components/sections/ReferencesSection";
import { WhyTrustUsSection } from "@/components/sections/WhyTrustUsSection";
import { ContactCta } from "@/components/sections/ContactCta";
import { publicAssetExists } from "@/lib/public-assets";

const HERO_IMAGE_PATH = "o-firmie/hero.jpg";

export default function AboutPage() {
  const hasHeroImage = publicAssetExists(HERO_IMAGE_PATH);

  return (
    <div className="flex-1">
      <AboutHeroSection />

      <section className="relative mx-auto max-w-[1600px] px-6 pt-14 pb-4 md:pt-20 lg:px-8">
        <ScrollReveal className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <p className="text-lg leading-relaxed text-muted-foreground">
            SPRINT-TRANS zajmuje się przewozem osób autobusami — obsługujemy linie regularne,
            wynajem autokarów na wycieczki oraz przewozy okazjonalne i grupowe. Naszym celem jest
            zapewnienie pasażerom bezpiecznego i komfortowego przejazdu, niezależnie od trasy.
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Stawiamy na punktualność, sprawną obsługę i indywidualne podejście do każdego
            zlecenia — od pojedynczego przejazdu po regularną współpracę z firmami i
            instytucjami. [Pełna historia i szczegóły firmy zostaną uzupełnione przez
            SPRINT-TRANS.]
          </p>
        </ScrollReveal>
        {hasHeroImage && (
          <ScrollReveal
            delay={150}
            className="relative mx-auto mt-10 aspect-video w-full max-w-4xl overflow-hidden rounded-3xl shadow-xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/${HERO_IMAGE_PATH}`} alt="SPRINT-TRANS" className="h-full w-full object-cover" />
          </ScrollReveal>
        )}
      </section>

      <section className="relative mx-auto max-w-[1600px] px-6 py-14 md:py-20 lg:px-8">
        <ScrollReveal className="mb-10 flex flex-col items-center gap-3 text-center">
          <span className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Co robimy</span>
          <h2 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">Nasze usługi</h2>
        </ScrollReveal>
        <ServiceOfferGrid />
      </section>

      <ReferencesSection />
      <WhyTrustUsSection />
      <ContactCta />
    </div>
  );
}
