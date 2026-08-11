"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  calculatorSettingsSchema,
  type CalculatorSettingsInput,
  calculatorSettingsDefaultValues,
} from "@/lib/validation/calculator-settings";
import type { CalculatorSettingsFormState } from "@/lib/actions/calculator-settings";

interface CalculatorSettingsFormProps {
  action: (data: CalculatorSettingsInput) => Promise<CalculatorSettingsFormState>;
  defaultValues?: CalculatorSettingsInput;
}

export function CalculatorSettingsForm({
  action,
  defaultValues = calculatorSettingsDefaultValues,
}: CalculatorSettingsFormProps) {
  const [serverError, setServerError] = useState<string | undefined>();
  const [savedAt, setSavedAt] = useState<number | undefined>();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CalculatorSettingsInput>({
    resolver: zodResolver(calculatorSettingsSchema),
    defaultValues,
  });

  const onSubmit = (data: CalculatorSettingsInput) => {
    setServerError(undefined);
    setSavedAt(undefined);
    startTransition(async () => {
      const result = await action(data);
      if (result?.error) setServerError(result.error);
      if (result?.success) setSavedAt(Date.now());
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="ratePerKm">Stawka za kilometr (PLN)</Label>
          <Input id="ratePerKm" type="number" step="0.01" {...register("ratePerKm")} />
          {errors.ratePerKm && (
            <p className="text-sm text-destructive">{errors.ratePerKm.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="baseFee">Opłata bazowa (PLN)</Label>
          <Input id="baseFee" type="number" step="0.01" {...register("baseFee")} />
          {errors.baseFee && <p className="text-sm text-destructive">{errors.baseFee.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="hourlyWaitingRate">Stawka za godzinę postoju (PLN)</Label>
          <Input
            id="hourlyWaitingRate"
            type="number"
            step="0.01"
            {...register("hourlyWaitingRate")}
          />
          {errors.hourlyWaitingRate && (
            <p className="text-sm text-destructive">{errors.hourlyWaitingRate.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="driverOvernightRate">Koszt noclegu kierowcy za noc (PLN)</Label>
          <Input
            id="driverOvernightRate"
            type="number"
            step="0.01"
            {...register("driverOvernightRate")}
          />
          {errors.driverOvernightRate && (
            <p className="text-sm text-destructive">{errors.driverOvernightRate.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:w-1/2 sm:pr-2">
        <Label htmlFor="averageSpeedKmh">Założona średnia prędkość (km/h)</Label>
        <Input id="averageSpeedKmh" type="number" step="1" {...register("averageSpeedKmh")} />
        {errors.averageSpeedKmh && (
          <p className="text-sm text-destructive">{errors.averageSpeedKmh.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Używana wyłącznie do orientacyjnego oszacowania czasu jazdy (i pośrednio czasu postoju)
          w automatycznej wycenie.
        </p>
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}
      {savedAt && <p className="text-sm text-primary">Zapisano nowe stawki.</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Zapisywanie…" : "Zapisz stawki"}
        </Button>
      </div>
    </form>
  );
}
