import { PhotoGallery } from "@/components/public/PhotoGallery";
import type { Trip, TripPhoto } from "@/lib/generated/prisma/client";

type TripWithPhotos = Trip & { photos: TripPhoto[] };

export function TripDetails({ trip }: { trip: TripWithPhotos }) {
  return (
    <div className="flex flex-col gap-6">
      <PhotoGallery photos={trip.photos} alt={trip.title} />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{trip.title}</h1>
        {trip.priceInfo && <p className="text-muted-foreground">{trip.priceInfo}</p>}
      </div>

      {trip.description && <p className="text-muted-foreground">{trip.description}</p>}
    </div>
  );
}
