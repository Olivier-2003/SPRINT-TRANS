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
import { ConfirmDeleteForm } from "@/components/forms/ConfirmDeleteForm";
import { deleteTrip } from "@/lib/actions/trips";
import type { Trip } from "@/lib/generated/prisma/client";

export function TripsTable({ trips }: { trips: Trip[] }) {
  if (trips.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Brak wycieczek. Dodaj pierwszą, klikając „Dodaj wycieczkę”.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tytuł</TableHead>
          <TableHead>Cena</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Akcje</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trips.map((trip) => (
          <TableRow key={trip.id}>
            <TableCell className="font-medium">{trip.title}</TableCell>
            <TableCell>{trip.priceInfo ?? "—"}</TableCell>
            <TableCell>
              <Badge variant={trip.active ? "default" : "secondary"}>
                {trip.active ? "Aktywna" : "Nieaktywna"}
              </Badge>
            </TableCell>
            <TableCell className="flex justify-end gap-1">
              <Button
                render={<Link href={`/admin/wycieczki/${trip.id}`} />}
                nativeButton={false}
                variant="ghost"
                size="sm"
              >
                Edytuj
              </Button>
              <ConfirmDeleteForm
                action={deleteTrip}
                id={trip.id}
                confirmMessage={`Usunąć wycieczkę „${trip.title}”?`}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
