import { TripsGrid } from "@/components/public/trips/TripsGrid";
import { getPublicTrips } from "@/lib/data/trips";

export const dynamic = "force-dynamic";

export default async function TripsPage() {
  const trips = await getPublicTrips();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wycieczki</h1>
        <p className="text-muted-foreground">
          Wybrane propozycje wycieczek organizowanych przez SPRINT-TRANS.
        </p>
      </div>
      <TripsGrid trips={trips} />
    </div>
  );
}
