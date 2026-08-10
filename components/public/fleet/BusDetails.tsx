import { PhotoGallery } from "@/components/public/PhotoGallery";
import { Badge } from "@/components/ui/badge";
import type { Bus, BusPhoto } from "@/lib/generated/prisma/client";

type BusWithPhotos = Bus & { photos: BusPhoto[] };

export function BusDetails({ bus }: { bus: BusWithPhotos }) {
  const features = Array.isArray(bus.features) ? (bus.features as string[]) : [];

  return (
    <div className="flex flex-col gap-6">
      <PhotoGallery photos={bus.photos} alt={bus.brandModel} />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{bus.brandModel}</h1>
        <p className="text-sm text-muted-foreground">{bus.seats} miejsc</p>
      </div>

      {bus.description && <p className="text-muted-foreground">{bus.description}</p>}

      {features.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {features.map((feature) => (
            <Badge key={feature} variant="secondary">
              {feature}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
