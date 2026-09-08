import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AssignDriverForm } from "@/components/forms/AssignDriverForm";
import { AssignBusForm } from "@/components/forms/AssignBusForm";
import { AvailableDriversPanel } from "@/components/forms/AvailableDriversPanel";
import { AvailableBusesPanel } from "@/components/forms/AvailableBusesPanel";
import { RemoveEntityButton } from "@/components/forms/RemoveEntityButton";
import { SwapDriverControl } from "@/components/forms/SwapDriverControl";
import { SwapBusControl } from "@/components/forms/SwapBusControl";
import { AssignmentHoursControl } from "@/components/forms/AssignmentHoursControl";
import {
  assignDriver,
  assignBus,
  removeDriver,
  removeBus,
  swapDriver,
  swapBus,
  updateAssignmentHours,
} from "@/lib/actions/bookings";
import { OVERALL_STATUS_LABELS, OVERALL_STATUS_BADGE_VARIANT } from "@/lib/availability-status-labels";
import type { DriverAvailabilityResult, BusAvailabilityResult } from "@/lib/availability-engine";
import type { DriverRecommendation } from "@/lib/driver-recommendation";
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
  driverStatuses: Map<string, DriverAvailabilityResult>;
  busStatuses: Map<string, BusAvailabilityResult>;
  recommendations: DriverRecommendation[];
}

export function BookingAssignments({
  bookingId,
  assignedDrivers,
  assignedBuses,
  allDrivers,
  allBuses,
  driverStatuses,
  busStatuses,
  recommendations,
}: BookingAssignmentsProps) {
  const assignedDriverIds = new Set(assignedDrivers.map((d) => d.driverId));
  const assignedBusIds = new Set(assignedBuses.map((b) => b.busId));

  const availableDrivers = allDrivers
    .filter((driver) => !assignedDriverIds.has(driver.id))
    .map((driver) => {
      const status = driverStatuses.get(driver.id);
      return {
        id: driver.id,
        label: `${driver.firstName} ${driver.lastName}`,
        statusLabel: status && status.status !== "DOSTEPNY" ? OVERALL_STATUS_LABELS[status.status] : null,
      };
    });

  const availableBuses = allBuses
    .filter((bus) => !assignedBusIds.has(bus.id))
    .map((bus) => {
      const status = busStatuses.get(bus.id);
      return {
        id: bus.id,
        label: `${bus.registrationNumber} — ${bus.brandModel}`,
        statusLabel: status && status.status !== "DOSTEPNY" ? OVERALL_STATUS_LABELS[status.status] : null,
      };
    });

  const availableBusOptions = allBuses
    .filter((bus) => !assignedBusIds.has(bus.id))
    .map((bus) => ({
      id: bus.id,
      label: `${bus.registrationNumber} — ${bus.brandModel}`,
      result: busStatuses.get(bus.id) ?? { busId: bus.id, status: "DOSTEPNY" as const, issues: [] },
    }));

  const unassignedRecommendations = recommendations.filter((rec) => !assignedDriverIds.has(rec.driverId));

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
              {assignedDrivers.map((assignment) => {
                const status = driverStatuses.get(assignment.driverId);
                return (
                  <li
                    key={assignment.id}
                    className="flex flex-col gap-1 rounded-md border p-2 text-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span>
                          {assignment.driver.firstName} {assignment.driver.lastName}
                        </span>
                        {assignment.roleOnTrip && (
                          <Badge variant="outline">{DRIVER_ROLE_LABELS[assignment.roleOnTrip]}</Badge>
                        )}
                        {status && status.status !== "DOSTEPNY" && (
                          <Badge variant={OVERALL_STATUS_BADGE_VARIANT[status.status]}>
                            {OVERALL_STATUS_LABELS[status.status]}
                          </Badge>
                        )}
                        <AssignmentHoursControl
                          bookingId={bookingId}
                          resourceType="driver"
                          resourceId={assignment.driverId}
                          plannedHours={assignment.plannedHours != null ? Number(assignment.plannedHours) : null}
                          action={updateAssignmentHours}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <SwapDriverControl
                          bookingId={bookingId}
                          currentDriverId={assignment.driverId}
                          currentRole={assignment.roleOnTrip}
                          drivers={availableDrivers}
                          action={swapDriver}
                        />
                        <RemoveEntityButton
                          parentId={bookingId}
                          targetId={assignment.driverId}
                          action={removeDriver}
                          confirmMessage={`Usunąć przypisanie kierowcy ${assignment.driver.firstName} ${assignment.driver.lastName}?`}
                        />
                      </div>
                    </div>
                    {status && status.issues.length > 0 && (
                      <ul className="list-disc pl-5 text-xs text-muted-foreground">
                        {status.issues.map((issue, i) => (
                          <li key={i}>{issue.message}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          <AssignDriverForm bookingId={bookingId} drivers={availableDrivers} action={assignDriver} />
          <AvailableDriversPanel
            bookingId={bookingId}
            recommendations={unassignedRecommendations}
            action={assignDriver}
          />
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
              {assignedBuses.map((assignment) => {
                const status = busStatuses.get(assignment.busId);
                return (
                  <li key={assignment.id} className="flex flex-col gap-1 rounded-md border p-2 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span>
                          {assignment.bus.registrationNumber} — {assignment.bus.brandModel}
                        </span>
                        {status && status.status !== "DOSTEPNY" && (
                          <Badge variant={OVERALL_STATUS_BADGE_VARIANT[status.status]}>
                            {OVERALL_STATUS_LABELS[status.status]}
                          </Badge>
                        )}
                        <AssignmentHoursControl
                          bookingId={bookingId}
                          resourceType="bus"
                          resourceId={assignment.busId}
                          plannedHours={assignment.plannedHours != null ? Number(assignment.plannedHours) : null}
                          action={updateAssignmentHours}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <SwapBusControl
                          bookingId={bookingId}
                          currentBusId={assignment.busId}
                          buses={availableBuses}
                          action={swapBus}
                        />
                        <RemoveEntityButton
                          parentId={bookingId}
                          targetId={assignment.busId}
                          action={removeBus}
                          confirmMessage={`Usunąć przypisanie autobusu ${assignment.bus.registrationNumber}?`}
                        />
                      </div>
                    </div>
                    {status && status.issues.length > 0 && (
                      <ul className="list-disc pl-5 text-xs text-muted-foreground">
                        {status.issues.map((issue, i) => (
                          <li key={i}>{issue.message}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          <AssignBusForm bookingId={bookingId} buses={availableBuses} action={assignBus} />
          <AvailableBusesPanel bookingId={bookingId} buses={availableBusOptions} action={assignBus} />
        </CardContent>
      </Card>
    </div>
  );
}
