"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SwapBusInput } from "@/lib/validation/booking-admin";
import type { ActionState } from "@/lib/actions/bookings";

interface BusOption {
  id: string;
  label: string;
  statusLabel: string | null;
}

interface SwapBusControlProps {
  bookingId: string;
  currentBusId: string;
  buses: BusOption[];
  action: (bookingId: string, oldBusId: string, data: SwapBusInput) => Promise<ActionState>;
}

export function SwapBusControl({ bookingId, currentBusId, buses, action }: SwapBusControlProps) {
  const [expanded, setExpanded] = useState(false);
  const [newBusId, setNewBusId] = useState("");
  const [plannedHours, setPlannedHours] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!newBusId) {
      setError("Wybierz nowy autobus.");
      return;
    }
    setError(undefined);
    startTransition(async () => {
      const result = await action(bookingId, currentBusId, { newBusId, plannedHours });
      if (result?.error) setError(result.error);
      else setExpanded(false);
    });
  };

  if (buses.length === 0) return null;

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
        <Select value={newBusId} onValueChange={(v) => v && setNewBusId(v)}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Nowy autobus" />
          </SelectTrigger>
          <SelectContent>
            {buses.map((bus) => (
              <SelectItem key={bus.id} value={bus.id}>
                {bus.label}
                {bus.statusLabel ? ` — ${bus.statusLabel}` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          step="0.5"
          min="0"
          placeholder="Godziny (opcjonalnie)"
          className="w-36"
          value={plannedHours}
          onChange={(e) => setPlannedHours(e.target.value)}
        />
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
