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
import { busAvailabilitySchema, type BusAvailabilityInput } from "@/lib/validation/availability-admin";
import { BUS_AVAILABILITY_TYPES, BUS_AVAILABILITY_TYPE_LABELS } from "@/lib/bus-availability-labels";
import type { ActionState } from "@/lib/actions/bus-availability";

interface BusAvailabilityFormProps {
  busId: string;
  action: (busId: string, data: BusAvailabilityInput) => Promise<ActionState>;
}

export function BusAvailabilityForm({ busId, action }: BusAvailabilityFormProps) {
  const [serverError, setServerError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BusAvailabilityInput>({
    resolver: zodResolver(busAvailabilitySchema),
    defaultValues: { type: "SERWIS", startAt: "", endAt: "", note: "" },
  });

  const onSubmit = (data: BusAvailabilityInput) => {
    setServerError(undefined);
    startTransition(async () => {
      const result = await action(busId, data);
      if (result?.error) setServerError(result.error);
      else reset({ type: "SERWIS", startAt: "", endAt: "", note: "" });
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
                  {BUS_AVAILABILITY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {BUS_AVAILABILITY_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="busAvailStart">Od</Label>
          <Input id="busAvailStart" type="datetime-local" {...register("startAt")} />
          {errors.startAt && <p className="text-sm text-destructive">{errors.startAt.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="busAvailEnd">Do</Label>
          <Input id="busAvailEnd" type="datetime-local" {...register("endAt")} />
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
