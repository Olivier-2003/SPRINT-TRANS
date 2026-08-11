"use client";

import { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BOOKING_STATUSES, BOOKING_STATUS_LABELS } from "@/lib/booking-status";
import type { BookingStatus } from "@/lib/generated/prisma/client";
import type { BookingStatusInput } from "@/lib/validation/inquiry-admin";

type ActionState = { error?: string; success?: boolean } | undefined;

interface BookingStatusFormProps {
  bookingId: string;
  currentStatus: BookingStatus;
  action: (id: string, data: BookingStatusInput) => Promise<ActionState>;
}

export function BookingStatusForm({ bookingId, currentStatus, action }: BookingStatusFormProps) {
  const [status, setStatus] = useState<BookingStatus>(currentStatus);
  const [error, setError] = useState<string | undefined>();
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onSave = () => {
    setError(undefined);
    setSaved(false);
    startTransition(async () => {
      const result = await action(bookingId, { status });
      if (result?.error) setError(result.error);
      if (result?.success) setSaved(true);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Select
          value={status}
          onValueChange={(value) => {
            if (value) setStatus(value as BookingStatus);
          }}
        >
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BOOKING_STATUSES.map((value) => (
              <SelectItem key={value} value={value}>
                {BOOKING_STATUS_LABELS[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" size="sm" onClick={onSave} disabled={isPending || status === currentStatus}>
          {isPending ? "Zapisywanie…" : "Zmień status"}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {saved && <p className="text-sm text-primary">Status zaktualizowany.</p>}
    </div>
  );
}
