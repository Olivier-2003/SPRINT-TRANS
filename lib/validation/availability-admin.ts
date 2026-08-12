import { z } from "zod";
import { DRIVER_AVAILABILITY_TYPES } from "@/lib/driver-availability-labels";
import { BUS_AVAILABILITY_TYPES } from "@/lib/bus-availability-labels";
import { DRIVER_LINE_ROLES } from "@/lib/driver-line-role";

function dateRangeSchema<T extends string>(typeValues: readonly T[]) {
  return z
    .object({
      type: z.enum(typeValues as [T, ...T[]]),
      startAt: z.string().min(1, "Podaj datę i godzinę początku."),
      endAt: z.string().min(1, "Podaj datę i godzinę końca."),
      note: z.string().trim(),
    })
    .refine((data) => new Date(data.endAt).getTime() > new Date(data.startAt).getTime(), {
      message: "Koniec musi być późniejszy niż początek.",
      path: ["endAt"],
    });
}

export const driverAvailabilitySchema = dateRangeSchema(DRIVER_AVAILABILITY_TYPES);
export type DriverAvailabilityInput = z.infer<typeof driverAvailabilitySchema>;

export const busAvailabilitySchema = dateRangeSchema(BUS_AVAILABILITY_TYPES);
export type BusAvailabilityInput = z.infer<typeof busAvailabilitySchema>;

export const driverLineAssignmentSchema = z.object({
  lineId: z.string().min(1, "Wybierz linię."),
  role: z.enum(DRIVER_LINE_ROLES as [string, ...string[]]),
  note: z.string().trim(),
});
export type DriverLineAssignmentInput = z.infer<typeof driverLineAssignmentSchema>;
