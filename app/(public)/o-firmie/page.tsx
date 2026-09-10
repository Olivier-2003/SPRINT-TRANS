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
            SPRINT-TRANS to licencjonowana i certyfikowana firma transportowa, działająca od 25
            lat, która stawia na najwyższe standardy przewozu osób. Naszą misją jest realizowanie
            usług transportowych, które łączą w sobie punktualność, bezpieczeństwo i komfort.
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Specjalizujemy się w wynajmie nowoczesnych pojazdów wraz z wykwalifikowaną kadrą
            kierowców, dostosowując ofertę do indywidualnych potrzeb zarówno klientów biznesowych,
            jak i prywatnych.
          </p>
        </ScrollReveal>
        {hasHeroImage && (
          <ScrollReveal
            delay={150}
            className="relative mx-auto mt-10 aspect-4/3 w-full max-w-3xl overflow-hidden rounded-3xl shadow-xl"
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
