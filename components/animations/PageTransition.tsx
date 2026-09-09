"use client";

import { usePathname } from "next/navigation";

/**
 * Delikatne przejście (fade + lekkie wsunięcie) przy każdej zmianie trasy —
 * `key={pathname}` wymusza remount tego diva przy nawigacji, co za każdym
 * razem od nowa uruchamia animację CSS `page-fade-in` (patrz globals.css).
 * Navbar/Footer zostają zamontowane (bez migotania), zmienia się tylko treść.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-fade-in flex flex-1 flex-col">
      {children}
    </div>
  );
}
