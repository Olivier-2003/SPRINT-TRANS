import { TripsGrid } from "@/components/public/trips/TripsGrid";
import { getPublicTrips } from "@/lib/data/trips";

export const dynamic = "force-dynamic";

export default async function TripsPage() {
  const trips = await getPublicTrips();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-14 md:py-16">
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Wycieczki</h1>
        <p className="text-muted-foreground">
          Wybrane propozycje wycieczek organizowanych przez SPRINT-TRANS.
        </p>
      </div>
      <TripsGrid trips={trips} />
    </div>
  );
}
