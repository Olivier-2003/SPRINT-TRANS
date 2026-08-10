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
import { deleteLine } from "@/lib/actions/lines";
import type { RegularLine } from "@/lib/generated/prisma/client";

type LineRow = RegularLine & { _count: { stops: number; schedules: number } };

export function LinesTable({ lines }: { lines: LineRow[] }) {
  if (lines.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Brak linii regularnych. Dodaj pierwszą, klikając „Dodaj linię”.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nazwa</TableHead>
          <TableHead>Trasa</TableHead>
          <TableHead>Przystanki</TableHead>
          <TableHead>Kursy</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Akcje</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lines.map((line) => (
          <TableRow key={line.id}>
            <TableCell className="font-medium">{line.name}</TableCell>
            <TableCell>
              {line.originLabel} → {line.destinationLabel}
            </TableCell>
            <TableCell>{line._count.stops}</TableCell>
            <TableCell>{line._count.schedules}</TableCell>
            <TableCell>
              <Badge variant={line.active ? "default" : "secondary"}>
                {line.active ? "Aktywna" : "Nieaktywna"}
              </Badge>
            </TableCell>
            <TableCell className="flex justify-end gap-1">
              <Button
                render={<Link href={`/admin/linie/${line.id}`} />}
                nativeButton={false}
                variant="ghost"
                size="sm"
              >
                Edytuj
              </Button>
              <ConfirmDeleteForm
                action={deleteLine}
                id={line.id}
                confirmMessage={`Usunąć linię „${line.name}”?`}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
