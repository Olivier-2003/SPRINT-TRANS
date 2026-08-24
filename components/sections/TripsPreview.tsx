import Link from "next/link";
import { ArrowRight, ImageOff, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { cn } from "@/lib/utils";
import type { Trip, TripPhoto } from "@/lib/generated/prisma/client";

type TripWithPhotos = Trip & { photos: TripPhoto[] };

export function TripsPreview({ trips }: { trips: TripWithPhotos[] }) {
  const preview = trips.slice(0, 3);
  // Przy jednej wycieczce karta NIE ma rozciągać się na cały kontener — ograniczona
  // szerokość (maks. ok. 400px) i siatka bez rozciągania (justify-start). Przy 2+
  // rekordach layout jest już gotowy pod 2 lub 3 karty w rzędzie.
  const gridCols =
    preview.length >= 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : preview.length === 2
        ? "sm:grid-cols-2"
        : "grid-cols-[minmax(0,400px)] justify-start";

  return (
    <section className="relative mx-auto max-w-[1600px] px-6 pt-14 pb-10 md:pt-20 md:pb-14 lg:px-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <ScrollReveal className="flex flex-col gap-3">
          <span className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
            Najpopularniejsze wycieczki
          </span>
          <h2 className="max-w-lg text-4xl font-bold tracking-tight sm:text-5xl">
            Odkryj z nami najpiękniejsze miejsca
          </h2>
        </ScrollReveal>
        <Button
          render={<Link href="/wycieczki" />}
          nativeButton={false}
          variant="outline"
          size="lg"
          className="hidden gap-1.5 rounded-full px-6 text-base lg:inline-flex"
        >
          Zobacz wszystkie wycieczki
          <ChevronRight />
        </Button>
      </div>

      {preview.length === 0 ? (
        <p className="text-sm text-muted-foreground">Oferta wycieczek będzie prezentowana tutaj wkrótce.</p>
      ) : (
        <div className={cn("grid gap-7", gridCols)}>
          {preview.map((trip, i) => (
            <ScrollReveal key={trip.id} delay={i * 90}>
              <Link href={`/wycieczki/${trip.id}`} className="group block h-full">
                <Card className="h-full py-0 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:ring-primary/30">
                  {trip.photos[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={trip.photos[0].url}
                      alt={trip.title}
                      className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex aspect-video flex-col items-center justify-center gap-2 bg-muted text-sm font-medium text-muted-foreground">
                      <ImageOff className="size-7" />
                      Zdjęcie wkrótce
                    </div>
                  )}
                  <CardHeader className="pt-5">
                    <CardTitle className="text-xl">{trip.title}</CardTitle>
                  </CardHeader>
                  {trip.priceInfo && (
                    <CardContent className="pb-6 text-base text-muted-foreground">{trip.priceInfo}</CardContent>
                  )}
                </Card>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-center lg:hidden">
        <Button
          render={<Link href="/wycieczki" />}
          nativeButton={false}
          variant="outline"
          size="lg"
          className="gap-1.5 rounded-full px-6 text-base"
        >
          Zobacz wszystkie wycieczki
          <ArrowRight />
        </Button>
      </div>
    </section>
  );
}
