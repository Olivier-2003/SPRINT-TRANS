import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TripForm } from "@/components/forms/TripForm";
import { createTrip } from "@/lib/actions/trips";

export default function NewTripPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Nowa wycieczka</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Dane wycieczki</CardTitle>
        </CardHeader>
        <CardContent>
          <TripForm action={createTrip} submitLabel="Dodaj wycieczkę" />
        </CardContent>
      </Card>
    </div>
  );
}
