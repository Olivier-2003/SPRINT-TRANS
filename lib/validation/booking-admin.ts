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

// Ręczna liczba godzin dla przypisania kierowcy/autobusu — opcjonalna, nadpisuje
// wyliczenie automatyczne z przedziału startAt–endAt zlecenia (lib/driver-timesheet.ts).
export const plannedHoursFieldSchema = z
  .string()
  .optional()
  .refine(
    (value) => !value || (!Number.isNaN(Number(value)) && Number(value) > 0),
    "Podaj liczbę godzin większą od zera."
  );

export const assignDriverSchema = z.object({
  driverId: z.string().min(1, "Wybierz kierowcę."),
  roleOnTrip: z.union([z.enum(BOOKING_DRIVER_ROLES), z.literal("")]),
  plannedHours: plannedHoursFieldSchema,
});
export type AssignDriverInput = z.infer<typeof assignDriverSchema>;

export const assignBusSchema = z.object({
  busId: z.string().min(1, "Wybierz autobus."),
  plannedHours: plannedHoursFieldSchema,
});
export type AssignBusInput = z.infer<typeof assignBusSchema>;

export const swapDriverSchema = z.object({
  newDriverId: z.string().min(1, "Wybierz nowego kierowcę."),
  roleOnTrip: z.union([z.enum(BOOKING_DRIVER_ROLES), z.literal("")]),
  plannedHours: plannedHoursFieldSchema,
});
export type SwapDriverInput = z.infer<typeof swapDriverSchema>;

export const swapBusSchema = z.object({
  newBusId: z.string().min(1, "Wybierz nowy autobus."),
  plannedHours: plannedHoursFieldSchema,
});
export type SwapBusInput = z.infer<typeof swapBusSchema>;

export const updateAssignmentHoursSchema = z.object({
  plannedHours: plannedHoursFieldSchema,
});
export type UpdateAssignmentHoursInput = z.infer<typeof updateAssignmentHoursSchema>;

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

// Współdzielone między createBookingSchema (pełna strona "Nowe zlecenie") i
// createBookingWithAssignmentsSchema (dialog szybkiego tworzenia w kalendarzu).
export const createBookingBaseSchema = z.object({
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
});

export const createBookingSchema = createBookingBaseSchema.refine(
  (data) => new Date(data.endAt).getTime() > new Date(data.startAt).getTime(),
  { message: "Powrót musi być późniejszy niż wyjazd.", path: ["endAt"] }
);
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

export const createBookingWithAssignmentsSchema = createBookingBaseSchema
  .extend({
    driverId: z.string().optional(),
    driverRoleOnTrip: z.union([z.enum(BOOKING_DRIVER_ROLES), z.literal("")]).optional(),
    driverPlannedHours: plannedHoursFieldSchema,
    busId: z.string().optional(),
    busPlannedHours: plannedHoursFieldSchema,
  })
  .refine((data) => new Date(data.endAt).getTime() > new Date(data.startAt).getTime(), {
    message: "Powrót musi być późniejszy niż wyjazd.",
    path: ["endAt"],
  });
export type CreateBookingWithAssignmentsInput = z.infer<typeof createBookingWithAssignmentsSchema>;

export const createBookingWithAssignmentsDefaultValues: CreateBookingWithAssignmentsInput = {
  ...createBookingDefaultValues,
  driverId: "",
  driverRoleOnTrip: "",
  driverPlannedHours: "",
  busId: "",
  busPlannedHours: "",
};

// Kurs linii regularnej dodany wprost z kalendarza — bez danych klienta i bez ręcznej
// trasy (kopiowana z przystanków linii przy tworzeniu, patrz createLineRunBooking).
export const createLineRunBookingSchema = z
  .object({
    lineId: z.string().min(1, "Wybierz linię."),
    startAt: z.string().min(1, "Podaj datę i godzinę wyjazdu."),
    endAt: z.string().min(1, "Podaj datę i godzinę przyjazdu."),
    finalPrice: z
      .string()
      .min(1, "Podaj cenę.")
      .refine(
        (value) => !Number.isNaN(Number(value)) && Number(value) > 0,
        "Podaj poprawną cenę większą od zera."
      ),
    status: z.enum(BOOKING_STATUSES),
    driverId: z.string().optional(),
    driverRoleOnTrip: z.union([z.enum(BOOKING_DRIVER_ROLES), z.literal("")]).optional(),
    driverPlannedHours: plannedHoursFieldSchema,
    busId: z.string().optional(),
    busPlannedHours: plannedHoursFieldSchema,
  })
  .refine((data) => new Date(data.endAt).getTime() > new Date(data.startAt).getTime(), {
    message: "Przyjazd musi być późniejszy niż wyjazd.",
    path: ["endAt"],
  });
export type CreateLineRunBookingInput = z.infer<typeof createLineRunBookingSchema>;

export const createLineRunBookingDefaultValues: CreateLineRunBookingInput = {
  lineId: "",
  startAt: "",
  endAt: "",
  finalPrice: "",
  status: "ZAPLANOWANE",
  driverId: "",
  driverRoleOnTrip: "",
  driverPlannedHours: "",
  busId: "",
  busPlannedHours: "",
};
