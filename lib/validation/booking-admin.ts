import { z } from "zod";
import { ROUTE_POINT_TYPES } from "@/lib/route-point";
import { BOOKING_STATUSES } from "@/lib/booking-status";

const BOOKING_DRIVER_ROLES = ["GLOWNY", "POMOCNICZY"] as const;

// Współdzielone między bookingRouteSchema (edycja trasy istniejącego zlecenia)
// a createBookingSchema (trasa nowego zlecenia) — ta sama walidacja w obu miejscach.
const routePointsFieldSchema = z
  .array(
    z.object({
      pointType: z.enum(ROUTE_POINT_TYPES),
      label: z.string().trim().min(1, "Podaj opis punktu trasy."),
    })
  )
  .min(1, "Trasa musi zawierać co najmniej jeden punkt.");

export const assignDriverSchema = z.object({
  driverId: z.string().min(1, "Wybierz kierowcę."),
  roleOnTrip: z.union([z.enum(BOOKING_DRIVER_ROLES), z.literal("")]),
});
export type AssignDriverInput = z.infer<typeof assignDriverSchema>;

export const assignBusSchema = z.object({
  busId: z.string().min(1, "Wybierz autobus."),
});
export type AssignBusInput = z.infer<typeof assignBusSchema>;

export const swapDriverSchema = z.object({
  newDriverId: z.string().min(1, "Wybierz nowego kierowcę."),
  roleOnTrip: z.union([z.enum(BOOKING_DRIVER_ROLES), z.literal("")]),
});
export type SwapDriverInput = z.infer<typeof swapDriverSchema>;

export const swapBusSchema = z.object({
  newBusId: z.string().min(1, "Wybierz nowy autobus."),
});
export type SwapBusInput = z.infer<typeof swapBusSchema>;

export const bookingRouteSchema = z.object({
  points: routePointsFieldSchema,
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

export const createBookingSchema = z
  .object({
    customerName: z.string().trim().min(1, "Podaj imię i nazwisko klienta."),
    customerEmail: z.string().trim().min(1, "Podaj adres e-mail.").email("Podaj poprawny adres e-mail."),
    customerPhone: z.string().trim().min(1, "Podaj numer telefonu."),
    startAt: z.string().min(1, "Podaj datę i godzinę wyjazdu."),
    endAt: z.string().min(1, "Podaj datę i godzinę powrotu."),
    finalPrice: z
      .string()
      .min(1, "Podaj cenę.")
      .refine(
        (value) => !Number.isNaN(Number(value)) && Number(value) > 0,
        "Podaj poprawną cenę większą od zera."
      ),
    status: z.enum(BOOKING_STATUSES),
    points: routePointsFieldSchema,
  })
  .refine((data) => new Date(data.endAt).getTime() > new Date(data.startAt).getTime(), {
    message: "Powrót musi być późniejszy niż wyjazd.",
    path: ["endAt"],
  });
export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const createBookingDefaultValues: CreateBookingInput = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  startAt: "",
  endAt: "",
  finalPrice: "",
  status: "ZAPLANOWANE",
  points: [{ pointType: "ODBIOR", label: "" }],
};
