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
import {
  driverLineAssignmentSchema,
  type DriverLineAssignmentInput,
} from "@/lib/validation/availability-admin";
import { DRIVER_LINE_ROLES, DRIVER_LINE_ROLE_LABELS } from "@/lib/driver-line-role";
import type { ActionState } from "@/lib/actions/driver-line-assignments";

interface DriverLineAssignmentFormProps {
  driverId: string;
  lines: { id: string; name: string }[];
  action: (driverId: string, data: DriverLineAssignmentInput) => Promise<ActionState>;
}

export function DriverLineAssignmentForm({ driverId, lines, action }: DriverLineAssignmentFormProps) {
  const [serverError, setServerError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DriverLineAssignmentInput>({
    resolver: zodResolver(driverLineAssignmentSchema),
    defaultValues: { lineId: "", role: "PREFEROWANY", note: "" },
  });

  const onSubmit = (data: DriverLineAssignmentInput) => {
    setServerError(undefined);
    startTransition(async () => {
      const result = await action(driverId, data);
      if (result?.error) setServerError(result.error);
      else reset({ lineId: "", role: "PREFEROWANY", note: "" });
    });
  };

  if (lines.length === 0) {
    return <p className="text-sm text-muted-foreground">Brak dostępnych linii regularnych.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-start gap-2">
      <div className="flex flex-col gap-1">
        <Controller
          control={control}
          name="lineId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={(v) => v && field.onChange(v)}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Wybierz linię" />
              </SelectTrigger>
              <SelectContent>
                {lines.map((line) => (
                  <SelectItem key={line.id} value={line.id}>
                    {line.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.lineId && <p className="text-sm text-destructive">{errors.lineId.message}</p>}
      </div>
      <Controller
        control={control}
        name="role"
        render={({ field }) => (
          <Select value={field.value} onValueChange={(v) => v && field.onChange(v)}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DRIVER_LINE_ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {DRIVER_LINE_ROLE_LABELS[role]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <div className="flex flex-col gap-1">
        <Label htmlFor="lineAssignNote" className="sr-only">
          Notatka
        </Label>
        <Input id="lineAssignNote" placeholder="Notatka (opcjonalnie)" {...register("note")} />
      </div>
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Przypisywanie…" : "Przypisz do linii"}
      </Button>
      {serverError && <p className="w-full text-sm text-destructive">{serverError}</p>}
    </form>
  );
}
