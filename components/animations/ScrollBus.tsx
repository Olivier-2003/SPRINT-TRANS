"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface ScrollBusProps {
  /** Opcjonalna ścieżka do prawdziwego zdjęcia autobusu — gdy brak, renderuje placeholder SVG. */
  src?: string;
  className?: string;
}

/**
 * Autobus SPRINT-TRANS reagujący na scroll — jego pozycja pozioma i lekki obrót
 * zależą od postępu przewijania całej strony, dając wrażenie przejazdu przez
 * kolejne sekcje. Placeholder graficzny (SVG) można później podmienić na
 * prawdziwe wycięte zdjęcie floty przez prop `src`, bez zmiany logiki animacji.
 */
export function ScrollBus({ src, className }: ScrollBusProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
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

  const translateX = reduced ? 0 : progress * 60 - 10;
  const rotate = reduced ? 0 : Math.sin(progress * Math.PI * 4) * 1.5;
  const bob = reduced ? 0 : Math.sin(progress * Math.PI * 10) * 4;

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className={cn("pointer-events-none select-none", className)}
      style={{
        transform: `translate3d(${translateX}%, ${bob}px, 0) rotate(${rotate}deg)`,
        transition: reduced ? undefined : "transform 120ms linear",
        willChange: "transform",
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-contain drop-shadow-2xl" />
      ) : (
        <BusPlaceholderSvg />
      )}
    </div>
  );
}

function BusPlaceholderSvg() {
  return (
    <svg viewBox="0 0 400 180" className="h-full w-full drop-shadow-2xl" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="200" cy="168" rx="170" ry="8" fill="black" opacity="0.25" />
      <rect x="20" y="40" width="330" height="90" rx="18" fill="var(--color-brand-navy-card, #1e3a5f)" stroke="var(--color-primary, #2563eb)" strokeWidth="3" />
      <rect x="20" y="40" width="330" height="34" rx="18" fill="var(--color-primary, #2563eb)" opacity="0.9" />
      <rect x="40" y="80" width="46" height="30" rx="4" fill="#bcd4f0" opacity="0.85" />
      <rect x="96" y="80" width="46" height="30" rx="4" fill="#bcd4f0" opacity="0.85" />
      <rect x="152" y="80" width="46" height="30" rx="4" fill="#bcd4f0" opacity="0.85" />
      <rect x="208" y="80" width="46" height="30" rx="4" fill="#bcd4f0" opacity="0.85" />
      <rect x="264" y="80" width="46" height="30" rx="4" fill="#bcd4f0" opacity="0.7" />
      <rect x="316" y="60" width="26" height="56" rx="6" fill="#0d1b2e" />
      <circle cx="90" cy="132" r="20" fill="#0d1b2e" />
      <circle cx="90" cy="132" r="9" fill="#5b7a99" />
      <circle cx="290" cy="132" r="20" fill="#0d1b2e" />
      <circle cx="290" cy="132" r="9" fill="#5b7a99" />
      <text x="35" y="105" fill="white" fontFamily="sans-serif" fontWeight="700" fontSize="14" opacity="0.9">
        SPRINT-TRANS
      </text>
    </svg>
  );
}
