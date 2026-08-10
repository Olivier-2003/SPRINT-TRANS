import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TripForm } from "@/components/forms/TripForm";
import { updateTrip } from "@/lib/actions/trips";
import { getTrip } from "@/lib/data/trips";

export default async function EditTripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = await getTrip(id);
  if (!trip) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Edycja wycieczki: {trip.title}</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Dane wycieczki</CardTitle>
        </CardHeader>
        <CardContent>
          <TripForm
            action={updateTrip.bind(null, trip.id)}
            defaultValues={{
              title: trip.title,
              description: trip.description ?? "",
              priceInfo: trip.priceInfo ?? "",
              active: trip.active,
              photos: trip.photos.map((photo) => ({ url: photo.url })),
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
