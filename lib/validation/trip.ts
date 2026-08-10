import { z } from "zod";

export const tripPhotoSchema = z.object({
  url: z.string().trim().url("Podaj poprawny adres URL zdjęcia."),
});

export const tripSchema = z.object({
  title: z.string().trim().min(1, "Podaj tytuł wycieczki."),
  description: z.string().trim(),
  priceInfo: z.string().trim(),
  active: z.boolean(),
  photos: z.array(tripPhotoSchema),
});

export type TripInput = z.infer<typeof tripSchema>;

export const tripDefaultValues: TripInput = {
  title: "",
  description: "",
  priceInfo: "",
  active: true,
  photos: [],
};
