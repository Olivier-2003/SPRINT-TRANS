/**
 * Ilustrowane tło hero — sylwetki gór i droga w perspektywie, budujące "kinowy"
 * nastrój dopóki nie zostanie podpięte prawdziwe zdjęcie (patrz `hero-assets.ts`).
 * Celowo stonowane (niska opacity, brak ostrych krawędzi) — leży POD warstwami
 * gradientu/winiety w HeroSection, które gwarantują czytelność tekstu.
 */
export function CinematicRoadBackdrop({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ctb-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.14" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Dalekie pasmo gór */}
      <polygon
        points="0,620 180,460 340,560 520,400 700,580 880,440 1060,560 1260,420 1440,560 1600,480 1600,900 0,900"
        fill="color-mix(in oklch, var(--color-brand-navy-card), black 25%)"
        opacity="0.5"
      />
      {/* Bliższe pasmo gór */}
      <polygon
        points="0,700 220,560 420,660 640,520 860,660 1080,540 1300,660 1600,580 1600,900 0,900"
        fill="color-mix(in oklch, var(--color-brand-navy-card), black 8%)"
        opacity="0.65"
      />
      {/* Droga w perspektywie, znikająca w kierunku horyzontu */}
      <polygon
        points="620,900 980,900 840,560 760,560"
        fill="color-mix(in oklch, var(--color-brand-navy), black 25%)"
        opacity="0.8"
      />
      <polygon points="620,900 980,900 840,560 760,560" fill="url(#ctb-road)" />
      <line
        x1="800"
        y1="900"
        x2="798"
        y2="560"
        stroke="white"
        strokeOpacity="0.3"
        strokeWidth="4"
        strokeDasharray="26 22"
      />
    </svg>
  );
}
