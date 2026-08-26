import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateBookingForm } from "@/components/forms/CreateBookingForm";
import { createManualBooking } from "@/lib/actions/bookings";

export default function NewBookingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Nowe zlecenie</h1>
        <p className="text-sm text-muted-foreground">
          Ręczne utworzenie zlecenia bez powiązanego zapytania klienta — np. dla ustaleń
          telefonicznych lub mailowych poza formularzem na stronie publicznej.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dane zlecenia</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p className="text-sm text-muted-foreground">Ładowanie…</p>}>
            <CreateBookingForm action={createManualBooking} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
