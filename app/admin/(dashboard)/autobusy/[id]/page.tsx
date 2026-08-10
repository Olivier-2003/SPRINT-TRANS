import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BusForm } from "@/components/forms/BusForm";
import { updateBus } from "@/lib/actions/buses";
import { getBus } from "@/lib/data/buses";

export default async function EditBusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bus = await getBus(id);
  if (!bus) notFound();

  const featuresText = Array.isArray(bus.features) ? bus.features.join(", ") : "";

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Edycja autobusu: {bus.registrationNumber}
      </h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Dane autobusu</CardTitle>
        </CardHeader>
        <CardContent>
          <BusForm
            action={updateBus.bind(null, bus.id)}
            defaultValues={{
              registrationNumber: bus.registrationNumber,
              brandModel: bus.brandModel,
              seats: bus.seats,
              productionYear: bus.productionYear ?? undefined,
              description: bus.description ?? "",
              featuresText,
              status: bus.status,
              photos: bus.photos.map((photo) => ({ url: photo.url })),
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
