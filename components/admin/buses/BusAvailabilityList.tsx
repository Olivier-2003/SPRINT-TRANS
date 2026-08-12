import { Badge } from "@/components/ui/badge";
import { RemoveEntityButton } from "@/components/forms/RemoveEntityButton";
import { deleteBusAvailability } from "@/lib/actions/bus-availability";
import { BUS_AVAILABILITY_TYPE_LABELS, BUS_AVAILABILITY_BLOCKING_TYPES } from "@/lib/bus-availability-labels";
import type { BusAvailability } from "@/lib/generated/prisma/client";

export function BusAvailabilityList({ busId, entries }: { busId: string; entries: BusAvailability[] }) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">Brak zarejestrowanych okresów niedostępności.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {entries.map((entry) => (
        <li key={entry.id} className="flex items-center justify-between gap-2 rounded-md border p-2 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={BUS_AVAILABILITY_BLOCKING_TYPES.includes(entry.type) ? "destructive" : "secondary"}>
              {BUS_AVAILABILITY_TYPE_LABELS[entry.type]}
            </Badge>
            <span className="text-muted-foreground">
              {new Date(entry.startAt).toLocaleString("pl-PL")} – {new Date(entry.endAt).toLocaleString("pl-PL")}
            </span>
            {entry.note && <span>{entry.note}</span>}
          </div>
          <RemoveEntityButton
            parentId={busId}
            targetId={entry.id}
            action={deleteBusAvailability}
            confirmMessage="Usunąć ten okres niedostępności?"
          />
        </li>
      ))}
    </ul>
  );
}
