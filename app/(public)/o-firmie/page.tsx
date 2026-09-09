import { AboutHeroSection } from "@/components/sections/AboutHeroSection";
import { ServiceOfferGrid } from "@/components/sections/ServiceOfferGrid";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ReferencesSection } from "@/components/sections/ReferencesSection";
import { WhyTrustUsSection } from "@/components/sections/WhyTrustUsSection";
import { ContactCta } from "@/components/sections/ContactCta";

export default function AboutPage() {
  return (
    <div className="flex-1">
      <AboutHeroSection />

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
