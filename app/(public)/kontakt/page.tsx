import Link from "next/link";
import { MapPin, Phone, Mail, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-14 md:py-16">
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Kontakt</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Masz pytania dotyczące przejazdu, wynajmu autobusu lub wycieczki? Skontaktuj się z nami.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Dane firmy</h2>
            <dl className="flex flex-col gap-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <dd>[adres do uzupełnienia]</dd>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                <dd>[telefon do uzupełnienia]</dd>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                <dd>[e-mail do uzupełnienia]</dd>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="mt-0.5 size-4 shrink-0 text-primary" />
                <dd>NIP: [do uzupełnienia]</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <div className="flex aspect-video items-center justify-center rounded-2xl border bg-muted text-sm text-muted-foreground lg:aspect-auto">
          <div className="flex flex-col items-center gap-2">
            <MapPin className="size-6" />
            Mapa — do podpięcia po uzupełnieniu adresu
          </div>
        </div>
      </div>

      <Card className="bg-brand-navy text-white">
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-md text-sm text-brand-navy-muted">
            Chcesz wynająć autobus? Skorzystaj z kalkulatora orientacyjnej ceny i wyślij zapytanie —
            bez żadnej płatności online.
          </p>
          <Button
            render={<Link href="/kalkulator" />}
            nativeButton={false}
            className="gap-1.5 rounded-full"
          >
            Wyślij zapytanie o przejazd
            <ArrowRight />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
