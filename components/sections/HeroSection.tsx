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
        <Button disabled title="Formularz zapytania powstanie w Etapie 4">
          Wyślij zapytanie o przejazd
        </Button>
        <span className="text-sm text-muted-foreground">
          (aktywne od Etapu 4 — kalkulator i formularz zapytania)
        </span>
      </div>
    </section>
  );
}
