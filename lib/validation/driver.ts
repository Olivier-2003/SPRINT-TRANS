import { z } from "zod";
import { INQUIRY_TYPES } from "@/lib/inquiry-type";

const optionalPositiveDecimal = (message: string) =>
  z
    .string()
    .trim()
    .refine((value) => value === "" || (!Number.isNaN(Number(value)) && Number(value) >= 0), message);

export const driverSchema = z.object({
  firstName: z.string().trim().min(1, "Podaj imię."),
  lastName: z.string().trim().min(1, "Podaj nazwisko."),
  phone: z.string().trim().min(1, "Podaj numer telefonu."),
  email: z.union([z.string().trim().email("Nieprawidłowy adres e-mail."), z.literal("")]),
  licenseCategories: z.string().trim().min(1, "Podaj kategorie prawa jazdy."),
  employmentStatus: z.enum(["ACTIVE", "INACTIVE"]),
  notes: z.string().trim(),
  restingHoursRequired: z
    .string()
    .trim()
    .min(1, "Podaj wymagany odpoczynek.")
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, "Podaj poprawną liczbę godzin."),
  maxDailyWorkHours: optionalPositiveDecimal("Podaj poprawną liczbę godzin."),
  monthlyWorkHoursNorm: optionalPositiveDecimal("Podaj poprawną liczbę godzin."),
  weeklyWorkHoursNorm: optionalPositiveDecimal("Podaj poprawną liczbę godzin."),
  restrictedWorkTypes: z.array(z.enum(INQUIRY_TYPES as [string, ...string[]])),
  preferredWorkTypes: z.array(z.enum(INQUIRY_TYPES as [string, ...string[]])),
});

export type DriverInput = z.infer<typeof driverSchema>;

export const driverDefaultValues: DriverInput = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  licenseCategories: "",
  employmentStatus: "ACTIVE",
  notes: "",
  restingHoursRequired: "11",
  maxDailyWorkHours: "",
  monthlyWorkHoursNorm: "",
  weeklyWorkHoursNorm: "",
  restrictedWorkTypes: [],
  preferredWorkTypes: [],
};
