import { FleetGrid } from "@/components/public/fleet/FleetGrid";
import { getPublicBuses } from "@/lib/data/buses";

export const dynamic = "force-dynamic";

export default async function FleetPage() {
  const buses = await getPublicBuses();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nasza flota</h1>
        <p className="text-muted-foreground">
          Autobusy SPRINT-TRANS dostępne do wynajmu i obsługi linii regularnych.
        </p>
      </div>
      <FleetGrid buses={buses} />
    </div>
  );
}
