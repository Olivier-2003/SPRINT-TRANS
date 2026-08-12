import { Badge } from "@/components/ui/badge";
import { RemoveEntityButton } from "@/components/forms/RemoveEntityButton";
import { deleteDriverAvailability } from "@/lib/actions/driver-availability";
import { DRIVER_AVAILABILITY_TYPE_LABELS, DRIVER_AVAILABILITY_BLOCKING_TYPES } from "@/lib/driver-availability-labels";
import type { DriverAvailability } from "@/lib/generated/prisma/client";

export function DriverAvailabilityList({
  driverId,
  entries,
}: {
  driverId: string;
  entries: DriverAvailability[];
}) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">Brak zarejestrowanych okresów niedostępności.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {entries.map((entry) => (
        <li key={entry.id} className="flex items-center justify-between gap-2 rounded-md border p-2 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={DRIVER_AVAILABILITY_BLOCKING_TYPES.includes(entry.type) ? "destructive" : "secondary"}>
              {DRIVER_AVAILABILITY_TYPE_LABELS[entry.type]}
            </Badge>
            <span className="text-muted-foreground">
              {new Date(entry.startAt).toLocaleString("pl-PL")} – {new Date(entry.endAt).toLocaleString("pl-PL")}
            </span>
            {entry.note && <span>{entry.note}</span>}
          </div>
          <RemoveEntityButton
            parentId={driverId}
            targetId={entry.id}
            action={deleteDriverAvailability}
            confirmMessage="Usunąć ten okres niedostępności?"
          />
        </li>
      ))}
    </ul>
  );
}
