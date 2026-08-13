import { FleetGrid } from "@/components/public/fleet/FleetGrid";
import { getPublicBuses } from "@/lib/data/buses";

export const dynamic = "force-dynamic";

export default async function FleetPage() {
  const buses = await getPublicBuses();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-14 md:py-16">
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Nasza flota</h1>
        <p className="text-muted-foreground">
          Autobusy SPRINT-TRANS dostępne do wynajmu i obsługi linii regularnych.
        </p>
      </div>
      <FleetGrid buses={buses} />
    </div>
  );
}
