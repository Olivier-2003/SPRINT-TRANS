import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollBus } from "@/components/animations/ScrollBus";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { CinematicRoadBackdrop } from "@/components/animations/CinematicRoadBackdrop";
import { HERO_ASSETS } from "@/components/sections/hero-assets";

/**
 * Hero strony głównej. Tło i zdjęcie autobusu to na razie placeholdery — gotowe
 * do podmiany na docelowe zdjęcie floty SPRINT-TRANS bez zmiany layoutu, wyłącznie
 * przez uzupełnienie `HERO_ASSETS` w `hero-assets.ts` (patrz też komentarze przy
 * warstwie tła i ScrollBus poniżej).
 */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brand-navy pt-24 pb-48 text-white sm:pt-28 sm:pb-56 lg:pt-32 lg:pb-64">
      {/* Warstwa tła — docelowe kinowe zdjęcie drogi/gór (gdy `HERO_ASSETS.backdropSrc`
          jest ustawione) albo ilustrowany placeholder o tej samej kompozycji. Leży
          NAJNIŻEJ (z-0), pod wszystkimi warstwami gradientu/winiety poniżej — dzięki
          temu tekst po lewej pozostaje czytelny niezależnie od jasności zdjęcia. */}
      {HERO_ASSETS.backdropSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={HERO_ASSETS.backdropSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <CinematicRoadBackdrop className="absolute inset-0 h-full w-full" />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 70% at 88% 10%, color-mix(in oklch, var(--color-primary), transparent 25%), transparent), radial-gradient(50% 60% at 78% 55%, color-mix(in oklch, var(--color-primary), transparent 55%), transparent), radial-gradient(45% 45% at 10% 90%, color-mix(in oklch, var(--color-primary), transparent 70%), transparent), radial-gradient(90% 70% at 50% 105%, color-mix(in oklch, var(--color-brand-navy-card), transparent 10%), transparent), linear-gradient(160deg, color-mix(in oklch, var(--color-brand-navy), black 15%) 0%, var(--color-brand-navy) 55%, color-mix(in oklch, var(--color-brand-navy-card), black 10%) 100%)",
        }}
      />
      {/* Delikatna siatka — sugeruje drogę/asfalt, wzmacnia „premium” charakter tła. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      {/* Winieta krawędzi — pogłębia tło, wzmacnia fokus na treści i autobusie. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 50%, transparent 55%, color-mix(in oklch, var(--color-brand-navy), black 35%) 100%)",
        }}
      />
      {/* Warstwa kontrastu — gwarantuje czytelność tekstu niezależnie od przyszłego zdjęcia. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] bg-gradient-to-r from-brand-navy via-brand-navy/80 to-brand-navy/15"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-24 z-[1] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[0.95fr_1.15fr] lg:items-center lg:gap-8 lg:px-8">
        <ScrollReveal delay={150} className="flex max-w-2xl flex-col gap-6">
          <span className="w-fit rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold tracking-[0.2em] text-white/80 uppercase ring-1 ring-white/15">
            U nas jeździ się
          </span>
          <h1 className="text-7xl leading-[0.95] font-extrabold tracking-tight sm:text-8xl md:text-9xl">
            SPRINTEM
          </h1>
          <p className="max-w-lg text-xl text-brand-navy-muted sm:text-2xl">
            Bezpieczny, komfortowy i punktualny przewóz osób na terenie kraju i całej Europy.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Button
              render={<Link href="/kalkulator" />}
              nativeButton={false}
              size="lg"
              className="gap-1.5 rounded-full px-7 py-6 text-base shadow-[0_20px_40px_-15px_rgba(37,99,235,0.6)]"
            >
              Zobacz ofertę
              <ArrowRight />
            </Button>
            <Button
              render={<Link href="/flota" />}
              nativeButton={false}
              size="lg"
              variant="outline"
              className="rounded-full border-white/20 bg-transparent px-7 py-6 text-base text-white hover:bg-white/10 hover:text-white"
            >
              Nasza flota
            </Button>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={300} direction="right" className="relative lg:-mr-6 lg:w-[112%] lg:justify-self-end">
          {/* Miejsce docelowe pod zdjęcie autokaru SPRINT-TRANS — wyraźnie
              wydzielona "scena" (reflektor z góry, poświata i platforma pod
              kołami) z placeholderem SVG reagującym na scroll. Rozmiar i pozycja
              celowo bliskie docelowej kompozycji (autobus "bleeduje" poza kolumnę
              treści), gotowe na podmianę na finalną fotografię przez `HERO_ASSETS.busSrc`. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-150 rounded-full opacity-90"
            style={{
              background: "radial-gradient(closest-side, color-mix(in oklch, var(--color-primary), transparent 45%), transparent)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute -top-16 left-1/2 h-56 w-72 -translate-x-1/2 opacity-70 sm:w-96"
            style={{
              background: "conic-gradient(from 180deg at 50% 0%, transparent, white 8%, transparent 16%)",
              filter: "blur(2px)",
            }}
          />
          <div className="relative mx-auto aspect-4/3 w-full max-w-2xl lg:max-w-none">
            <ScrollBus src={HERO_ASSETS.busSrc} className="absolute inset-0" />
            <div
              aria-hidden="true"
              className="absolute inset-x-6 bottom-6 h-5 rounded-full bg-black/50 blur-xl sm:inset-x-10"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
