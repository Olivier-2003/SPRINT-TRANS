/**
 * Pojedynczy punkt konfiguracji zasobów wizualnych hero strony głównej.
 * Docelowe pliki: `public/hero/hero-bg.jpg` (pełnoekranowe kinowe tło drogi)
 * i `public/hero/hero-bus.png` (duże zdjęcie autokaru na przezroczystym tle).
 * Wystarczy wrzucić plik pod dokładnie tą ścieżką — `HeroSection` sam wykrywa
 * jego obecność (patrz `lib/public-assets.ts`) i przełącza się z ilustrowanego
 * placeholdera na docelowy materiał, bez żadnych zmian w kodzie.
 */
export const HERO_ASSETS = {
  backdropPath: "hero/hero-bg.jpg",
  busPath: "hero/hero-bus.png",
} as const;
