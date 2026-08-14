import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollBus } from "@/components/animations/ScrollBus";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { CinematicRoadBackdrop } from "@/components/animations/CinematicRoadBackdrop";
import { HERO_ASSETS } from "@/components/sections/hero-assets";
import { publicAssetExists } from "@/lib/public-assets";

/**
 * Hero strony głównej. Tło i zdjęcie autobusu docelowo pochodzą z
 * `public/hero/hero-bg.jpg` i `public/hero/hero-bus.png` (patrz `hero-assets.ts`).
 * Dopóki tych plików nie ma w repo, renderowany jest dopracowany, ilustrowany
 * placeholder w docelowej kompozycji/skali — layout nie wymaga żadnych zmian
 * po podmianie plików.
 */
export function HeroSection() {
  const hasBackdrop = publicAssetExists(HERO_ASSETS.backdropPath);
  const hasBus = publicAssetExists(HERO_ASSETS.busPath);

  return (
    <section className="relative overflow-hidden bg-brand-navy pt-24 pb-48 text-white sm:pt-28 sm:pb-56 lg:pt-32 lg:pb-64">
      {/* Warstwa tła — docelowe kinowe zdjęcie drogi (public/hero/hero-bg.jpg) albo
          ilustrowany placeholder o tej samej kompozycji. Leży NAJNIŻEJ (z-0), pod
          wszystkimi warstwami gradientu/winiety poniżej — dzięki temu tekst po lewej
          pozostaje czytelny niezależnie od jasności zdjęcia. */}
      {hasBackdrop ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/${HERO_ASSETS.backdropPath}`}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <CinematicRoadBackdrop className="absolute inset-0 h-full w-full" />
      )}
      {/* Głęboki, kinowy navy — baza koloru niezależnie od tła. Świadomie
          PÓŁPRZEZROCZYSTA (color-mix z "transparent", nie z "black") — to
          wcześniej był bug: te same stopnie mieszane z "black" dawały w 100%
          nieprzezroczystą warstwę, która całkowicie zasłaniała zdjęcie tła
          niezależnie od tego, jak jasne/nasycone by ono nie było. Wartości
          opacity dodatkowo obniżone (były 0.65/0.28/0.55/0.40/0.55), bo przy
          starych poziomach ta warstwa razem z winietą i warstwą kontrastu
          zjadała nawet ~90% jasności zdjęcia tła. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(65% 75% at 90% 15%, color-mix(in oklch, var(--color-primary), transparent 78%), transparent), radial-gradient(50% 55% at 15% 90%, color-mix(in oklch, var(--color-primary), transparent 88%), transparent), linear-gradient(155deg, color-mix(in oklch, var(--color-brand-navy), transparent 80%) 0%, color-mix(in oklch, var(--color-brand-navy), transparent 88%) 50%, color-mix(in oklch, var(--color-brand-navy-card), transparent 80%) 100%)",
        }}
      />
      {/* Winieta krawędzi — pogłębia tło w rogach (kinowy efekt), ale już nie
          w pełni nieprzezroczysta (była: color-mix z "black" bez żadnego
          alpha = twarda, nieprzezroczysta krawędź). Zagnieżdżony color-mix
          dokłada przezroczystość na wierzch przyciemnienia. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(125% 95% at 50% 45%, transparent 55%, color-mix(in oklch, color-mix(in oklch, var(--color-brand-navy), black 45%), transparent 45%) 100%)",
        }}
      />
      {/* Warstwa kontrastu — chroni czytelność tekstu, ale TYLKO po lewej
          stronie (strefa tekstu). Wcześniej opadała liniowo do 20% na samej
          prawej krawędzi (efektywnie wciąż prawie nieprzezroczysta za
          autobusem/tłem) — teraz kończy się blisko przezroczystości już
          w okolicach ~65% szerokości, więc tło po prawej jest w pełni widoczne. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to right, var(--color-brand-navy) 0%, color-mix(in oklch, var(--color-brand-navy), transparent 10%) 30%, color-mix(in oklch, var(--color-brand-navy), transparent 55%) 50%, color-mix(in oklch, var(--color-brand-navy), transparent 92%) 65%, transparent 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-24 z-[1] h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[0.9fr_1.2fr] lg:items-center lg:gap-8 lg:px-8">
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

        <ScrollReveal delay={300} direction="right" className="relative lg:-mr-10 lg:w-[122%] lg:justify-self-end">
          {/* Miejsce docelowe pod zdjęcie autokaru SPRINT-TRANS — duża "scena"
              (ambientowa poświata + cień pod kołami) z placeholderem SVG reagującym
              na scroll. Kolumna celowo "wylewa się" poza siatkę treści (bleed w prawo),
              tak by po podmianie na `public/hero/hero-bus.png` autobus wizualnie
              dominował prawą połowę hero, tak jak w referencji. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-125 rounded-full opacity-70"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in oklch, var(--color-primary), transparent 60%), transparent)",
            }}
          />
          <div className="relative mx-auto aspect-4/3 w-full max-w-2xl lg:max-w-none">
            {hasBus ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/${HERO_ASSETS.busPath}`}
                alt="Autokar SPRINT-TRANS"
                className="absolute inset-0 h-full w-full object-contain drop-shadow-2xl"
              />
            ) : (
              <ScrollBus className="absolute inset-0" />
            )}
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
