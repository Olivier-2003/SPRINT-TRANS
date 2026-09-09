import Link from "next/link";
import { ImageOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Trip, TripPhoto } from "@/lib/generated/prisma/client";

type TripWithPhotos = Trip & { photos: TripPhoto[] };

export function TripsGrid({ trips }: { trips: TripWithPhotos[] }) {
  if (trips.length === 0) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="overflow-hidden rounded-xl border border-dashed border-border">
            <div className="flex aspect-video flex-col items-center justify-center gap-2 bg-muted text-sm font-medium text-muted-foreground">
              <ImageOff className="size-7" />
              Zdjęcie wkrótce
            </div>
            <div className="flex flex-col gap-1 p-4">
              <p className="text-base font-semibold text-muted-foreground">Wycieczka — wkrótce</p>
              <p className="text-sm text-muted-foreground/70">Szczegóły oferty w przygotowaniu.</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => (
        <Link key={trip.id} href={`/wycieczki/${trip.id}`} className="block">
          <Card className="h-full transition-colors hover:border-primary">
            {trip.photos[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={trip.photos[0].url}
                alt={trip.title}
                className="aspect-video w-full rounded-t-xl border-b object-cover"
              />
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-t-xl border-b bg-muted text-sm text-muted-foreground">
                Brak zdjęcia
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-base">{trip.title}</CardTitle>
            </CardHeader>
            {trip.priceInfo && (
              <CardContent className="text-sm text-muted-foreground">
                {trip.priceInfo}
              </CardContent>
            )}
          </Card>
        </Link>
      ))}
    </div>
  );
}
