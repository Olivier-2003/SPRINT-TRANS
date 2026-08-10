"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import {
  calculatorSettingsSchema,
  type CalculatorSettingsInput,
} from "@/lib/validation/calculator-settings";

export type CalculatorSettingsFormState = { error?: string; success?: boolean } | undefined;

const PAGE_PATH = "/admin/ustawienia/kalkulator";

export async function updateCalculatorSettings(
  data: CalculatorSettingsInput
): Promise<CalculatorSettingsFormState> {
  const parsed = calculatorSettingsSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Popraw błędy w formularzu." };
  }

  const session = await auth();
  const existing = await db.calculatorSettings.findFirst({ orderBy: { updatedAt: "desc" } });

  const values = {
    ratePerKm: Number(parsed.data.ratePerKm),
    baseFee: Number(parsed.data.baseFee),
    updatedById: session?.user?.id,
  };

  if (existing) {
    await db.calculatorSettings.update({ where: { id: existing.id }, data: values });
  } else {
    await db.calculatorSettings.create({ data: values });
  }

  revalidatePath(PAGE_PATH);
  return { success: true };
}
