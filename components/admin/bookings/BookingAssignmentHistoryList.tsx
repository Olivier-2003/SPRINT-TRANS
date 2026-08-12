import { Badge } from "@/components/ui/badge";
import {
  ASSIGNMENT_RESOURCE_TYPE_LABELS,
  ASSIGNMENT_CHANGE_TYPE_LABELS,
} from "@/lib/booking-assignment-history-labels";
import type {
  BookingAssignmentHistory,
  AdminUser,
  AssignmentChangeType,
} from "@/lib/generated/prisma/client";

const CHANGE_BADGE_VARIANT: Record<AssignmentChangeType, "default" | "secondary" | "outline" | "destructive"> = {
  PRZYPISANO: "default",
  ZMIENIONO: "secondary",
  USUNIETO: "destructive",
};

type HistoryEntry = BookingAssignmentHistory & { changedBy: Pick<AdminUser, "name"> | null };

export function BookingAssignmentHistoryList({ entries }: { entries: HistoryEntry[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">Brak zmian obsady tego zlecenia.</p>;
  }

  return (
    <ol className="flex flex-col gap-2">
      {entries.map((entry) => (
        <li key={entry.id} className="flex flex-wrap items-center gap-2 rounded-md border p-2 text-sm">
          <Badge variant={CHANGE_BADGE_VARIANT[entry.changeType]}>
            {ASSIGNMENT_CHANGE_TYPE_LABELS[entry.changeType]}
          </Badge>
          <span className="text-muted-foreground">{ASSIGNMENT_RESOURCE_TYPE_LABELS[entry.resourceType]}:</span>
          <span className="font-medium">{entry.resourceLabel}</span>
          {entry.note && <span className="text-muted-foreground">— {entry.note}</span>}
          <span className="ml-auto text-xs text-muted-foreground">
            {entry.changedBy?.name ?? "System"} · {new Date(entry.changedAt).toLocaleString("pl-PL")}
          </span>
        </li>
      ))}
    </ol>
  );
}
