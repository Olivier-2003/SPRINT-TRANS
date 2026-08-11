"use client";

import { useState, useTransition } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import { bookingRouteSchema, type BookingRouteInput } from "@/lib/validation/booking-admin";
import { ROUTE_POINT_TYPES, ROUTE_POINT_TYPE_LABELS } from "@/lib/route-point";
import type { ActionState } from "@/lib/actions/bookings";
import type { RoutePoint } from "@/lib/generated/prisma/client";

interface BookingRouteFormProps {
  bookingId: string;
  routePoints: RoutePoint[];
  action: (bookingId: string, data: BookingRouteInput) => Promise<ActionState>;
}

export function BookingRouteForm({ bookingId, routePoints, action }: BookingRouteFormProps) {
  const [serverError, setServerError] = useState<string | undefined>();
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingRouteInput>({
    resolver: zodResolver(bookingRouteSchema),
    defaultValues: {
      points:
        routePoints.length > 0
          ? routePoints.map((point) => ({ pointType: point.pointType, label: point.label }))
          : [{ pointType: "ODBIOR", label: "" }],
    },
  });

  const pointsArray = useFieldArray({ control, name: "points" });

  const onSubmit = (data: BookingRouteInput) => {
    setServerError(undefined);
    setSaved(false);
    startTransition(async () => {
      const result = await action(bookingId, data);
      if (result?.error) setServerError(result.error);
      if (result?.success) setSaved(true);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      {errors.points?.message && (
        <p className="text-sm text-destructive">{errors.points.message}</p>
      )}
      <ol className="flex flex-col gap-2">
        {pointsArray.fields.map((field, index) => (
          <li key={field.id} className="flex items-end gap-2">
            <span className="flex h-8 w-6 shrink-0 items-center justify-center text-sm text-muted-foreground">
              {index + 1}
            </span>
            <div className="flex w-48 flex-col gap-2">
              <Label>Typ punktu</Label>
              <Controller
                control={control}
                name={`points.${index}.pointType` as const}
                render={({ field: typeField }) => (
                  <Select value={typeField.value} onValueChange={(v) => v && typeField.onChange(v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROUTE_POINT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {ROUTE_POINT_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Label>Opis / adres</Label>
              <Input
                placeholder="np. Warszawa, ul. Przykładowa 1"
                {...register(`points.${index}.label` as const)}
              />
              {errors.points?.[index]?.label && (
                <p className="text-sm text-destructive">{errors.points[index]?.label?.message}</p>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={index === 0}
                onClick={() => pointsArray.swap(index, index - 1)}
              >
                ↑
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={index === pointsArray.fields.length - 1}
                onClick={() => pointsArray.swap(index, index + 1)}
              >
                ↓
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                disabled={pointsArray.fields.length <= 1}
                onClick={() => pointsArray.remove(index)}
              >
                Usuń
              </Button>
            </div>
          </li>
        ))}
      </ol>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() => pointsArray.append({ pointType: "PRZYSTANEK", label: "" })}
      >
        Dodaj punkt trasy
      </Button>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}
      {saved && <p className="text-sm text-primary">Trasa zapisana.</p>}

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Zapisywanie…" : "Zapisz trasę"}
        </Button>
      </div>
    </form>
  );
}
