"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import { PremiumBusIllustration } from "@/components/animations/PremiumBusIllustration";

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
        <PremiumBusIllustration className="h-full w-full drop-shadow-2xl" />
      )}
    </div>
  );
}
