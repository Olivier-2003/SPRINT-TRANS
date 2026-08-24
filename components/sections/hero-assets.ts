/**
 * Pojedynczy punkt konfiguracji zasobów wizualnych hero strony głównej.
 * Docelowy plik: `public/hero/hero-bg.jpg` — jedna spójna, fotorealistyczna
 * scena (droga, tło, autobus SPRINT-TRANS — wszystko w jednym kadrze).
 * Wystarczy wrzucić plik pod dokładnie tą ścieżką — `HeroSection` sam wykrywa
 * jego obecność (patrz `lib/public-assets.ts`) i przełącza się z ilustrowanego
 * placeholdera na docelowy materiał, bez żadnych zmian w kodzie.
 */
export const HERO_ASSETS = {
  backdropPath: "hero/hero-bg.jpg",
} as const;
