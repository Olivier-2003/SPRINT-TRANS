import { FleetCategories } from "@/components/sections/FleetCategories";
import { WhyTrustUsSection } from "@/components/sections/WhyTrustUsSection";
import { ContactCta } from "@/components/sections/ContactCta";
import { SectionWaveDivider } from "@/components/animations/SectionWaveDivider";
import { CountUp } from "@/components/animations/CountUp";

export default function FleetPage() {
  return (
    <div className="flex-1">
      <section className="relative overflow-visible bg-brand-navy py-16 text-white md:py-24">
        <SectionWaveDivider position="top" fill="var(--color-brand-navy)" />
        <SectionWaveDivider position="bottom" fill="var(--background)" />
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/4 size-72 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute right-1/5 bottom-0 size-56 translate-y-1/3 rounded-full bg-primary/15 blur-3xl"
        />
        <div className="relative mx-auto flex max-w-[1600px] flex-col items-center gap-4 px-6 text-center lg:px-8">
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Nasza flota
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-brand-navy-muted">
            Autobusy SPRINT-TRANS dostępne do wynajmu i obsługi linii regularnych.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 transition-colors duration-300 hover:bg-white/10">
              <div className="text-3xl font-bold">
                <CountUp target={3} />
              </div>
              <div className="text-sm text-brand-navy-muted">kategorie pojazdów</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 transition-colors duration-300 hover:bg-white/10">
              <div className="text-3xl font-bold">6-68</div>
              <div className="text-sm text-brand-navy-muted">miejsc</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-14 md:py-20 lg:px-8">
        <FleetCategories />
      </section>

      <WhyTrustUsSection />
      <ContactCta />
    </div>
  );
}
