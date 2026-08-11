import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_BADGE_VARIANT } from "@/lib/booking-status";
import type { Booking, BookingDriver, BookingBus, Driver, Bus } from "@/lib/generated/prisma/client";

type BookingRow = Booking & {
  drivers: (BookingDriver & { driver: Pick<Driver, "firstName" | "lastName"> })[];
  buses: (BookingBus & { bus: Pick<Bus, "registrationNumber" | "brandModel"> })[];
};

export function BookingsTable({ bookings }: { bookings: BookingRow[] }) {
  if (bookings.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Brak zleceń. Zlecenia powstają po akceptacji zapytania w jego szczegółach.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Wyjazd</TableHead>
          <TableHead>Powrót</TableHead>
          <TableHead>Klient</TableHead>
          <TableHead>Cena</TableHead>
          <TableHead>Autobusy / kierowcy</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Akcje</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell className="whitespace-nowrap text-sm">
              {new Date(booking.startAt).toLocaleString("pl-PL")}
            </TableCell>
            <TableCell className="whitespace-nowrap text-sm">
              {new Date(booking.endAt).toLocaleString("pl-PL")}
            </TableCell>
            <TableCell className="font-medium">{booking.customerName}</TableCell>
            <TableCell>{Number(booking.finalPrice).toFixed(2)} zł</TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {booking.buses.length === 0 && booking.drivers.length === 0
                ? "brak przypisań"
                : `${booking.buses.length} / ${booking.drivers.length}`}
            </TableCell>
            <TableCell>
              <Badge variant={BOOKING_STATUS_BADGE_VARIANT[booking.status]}>
                {BOOKING_STATUS_LABELS[booking.status]}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button
                render={<Link href={`/admin/zlecenia/${booking.id}`} />}
                nativeButton={false}
                variant="ghost"
                size="sm"
              >
                Szczegóły
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
