/**
 * Pojedynczy punkt konfiguracji zasobów wizualnych hero strony głównej.
 * Podmiana na docelowe materiały SPRINT-TRANS = wpisanie ścieżek do plików
 * (np. w `public/hero/`) poniżej — bez żadnych zmian w komponencie HeroSection.
 * Dopóki pola pozostają `undefined`, hero renderuje dopracowany placeholder
 * (ilustrowane tło + SVG autobusu) w docelowej pozycji/skali/warstwach.
 */
export const HERO_ASSETS: {
  /** Docelowe zdjęcie tła (droga/góry, szerokie, ciemne/kinowe ujęcie). */
  backdropSrc?: string;
  /** Docelowe wycięte zdjęcie autokaru SPRINT-TRANS (przezroczyste tło, PNG/WebP). */
  busSrc?: string;
} = {
  backdropSrc: undefined,
  busSrc: undefined,
};
