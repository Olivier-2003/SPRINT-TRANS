import Link from "next/link";
import { MapPin, Phone, Mail, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionWaveDivider } from "@/components/animations/SectionWaveDivider";
import { COMPANY_ADDRESS, COMPANY_MAP_EMBED_SRC } from "@/lib/company-info";

export default function ContactPage() {
  return (
    <div className="flex-1">
      <section className="relative overflow-visible bg-brand-navy py-16 text-white md:py-24">
        <SectionWaveDivider position="bottom" fill="var(--background)" />
        <div className="relative mx-auto flex max-w-[1600px] flex-col items-center gap-4 px-6 text-center lg:px-8">
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">Skontaktuj się z nami</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-brand-navy-muted">
            Masz pytania dotyczące przejazdu, wynajmu autobusu lub wycieczki? Chętnie pomożemy.
          </p>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-14 md:py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Dane firmy</h2>
              <dl className="flex flex-col gap-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  <dd>{COMPANY_ADDRESS}</dd>
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

          <div className="aspect-video overflow-hidden rounded-2xl border lg:aspect-auto">
            <iframe
              src={COMPANY_MAP_EMBED_SRC}
              title="Lokalizacja SPRINT-TRANS na mapie"
              loading="lazy"
              className="h-full w-full min-h-64"
              referrerPolicy="no-referrer-when-downgrade"
            />
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
    </div>
  );
}
