import { notFound } from "next/navigation";
import { TripDetails } from "@/components/public/trips/TripDetails";
import { getPublicTrip } from "@/lib/data/trips";

export const dynamic = "force-dynamic";

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getPublicTrip(tripId);
  if (!trip) notFound();

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-14 md:py-16">
      <TripDetails trip={trip} />
    </div>
  );
}
