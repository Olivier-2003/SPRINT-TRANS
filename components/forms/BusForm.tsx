"use client";

import { useState, useTransition } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { type BusInput, busDefaultValues } from "@/lib/validation/bus";
import type { BusFormState } from "@/lib/actions/buses";

// Formularz operuje na tekstowych polach liczbowych (naturalny typ inputów HTML)
// i konwertuje je na liczby dopiero przy wysyłce — unika to niezgodności typów
// wejścia/wyjścia Zod przy walidacji po stronie klienta.
const busFormSchema = z.object({
  registrationNumber: z.string().trim().min(1, "Podaj numer rejestracyjny."),
  brandModel: z.string().trim().min(1, "Podaj markę i model."),
  seats: z
    .string()
    .min(1, "Podaj liczbę miejsc.")
    .refine(
      (value) => Number.isInteger(Number(value)) && Number(value) > 0,
      "Podaj poprawną liczbę miejsc."
    ),
  productionYear: z.string(),
  description: z.string().trim(),
  featuresText: z.string().trim(),
  status: z.enum(["ACTIVE", "SERVICE", "INACTIVE"]),
  photos: z.array(z.object({ url: z.string().trim().url("Podaj poprawny adres URL zdjęcia.") })),
});

type BusFormValues = z.infer<typeof busFormSchema>;

function toFormValues(input: BusInput): BusFormValues {
  return {
    ...input,
    seats: String(input.seats),
    productionYear: input.productionYear !== undefined ? String(input.productionYear) : "",
  };
}

interface BusFormProps {
  action: (data: BusInput) => Promise<BusFormState>;
  defaultValues?: BusInput;
  submitLabel?: string;
}

export function BusForm({
  action,
  defaultValues = busDefaultValues,
  submitLabel = "Zapisz",
}: BusFormProps) {
  const [serverError, setServerError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BusFormValues>({
    resolver: zodResolver(busFormSchema),
    defaultValues: toFormValues(defaultValues),
  });

  const { fields, append, remove } = useFieldArray({ control, name: "photos" });

  const onSubmit = (data: BusFormValues) => {
    setServerError(undefined);
    startTransition(async () => {
      const result = await action({
        ...data,
        seats: Number(data.seats),
        productionYear: data.productionYear ? Number(data.productionYear) : undefined,
      });
      if (result?.error) setServerError(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="registrationNumber">Numer rejestracyjny</Label>
          <Input id="registrationNumber" {...register("registrationNumber")} />
          {errors.registrationNumber && (
            <p className="text-sm text-destructive">{errors.registrationNumber.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="brandModel">Marka i model</Label>
          <Input id="brandModel" {...register("brandModel")} />
          {errors.brandModel && (
            <p className="text-sm text-destructive">{errors.brandModel.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="seats">Liczba miejsc</Label>
          <Input id="seats" type="number" {...register("seats")} />
          {errors.seats && <p className="text-sm text-destructive">{errors.seats.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="productionYear">Rok produkcji (opcjonalnie)</Label>
          <Input id="productionYear" type="number" {...register("productionYear")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Aktywny</SelectItem>
                  <SelectItem value="SERVICE">W serwisie</SelectItem>
                  <SelectItem value="INACTIVE">Nieaktywny</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="featuresText">Wyposażenie (oddzielone przecinkami)</Label>
        <Input
          id="featuresText"
          placeholder="np. klimatyzacja, WiFi, USB"
          {...register("featuresText")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Opis (opcjonalnie)</Label>
        <Textarea id="description" rows={3} {...register("description")} />
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
