import { z } from "zod";

export const calculatorSettingsSchema = z.object({
  ratePerKm: z
    .string()
    .min(1, "Podaj stawkę za km.")
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, "Podaj poprawną stawkę."),
  baseFee: z
    .string()
    .min(1, "Podaj opłatę bazową.")
    .refine(
      (value) => !Number.isNaN(Number(value)) && Number(value) >= 0,
      "Podaj poprawną opłatę bazową."
    ),
});

export type CalculatorSettingsInput = z.infer<typeof calculatorSettingsSchema>;

export const calculatorSettingsDefaultValues: CalculatorSettingsInput = {
  ratePerKm: "",
  baseFee: "",
};
