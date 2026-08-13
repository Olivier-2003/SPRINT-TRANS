"use client";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface AnimatedLogoProps {
  className?: string;
  /** Kolor konturu/tekstu logo — domyślnie biały (dla granatowego tła navbaru/hero). */
  tone?: "light" | "dark";
}

/**
 * Placeholder logo SPRINT-TRANS przygotowany pod animację "SVG draw": kontury
 * rysują się (stroke-dashoffset), następnie kształt się wypełnia. To wyłącznie
 * tymczasowy glif (autobus + drogowa linia) — gdy dostępne będzie docelowe logo
 * firmy jako SVG, wystarczy podmienić zawartość <svg> poniżej, zachowując klasy
 * `logo-draw-path` na konturach i `logo-fill` na wypełnieniach, żeby animacja
 * zadziałała bez dodatkowych zmian w reszcie strony.
 */
export function AnimatedLogo({ className, tone = "light" }: AnimatedLogoProps) {
  const reduced = useReducedMotion();
  const stroke = tone === "light" ? "#ffffff" : "var(--color-primary)";
  const fill = tone === "light" ? "#ffffff" : "var(--color-foreground)";

  return (
    <svg
      viewBox="0 0 220 56"
      className={cn("h-8 w-auto overflow-visible", className)}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="SPRINT-TRANS"
    >
      <path
        d="M6 40 h34 a6 6 0 0 0 6 -6 v-10 a6 6 0 0 0 -4 -5.6 L30 14 H10 a4 4 0 0 0 -4 4 Z"
        fill="none"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinejoin="round"
        pathLength={1}
        className={reduced ? undefined : "logo-draw-path"}
        style={reduced ? { strokeDasharray: "none" } : undefined}
      />
      <circle cx="14" cy="40" r="4" fill="none" stroke={stroke} strokeWidth="2" pathLength={1} className={reduced ? undefined : "logo-draw-path"} />
      <circle cx="34" cy="40" r="4" fill="none" stroke={stroke} strokeWidth="2" pathLength={1} className={reduced ? undefined : "logo-draw-path"} />
      <path
        d="M10 40 a4 4 0 0 1 4 -4 a4 4 0 0 1 4 4 M30 40 a4 4 0 0 1 4 -4 a4 4 0 0 1 4 4"
        fill={fill}
        className={reduced ? undefined : "logo-fill"}
      />
      <text
        x="52"
        y="35"
        fontFamily="var(--font-geist-sans), sans-serif"
        fontWeight={700}
        fontSize="22"
        letterSpacing="0.5"
        fill={fill}
        className={reduced ? undefined : "logo-fill"}
      >
        SPRINT-TRANS
      </text>
    </svg>
  );
}
