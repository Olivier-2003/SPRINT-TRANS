"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ActionState } from "@/lib/actions/bookings";

interface AssignmentHoursControlProps {
  bookingId: string;
  resourceType: "driver" | "bus";
  resourceId: string;
  plannedHours: number | null;
  action: (
    bookingId: string,
    resourceType: "driver" | "bus",
    resourceId: string,
    data: { plannedHours?: string }
  ) => Promise<ActionState>;
}

/** Wyświetla ręczną liczbę godzin przypisania i pozwala ją edytować bez zdejmowania przypisania. */
export function AssignmentHoursControl({
  bookingId,
  resourceType,
  resourceId,
  plannedHours,
  action,
}: AssignmentHoursControlProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(plannedHours != null ? String(plannedHours) : "");
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    setError(undefined);
    startTransition(async () => {
      const result = await action(bookingId, resourceType, resourceId, { plannedHours: value });
      if (result?.error) setError(result.error);
      else setEditing(false);
    });
  };

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="text-xs text-muted-foreground underline-offset-2 hover:underline"
      >
        {plannedHours != null ? `${plannedHours} godz. (ręcznie)` : "Ustaw liczbę godzin"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Input
        type="number"
        step="0.5"
        min="0"
        className="h-6 w-24 text-xs"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button type="button" size="sm" className="h-6 px-2 text-xs" onClick={handleSubmit} disabled={isPending}>
        OK
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-xs"
        onClick={() => setEditing(false)}
      >
        Anuluj
      </Button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
