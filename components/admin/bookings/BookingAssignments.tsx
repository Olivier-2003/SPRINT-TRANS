import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AssignDriverForm } from "@/components/forms/AssignDriverForm";
import { AssignBusForm } from "@/components/forms/AssignBusForm";
import { RemoveAssignmentButton } from "@/components/forms/RemoveAssignmentButton";
import { assignDriver, assignBus, removeDriver, removeBus } from "@/lib/actions/bookings";
import type { BookingDriver, BookingBus, Driver, Bus } from "@/lib/generated/prisma/client";

const DRIVER_ROLE_LABELS: Record<string, string> = {
  GLOWNY: "Kierowca główny",
  POMOCNICZY: "Kierowca pomocniczy",
};

interface BookingAssignmentsProps {
  bookingId: string;
  assignedDrivers: (BookingDriver & { driver: Driver })[];
  assignedBuses: (BookingBus & { bus: Bus })[];
  allDrivers: Driver[];
  allBuses: Bus[];
  busyDriverIds: Set<string>;
  busyBusIds: Set<string>;
}

export function BookingAssignments({
  bookingId,
  assignedDrivers,
  assignedBuses,
  allDrivers,
  allBuses,
  busyDriverIds,
  busyBusIds,
}: BookingAssignmentsProps) {
  const assignedDriverIds = new Set(assignedDrivers.map((d) => d.driverId));
  const assignedBusIds = new Set(assignedBuses.map((b) => b.busId));

  const availableDrivers = allDrivers
    .filter((driver) => !assignedDriverIds.has(driver.id))
    .map((driver) => ({
      id: driver.id,
      label: `${driver.firstName} ${driver.lastName}`,
      busy: busyDriverIds.has(driver.id),
    }));

  const availableBuses = allBuses
    .filter((bus) => !assignedBusIds.has(bus.id))
    .map((bus) => ({
      id: bus.id,
      label: `${bus.registrationNumber} — ${bus.brandModel}`,
      busy: busyBusIds.has(bus.id),
    }));

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Kierowcy</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {assignedDrivers.length === 0 ? (
            <p className="text-sm text-muted-foreground">Brak przypisanych kierowców.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {assignedDrivers.map((assignment) => (
                <li
                  key={assignment.id}
                  className="flex items-center justify-between gap-2 rounded-md border p-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span>
                      {assignment.driver.firstName} {assignment.driver.lastName}
                    </span>
                    {assignment.roleOnTrip && (
                      <Badge variant="outline">{DRIVER_ROLE_LABELS[assignment.roleOnTrip]}</Badge>
                    )}
                  </div>
                  <RemoveAssignmentButton
                    bookingId={bookingId}
                    targetId={assignment.driverId}
                    action={removeDriver}
                    confirmMessage={`Usunąć przypisanie kierowcy ${assignment.driver.firstName} ${assignment.driver.lastName}?`}
                  />
                </li>
              ))}
            </ul>
          )}
          <AssignDriverForm bookingId={bookingId} drivers={availableDrivers} action={assignDriver} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Autobusy</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {assignedBuses.length === 0 ? (
            <p className="text-sm text-muted-foreground">Brak przypisanych autobusów.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {assignedBuses.map((assignment) => (
                <li
                  key={assignment.id}
                  className="flex items-center justify-between gap-2 rounded-md border p-2 text-sm"
                >
                  <span>
                    {assignment.bus.registrationNumber} — {assignment.bus.brandModel}
                  </span>
                  <RemoveAssignmentButton
                    bookingId={bookingId}
                    targetId={assignment.busId}
                    action={removeBus}
                    confirmMessage={`Usunąć przypisanie autobusu ${assignment.bus.registrationNumber}?`}
                  />
                </li>
              ))}
            </ul>
          )}
          <AssignBusForm bookingId={bookingId} buses={availableBuses} action={assignBus} />
        </CardContent>
      </Card>
    </div>
  );
}
