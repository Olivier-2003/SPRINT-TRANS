import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BusForm } from "@/components/forms/BusForm";
import { createBus } from "@/lib/actions/buses";

export default function NewBusPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Nowy autobus</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Dane autobusu</CardTitle>
        </CardHeader>
        <CardContent>
          <BusForm action={createBus} submitLabel="Dodaj autobus" />
        </CardContent>
      </Card>
    </div>
  );
}
