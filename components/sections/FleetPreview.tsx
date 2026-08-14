import Link from "next/link";
import { ArrowRight, Users, Wifi, Snowflake, Tv, CircleCheck, Bus as BusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { cn } from "@/lib/utils";
import type { Bus, BusPhoto } from "@/lib/generated/prisma/client";

type BusWithPhotos = Bus & { photos: BusPhoto[] };

function featureIcon(feature: string) {
  const f = feature.toLowerCase();
  if (f.includes("wifi") || f.includes("wi-fi")) return Wifi;
  if (f.includes("klimaty")) return Snowflake;
  if (f.includes("dvd") || f.includes("tv") || f.includes("monitor")) return Tv;
  return CircleCheck;
}

/**
 * Sekcja floty na stronie głównej. Zdjęcia autobusów są opcjonalne (pole
 * `photos` z panelu) — dopóki administrator ich nie doda, karta pokazuje
 * czytelny placeholder "Zdjęcie wkrótce", bez blokowania wdrożenia. Liczba
 * kolumn siatki dopasowuje się do faktycznej liczby autobusów (do 4) —
 * layout jest gotowy na 4 karty w rzędzie, gdy flota się powiększy, bez
 * pozostawiania pustych kart-placeholderów.
 */
export function FleetPreview({ buses }: { buses: BusWithPhotos[] }) {
  const preview = buses.slice(0, 4);
  const gridCols =
    preview.length >= 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : preview.length === 3
        ? "sm:grid-cols-2 lg:grid-cols-3"
        : preview.length === 2
          ? "sm:grid-cols-2"
          : "";

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-14 md:py-20 lg:px-8">
      <ScrollReveal className="mb-10 flex flex-col items-start gap-3">
        <span className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Nasza flota</span>
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Komfort i bezpieczeństwo</h2>
      </ScrollReveal>

      {preview.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Flota będzie prezentowana tutaj wkrótce — dane są uzupełniane w panelu administracyjnym.
        </p>
      ) : (
        <div className={cn("grid gap-8", gridCols)}>
          {preview.map((bus, i) => {
            const features = Array.isArray(bus.features) ? (bus.features as string[]) : [];
            return (
              <ScrollReveal key={bus.id} delay={i * 80}>
                <Link href={`/flota/${bus.id}`} className="group block h-full">
                  <Card className="h-full gap-0 overflow-hidden rounded-2xl border border-border/60 py-0 shadow-sm ring-0 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-2xl">
                    <div className="relative aspect-[4/3] overflow-hidden bg-brand-navy">
                      {bus.photos[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={bus.photos[0].url}
                          alt={bus.brandModel}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-brand-navy-card to-brand-navy text-brand-navy-muted">
                          <div
                            aria-hidden="true"
                            className="absolute size-32 rounded-full bg-primary/20 blur-2xl"
                          />
                          <BusIcon className="relative size-12 text-white/70" strokeWidth={1.5} />
                          <span className="relative text-sm font-medium text-white/60">Zdjęcie wkrótce</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/0" />
                      <span className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold tracking-wide text-brand-navy uppercase shadow-sm backdrop-blur">
                        {bus.seats} miejsc
                      </span>
                      <span className="absolute bottom-4 left-5 text-2xl font-bold text-white drop-shadow-sm">
                        {bus.brandModel}
                      </span>
                    </div>
                    <CardContent className="flex flex-col gap-4 px-6 py-6 text-base text-muted-foreground">
                      <span className="flex items-center gap-2 font-medium text-foreground">
                        <Users className="size-5 text-primary" />
                        {bus.seats} miejsc pasażerskich
                      </span>
                      {features.length > 0 && (
                        <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
                          {features.slice(0, 4).map((feature) => {
                            const Icon = featureIcon(feature);
                            return (
                              <span
                                key={feature}
                                className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm"
                              >
                                <Icon className="size-3.5 text-primary" />
                                {feature}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Button
          render={<Link href="/flota" />}
          nativeButton={false}
          variant="outline"
          size="lg"
          className="gap-1.5 rounded-full px-6 text-base"
        >
          Zobacz całą flotę
          <ArrowRight />
        </Button>
      </div>
    </section>
  );
}
