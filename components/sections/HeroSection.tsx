import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-4xl font-bold tracking-tight">
        SPRINT-TRANS — przewozy autobusowe
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground">
        Linie regularne, wynajem autobusów na wycieczki i inne przejazdy. Docelowe treści i
        zdjęcia firmy zostaną uzupełnione przez SPRINT-TRANS.
      </p>
      <div className="flex items-center gap-3">
        <Button render={<Link href="/kalkulator" />} nativeButton={false}>
          Wyślij zapytanie o przejazd
        </Button>
        <span className="text-sm text-muted-foreground">
          Bezpłatna, niewiążąca wycena — bez płatności online.
        </span>
      </div>
    </section>
  );
}
