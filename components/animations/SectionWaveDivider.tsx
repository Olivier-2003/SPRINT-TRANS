interface SectionWaveDividerProps {
  /** Kolor wypełnienia fali — zwykle kolor sekcji, do której fala "wprowadza". */
  fill: string;
  /** "top" = fala nad górną krawędzią sekcji, "bottom" = fala pod dolną krawędzią. */
  position: "top" | "bottom";
  className?: string;
}

/**
 * Ostra, czytelna fala na granicy dwóch sekcji o różnych kolorach tła —
 * zamiast gradientu (który przy dużym skoku jasności/koloru wygląda na
 * zamazany/"brudny"). Płaska krawędź strony wypełnienia styka się bez szwu
 * z sekcją, do której należy; druga krawędź faluje.
 */
export function SectionWaveDivider({ fill, position, className }: SectionWaveDividerProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 h-14 w-full sm:h-20 ${
        position === "top" ? "top-0 -translate-y-[calc(100%-1px)]" : "bottom-0 translate-y-[calc(100%-1px)] rotate-180"
      } ${className ?? ""}`}
    >
      <path
        d="M0,100 L0,45 C240,10 480,80 720,45 C960,10 1200,80 1440,45 L1440,100 Z"
        style={{ fill }}
      />
    </svg>
  );
}
