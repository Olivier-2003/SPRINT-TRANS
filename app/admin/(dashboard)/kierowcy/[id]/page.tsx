import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DriverForm } from "@/components/forms/DriverForm";
import { DriverAvailabilityForm } from "@/components/forms/DriverAvailabilityForm";
import { DriverAvailabilityList } from "@/components/admin/drivers/DriverAvailabilityList";
import { DriverLineAssignmentForm } from "@/components/forms/DriverLineAssignmentForm";
import { DriverLineAssignmentList } from "@/components/admin/drivers/DriverLineAssignmentList";
import { updateDriver } from "@/lib/actions/drivers";
import { createDriverAvailability } from "@/lib/actions/driver-availability";
import { assignDriverToLine } from "@/lib/actions/driver-line-assignments";
import { getDriver } from "@/lib/data/drivers";
import { getDriverAvailabilityRecords } from "@/lib/data/driver-availability";
import { getLines } from "@/lib/data/lines";
import { db } from "@/lib/db";

export default async function EditDriverPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const driver = await getDriver(id);
  if (!driver) notFound();

  const [availabilityEntries, lines, lineAssignments] = await Promise.all([
    getDriverAvailabilityRecords(id),
    getLines(),
    db.driverLineAssignment.findMany({
      where: { driverId: id },
      include: { line: { select: { id: true, name: true } } },
      orderBy: { createdAt: "asc" },
    }),
  ]);

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
              restingHoursRequired: String(driver.restingHoursRequired),
              maxDailyWorkHours: driver.maxDailyWorkHours != null ? String(driver.maxDailyWorkHours) : "",
              monthlyWorkHoursNorm:
                driver.monthlyWorkHoursNorm != null ? String(driver.monthlyWorkHoursNorm) : "",
              weeklyWorkHoursNorm:
                driver.weeklyWorkHoursNorm != null ? String(driver.weeklyWorkHoursNorm) : "",
              restrictedWorkTypes: driver.restrictedWorkTypes,
              preferredWorkTypes: driver.preferredWorkTypes,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dostępność i niedostępność</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <DriverAvailabilityList driverId={driver.id} entries={availabilityEntries} />
          <DriverAvailabilityForm driverId={driver.id} action={createDriverAvailability} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Przypisania do linii regularnych</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <DriverLineAssignmentList driverId={driver.id} assignments={lineAssignments} />
          <DriverLineAssignmentForm
            driverId={driver.id}
            lines={lines.map((line) => ({ id: line.id, name: line.name }))}
            action={assignDriverToLine}
          />
        </CardContent>
      </Card>
    </div>
  );
}
