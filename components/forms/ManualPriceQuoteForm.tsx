"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { manualPriceQuoteSchema, type ManualPriceQuoteInput } from "@/lib/validation/inquiry-admin";
import type { ActionState } from "@/lib/actions/inquiries";

interface ManualPriceQuoteFormProps {
  inquiryId: string;
  action: (id: string, data: ManualPriceQuoteInput) => Promise<ActionState>;
  defaultValues: ManualPriceQuoteInput;
  rates: {
    ratePerKm: number;
    baseFee: number;
    hourlyWaitingRate: number;
    driverOvernightRate: number;
  };
}

export function ManualPriceQuoteForm({
  inquiryId,
  action,
  defaultValues,
  rates,
}: ManualPriceQuoteFormProps) {
  const [serverError, setServerError] = useState<string | undefined>();
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<ManualPriceQuoteInput>({
    resolver: zodResolver(manualPriceQuoteSchema),
    defaultValues,
  });

  const onRecalculate = () => {
    const values = getValues();
    const distanceKm = Number(values.distanceKm) || 0;
    const overnightStays = Number(values.overnightStays) || 0;
    const driverCount = Number(values.driverCount) || 1;
    const waitingHours = Number(values.waitingHours) || 0;
    const extraCosts = Number(values.extraCosts) || 0;

    const suggested =
      rates.baseFee +
      distanceKm * rates.ratePerKm +
      waitingHours * rates.hourlyWaitingRate +
      overnightStays * rates.driverOvernightRate * driverCount +
      extraCosts;

    setValue("finalPrice", suggested.toFixed(2));
  };

  const onSubmit = (data: ManualPriceQuoteInput) => {
    setServerError(undefined);
    setSaved(false);
    startTransition(async () => {
      const result = await action(inquiryId, data);
      if (result?.error) setServerError(result.error);
      if (result?.success) setSaved(true);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="distanceKm">Dystans (km)</Label>
          <Input id="distanceKm" type="number" step="0.1" {...register("distanceKm")} />
          {errors.distanceKm && (
            <p className="text-sm text-destructive">{errors.distanceKm.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="tripDays">Liczba dni</Label>
          <Input id="tripDays" type="number" {...register("tripDays")} />
          {errors.tripDays && <p className="text-sm text-destructive">{errors.tripDays.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="overnightStays">Liczba noclegów</Label>
          <Input id="overnightStays" type="number" {...register("overnightStays")} />
          {errors.overnightStays && (
            <p className="text-sm text-destructive">{errors.overnightStays.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="driverCount">Liczba kierowców</Label>
          <Input id="driverCount" type="number" {...register("driverCount")} />
          {errors.driverCount && (
            <p className="text-sm text-destructive">{errors.driverCount.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="waitingHours">Godziny postoju</Label>
          <Input id="waitingHours" type="number" step="0.01" {...register("waitingHours")} />
          {errors.waitingHours && (
            <p className="text-sm text-destructive">{errors.waitingHours.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="extraCosts">Dodatkowe koszty (PLN)</Label>
          <Input id="extraCosts" type="number" step="0.01" {...register("extraCosts")} />
          {errors.extraCosts && (
            <p className="text-sm text-destructive">{errors.extraCosts.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="extraCostsNote">Uzasadnienie dodatkowych kosztów (opcjonalnie)</Label>
        <Input id="extraCostsNote" {...register("extraCostsNote")} />
      </div>

      <div className="flex items-end gap-3">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="finalPrice">Cena końcowa (PLN)</Label>
          <Input id="finalPrice" type="number" step="0.01" {...register("finalPrice")} />
          {errors.finalPrice && (
            <p className="text-sm text-destructive">{errors.finalPrice.message}</p>
          )}
        </div>
        <Button type="button" variant="outline" onClick={onRecalculate}>
          Przelicz sugerowaną cenę
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="note">Notatka do tej wyceny (opcjonalnie)</Label>
        <Textarea id="note" rows={2} {...register("note")} />
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}
      {saved && <p className="text-sm text-primary">Nowa wycena zapisana w historii.</p>}

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Zapisywanie…" : "Zapisz nową wycenę"}
        </Button>
      </div>
    </form>
  );
}
