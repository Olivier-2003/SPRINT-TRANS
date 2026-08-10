import { z } from "zod";

export const lineStopSchema = z.object({
  stopName: z.string().trim().min(1, "Podaj nazwę przystanku."),
  arrivalOffsetMinutes: z.number().int().min(0, "Podaj liczbę minut od wyjazdu."),
});

export const lineScheduleSchema = z.object({
  daysOfWeek: z.array(z.number().int().min(1).max(7)).min(1, "Wybierz przynajmniej jeden dzień."),
  departureTime: z.string().min(1, "Podaj godzinę wyjazdu."),
  arrivalTime: z.string().min(1, "Podaj godzinę przyjazdu."),
  price: z.number().min(0, "Podaj cenę."),
  validFrom: z.string().min(1, "Podaj datę obowiązywania od."),
  validTo: z.string().optional(),
});

export const lineSchema = z.object({
  name: z.string().trim().min(1, "Podaj nazwę linii."),
  originLabel: z.string().trim().min(1, "Podaj miejsce początkowe."),
  destinationLabel: z.string().trim().min(1, "Podaj miejsce docelowe."),
  description: z.string().trim(),
  active: z.boolean(),
  stops: z.array(lineStopSchema),
  schedules: z.array(lineScheduleSchema),
});

export type LineInput = z.infer<typeof lineSchema>;

export const lineDefaultValues: LineInput = {
  name: "",
  originLabel: "",
  destinationLabel: "",
  description: "",
  active: true,
  stops: [],
  schedules: [],
};

export const DAY_OPTIONS = [
  { value: 1, label: "Pon" },
  { value: 2, label: "Wt" },
  { value: 3, label: "Śr" },
  { value: 4, label: "Czw" },
  { value: 5, label: "Pt" },
  { value: 6, label: "Sob" },
  { value: 7, label: "Nd" },
] as const;
