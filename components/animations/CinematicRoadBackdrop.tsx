/**
 * Ilustrowane tło hero — nocna scena z księżycem, trzema warstwami gór i drogą
 * w perspektywie ze światłem reflektorów, budująca "kinowy" nastrój dopóki nie
 * zostanie podpięte prawdziwe zdjęcie (patrz `hero-assets.ts`). Celowo stonowane
 * (niska opacity, miękkie krawędzie) — leży POD warstwami gradientu/winiety
 * w HeroSection, które gwarantują czytelność tekstu.
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
        <radialGradient id="ctb-moon-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#eaf2ff" stopOpacity="0.9" />
          <stop offset="35%" stopColor="#c7dcff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#c7dcff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ctb-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.16" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ctb-headlight-glow" cx="50%" cy="100%" r="70%">
          <stop offset="0%" stopColor="#fff3d6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#fff3d6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ctb-mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="white" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {/* Księżyc + poświata */}
      <circle cx="1180" cy="150" r="46" fill="#f3f7ff" opacity="0.85" />
      <circle cx="1180" cy="150" r="220" fill="url(#ctb-moon-glow)" />

      {/* Najdalsze pasmo gór */}
      <polygon
        points="0,560 160,440 320,520 480,380 660,540 840,410 1020,530 1220,390 1420,530 1600,440 1600,900 0,900"
        fill="color-mix(in oklch, var(--color-brand-navy-card), black 35%)"
        opacity="0.4"
      />
      {/* Środkowe pasmo gór */}
      <polygon
        points="0,620 180,460 340,560 520,400 700,580 880,440 1060,560 1260,420 1440,560 1600,480 1600,900 0,900"
        fill="color-mix(in oklch, var(--color-brand-navy-card), black 22%)"
        opacity="0.5"
      />
      {/* Bliższe pasmo gór */}
      <polygon
        points="0,700 220,560 420,660 640,520 860,660 1080,540 1300,660 1600,580 1600,900 0,900"
        fill="color-mix(in oklch, var(--color-brand-navy-card), black 8%)"
        opacity="0.7"
      />
      {/* Mgła między pasmami, wzmacnia głębię */}
      <rect x="0" y="520" width="1600" height="90" fill="url(#ctb-mist)" />

      {/* Droga w perspektywie, znikająca w kierunku horyzontu */}
      <ellipse cx="800" cy="640" rx="140" ry="80" fill="url(#ctb-headlight-glow)" />
      <polygon
        points="620,900 980,900 840,560 760,560"
        fill="color-mix(in oklch, var(--color-brand-navy), black 25%)"
        opacity="0.85"
      />
      <polygon points="620,900 980,900 840,560 760,560" fill="url(#ctb-road)" />
      <line
        x1="800"
        y1="900"
        x2="798"
        y2="560"
        stroke="white"
        strokeOpacity="0.32"
        strokeWidth="4"
        strokeDasharray="26 22"
      />
    </svg>
  );
}
