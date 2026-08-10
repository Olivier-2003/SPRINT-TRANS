import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight">404</h1>
      <p className="text-muted-foreground">Nie znaleziono takiej strony.</p>
      <Button render={<Link href="/" />} nativeButton={false}>
        Wróć do strony głównej
      </Button>
    </div>
  );
}
