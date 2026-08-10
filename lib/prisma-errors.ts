import { Prisma } from "@/lib/generated/prisma/client";

/** P2003 = naruszenie klucza obcego — rekord jest gdzieś jeszcze używany. */
export function isForeignKeyConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003"
  );
}

/** P2002 = naruszenie unikalności (np. duplikat numeru rejestracyjnego). */
export function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
  );
}
