import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingScheduleForm } from "@/components/forms/BookingScheduleForm";
import { updateBookingSchedule } from "@/lib/actions/bookings";
import type { Booking } from "@/lib/generated/prisma/client";

interface BookingOverviewProps {
  booking: Booking;
  sourceInquiryId: string;
}

export function BookingOverview({ booking, sourceInquiryId }: BookingOverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dane klienta</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm">
          <div>
            <span className="text-muted-foreground">Imię i nazwisko: </span>
            {booking.customerName}
          </div>
          <div>
            <span className="text-muted-foreground">Telefon: </span>
            {booking.customerPhone}
          </div>
          <div>
            <span className="text-muted-foreground">E-mail: </span>
            {booking.customerEmail}
          </div>
          <div>
            <span className="text-muted-foreground">Cena końcowa: </span>
            <span className="font-medium">{Number(booking.finalPrice).toFixed(2)} zł</span>
          </div>
          <div className="pt-2">
            <Link
              href={`/admin/zapytania/${sourceInquiryId}`}
              className="underline underline-offset-2"
            >
              Zobacz pierwotne zapytanie i historię wycen
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Termin realizacji</CardTitle>
        </CardHeader>
        <CardContent>
          <BookingScheduleForm
            bookingId={booking.id}
            startAt={booking.startAt}
            endAt={booking.endAt}
            action={updateBookingSchedule}
          />
        </CardContent>
      </Card>
    </div>
  );
}
