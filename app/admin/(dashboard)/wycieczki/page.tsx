import { AdminListHeader } from "@/components/admin/AdminListHeader";
import { ErrorBanner } from "@/components/admin/ErrorBanner";
import { TripsTable } from "@/components/admin/trips/TripsTable";
import { getTrips } from "@/lib/data/trips";

export default async function TripsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [trips, { error }] = await Promise.all([getTrips(), searchParams]);

  return (
    <div className="flex flex-col gap-6">
      <AdminListHeader
        title="Wycieczki"
        description="Oferta wycieczek prezentowana na stronie publicznej."
        addHref="/admin/wycieczki/nowy"
        addLabel="Dodaj wycieczkę"
      />
      <ErrorBanner message={error} />
      <TripsTable trips={trips} />
    </div>
  );
}
