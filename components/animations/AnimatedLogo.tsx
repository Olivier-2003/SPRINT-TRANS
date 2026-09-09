import { cn } from "@/lib/utils";

interface AnimatedLogoProps {
  className?: string;
}

/** Prawdziwe logo SPRINT-TRANS (public/brand/sprint-trans-logo.png) — plik z
 *  profesjonalnie wyciętym tłem (przezroczyste PNG), renderowane bez żadnej
 *  dodatkowej plakietki/podkładki. `className` ustala wysokość obrazu.
 *
 *  Przy pierwszym załadowaniu logo "rysuje się" od lewej do prawej (odsłania
 *  się stopniowo, z podświetloną krawędzią imitującą pisak) — logo to plik
 *  PNG bez ścieżek wektorowych, więc to najbliższe wrażenie prawdziwego
 *  rysowania, jakie da się uzyskać bez przerabiania go na SVG. */
export function AnimatedLogo({ className }: AnimatedLogoProps) {
  return (
    <span className={cn("relative inline-block w-auto shrink-0", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/sprint-trans-logo.png"
        alt="SPRINT-TRANS"
        className="logo-reveal-img h-full w-auto object-contain"
      />
      <span
        aria-hidden="true"
        className="logo-reveal-tip pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-primary shadow-[0_0_8px_2px_var(--color-primary)]"
      />
    </span>
  );
}
