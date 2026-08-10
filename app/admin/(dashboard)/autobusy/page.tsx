import { AdminListHeader } from "@/components/admin/AdminListHeader";
import { ErrorBanner } from "@/components/admin/ErrorBanner";
import { BusesTable } from "@/components/admin/buses/BusesTable";
import { getBuses } from "@/lib/data/buses";

export default async function BusesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [buses, { error }] = await Promise.all([getBuses(), searchParams]);

  return (
    <div className="flex flex-col gap-6">
      <AdminListHeader
        title="Autobusy"
        description="Flota SPRINT-TRANS."
        addHref="/admin/autobusy/nowy"
        addLabel="Dodaj autobus"
      />
      <ErrorBanner message={error} />
      <BusesTable buses={buses} />
    </div>
  );
}
