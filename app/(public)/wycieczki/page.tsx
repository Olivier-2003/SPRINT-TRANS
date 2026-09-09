import { TripsGrid } from "@/components/public/trips/TripsGrid";
import { SectionWaveDivider } from "@/components/animations/SectionWaveDivider";
import { getPublicTrips } from "@/lib/data/trips";

export const dynamic = "force-dynamic";

export default async function TripsPage() {
  const trips = await getPublicTrips();

  return (
    <div className="flex-1">
      <section className="relative overflow-visible bg-brand-navy py-16 text-white md:py-24">
        <SectionWaveDivider position="bottom" fill="var(--background)" />
        <div className="relative mx-auto flex max-w-[1600px] flex-col items-center gap-4 px-6 text-center lg:px-8">
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Wycieczki organizowane przez SPRINT-TRANS
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-brand-navy-muted">
            Wybrane propozycje wycieczek — sprawdź aktualną ofertę i szczegóły każdego wyjazdu.
          </p>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-14 md:py-16">
        <TripsGrid trips={trips} />
      </div>
    </div>
  );
}
