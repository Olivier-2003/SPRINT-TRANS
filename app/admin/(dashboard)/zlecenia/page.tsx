import { BookingsTable } from "@/components/admin/bookings/BookingsTable";
import { getBookings } from "@/lib/data/bookings";

export default async function BookingsPage() {
  const bookings = await getBookings();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Zlecenia</h1>
        <p className="text-sm text-muted-foreground">
          Zlecenia utworzone z zaakceptowanych zapytań, wraz z przypisanymi autobusami i kierowcami.
        </p>
      </div>
      <BookingsTable bookings={bookings} />
    </div>
  );
}
