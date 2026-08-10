"use client";

import { useState, useTransition } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { tripSchema, type TripInput, tripDefaultValues } from "@/lib/validation/trip";
import type { TripFormState } from "@/lib/actions/trips";

interface TripFormProps {
  action: (data: TripInput) => Promise<TripFormState>;
  defaultValues?: TripInput;
  submitLabel?: string;
}

export function TripForm({
  action,
  defaultValues = tripDefaultValues,
  submitLabel = "Zapisz",
}: TripFormProps) {
  const [serverError, setServerError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TripInput>({
    resolver: zodResolver(tripSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "photos" });

  const onSubmit = (data: TripInput) => {
    setServerError(undefined);
    startTransition(async () => {
      const result = await action(data);
      if (result?.error) setServerError(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Tytuł wycieczki</Label>
        <Input id="title" {...register("title")} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Opis (opcjonalnie)</Label>
        <Textarea id="description" rows={3} {...register("description")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="priceInfo">Informacja o cenie (opcjonalnie)</Label>
          <Input
            id="priceInfo"
            placeholder="np. Cena ustalana indywidualnie"
            {...register("priceInfo")}
          />
        </div>
        <div className="flex items-center gap-2 pt-6">
          <Controller
            control={control}
            name="active"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} id="active" />
            )}
          />
          <Label htmlFor="active">Wycieczka aktywna (widoczna publicznie)</Label>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Zdjęcia (adresy URL)</Label>
        <p className="text-xs text-muted-foreground">
          Wklej adresy URL zdjęć. Docelowe zdjęcia dostarczy klient — na razie można użyć
          placeholderów.
        </p>
        <div className="flex flex-col gap-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input
                placeholder="https://..."
                {...register(`photos.${index}.url` as const)}
              />
              <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                Usuń
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() => append({ url: "" })}
        >
          Dodaj zdjęcie
        </Button>
        {errors.photos && (
          <p className="text-sm text-destructive">Sprawdź poprawność adresów URL zdjęć.</p>
        )}
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Zapisywanie…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
