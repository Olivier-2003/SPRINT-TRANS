"use client";

import { useState, useTransition } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { previewInquiryPrice, submitInquiry } from "@/lib/actions/inquiry";
import type { PriceBreakdown } from "@/lib/pricing";
import { INQUIRY_CONFIRMATION_MESSAGE } from "@/lib/inquiry-messages";

const inquiryFormSchema = z.object({
  origin: z.string().trim().min(1, "Podaj miejsce rozpoczęcia podróży."),
  stops: z.array(z.object({ label: z.string().trim().min(1, "Podaj nazwę punktu pośredniego.") })),
  destination: z.string().trim().min(1, "Podaj miejsce docelowe."),
  passengerCount: z
    .string()
    .min(1, "Podaj liczbę pasażerów.")
    .refine((value) => Number.isInteger(Number(value)) && Number(value) > 0, "Podaj poprawną liczbę pasażerów."),
  requestedDepartureAt: z.string().min(1, "Podaj datę i godzinę wyjazdu."),
  requestedReturnAt: z.string(),
  additionalInfo: z.string().trim(),
  customerName: z.string().trim().min(1, "Podaj imię i nazwisko."),
  customerEmail: z.string().trim().email("Nieprawidłowy adres e-mail."),
  customerPhone: z.string().trim().min(1, "Podaj numer telefonu."),
});

type InquiryFormValues = z.infer<typeof inquiryFormSchema>;

const ROUTE_FIELDS: (keyof InquiryFormValues)[] = [
  "origin",
  "stops",
  "destination",
  "passengerCount",
  "requestedDepartureAt",
];

const defaultValues: InquiryFormValues = {
  origin: "",
  stops: [],
  destination: "",
  passengerCount: "",
  requestedDepartureAt: "",
  requestedReturnAt: "",
  additionalInfo: "",
  customerName: "",
  customerEmail: "",
  customerPhone: "",
};

function routeSnapshot(values: InquiryFormValues): string {
  return JSON.stringify({
    origin: values.origin,
    stops: values.stops,
    destination: values.destination,
    passengerCount: values.passengerCount,
    requestedDepartureAt: values.requestedDepartureAt,
    requestedReturnAt: values.requestedReturnAt,
  });
}

export function InquiryForm() {
  const [isPending, startTransition] = useTransition();
  const [previewError, setPreviewError] = useState<string | undefined>();
  const [breakdown, setBreakdown] = useState<PriceBreakdown | undefined>();
  const [previewSnapshot, setPreviewSnapshot] = useState<string | undefined>();
  const [submitError, setSubmitError] = useState<string | undefined>();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues,
  });

  const stopsArray = useFieldArray({ control, name: "stops" });
  const watchedValues = useWatch({ control });
  const currentSnapshot = routeSnapshot(watchedValues as InquiryFormValues);
  const isPreviewStale = breakdown !== undefined && currentSnapshot !== previewSnapshot;

  const onCalculate = async () => {
    const valid = await trigger(ROUTE_FIELDS);
    if (!valid) return;

    setPreviewError(undefined);
    const values = getValues();
    startTransition(async () => {
      const result = await previewInquiryPrice({
        origin: values.origin,
        stops: values.stops,
        destination: values.destination,
        passengerCount: Number(values.passengerCount),
        requestedDepartureAt: values.requestedDepartureAt,
        requestedReturnAt: values.requestedReturnAt || undefined,
      });
      if (result.status === "error") {
        setPreviewError(result.message);
        setBreakdown(undefined);
        setPreviewSnapshot(undefined);
      } else {
        setBreakdown(result.breakdown);
        setPreviewSnapshot(routeSnapshot(values));
      }
    });
  };

  const onSubmit = (values: InquiryFormValues) => {
    setSubmitError(undefined);
    startTransition(async () => {
      const result = await submitInquiry({
        origin: values.origin,
        stops: values.stops,
        destination: values.destination,
        passengerCount: Number(values.passengerCount),
        requestedDepartureAt: values.requestedDepartureAt,
        requestedReturnAt: values.requestedReturnAt || undefined,
        additionalInfo: values.additionalInfo,
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        customerPhone: values.customerPhone,
      });
      if (result?.error) {
        setSubmitError(result.error);
      } else if (result?.success) {
        setSubmitted(true);
      }
    });
  };

  if (submitted) {
    return (
      <div className="flex flex-col gap-3 rounded-md border border-primary/30 bg-primary/5 p-4">
        <p className="font-medium">Zapytanie zostało wysłane.</p>
        <p className="text-sm text-muted-foreground">{INQUIRY_CONFIRMATION_MESSAGE}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="origin">Miejsce rozpoczęcia podróży</Label>
          <Input id="origin" placeholder="np. Warszawa, ul. Przykładowa 1" {...register("origin")} />
          {errors.origin && <p className="text-sm text-destructive">{errors.origin.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="destination">Miejsce docelowe</Label>
          <Input id="destination" placeholder="np. Kraków, Rynek Główny" {...register("destination")} />
          {errors.destination && (
            <p className="text-sm text-destructive">{errors.destination.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Punkty pośrednie (opcjonalnie)</Label>
        <div className="flex flex-col gap-2">
          {stopsArray.fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input
                placeholder="np. Radom, dworzec PKS"
                {...register(`stops.${index}.label` as const)}
              />
              <Button type="button" variant="ghost" size="sm" onClick={() => stopsArray.remove(index)}>
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
          onClick={() => stopsArray.append({ label: "" })}
        >
          Dodaj punkt pośredni
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="requestedDepartureAt">Data i godzina wyjazdu</Label>
          <Input
            id="requestedDepartureAt"
            type="datetime-local"
            {...register("requestedDepartureAt")}
          />
          {errors.requestedDepartureAt && (
            <p className="text-sm text-destructive">{errors.requestedDepartureAt.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="requestedReturnAt">Data i godzina powrotu (opcjonalnie)</Label>
          <Input id="requestedReturnAt" type="datetime-local" {...register("requestedReturnAt")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="passengerCount">Liczba pasażerów</Label>
          <Input id="passengerCount" type="number" {...register("passengerCount")} />
          {errors.passengerCount && (
            <p className="text-sm text-destructive">{errors.passengerCount.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="additionalInfo">Dodatkowe informacje (opcjonalnie)</Label>
        <Textarea id="additionalInfo" rows={3} {...register("additionalInfo")} />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={onCalculate} disabled={isPending}>
            {isPending ? "Liczenie…" : "Oblicz cenę"}
          </Button>
          <span className="text-xs text-muted-foreground">
            Wynik jest orientacyjny i nie stanowi ostatecznej oferty.
          </span>
        </div>

        {previewError && <p className="text-sm text-destructive">{previewError}</p>}

        {breakdown && (
          <Card className={isPreviewStale ? "opacity-50" : undefined}>
            <CardHeader>
              <CardTitle className="text-base">Orientacyjna wycena</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dystans trasy</span>
                <span>{breakdown.distanceKm.toFixed(1)} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Koszt kilometrów ({breakdown.ratePerKm.toFixed(2)} zł/km)
                </span>
                <span>{breakdown.distanceCost.toFixed(2)} zł</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Opłata bazowa</span>
                <span>{breakdown.baseFee.toFixed(2)} zł</span>
              </div>
              {breakdown.estimatedWaitingHours > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Szacowany postój (~{breakdown.estimatedWaitingHours.toFixed(1)} h)
                  </span>
                  <span>{breakdown.waitingCost.toFixed(2)} zł</span>
                </div>
              )}
              {breakdown.overnightStays > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Nocleg kierowcy ({breakdown.overnightStays}{" "}
                    {breakdown.overnightStays === 1 ? "noc" : "noce"})
                  </span>
                  <span>{breakdown.overnightCost.toFixed(2)} zł</span>
                </div>
              )}
              <div className="mt-2 flex justify-between border-t pt-2 text-base font-semibold">
                <span>Razem (orientacyjnie)</span>
                <span>{breakdown.calculatedPrice.toFixed(2)} zł</span>
              </div>
              {isPreviewStale && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Zmieniono trasę lub daty — kliknij „Oblicz cenę” ponownie przed wysłaniem.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex flex-col gap-4 border-t pt-4">
        <h2 className="text-base font-semibold">Twoje dane kontaktowe</h2>
        <div className="grid gap-4 sm:grid-cols-2">
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
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="customerEmail">E-mail</Label>
          <Input id="customerEmail" type="email" {...register("customerEmail")} />
          {errors.customerEmail && (
            <p className="text-sm text-destructive">{errors.customerEmail.message}</p>
          )}
        </div>
      </div>

      {submitError && <p className="text-sm text-destructive">{submitError}</p>}

      <div className="flex flex-col gap-2">
        <Button type="submit" disabled={isPending || !breakdown || isPreviewStale}>
          {isPending ? "Wysyłanie…" : "Wyślij zapytanie o przejazd"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Przesłanie formularza nie oznacza potwierdzenia rezerwacji ani płatności. Skontaktujemy
          się z Tobą, aby potwierdzić szczegóły.
        </p>
      </div>
    </form>
  );
}
