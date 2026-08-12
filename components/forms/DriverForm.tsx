"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  driverSchema,
  type DriverInput,
  driverDefaultValues,
} from "@/lib/validation/driver";
import { INQUIRY_TYPES, INQUIRY_TYPE_LABELS } from "@/lib/inquiry-type";
import type { DriverFormState } from "@/lib/actions/drivers";

interface DriverFormProps {
  action: (data: DriverInput) => Promise<DriverFormState>;
  defaultValues?: DriverInput;
  submitLabel?: string;
}

export function DriverForm({
  action,
  defaultValues = driverDefaultValues,
  submitLabel = "Zapisz",
}: DriverFormProps) {
  const [serverError, setServerError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DriverInput>({
    resolver: zodResolver(driverSchema),
    defaultValues,
  });

  const onSubmit = (data: DriverInput) => {
    setServerError(undefined);
    startTransition(async () => {
      const result = await action(data);
      if (result?.error) setServerError(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="firstName">Imię</Label>
          <Input id="firstName" {...register("firstName")} />
          {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="lastName">Nazwisko</Label>
          <Input id="lastName" {...register("lastName")} />
          {errors.lastName && (
            <p className="text-sm text-destructive">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input id="phone" {...register("phone")} />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">E-mail (opcjonalnie)</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="licenseCategories">Kategorie prawa jazdy</Label>
          <Input id="licenseCategories" placeholder="np. D, D1" {...register("licenseCategories")} />
          {errors.licenseCategories && (
            <p className="text-sm text-destructive">{errors.licenseCategories.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Status zatrudnienia</Label>
          <Controller
            control={control}
            name="employmentStatus"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Aktywny</SelectItem>
                  <SelectItem value="INACTIVE">Nieaktywny</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="notes">Notatki (opcjonalnie)</Label>
        <Textarea id="notes" rows={3} {...register("notes")} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Czas pracy i odpoczynek</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="restingHoursRequired">Wymagany odpoczynek między zleceniami (h)</Label>
            <Input id="restingHoursRequired" type="number" step="0.5" {...register("restingHoursRequired")} />
            {errors.restingHoursRequired && (
              <p className="text-sm text-destructive">{errors.restingHoursRequired.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="maxDailyWorkHours">Maks. dzienny czas pracy (h, opcjonalnie)</Label>
            <Input id="maxDailyWorkHours" type="number" step="0.5" {...register("maxDailyWorkHours")} />
            {errors.maxDailyWorkHours && (
              <p className="text-sm text-destructive">{errors.maxDailyWorkHours.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="monthlyWorkHoursNorm">Miesięczny wymiar czasu pracy (h, opcjonalnie)</Label>
            <Input id="monthlyWorkHoursNorm" type="number" step="0.5" {...register("monthlyWorkHoursNorm")} />
            {errors.monthlyWorkHoursNorm && (
              <p className="text-sm text-destructive">{errors.monthlyWorkHoursNorm.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="weeklyWorkHoursNorm">Tygodniowy wymiar czasu pracy (h, opcjonalnie)</Label>
            <Input id="weeklyWorkHoursNorm" type="number" step="0.5" {...register("weeklyWorkHoursNorm")} />
            {errors.weeklyWorkHoursNorm && (
              <p className="text-sm text-destructive">{errors.weeklyWorkHoursNorm.message}</p>
            )}
          </div>
          <p className="text-xs text-muted-foreground sm:col-span-2">
            Wymiar miesięczny ma pierwszeństwo. Jeśli podano tylko tygodniowy, system przeliczy go
            proporcjonalnie na dany miesiąc w ewidencji czasu pracy.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preferencje i ograniczenia rodzaju pracy</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Ograniczenia (kierowca nie powinien być przydzielany)</Label>
            <Controller
              control={control}
              name="restrictedWorkTypes"
              render={({ field }) => (
                <div className="flex flex-wrap gap-3">
                  {INQUIRY_TYPES.map((type) => {
                    const checked = field.value.includes(type);
                    return (
                      <label key={type} className="flex items-center gap-1.5 text-sm">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(next) => {
                            field.onChange(
                              next
                                ? [...field.value, type]
                                : field.value.filter((v) => v !== type)
                            );
                          }}
                        />
                        {INQUIRY_TYPE_LABELS[type]}
                      </label>
                    );
                  })}
                </div>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Preferencje (wpływają wyłącznie na kolejność rekomendacji)</Label>
            <Controller
              control={control}
              name="preferredWorkTypes"
              render={({ field }) => (
                <div className="flex flex-wrap gap-3">
                  {INQUIRY_TYPES.map((type) => {
                    const checked = field.value.includes(type);
                    return (
                      <label key={type} className="flex items-center gap-1.5 text-sm">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(next) => {
                            field.onChange(
                              next
                                ? [...field.value, type]
                                : field.value.filter((v) => v !== type)
                            );
                          }}
                        />
                        {INQUIRY_TYPE_LABELS[type]}
                      </label>
                    );
                  })}
                </div>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Zapisywanie…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
