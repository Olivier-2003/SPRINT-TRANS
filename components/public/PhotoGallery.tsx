interface PhotoGalleryProps {
  photos: { id: string; url: string }[];
  alt: string;
}

export function PhotoGallery({ photos, alt }: PhotoGalleryProps) {
  if (photos.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-md border bg-muted text-sm text-muted-foreground">
        Brak zdjęć (do uzupełnienia)
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {photos.map((photo, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={photo.id}
          src={photo.url}
          alt={`${alt} — zdjęcie ${index + 1}`}
          className="aspect-video w-full rounded-md border object-cover"
        />
      ))}
    </div>
  );
}
