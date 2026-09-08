import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingOverview } from "@/components/admin/bookings/BookingOverview";
import { BookingAssignments } from "@/components/admin/bookings/BookingAssignments";
import { BookingAssignmentHistoryList } from "@/components/admin/bookings/BookingAssignmentHistoryList";
import { BookingStatusForm } from "@/components/forms/BookingStatusForm";
import { BookingNotesForm } from "@/components/forms/BookingNotesForm";
import { BookingRouteForm } from "@/components/forms/BookingRouteForm";
import { getBooking } from "@/lib/data/bookings";
import { getDrivers } from "@/lib/data/drivers";
import { getBuses } from "@/lib/data/buses";
import { computeDriverAvailability, computeBusAvailability } from "@/lib/availability-engine";
import { getDriverRecommendations } from "@/lib/driver-recommendation";
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

  const inquiryType = booking.sourceInquiry?.type ?? null;
  const lineId = booking.sourceInquiry?.relatedLineId ?? null;

  const [allDrivers, allBuses, driverStatuses, busStatuses, recommendations] = await Promise.all([
    getDrivers(),
    getBuses(),
    computeDriverAvailability({
      startAt: booking.startAt,
      endAt: booking.endAt,
      excludeBookingId: booking.id,
      inquiryType,
    }),
    computeBusAvailability({ startAt: booking.startAt, endAt: booking.endAt, excludeBookingId: booking.id }),
    getDriverRecommendations({
      startAt: booking.startAt,
      endAt: booking.endAt,
      excludeBookingId: booking.id,
      inquiryType,
      lineId,
    }),
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

      <BookingOverview booking={booking} sourceInquiryId={booking.sourceInquiryId} sourceLine={booking.sourceLine} />

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
          driverStatuses={driverStatuses}
          busStatuses={busStatuses}
          recommendations={recommendations}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historia przydziałów</CardTitle>
        </CardHeader>
        <CardContent>
          <BookingAssignmentHistoryList entries={booking.assignmentHistory} />
        </CardContent>
      </Card>

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
