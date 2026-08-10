import { z } from "zod";

export const busPhotoSchema = z.object({
  url: z.string().trim().url("Podaj poprawny adres URL zdjęcia."),
});

export const busSchema = z.object({
  registrationNumber: z.string().trim().min(1, "Podaj numer rejestracyjny."),
  brandModel: z.string().trim().min(1, "Podaj markę i model."),
  seats: z.coerce.number().int().min(1, "Podaj liczbę miejsc.").max(200),
  productionYear: z.preprocess(
    (value) => (value === "" || value === undefined || value === null ? undefined : Number(value)),
    z.number().int().min(1970).max(2100).optional()
  ),
  description: z.string().trim(),
  featuresText: z.string().trim(),
  status: z.enum(["ACTIVE", "SERVICE", "INACTIVE"]),
  photos: z.array(busPhotoSchema),
});

export type BusInput = z.infer<typeof busSchema>;

export const busDefaultValues: BusInput = {
  registrationNumber: "",
  brandModel: "",
  seats: 50,
  productionYear: undefined,
  description: "",
  featuresText: "",
  status: "ACTIVE",
  photos: [],
};
