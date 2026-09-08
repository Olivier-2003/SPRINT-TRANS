import { cn } from "@/lib/utils";

interface AnimatedLogoProps {
  className?: string;
}

/** Prawdziwe logo SPRINT-TRANS (public/brand/sprint-trans-logo.png) — plik z
 *  profesjonalnie wyciętym tłem (przezroczyste PNG), renderowane bez żadnej
 *  dodatkowej plakietki/podkładki. `className` ustala wysokość obrazu. */
export function AnimatedLogo({ className }: AnimatedLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/sprint-trans-logo.png"
      alt="SPRINT-TRANS"
      className={cn("w-auto shrink-0 object-contain", className)}
    />
  );
}
