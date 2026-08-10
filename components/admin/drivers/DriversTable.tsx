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
import { deleteDriver } from "@/lib/actions/drivers";
import type { Driver } from "@/lib/generated/prisma/client";

const STATUS_LABEL: Record<Driver["employmentStatus"], string> = {
  ACTIVE: "Aktywny",
  INACTIVE: "Nieaktywny",
};

export function DriversTable({ drivers }: { drivers: Driver[] }) {
  if (drivers.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Brak kierowców. Dodaj pierwszego, klikając „Dodaj kierowcę”.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Imię i nazwisko</TableHead>
          <TableHead>Telefon</TableHead>
          <TableHead>Kategorie</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Akcje</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {drivers.map((driver) => (
          <TableRow key={driver.id}>
            <TableCell className="font-medium">
              {driver.firstName} {driver.lastName}
            </TableCell>
            <TableCell>{driver.phone}</TableCell>
            <TableCell>{driver.licenseCategories}</TableCell>
            <TableCell>
              <Badge variant={driver.employmentStatus === "ACTIVE" ? "default" : "secondary"}>
                {STATUS_LABEL[driver.employmentStatus]}
              </Badge>
            </TableCell>
            <TableCell className="flex justify-end gap-1">
              <Button
                render={<Link href={`/admin/kierowcy/${driver.id}`} />}
                nativeButton={false}
                variant="ghost"
                size="sm"
              >
                Edytuj
              </Button>
              <ConfirmDeleteForm
                action={deleteDriver}
                id={driver.id}
                confirmMessage={`Usunąć kierowcę ${driver.firstName} ${driver.lastName}?`}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
