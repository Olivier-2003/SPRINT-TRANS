import { AdminListHeader } from "@/components/admin/AdminListHeader";
import { ErrorBanner } from "@/components/admin/ErrorBanner";
import { DriversTable } from "@/components/admin/drivers/DriversTable";
import { getDrivers } from "@/lib/data/drivers";

export default async function DriversPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [drivers, { error }] = await Promise.all([getDrivers(), searchParams]);

  return (
    <div className="flex flex-col gap-6">
      <AdminListHeader
        title="Kierowcy"
        description="Lista kierowców SPRINT-TRANS."
        addHref="/admin/kierowcy/nowy"
        addLabel="Dodaj kierowcę"
      />
      <ErrorBanner message={error} />
      <DriversTable drivers={drivers} />
    </div>
  );
}
