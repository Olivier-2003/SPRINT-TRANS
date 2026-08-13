import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <span className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">Błąd 404</span>
      <h1 className="text-5xl font-extrabold tracking-tight">Nie znaleziono strony</h1>
      <p className="text-muted-foreground">Sprawdź adres lub wróć na stronę główną.</p>
      <Button render={<Link href="/" />} nativeButton={false} className="mt-2 rounded-full">
        Wróć do strony głównej
      </Button>
    </div>
  );
}
