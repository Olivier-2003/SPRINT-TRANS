"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bookingScheduleSchema, type BookingScheduleInput } from "@/lib/validation/booking-admin";
import type { ActionState } from "@/lib/actions/bookings";

function toDateTimeLocal(date: Date): string {
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface BookingScheduleFormProps {
  bookingId: string;
  startAt: Date;
  endAt: Date;
  action: (bookingId: string, data: BookingScheduleInput) => Promise<ActionState>;
}

export function BookingScheduleForm({ bookingId, startAt, endAt, action }: BookingScheduleFormProps) {
  const [serverError, setServerError] = useState<string | undefined>();
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingScheduleInput>({
    resolver: zodResolver(bookingScheduleSchema),
    defaultValues: {
      startAt: toDateTimeLocal(startAt),
      endAt: toDateTimeLocal(endAt),
    },
  });

  const onSubmit = (data: BookingScheduleInput) => {
    setServerError(undefined);
    setSaved(false);
    startTransition(async () => {
      const result = await action(bookingId, data);
      if (result?.error) setServerError(result.error);
      if (result?.success) setSaved(true);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="startAt">Wyjazd</Label>
          <Input id="startAt" type="datetime-local" {...register("startAt")} />
          {errors.startAt && <p className="text-sm text-destructive">{errors.startAt.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="endAt">Powrót</Label>
          <Input id="endAt" type="datetime-local" {...register("endAt")} />
          {errors.endAt && <p className="text-sm text-destructive">{errors.endAt.message}</p>}
        </div>
      </div>
      {serverError && <p className="text-sm text-destructive">{serverError}</p>}
      {saved && <p className="text-sm text-primary">Termin zaktualizowany.</p>}
      <div>
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Zapisywanie…" : "Zapisz termin"}
        </Button>
      </div>
    </form>
  );
}
