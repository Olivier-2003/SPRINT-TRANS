"use client";

import {
  useFieldArray,
  Controller,
  type Control,
  type UseFormRegister,
  type FieldErrors,
  type Path,
} from "react-hook-form";
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
import { ROUTE_POINT_TYPES, ROUTE_POINT_TYPE_LABELS } from "@/lib/route-point";
import type { RoutePointType } from "@/lib/generated/prisma/client";

export interface RoutePointsFieldValues {
  points: { pointType: RoutePointType; label: string }[];
}

interface RoutePointsEditorProps<T extends RoutePointsFieldValues> {
  control: Control<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

/**
 * Edytor listy punktów trasy (typ + opis, z możliwością zmiany kolejności) —
 * wydzielony z BookingRouteForm, żeby ten sam UI mógł posłużyć zarówno do
 * edycji trasy istniejącego zlecenia, jak i do trasy tworzonej razem z nowym
 * zleceniem (CreateBookingForm). Komponent NIE ma własnego przycisku zapisu —
 * jest częścią większego formularza, który go osadza.
 */
export function RoutePointsEditor<T extends RoutePointsFieldValues>({
  control,
  register,
  errors,
}: RoutePointsEditorProps<T>) {
  // Manipulujemy wyłącznie polem `points`, którego kształt jest identyczny
  // niezależnie od reszty pól konkretnego formularza T (BookingRouteInput,
  // CreateBookingInput) — zawężenie do stałego kształtu upraszcza typowanie
  // useFieldArray/errors, które inaczej nie da się wywieść z samego T.
  const narrowedControl = control as unknown as Control<RoutePointsFieldValues>;
  const pointsErrors = (errors as unknown as FieldErrors<RoutePointsFieldValues>).points;
  const pointsArray = useFieldArray({ control: narrowedControl, name: "points" });

  return (
    <div className="flex flex-col gap-3">
      {pointsErrors?.message && (
        <p className="text-sm text-destructive">{pointsErrors.message}</p>
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
                name={`points.${index}.pointType` as Path<T>}
                render={({ field: typeField }) => (
                  <Select
                    value={typeField.value as RoutePointType}
                    onValueChange={(v) => v && typeField.onChange(v)}
                  >
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
                {...register(`points.${index}.label` as Path<T>)}
              />
              {pointsErrors?.[index]?.label && (
                <p className="text-sm text-destructive">
                  {pointsErrors[index]?.label?.message}
                </p>
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
    </div>
  );
}
