"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Kierunek wejścia — "up" (domyślnie), "left", "right" lub "none" (samo przenikanie). */
  direction?: "up" | "left" | "right" | "none";
  /** Opóźnienie w ms, przydatne do rozłożenia w czasie kilku elementów w siatce. */
  delay?: number;
  as?: keyof React.JSX.IntrinsicElements;
}

const DIRECTION_OFFSET: Record<string, string> = {
  up: "translate-y-6",
  left: "-translate-x-6",
  right: "translate-x-6",
  none: "",
};

export function ScrollReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  // `reduced` zaczyna jako false (patrz useReducedMotion) i ewentualnie przełącza się
  // na true tuż po hydratacji — liczenie widoczności jako suma obu flag pozwala uniknąć
  // dodatkowego ręcznego setState() dla przypadku ograniczonych animacji.
  const isVisible = visible || reduced;

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  const Comp = Tag as React.ElementType;

  return (
    <Comp
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible ? "translate-x-0 translate-y-0 opacity-100" : cn("opacity-0", DIRECTION_OFFSET[direction]),
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Comp>
  );
}
