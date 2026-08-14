import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Sprawdza (wyłącznie po stronie serwera — Server Components), czy plik
 * istnieje pod wskazaną ścieżką w `public/`. Używane do bezpiecznego przełączania
 * między docelowym assetem a placeholderem: dopóki pliku nie ma w repo, renderuje
 * się placeholder; w chwili, gdy plik faktycznie się pojawi pod tą samą ścieżką,
 * strona automatycznie zaczyna go używać — bez zmian w kodzie.
 */
export function publicAssetExists(relativePath: string): boolean {
  try {
    return existsSync(path.join(process.cwd(), "public", relativePath));
  } catch {
    return false;
  }
}
