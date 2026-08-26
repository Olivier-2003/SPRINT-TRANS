"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoutePointsEditor } from "@/components/forms/RoutePointsEditor";
import {
  createBookingSchema,
  createBookingDefaultValues,
  type CreateBookingInput,
} from "@/lib/validation/booking-admin";
import { BOOKING_STATUSES, BOOKING_STATUS_LABELS } from "@/lib/booking-status";
import type { ActionState } from "@/lib/actions/bookings";

interface CreateBookingFormProps {
  action: (data: CreateBookingInput) => Promise<ActionState>;
}

export function CreateBookingForm({ action }: CreateBookingFormProps) {
  const [serverError, setServerError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBookingInput>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: createBookingDefaultValues,
  });

  const onSubmit = (data: CreateBookingInput) => {
    setServerError(undefined);
    startTransition(async () => {
      const result = await action(data);
      if (result?.error) setServerError(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-semibold">Dane klienta</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="customerName">Imię i nazwisko</Label>
            <Input id="customerName" {...register("customerName")} />
            {errors.customerName && (
              <p className="text-sm text-destructive">{errors.customerName.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="customerPhone">Telefon</Label>
            <Input id="customerPhone" {...register("customerPhone")} />
            {errors.customerPhone && (
              <p className="text-sm text-destructive">{errors.customerPhone.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="customerEmail">E-mail</Label>
            <Input id="customerEmail" type="email" {...register("customerEmail")} />
            {errors.customerEmail && (
              <p className="text-sm text-destructive">{errors.customerEmail.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-base font-semibold">Termin i cena</h2>
        <div className="grid gap-4 sm:grid-cols-3">
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
          <div className="flex flex-col gap-2">
            <Label htmlFor="finalPrice">Cena (PLN)</Label>
            <Input id="finalPrice" type="number" step="0.01" {...register("finalPrice")} />
            {errors.finalPrice && (
              <p className="text-sm text-destructive">{errors.finalPrice.message}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:w-56">
          <Label>Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={(v) => v && field.onChange(v)}>
                <SelectTrigger className="w-full">
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
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-base font-semibold">Trasa</h2>
        <RoutePointsEditor control={control} register={register} errors={errors} />
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Tworzenie…" : "Utwórz zlecenie"}
        </Button>
      </div>
    </form>
  );
}
