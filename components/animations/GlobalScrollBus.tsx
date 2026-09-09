"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface GlobalScrollBusProps {
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

// Tor pionowy (vh) — swobodnie przemierza wysokość strony. Dzięki wysokiemu
// z-index (patrz niżej) autobus zawsze rysuje się NAD treścią, więc nie ma
// ryzyka, że "zgubi się" w pustych partiach strony — może więc mieć szerszy,
// bardziej żywy zakres ruchu.
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
 * Celowo jeździ NAD treścią sekcji (wysoki `z-index`, poniżej tylko sticky
 * navbaru) — ma "przejeżdżać przez" karty/sekcje jako widoczny, dekoracyjny
 * akcent, a nie znikać pod ich tłem. Mimo to nigdy nie przeszkadza w
 * korzystaniu ze strony:
 * - `position: fixed`, więc nie wpływa na wysokość/układ żadnej sekcji,
 * - `pointer-events-none` — nigdy nie przechwytuje kliknięć/interakcji,
 * - widoczny na wszystkich szerokościach, mniejszy na mobile (rośnie z breakpointami),
 * - przy `prefers-reduced-motion` animacja jest całkowicie wyłączona.
 */
export function GlobalScrollBus({ className }: GlobalScrollBusProps) {
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
        "pointer-events-none fixed z-40 w-24 -translate-x-1/2 -translate-y-1/2 select-none sm:w-28 lg:w-32 xl:w-40",
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
      <ClassicBusIcon />
    </div>
  );
}

/**
 * Ikona autobusu — czysty, "klasyczny" kształt (sylwetka autokaru z boku) z
 * gradientem w kolorach marki, zamiast fotograficznego wycinka. Czytelna jako
 * mały, dekoracyjny akcent w dowolnym miejscu strony, niezależnie od tła pod spodem.
 */
function ClassicBusIcon() {
  return (
    <svg viewBox="0 0 120 56" className="h-full w-full drop-shadow-2xl" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="global-bus-body" x1="0.1" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="color-mix(in oklch, var(--color-primary, #2563eb), white 30%)" />
          <stop offset="55%" stopColor="var(--color-primary, #2563eb)" />
          <stop offset="100%" stopColor="var(--color-brand-navy, #0d1b2e)" />
        </linearGradient>
        <linearGradient id="global-bus-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.75" />
          <stop offset="100%" stopColor="white" stopOpacity="0.25" />
        </linearGradient>
        <radialGradient id="global-bus-hub" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="60%" stopColor="#475569" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>
      </defs>

      {/* Sylwetka nadwozia — dziób (przód) po prawej, lekko pochylona szyba. */}
      <path
        d="M7,44 L7,27 C7,20 12,14 20,13 L80,13 C86,13 91,15 95,20 L107,33 C110,36.5 111,39.5 110,44 Z"
        fill="url(#global-bus-body)"
      />
      {/* Pas szyb */}
      <path
        d="M15,20 C15,17.5 17,16 20,16 L79,16 C83,16 87,17.5 90,20.5 L98,28 L15,28 Z"
        fill="url(#global-bus-glass)"
      />
      {/* Przeszklenia — pionowe słupki */}
      {[30, 45, 60, 75].map((x) => (
        <line key={x} x1={x} y1="16.5" x2={x} y2="28" stroke="var(--color-brand-navy, #0d1b2e)" strokeOpacity="0.5" strokeWidth="1.4" />
      ))}
      {/* Akcentowy pas w kolorze marki */}
      <rect x="7" y="34" width="103" height="4" fill="white" fillOpacity="0.35" />
      {/* Reflektor */}
      <ellipse cx="105" cy="38" rx="3" ry="2.2" fill="#fff3d6" />
      {/* Koła */}
      <circle cx="28" cy="46" r="7" fill="#0f172a" />
      <circle cx="28" cy="46" r="3.4" fill="url(#global-bus-hub)" />
      <circle cx="90" cy="46" r="7" fill="#0f172a" />
      <circle cx="90" cy="46" r="3.4" fill="url(#global-bus-hub)" />
    </svg>
  );
}
