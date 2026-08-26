"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { RoutePointsEditor } from "@/components/forms/RoutePointsEditor";
import { bookingRouteSchema, type BookingRouteInput } from "@/lib/validation/booking-admin";
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
      <RoutePointsEditor control={control} register={register} errors={errors} />

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
