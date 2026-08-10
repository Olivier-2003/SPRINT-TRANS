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
import { deleteBus } from "@/lib/actions/buses";
import type { Bus } from "@/lib/generated/prisma/client";

const STATUS_LABEL: Record<Bus["status"], string> = {
  ACTIVE: "Aktywny",
  SERVICE: "W serwisie",
  INACTIVE: "Nieaktywny",
};

const STATUS_VARIANT: Record<Bus["status"], "default" | "secondary" | "outline"> = {
  ACTIVE: "default",
  SERVICE: "outline",
  INACTIVE: "secondary",
};

export function BusesTable({ buses }: { buses: Bus[] }) {
  if (buses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Brak autobusów. Dodaj pierwszy, klikając „Dodaj autobus”.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nr rejestracyjny</TableHead>
          <TableHead>Marka i model</TableHead>
          <TableHead>Miejsca</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Akcje</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {buses.map((bus) => (
          <TableRow key={bus.id}>
            <TableCell className="font-medium">{bus.registrationNumber}</TableCell>
            <TableCell>{bus.brandModel}</TableCell>
            <TableCell>{bus.seats}</TableCell>
            <TableCell>
              <Badge variant={STATUS_VARIANT[bus.status]}>{STATUS_LABEL[bus.status]}</Badge>
            </TableCell>
            <TableCell className="flex justify-end gap-1">
              <Button
                render={<Link href={`/admin/autobusy/${bus.id}`} />}
                nativeButton={false}
                variant="ghost"
                size="sm"
              >
                Edytuj
              </Button>
              <ConfirmDeleteForm
                action={deleteBus}
                id={bus.id}
                confirmMessage={`Usunąć autobus ${bus.registrationNumber}?`}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
