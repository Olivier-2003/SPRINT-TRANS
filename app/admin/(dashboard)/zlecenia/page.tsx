import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookingsTable } from "@/components/admin/bookings/BookingsTable";
import { getBookings } from "@/lib/data/bookings";

export default async function BookingsPage() {
  const bookings = await getBookings();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Zlecenia</h1>
          <p className="text-sm text-muted-foreground">
            Zlecenia utworzone z zaakceptowanych zapytań lub ręcznie w panelu, wraz z przypisanymi
            autobusami i kierowcami.
          </p>
        </div>
        <Button render={<Link href="/admin/zlecenia/nowy" />} nativeButton={false} size="sm">
          Nowe zlecenie
        </Button>
      </div>
      <BookingsTable bookings={bookings} />
    </div>
  );
}
