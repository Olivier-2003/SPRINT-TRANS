"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assignBusSchema, type AssignBusInput } from "@/lib/validation/booking-admin";
import type { ActionState } from "@/lib/actions/bookings";

interface BusOption {
  id: string;
  label: string;
  statusLabel: string | null;
}

interface AssignBusFormProps {
  bookingId: string;
  buses: BusOption[];
  action: (bookingId: string, data: AssignBusInput) => Promise<ActionState>;
}

export function AssignBusForm({ bookingId, buses, action }: AssignBusFormProps) {
  const [serverError, setServerError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssignBusInput>({
    resolver: zodResolver(assignBusSchema),
    defaultValues: { busId: "" },
  });

  const onSubmit = (data: AssignBusInput) => {
    setServerError(undefined);
    startTransition(async () => {
      const result = await action(bookingId, data);
      if (result?.error) setServerError(result.error);
      else reset({ busId: "" });
    });
  };

  if (buses.length === 0) {
    return <p className="text-sm text-muted-foreground">Brak autobusów dostępnych do przypisania.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-start gap-2">
      <div className="flex flex-col gap-1">
        <Controller
          control={control}
          name="busId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={(value) => value && field.onChange(value)}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Wybierz autobus" />
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
          )}
        />
        {errors.busId && <p className="text-sm text-destructive">{errors.busId.message}</p>}
      </div>
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Przypisywanie…" : "Przypisz autobus"}
      </Button>
      {serverError && <p className="w-full text-sm text-destructive">{serverError}</p>}
    </form>
  );
}
