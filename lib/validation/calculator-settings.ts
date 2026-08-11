import { z } from "zod";

const nonNegativeDecimalField = (message: string) =>
  z
    .string()
    .min(1, message)
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, message);

export const calculatorSettingsSchema = z.object({
  ratePerKm: nonNegativeDecimalField("Podaj poprawną stawkę za km."),
  baseFee: nonNegativeDecimalField("Podaj poprawną opłatę bazową."),
  hourlyWaitingRate: nonNegativeDecimalField("Podaj poprawną stawkę za godzinę postoju."),
  driverOvernightRate: nonNegativeDecimalField("Podaj poprawny koszt noclegu kierowcy."),
  averageSpeedKmh: z
    .string()
    .min(1, "Podaj średnią prędkość.")
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) > 0, "Podaj poprawną średnią prędkość."),
});

export type CalculatorSettingsInput = z.infer<typeof calculatorSettingsSchema>;

export const calculatorSettingsDefaultValues: CalculatorSettingsInput = {
  ratePerKm: "",
  baseFee: "",
  hourlyWaitingRate: "",
  driverOvernightRate: "",
  averageSpeedKmh: "",
};
