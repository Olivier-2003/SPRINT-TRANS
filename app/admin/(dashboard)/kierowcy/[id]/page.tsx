import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DriverForm } from "@/components/forms/DriverForm";
import { updateDriver } from "@/lib/actions/drivers";
import { getDriver } from "@/lib/data/drivers";

export default async function EditDriverPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const driver = await getDriver(id);
  if (!driver) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Edycja kierowcy: {driver.firstName} {driver.lastName}
      </h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Dane kierowcy</CardTitle>
        </CardHeader>
        <CardContent>
          <DriverForm
            action={updateDriver.bind(null, driver.id)}
            defaultValues={{
              firstName: driver.firstName,
              lastName: driver.lastName,
              phone: driver.phone,
              email: driver.email ?? "",
              licenseCategories: driver.licenseCategories,
              employmentStatus: driver.employmentStatus,
              notes: driver.notes ?? "",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
