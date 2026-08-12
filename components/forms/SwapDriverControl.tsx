"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SwapDriverInput } from "@/lib/validation/booking-admin";
import type { ActionState } from "@/lib/actions/bookings";

interface DriverOption {
  id: string;
  label: string;
  statusLabel: string | null;
}

interface SwapDriverControlProps {
  bookingId: string;
  currentDriverId: string;
  currentRole: string | null;
  drivers: DriverOption[];
  action: (bookingId: string, oldDriverId: string, data: SwapDriverInput) => Promise<ActionState>;
}

export function SwapDriverControl({
  bookingId,
  currentDriverId,
  currentRole,
  drivers,
  action,
}: SwapDriverControlProps) {
  const [expanded, setExpanded] = useState(false);
  const [newDriverId, setNewDriverId] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!newDriverId) {
      setError("Wybierz nowego kierowcę.");
      return;
    }
    setError(undefined);
    startTransition(async () => {
      const result = await action(bookingId, currentDriverId, {
        newDriverId,
        roleOnTrip: (currentRole as SwapDriverInput["roleOnTrip"]) ?? "",
      });
      if (result?.error) setError(result.error);
      else setExpanded(false);
    });
  };

  if (drivers.length === 0) return null;

  if (!expanded) {
    return (
      <Button type="button" variant="ghost" size="sm" onClick={() => setExpanded(true)}>
        Zmień
      </Button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <Select value={newDriverId} onValueChange={(v) => v && setNewDriverId(v)}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Nowy kierowca" />
          </SelectTrigger>
          <SelectContent>
            {drivers.map((driver) => (
              <SelectItem key={driver.id} value={driver.id}>
                {driver.label}
                {driver.statusLabel ? ` — ${driver.statusLabel}` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" size="sm" onClick={handleSubmit} disabled={isPending}>
          {isPending ? "Zmiana…" : "Zatwierdź"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setExpanded(false)}>
          Anuluj
        </Button>
      </div>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
