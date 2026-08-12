import { Badge } from "@/components/ui/badge";
import { RemoveEntityButton } from "@/components/forms/RemoveEntityButton";
import { removeDriverLineAssignment } from "@/lib/actions/driver-line-assignments";
import { DRIVER_LINE_ROLE_LABELS } from "@/lib/driver-line-role";
import type { DriverLineAssignment, RegularLine } from "@/lib/generated/prisma/client";

type Assignment = DriverLineAssignment & { line: Pick<RegularLine, "id" | "name"> };

export function DriverLineAssignmentList({
  driverId,
  assignments,
}: {
  driverId: string;
  assignments: Assignment[];
}) {
  if (assignments.length === 0) {
    return <p className="text-sm text-muted-foreground">Kierowca nie jest przypisany do żadnej linii.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {assignments.map((assignment) => (
        <li key={assignment.id} className="flex items-center justify-between gap-2 rounded-md border p-2 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">{assignment.line.name}</span>
            <Badge variant="outline">{DRIVER_LINE_ROLE_LABELS[assignment.role]}</Badge>
            {assignment.note && <span className="text-muted-foreground">{assignment.note}</span>}
          </div>
          <RemoveEntityButton
            parentId={driverId}
            targetId={assignment.lineId}
            action={removeDriverLineAssignment}
            confirmMessage={`Usunąć przypisanie do linii "${assignment.line.name}"?`}
          />
        </li>
      ))}
    </ul>
  );
}
