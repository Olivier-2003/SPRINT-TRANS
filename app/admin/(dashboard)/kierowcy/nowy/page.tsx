import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DriverForm } from "@/components/forms/DriverForm";
import { createDriver } from "@/lib/actions/drivers";

export default function NewDriverPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Nowy kierowca</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Dane kierowcy</CardTitle>
        </CardHeader>
        <CardContent>
          <DriverForm action={createDriver} submitLabel="Dodaj kierowcę" />
        </CardContent>
      </Card>
    </div>
  );
}
