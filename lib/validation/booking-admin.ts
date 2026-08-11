import { z } from "zod";
import { ROUTE_POINT_TYPES } from "@/lib/route-point";

const BOOKING_DRIVER_ROLES = ["GLOWNY", "POMOCNICZY"] as const;

export const assignDriverSchema = z.object({
  driverId: z.string().min(1, "Wybierz kierowcę."),
  roleOnTrip: z.union([z.enum(BOOKING_DRIVER_ROLES), z.literal("")]),
});
export type AssignDriverInput = z.infer<typeof assignDriverSchema>;

export const assignBusSchema = z.object({
  busId: z.string().min(1, "Wybierz autobus."),
});
export type AssignBusInput = z.infer<typeof assignBusSchema>;

export const bookingRouteSchema = z.object({
  points: z
    .array(
      z.object({
        pointType: z.enum(ROUTE_POINT_TYPES),
        label: z.string().trim().min(1, "Podaj opis punktu trasy."),
      })
    )
    .min(1, "Trasa musi zawierać co najmniej jeden punkt."),
});
export type BookingRouteInput = z.infer<typeof bookingRouteSchema>;

export const bookingScheduleSchema = z
  .object({
    startAt: z.string().min(1, "Podaj datę i godzinę wyjazdu."),
    endAt: z.string().min(1, "Podaj datę i godzinę powrotu."),
  })
  .refine((data) => new Date(data.endAt).getTime() > new Date(data.startAt).getTime(), {
    message: "Powrót musi być późniejszy niż wyjazd.",
    path: ["endAt"],
  });
export type BookingScheduleInput = z.infer<typeof bookingScheduleSchema>;
