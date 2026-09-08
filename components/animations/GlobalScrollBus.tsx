"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface GlobalScrollBusProps {
  /** Opcjonalna ścieżka do docelowego, wyciętego zdjęcia autobusu (PNG/WebP
   *  z przezroczystym tłem) — gdy brak, renderuje lekki placeholder SVG. */
  src?: string;
  className?: string;
}

function clamp(x: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, x));
}

function clamp01(x: number): number {
  return clamp(x, 0, 1);
}

/** Klasyczny smoothstep — płynne przejście 0→1 bez skoków prędkości na krawędziach. */
function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

interface Waypoint {
  t: number;
  value: number;
}

/** Interpoluje wartość między uporządkowanymi waypointami, z ease-in/ease-out
 *  (smoothstep) w obrębie każdego odcinka — ruch przyspiesza i zwalnia płynnie
 *  między punktami, bez skoków prędkości ani teleportacji. */
function alongPath(waypoints: Waypoint[], t: number): number {
  const first = waypoints[0];
  const last = waypoints[waypoints.length - 1];
  if (t <= first.t) return first.value;
  if (t >= last.t) return last.value;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i];
    const b = waypoints[i + 1];
    if (t >= a.t && t <= b.t) {
      const localT = smoothstep(a.t, b.t, t);
      return a.value + (b.value - a.value) * localT;
    }
  }
  return last.value;
}

// Tor poziomy (vw) — kilka waypointów rozłożonych na całej szerokości widocznego
// layoutu (NIE tylko przy krawędziach), tak by autobus był wyraźnym, zauważalnym
// motywem przejeżdżającym przez stronę w trakcie scrollowania.
const HORIZONTAL_PATH: Waypoint[] = [
  { t: 0, value: 20 },
  { t: 0.25, value: 73 },
  { t: 0.5, value: 32 },
  { t: 0.75, value: 68 },
  { t: 1, value: 22 },
];

// Tor pionowy (vh) — niezależna, delikatna fala w obrębie viewportu, żeby ruch
// nie wyglądał jak przejazd po jednej prostej.
const VERTICAL_PATH: Waypoint[] = [
  { t: 0, value: 14 },
  { t: 0.2, value: 58 },
  { t: 0.4, value: 24 },
  { t: 0.6, value: 66 },
  { t: 0.8, value: 30 },
  { t: 1, value: 56 },
];

const DERIVATIVE_DELTA = 0.004;

/**
 * Mały autobus SPRINT-TRANS "podróżujący" przez całą stronę główną, niezależnie
 * od hero — jego pozycja zależy od globalnego postępu scrolla całego dokumentu.
 * Porusza się po kilku waypointach (patrz `HORIZONTAL_PATH`/`VERTICAL_PATH`),
 * płynnie interpolowanych (ease-in/ease-out na każdym odcinku), więc realnie
 * przemierza widoczną szerokość layoutu, a nie tylko ślizga się przy krawędzi.
 *
 * Bezpieczeństwo — dlaczego NIGDY nie zasłania treści:
 * - `position: fixed`, więc nie wpływa na wysokość/układ żadnej sekcji,
 * - `pointer-events-none` — nigdy nie przechwytuje kliknięć/interakcji,
 * - ma NISKI, jawny `z-index` (poniżej treści), a każda sekcja strony głównej
 *   (i stopka) ma `position: relative`, więc w kolejności malowania CSS zawsze
 *   znajduje się NAD autobusem, niezależnie od tego, w którym miejscu strony
 *   akurat się on znajduje — to gwarancja architektoniczna (stacking context),
 *   a nie tylko dobór trasy tak, by "zwykle" niczego nie zasłaniać,
 * - widoczny dopiero od `xl` (1280px) w górę; poniżej tego progu jest ukryty,
 * - przy `prefers-reduced-motion` animacja jest całkowicie wyłączona.
 */
export function GlobalScrollBus({ src, className }: GlobalScrollBusProps) {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const p = max > 0 ? clamp01(window.scrollY / max) : 0;
        setProgress(p);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  if (reduced) return null;

  const t = progress;
  const leftVw = alongPath(HORIZONTAL_PATH, t);
  const topVh = alongPath(VERTICAL_PATH, t);

  // Kierunek ruchu wyznaczony numerycznie (pochodna toru poziomego) — steruje
  // obrotem i odwróceniem sprite'a przy zmianie kierunku.
  const leftAhead = alongPath(HORIZONTAL_PATH, clamp01(t + DERIVATIVE_DELTA));
  const velocity = (leftAhead - leftVw) / DERIVATIVE_DELTA;
  const rotate = clamp(velocity * 0.05, -7, 7);
  const facingLeft = velocity < 0;

  const wobble = Math.sin(t * Math.PI * 18) * 1.5;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed z-0 hidden w-40 -translate-x-1/2 -translate-y-1/2 select-none xl:block",
        className
      )}
      style={{
        left: `${leftVw}vw`,
        top: `${topVh}vh`,
        transform: `translate(-50%, -50%) translateY(${wobble}px) rotate(${rotate}deg) ${
          facingLeft ? "scaleX(-1)" : ""
        }`,
        transition: "transform 150ms linear",
        willChange: "transform, top, left",
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-contain drop-shadow-2xl" />
      ) : (
        <MiniBusPlaceholderSvg />
      )}
    </div>
  );
}

/**
 * Placeholder — mały, stonowany zarys autobusu (bez jaskrawego koloru marki),
 * żeby czytać się jako dyskretny, dekoracyjny akcent, a nie kreskówkowa maskotka.
 * Docelowo podmieniany jednym plikiem, patrz `global-bus-asset.ts`.
 */
function MiniBusPlaceholderSvg() {
  return (
    <svg viewBox="0 0 120 56" className="h-full w-full opacity-80 drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="6"
        y="14"
        width="96"
        height="30"
        rx="8"
        fill="var(--color-brand-navy, #0d1b2e)"
        fillOpacity="0.85"
        stroke="white"
        strokeOpacity="0.55"
        strokeWidth="1.5"
      />
      <rect x="14" y="20" width="80" height="12" rx="3" fill="white" opacity="0.22" />
      <circle cx="26" cy="46" r="6" fill="#0d1b2e" />
      <circle cx="26" cy="46" r="2.5" fill="white" opacity="0.5" />
      <circle cx="82" cy="46" r="6" fill="#0d1b2e" />
      <circle cx="82" cy="46" r="2.5" fill="white" opacity="0.5" />
    </svg>
  );
}
