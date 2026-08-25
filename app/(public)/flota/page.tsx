import { FleetCategories } from "@/components/sections/FleetCategories";
import { WhyTrustUsSection } from "@/components/sections/WhyTrustUsSection";
import { ContactCta } from "@/components/sections/ContactCta";

export default function FleetPage() {
  return (
    <div className="flex-1">
      <section className="relative overflow-hidden bg-brand-navy py-16 text-white md:py-24">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-8">
          <span className="text-sm font-semibold tracking-[0.2em] text-brand-navy-muted uppercase">
            Flota
          </span>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Nasza flota
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-brand-navy-muted">
            Autobusy SPRINT-TRANS dostępne do wynajmu i obsługi linii regularnych.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4">
              <div className="text-3xl font-bold">3</div>
              <div className="text-sm text-brand-navy-muted">kategorie pojazdów</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4">
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
