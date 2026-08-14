/**
 * Dopracowana ilustracja autokaru (profil boczny) — cieniowana bryła, przyciemniane
 * szyby z odbiciem, oświetlenie, felgi ze światłocieniem. To wciąż ilustracja
 * wektorowa, nie fotografia — najbardziej premium wersja placeholdera, jaką da się
 * zbudować bez prawdziwego zdjęcia. Zastępowana w całości, gdy pojawi się plik pod
 * `HERO_ASSETS.busPath` (patrz `components/sections/hero-assets.ts`).
 */
const MULLION_X = [95, 150, 205, 260, 315, 370];

export function PremiumBusIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 460 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="premium-bus-clip">
          <path d="M34,150 L34,78 C34,60 50,46 70,46 L392,46 C404,46 415,50 423,60 L448,94 C453,101 456,110 456,119 L456,150 Z" />
        </clipPath>
        <linearGradient id="premium-bus-body" x1="0.15" y1="0" x2="0.55" y2="1">
          <stop offset="0%" stopColor="#f5f8fc" />
          <stop offset="32%" stopColor="#c9d4e2" />
          <stop offset="68%" stopColor="var(--color-brand-navy-card, #1e3a5f)" />
          <stop offset="100%" stopColor="var(--color-brand-navy, #0d1b2e)" />
        </linearGradient>
        <linearGradient id="premium-bus-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a9cdf0" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#2c4d70" stopOpacity="0.96" />
          <stop offset="100%" stopColor="#0a1420" stopOpacity="0.98" />
        </linearGradient>
        <linearGradient id="premium-bus-stripe" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-primary, #2563eb)" stopOpacity="0.55" />
          <stop offset="55%" stopColor="var(--color-primary, #2563eb)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--color-primary, #2563eb)" stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id="premium-bus-hub" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#aebac8" />
          <stop offset="55%" stopColor="#4b5563" />
          <stop offset="100%" stopColor="#0f1520" />
        </radialGradient>
        <filter id="premium-bus-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g clipPath="url(#premium-bus-clip)">
        <rect x="0" y="0" width="460" height="200" fill="url(#premium-bus-body)" />
        <rect x="0" y="46" width="460" height="16" fill="white" opacity="0.28" />
        <rect x="16" y="58" width="444" height="38" rx="4" fill="url(#premium-bus-glass)" />
        <rect x="16" y="58" width="444" height="6" fill="white" opacity="0.35" />
        {MULLION_X.map((x) => (
          <line
            key={x}
            x1={x}
            y1="58"
            x2={x}
            y2="96"
            stroke="var(--color-brand-navy, #0d1b2e)"
            strokeOpacity="0.65"
            strokeWidth="4"
          />
        ))}
        <rect x="0" y="118" width="460" height="15" fill="url(#premium-bus-stripe)" />
        <rect x="0" y="133" width="460" height="20" fill="black" opacity="0.16" />
      </g>

      <path
        d="M34,150 L34,78 C34,60 50,46 70,46 L392,46 C404,46 415,50 423,60 L448,94 C453,101 456,110 456,119 L456,150"
        fill="none"
        stroke="white"
        strokeOpacity="0.22"
        strokeWidth="1.5"
      />

      <ellipse cx="447" cy="112" rx="7" ry="5" fill="#fff3d6" filter="url(#premium-bus-glow)" />
      <rect x="30" y="107" width="5" height="15" rx="2" fill="#b91c1c" opacity="0.85" />

      <text
        x="150"
        y="130"
        fill="white"
        fillOpacity="0.9"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="700"
        fontSize="11"
        letterSpacing="2"
      >
        SPRINT-TRANS
      </text>

      <circle cx="118" cy="152" r="26" fill="#12161d" />
      <circle cx="118" cy="152" r="14" fill="url(#premium-bus-hub)" />
      <circle cx="372" cy="152" r="26" fill="#12161d" />
      <circle cx="372" cy="152" r="14" fill="url(#premium-bus-hub)" />
    </svg>
  );
}
