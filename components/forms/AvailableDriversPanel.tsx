"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OVERALL_STATUS_LABELS, OVERALL_STATUS_BADGE_VARIANT } from "@/lib/availability-status-labels";
import { DRIVER_LINE_ROLE_LABELS } from "@/lib/driver-line-role";
import type { DriverRecommendation } from "@/lib/driver-recommendation";
import type { AssignDriverInput } from "@/lib/validation/booking-admin";
import type { ActionState } from "@/lib/actions/bookings";

interface AvailableDriversPanelProps {
  bookingId: string;
  recommendations: DriverRecommendation[];
  action: (bookingId: string, data: AssignDriverInput) => Promise<ActionState>;
}

function AssignRowButton({
  bookingId,
  driverId,
  action,
  hasWarnings,
}: {
  bookingId: string;
  driverId: string;
  action: AvailableDriversPanelProps["action"];
  hasWarnings: boolean;
}) {
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (hasWarnings && !window.confirm("Ten kierowca ma ostrzeżenia dostępności. Przypisać mimo to?")) {
      return;
    }
    setError(undefined);
    startTransition(async () => {
      const result = await action(bookingId, { driverId, roleOnTrip: "" });
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

export function AvailableDriversPanel({ bookingId, recommendations, action }: AvailableDriversPanelProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => setExpanded((v) => !v)}>
        {expanded ? "Ukryj proponowaną obsadę — kierowcy" : "Proponowana obsada — kierowcy"}
      </Button>
      {expanded && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">
            Ranking wyłącznie sugeruje kolejność kandydatów — ostateczny przydział zawsze zatwierdza administrator.
          </p>
          {recommendations.length === 0 ? (
            <p className="text-sm text-muted-foreground">Brak aktywnych kierowców do zaproponowania.</p>
          ) : (
            recommendations.map((rec) => (
              <div key={rec.driverId} className="flex flex-col gap-2 rounded-md border p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{rec.driverName}</span>
                    <Badge variant={OVERALL_STATUS_BADGE_VARIANT[rec.status]}>
                      {OVERALL_STATUS_LABELS[rec.status]}
                    </Badge>
                    {rec.lineRole && <Badge variant="outline">{DRIVER_LINE_ROLE_LABELS[rec.lineRole]}</Badge>}
                    <span className="text-xs text-muted-foreground">
                      Kategorie: {rec.licenseCategories} · {rec.monthlyHours.toFixed(1)} h w tym miesiącu
                    </span>
                  </div>
                  <AssignRowButton
                    bookingId={bookingId}
                    driverId={rec.driverId}
                    action={action}
                    hasWarnings={rec.issues.length > 0}
                  />
                </div>
                {rec.reasons.length > 0 && (
                  <ul className="list-disc pl-5 text-xs text-muted-foreground">
                    {rec.reasons.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))}
                  </ul>
                )}
                {rec.issues.length > 0 && (
                  <ul className="list-disc pl-5 text-xs text-destructive">
                    {rec.issues.map((issue, i) => (
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
