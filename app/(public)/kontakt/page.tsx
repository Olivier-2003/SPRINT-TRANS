import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Kontakt</h1>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Dane firmy</h2>
          <dl className="flex flex-col gap-1 text-sm text-muted-foreground">
            <div>
              <dt className="inline font-medium text-foreground">Adres: </dt>
              <dd className="inline">[do uzupełnienia]</dd>
            </div>
            <div>
              <dt className="inline font-medium text-foreground">Telefon: </dt>
              <dd className="inline">[do uzupełnienia]</dd>
            </div>
            <div>
              <dt className="inline font-medium text-foreground">E-mail: </dt>
              <dd className="inline">[do uzupełnienia]</dd>
            </div>
            <div>
              <dt className="inline font-medium text-foreground">NIP: </dt>
              <dd className="inline">[do uzupełnienia]</dd>
            </div>
          </dl>
        </div>

        <div className="flex aspect-video items-center justify-center rounded-md border bg-muted text-sm text-muted-foreground">
          Mapa (do uzupełnienia)
        </div>
      </div>

      <div className="rounded-md border p-4">
        <p className="text-sm text-muted-foreground">
          Formularz zapytania o wynajem autobusu i kalkulator orientacyjnej ceny znajdziesz na
          stronie{" "}
          <Link href="/flota" className="underline underline-offset-2">
            Flota
          </Link>{" "}
          (aktywne od Etapu 4).
        </p>
        <Button className="mt-3" disabled title="Aktywne od Etapu 4">
          Wyślij zapytanie o przejazd
        </Button>
      </div>
    </div>
  );
}
