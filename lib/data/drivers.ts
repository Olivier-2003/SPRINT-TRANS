import { db } from "@/lib/db";

export function getDrivers() {
  return db.driver.findMany({ orderBy: [{ lastName: "asc" }, { firstName: "asc" }] });
}

export function getDriver(id: string) {
  return db.driver.findUnique({ where: { id } });
}
