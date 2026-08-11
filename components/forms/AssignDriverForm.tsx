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
import { assignDriverSchema, type AssignDriverInput } from "@/lib/validation/booking-admin";
import type { ActionState } from "@/lib/actions/bookings";

const ROLE_OPTIONS: { value: string; label: string }[] = [
  { value: "NONE", label: "Bez określonej roli" },
  { value: "GLOWNY", label: "Kierowca główny" },
  { value: "POMOCNICZY", label: "Kierowca pomocniczy" },
];

interface DriverOption {
  id: string;
  label: string;
  busy: boolean;
}

interface AssignDriverFormProps {
  bookingId: string;
  drivers: DriverOption[];
  action: (bookingId: string, data: AssignDriverInput) => Promise<ActionState>;
}

export function AssignDriverForm({ bookingId, drivers, action }: AssignDriverFormProps) {
  const [serverError, setServerError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssignDriverInput>({
    resolver: zodResolver(assignDriverSchema),
    defaultValues: { driverId: "", roleOnTrip: "" },
  });

  const onSubmit = (data: AssignDriverInput) => {
    setServerError(undefined);
    startTransition(async () => {
      const result = await action(bookingId, data);
      if (result?.error) setServerError(result.error);
      else reset({ driverId: "", roleOnTrip: "" });
    });
  };

  if (drivers.length === 0) {
    return <p className="text-sm text-muted-foreground">Brak kierowców dostępnych do przypisania.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-start gap-2">
      <div className="flex flex-col gap-1">
        <Controller
          control={control}
          name="driverId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={(value) => value && field.onChange(value)}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Wybierz kierowcę" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>
                    {driver.label}
                    {driver.busy ? " — zajęty w tym terminie" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.driverId && <p className="text-sm text-destructive">{errors.driverId.message}</p>}
      </div>
      <Controller
        control={control}
        name="roleOnTrip"
        render={({ field }) => (
          <Select
            value={field.value || "NONE"}
            onValueChange={(value) => {
              if (!value) return;
              field.onChange(value === "NONE" ? "" : value);
            }}
          >
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Przypisywanie…" : "Przypisz kierowcę"}
      </Button>
      {serverError && <p className="w-full text-sm text-destructive">{serverError}</p>}
    </form>
  );
}
