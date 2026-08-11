import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingOverview } from "@/components/admin/bookings/BookingOverview";
import { BookingAssignments } from "@/components/admin/bookings/BookingAssignments";
import { BookingStatusForm } from "@/components/forms/BookingStatusForm";
import { BookingNotesForm } from "@/components/forms/BookingNotesForm";
import { BookingRouteForm } from "@/components/forms/BookingRouteForm";
import { getBooking } from "@/lib/data/bookings";
import { getDrivers } from "@/lib/data/drivers";
import { getBuses } from "@/lib/data/buses";
import { getResourceConflicts } from "@/lib/data/availability";
import {
  updateBookingStatus,
  updateBookingNotes,
  updateBookingRoute,
} from "@/lib/actions/bookings";
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_BADGE_VARIANT } from "@/lib/booking-status";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBooking(id);
  if (!booking) notFound();

  const [allDrivers, allBuses, conflicts] = await Promise.all([
    getDrivers(),
    getBuses(),
    getResourceConflicts(booking.startAt, booking.endAt, booking.id),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Zlecenie: {booking.customerName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Utworzone {new Date(booking.createdAt).toLocaleString("pl-PL")}
            {booking.createdBy?.name ? ` przez ${booking.createdBy.name}` : ""}
          </p>
        </div>
        <Badge variant={BOOKING_STATUS_BADGE_VARIANT[booking.status]}>
          {BOOKING_STATUS_LABELS[booking.status]}
        </Badge>
      </div>

      <BookingStatusForm
        bookingId={booking.id}
        currentStatus={booking.status}
        action={updateBookingStatus}
      />

      <BookingOverview booking={booking} sourceInquiryId={booking.sourceInquiryId} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trasa operacyjna</CardTitle>
        </CardHeader>
        <CardContent>
          <BookingRouteForm
            bookingId={booking.id}
            routePoints={booking.routePoints}
            action={updateBookingRoute}
          />
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-base font-semibold">Przypisania</h2>
        <BookingAssignments
          bookingId={booking.id}
          assignedDrivers={booking.drivers}
          assignedBuses={booking.buses}
          allDrivers={allDrivers}
          allBuses={allBuses}
          busyDriverIds={conflicts.busyDriverIds}
          busyBusIds={conflicts.busyBusIds}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notatki wewnętrzne</CardTitle>
        </CardHeader>
        <CardContent>
          <BookingNotesForm
            bookingId={booking.id}
            defaultNotes={booking.notes ?? ""}
            action={updateBookingNotes}
          />
        </CardContent>
      </Card>
    </div>
  );
}
