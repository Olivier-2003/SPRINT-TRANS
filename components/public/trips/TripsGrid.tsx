import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Trip, TripPhoto } from "@/lib/generated/prisma/client";

type TripWithPhotos = Trip & { photos: TripPhoto[] };

export function TripsGrid({ trips }: { trips: TripWithPhotos[] }) {
  if (trips.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Oferta wycieczek będzie prezentowana tutaj wkrótce.
      </p>
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
