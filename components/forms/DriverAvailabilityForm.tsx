"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  driverAvailabilitySchema,
  type DriverAvailabilityInput,
} from "@/lib/validation/availability-admin";
import { DRIVER_AVAILABILITY_TYPES, DRIVER_AVAILABILITY_TYPE_LABELS } from "@/lib/driver-availability-labels";
import type { ActionState } from "@/lib/actions/driver-availability";

interface DriverAvailabilityFormProps {
  driverId: string;
  action: (driverId: string, data: DriverAvailabilityInput) => Promise<ActionState>;
}

export function DriverAvailabilityForm({ driverId, action }: DriverAvailabilityFormProps) {
  const [serverError, setServerError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DriverAvailabilityInput>({
    resolver: zodResolver(driverAvailabilitySchema),
    defaultValues: { type: "URLOP", startAt: "", endAt: "", note: "" },
  });

  const onSubmit = (data: DriverAvailabilityInput) => {
    setServerError(undefined);
    startTransition(async () => {
      const result = await action(driverId, data);
      if (result?.error) setServerError(result.error);
      else reset({ type: "URLOP", startAt: "", endAt: "", note: "" });
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label>Typ</Label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={(v) => v && field.onChange(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DRIVER_AVAILABILITY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {DRIVER_AVAILABILITY_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="driverAvailStart">Od</Label>
          <Input id="driverAvailStart" type="datetime-local" {...register("startAt")} />
          {errors.startAt && <p className="text-sm text-destructive">{errors.startAt.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="driverAvailEnd">Do</Label>
          <Input id="driverAvailEnd" type="datetime-local" {...register("endAt")} />
          {errors.endAt && <p className="text-sm text-destructive">{errors.endAt.message}</p>}
        </div>
      </div>
      <Textarea placeholder="Notatka (opcjonalnie)" rows={2} {...register("note")} />
      {serverError && <p className="text-sm text-destructive">{serverError}</p>}
      <Button type="submit" size="sm" className="w-fit" disabled={isPending}>
        {isPending ? "Zapisywanie…" : "Dodaj okres"}
      </Button>
    </form>
  );
}
