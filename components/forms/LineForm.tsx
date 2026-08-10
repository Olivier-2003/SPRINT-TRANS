"use client";

import { useState, useTransition } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type LineInput, lineDefaultValues, DAY_OPTIONS } from "@/lib/validation/line";
import type { LineFormState } from "@/lib/actions/lines";

const lineFormSchema = z.object({
  name: z.string().trim().min(1, "Podaj nazwę linii."),
  originLabel: z.string().trim().min(1, "Podaj miejsce początkowe."),
  destinationLabel: z.string().trim().min(1, "Podaj miejsce docelowe."),
  description: z.string().trim(),
  active: z.boolean(),
  stops: z.array(
    z.object({
      stopName: z.string().trim().min(1, "Podaj nazwę przystanku."),
      arrivalOffsetMinutes: z
        .string()
        .min(1, "Podaj liczbę minut.")
        .refine((value) => Number.isInteger(Number(value)) && Number(value) >= 0, "Podaj poprawną liczbę minut."),
    })
  ),
  schedules: z.array(
    z.object({
      daysOfWeek: z.array(z.number()).min(1, "Wybierz przynajmniej jeden dzień."),
      departureTime: z.string().min(1, "Podaj godzinę wyjazdu."),
      arrivalTime: z.string().min(1, "Podaj godzinę przyjazdu."),
      price: z
        .string()
        .min(1, "Podaj cenę.")
        .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, "Podaj poprawną cenę."),
      validFrom: z.string().min(1, "Podaj datę obowiązywania od."),
      validTo: z.string(),
    })
  ),
});

type LineFormValues = z.infer<typeof lineFormSchema>;

function toFormValues(input: LineInput): LineFormValues {
  return {
    ...input,
    stops: input.stops.map((stop) => ({
      stopName: stop.stopName,
      arrivalOffsetMinutes: String(stop.arrivalOffsetMinutes),
    })),
    schedules: input.schedules.map((schedule) => ({
      ...schedule,
      price: String(schedule.price),
      validTo: schedule.validTo ?? "",
    })),
  };
}

interface LineFormProps {
  action: (data: LineInput) => Promise<LineFormState>;
  defaultValues?: LineInput;
  submitLabel?: string;
}

export function LineForm({
  action,
  defaultValues = lineDefaultValues,
  submitLabel = "Zapisz",
}: LineFormProps) {
  const [serverError, setServerError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LineFormValues>({
    resolver: zodResolver(lineFormSchema),
    defaultValues: toFormValues(defaultValues),
  });

  const stopsArray = useFieldArray({ control, name: "stops" });
  const schedulesArray = useFieldArray({ control, name: "schedules" });

  const onSubmit = (data: LineFormValues) => {
    setServerError(undefined);
    startTransition(async () => {
      const result = await action({
        ...data,
        stops: data.stops.map((stop) => ({
          stopName: stop.stopName,
          arrivalOffsetMinutes: Number(stop.arrivalOffsetMinutes),
        })),
        schedules: data.schedules.map((schedule) => ({
          ...schedule,
          price: Number(schedule.price),
          validTo: schedule.validTo || undefined,
        })),
      });
      if (result?.error) setServerError(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Nazwa linii</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="flex items-center gap-2 pt-6">
          <Controller
            control={control}
            name="active"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} id="active" />
            )}
          />
          <Label htmlFor="active">Linia aktywna</Label>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="originLabel">Miejsce początkowe</Label>
          <Input id="originLabel" {...register("originLabel")} />
          {errors.originLabel && (
            <p className="text-sm text-destructive">{errors.originLabel.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="destinationLabel">Miejsce docelowe</Label>
          <Input id="destinationLabel" {...register("destinationLabel")} />
          {errors.destinationLabel && (
            <p className="text-sm text-destructive">{errors.destinationLabel.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Opis (opcjonalnie)</Label>
        <Textarea id="description" rows={2} {...register("description")} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Przystanki</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {stopsArray.fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-2">
              <div className="flex flex-1 flex-col gap-2">
                <Label>Przystanek {index + 1}</Label>
                <Input
                  placeholder="Nazwa przystanku"
                  {...register(`stops.${index}.stopName` as const)}
                />
              </div>
              <div className="flex w-40 flex-col gap-2">
                <Label>Minut od wyjazdu</Label>
                <Input
                  type="number"
                  {...register(`stops.${index}.arrivalOffsetMinutes` as const)}
                />
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => stopsArray.remove(index)}>
                Usuń
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => stopsArray.append({ stopName: "", arrivalOffsetMinutes: "0" })}
          >
            Dodaj przystanek
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Harmonogram kursów</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {schedulesArray.fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-3 rounded-md border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium">Kurs {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => schedulesArray.remove(index)}
                >
                  Usuń kurs
                </Button>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Dni kursowania</Label>
                <Controller
                  control={control}
                  name={`schedules.${index}.daysOfWeek`}
                  render={({ field: daysField }) => (
                    <div className="flex flex-wrap gap-3">
                      {DAY_OPTIONS.map((day) => {
                        const checked = daysField.value.includes(day.value);
                        return (
                          <label key={day.value} className="flex items-center gap-1.5 text-sm">
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(next) => {
                                if (next) {
                                  daysField.onChange([...daysField.value, day.value].sort());
                                } else {
                                  daysField.onChange(
                                    daysField.value.filter((d) => d !== day.value)
                                  );
                                }
                              }}
                            />
                            {day.label}
                          </label>
                        );
                      })}
                    </div>
                  )}
                />
                {errors.schedules?.[index]?.daysOfWeek && (
                  <p className="text-sm text-destructive">
                    {errors.schedules[index]?.daysOfWeek?.message}
                  </p>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-4">
                <div className="flex flex-col gap-2">
                  <Label>Wyjazd</Label>
                  <Input type="time" {...register(`schedules.${index}.departureTime` as const)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Przyjazd</Label>
                  <Input type="time" {...register(`schedules.${index}.arrivalTime` as const)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Cena (PLN)</Label>
                  <Input type="number" step="0.01" {...register(`schedules.${index}.price` as const)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Obowiązuje od</Label>
                  <Input type="date" {...register(`schedules.${index}.validFrom` as const)} />
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:w-1/4">
                <Label>Obowiązuje do (opcjonalnie)</Label>
                <Input type="date" {...register(`schedules.${index}.validTo` as const)} />
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() =>
              schedulesArray.append({
                daysOfWeek: [],
                departureTime: "",
                arrivalTime: "",
                price: "",
                validFrom: "",
                validTo: "",
              })
            }
          >
            Dodaj kurs
          </Button>
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
