"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OVERALL_STATUS_LABELS, OVERALL_STATUS_BADGE_VARIANT } from "@/lib/availability-status-labels";
import type { BusAvailabilityResult } from "@/lib/availability-engine";
import type { AssignBusInput } from "@/lib/validation/booking-admin";
import type { ActionState } from "@/lib/actions/bookings";

export interface BusOption {
  id: string;
  label: string;
  result: BusAvailabilityResult;
}

interface AvailableBusesPanelProps {
  bookingId: string;
  buses: BusOption[];
  action: (bookingId: string, data: AssignBusInput) => Promise<ActionState>;
}

function AssignRowButton({
  bookingId,
  busId,
  action,
  hasIssues,
}: {
  bookingId: string;
  busId: string;
  action: AvailableBusesPanelProps["action"];
  hasIssues: boolean;
}) {
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (hasIssues && !window.confirm("Ten autobus ma zgłoszone ostrzeżenia dostępności. Przypisać mimo to?")) {
      return;
    }
    setError(undefined);
    startTransition(async () => {
      const result = await action(bookingId, { busId });
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Button type="button" size="sm" onClick={handleClick} disabled={isPending}>
        {isPending ? "Przypisywanie…" : "Przypisz"}
      </Button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}

export function AvailableBusesPanel({ bookingId, buses, action }: AvailableBusesPanelProps) {
  const [expanded, setExpanded] = useState(false);

  const sorted = [...buses].sort((a, b) => {
    const order = { DOSTEPNY: 0, OSTRZEZENIE: 1, KONFLIKT: 2 };
    return order[a.result.status] - order[b.result.status] || a.label.localeCompare(b.label, "pl");
  });

  return (
    <div className="flex flex-col gap-3">
      <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => setExpanded((v) => !v)}>
        {expanded ? "Ukryj proponowaną obsadę — autobusy" : "Proponowana obsada — autobusy"}
      </Button>
      {expanded && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">
            Ranking wyłącznie sugeruje kolejność kandydatów — ostateczny przydział zawsze zatwierdza administrator.
          </p>
          {sorted.length === 0 ? (
            <p className="text-sm text-muted-foreground">Brak autobusów do zaproponowania.</p>
          ) : (
            sorted.map((bus) => (
              <div key={bus.id} className="flex flex-col gap-2 rounded-md border p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{bus.label}</span>
                    <Badge variant={OVERALL_STATUS_BADGE_VARIANT[bus.result.status]}>
                      {OVERALL_STATUS_LABELS[bus.result.status]}
                    </Badge>
                  </div>
                  <AssignRowButton
                    bookingId={bookingId}
                    busId={bus.id}
                    action={action}
                    hasIssues={bus.result.issues.length > 0}
                  />
                </div>
                {bus.result.issues.length > 0 && (
                  <ul className="list-disc pl-5 text-xs text-destructive">
                    {bus.result.issues.map((issue, i) => (
                      <li key={i}>{issue.message}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
