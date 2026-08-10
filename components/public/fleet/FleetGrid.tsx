import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Bus, BusPhoto } from "@/lib/generated/prisma/client";

type BusWithPhotos = Bus & { photos: BusPhoto[] };

export function FleetGrid({ buses }: { buses: BusWithPhotos[] }) {
  if (buses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Flota będzie prezentowana tutaj wkrótce — dane są uzupełniane w panelu administracyjnym.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {buses.map((bus) => (
        <Link key={bus.id} href={`/flota/${bus.id}`} className="block">
          <Card className="h-full transition-colors hover:border-primary">
            {bus.photos[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={bus.photos[0].url}
                alt={bus.brandModel}
                className="aspect-video w-full rounded-t-xl border-b object-cover"
              />
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-t-xl border-b bg-muted text-sm text-muted-foreground">
                Brak zdjęcia
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-base">{bus.brandModel}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{bus.seats} miejsc</span>
              {bus.productionYear && <Badge variant="secondary">{bus.productionYear}</Badge>}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
