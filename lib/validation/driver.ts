import { z } from "zod";

export const driverSchema = z.object({
  firstName: z.string().trim().min(1, "Podaj imię."),
  lastName: z.string().trim().min(1, "Podaj nazwisko."),
  phone: z.string().trim().min(1, "Podaj numer telefonu."),
  email: z.union([z.string().trim().email("Nieprawidłowy adres e-mail."), z.literal("")]),
  licenseCategories: z.string().trim().min(1, "Podaj kategorie prawa jazdy."),
  employmentStatus: z.enum(["ACTIVE", "INACTIVE"]),
  notes: z.string().trim(),
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
};
