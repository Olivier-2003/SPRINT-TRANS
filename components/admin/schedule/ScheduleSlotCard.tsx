"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SLOT_STATUS_LABELS, SLOT_STATUS_BADGE_VARIANT } from "@/lib/schedule-status-labels";
import type { ScheduleBookingSlot, SlotStatus } from "@/lib/schedule-proposal";

function formatDateTime(date: Date): string {
  return date.toLocaleString("pl-PL", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

interface ScheduleSlotCardProps {
  slot: ScheduleBookingSlot;
  effectiveDriverId: string | null;
  effectiveDriverStatus: SlotStatus;
  effectiveDriverReason: string;
  effectiveBusId: string | null;
  effectiveBusStatus: SlotStatus;
  effectiveBusReason: string;
  onDriverChange: (driverId: string | null) => void;
  onBusChange: (busId: string | null) => void;
}

export function ScheduleSlotCard({
  slot,
  effectiveDriverId,
  effectiveDriverStatus,
  effectiveDriverReason,
  effectiveBusId,
  effectiveBusStatus,
  effectiveBusReason,
  onDriverChange,
  onBusChange,
}: ScheduleSlotCardProps) {
  // Dla zleceń zachowanych bez zmian silnik nie dołącza pełnej listy `alternatives`
  // (celowo, żeby uniknąć zbędnych zapytań) — dlatego etykieta obecnie wybranej
  // pozycji jest dodatkowo zasilana z samej propozycji/obecnego przydziału, żeby
  // select nigdy nie pokazał surowego id zamiast nazwy.
  const driverLabelById = new Map(slot.driverProposal.alternatives.map((alt) => [alt.driverId, alt.driverName]));
  if (slot.driverProposal.driverId && slot.driverProposal.driverName) {
    driverLabelById.set(slot.driverProposal.driverId, slot.driverProposal.driverName);
  }
  if (slot.currentDriverId && slot.currentDriverNames.length > 0) {
    driverLabelById.set(slot.currentDriverId, slot.currentDriverNames.join(", "));
  }

  const busLabelById = new Map(slot.busProposal.alternatives.map((alt) => [alt.busId, alt.label]));
  if (slot.busProposal.busId && slot.busProposal.busLabel) {
    busLabelById.set(slot.busProposal.busId, slot.busProposal.busLabel);
  }
  if (slot.currentBusId && slot.currentBusLabels.length > 0) {
    busLabelById.set(slot.currentBusId, slot.currentBusLabels.join(", "));
  }

  return (
    <div className="flex flex-col gap-3 rounded-md border p-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{slot.customerName}</span>
          <span className="text-xs text-muted-foreground">
            {formatDateTime(slot.startAt)} – {formatDateTime(slot.endAt)}
          </span>
          {slot.lineName && <Badge variant="outline">{slot.lineName}</Badge>}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-muted-foreground">Kierowca</span>
            <Badge variant={SLOT_STATUS_BADGE_VARIANT[effectiveDriverStatus]}>
              {SLOT_STATUS_LABELS[effectiveDriverStatus]}
            </Badge>
          </div>
          <Select
            value={effectiveDriverId ?? "NONE"}
            onValueChange={(v) => {
              if (!v) return;
              onDriverChange(v === "NONE" ? null : v);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {(value: string) => (value === "NONE" ? "— Pozostaw bez obsady —" : driverLabelById.get(value) ?? value)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NONE">— Pozostaw bez obsady —</SelectItem>
              {slot.driverProposal.alternatives.map((alt) => (
                <SelectItem key={alt.driverId} value={alt.driverId}>
                  {alt.driverName}
                  {alt.status !== "DOSTEPNY" ? ` — ${alt.status === "OSTRZEZENIE" ? "ostrzeżenie" : "konflikt"}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">{effectiveDriverReason}</p>
          {slot.currentDriverNames.length > 0 && (
            <p className="text-xs text-muted-foreground">Obecnie: {slot.currentDriverNames.join(", ")}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-muted-foreground">Autobus</span>
            <Badge variant={SLOT_STATUS_BADGE_VARIANT[effectiveBusStatus]}>
              {SLOT_STATUS_LABELS[effectiveBusStatus]}
            </Badge>
          </div>
          <Select
            value={effectiveBusId ?? "NONE"}
            onValueChange={(v) => {
              if (!v) return;
              onBusChange(v === "NONE" ? null : v);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {(value: string) => (value === "NONE" ? "— Pozostaw bez obsady —" : busLabelById.get(value) ?? value)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NONE">— Pozostaw bez obsady —</SelectItem>
              {slot.busProposal.alternatives.map((alt) => (
                <SelectItem key={alt.busId} value={alt.busId}>
                  {alt.label}
                  {alt.status !== "DOSTEPNY" ? ` — ${alt.status === "OSTRZEZENIE" ? "ostrzeżenie" : "konflikt"}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">{effectiveBusReason}</p>
          {slot.currentBusLabels.length > 0 && (
            <p className="text-xs text-muted-foreground">Obecnie: {slot.currentBusLabels.join(", ")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
