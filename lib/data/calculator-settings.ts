import { db } from "@/lib/db";

export function getCalculatorSettings() {
  return db.calculatorSettings.findFirst({ orderBy: { updatedAt: "desc" } });
}
