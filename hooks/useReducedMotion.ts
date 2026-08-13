"use client";

import { useEffect, useState } from "react";

/**
 * Zawsze zaczyna od `false` (tak samo renderowane na serwerze, gdzie `window`
 * nie istnieje), a dopiero po zamontowaniu odczytuje realną preferencję
 * systemową — dzięki temu pierwszy render klienta jest identyczny z HTML-em
 * z serwera (brak niezgodności hydratacji).
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- celowa korekta po hydratacji: prawdziwa wartość znana jest wyłącznie w przeglądarce
    setReduced(query.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  return reduced;
}
