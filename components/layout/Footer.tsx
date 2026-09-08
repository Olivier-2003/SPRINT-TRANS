import Link from "next/link";
import { MapPin, Phone, Mail, FileText, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedLogo } from "@/components/animations/AnimatedLogo";
import { COMPANY_ADDRESS, COMPANY_MAP_EMBED_SRC } from "@/lib/company-info";

const FACEBOOK_URL = "https://www.facebook.com/sprinttranspiechcin";

const QUICK_LINKS = [
  { label: "Oferta", href: "/oferta" },
  { label: "Flota", href: "/flota" },
  { label: "Rozkłady jazdy", href: "/rozklad-jazdy" },
  { label: "Wycieczki", href: "/wycieczki" },
  { label: "Kontakt", href: "/kontakt" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-white text-muted-foreground">
      <div className="mx-auto grid max-w-[1600px] gap-x-10 gap-y-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8 lg:px-8">
        <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">
          <AnimatedLogo className="h-16" />
          <p className="max-w-xs text-base leading-relaxed">
            SPRINT-TRANS zajmuje się przewozem osób — linie regularne, wynajem autobusów oraz
            wycieczki. Dane firmy to na razie placeholder, do uzupełnienia przez SPRINT-TRANS.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold tracking-[0.15em] text-foreground uppercase">Dane firmy</h3>
          <dl className="flex flex-col gap-3.5 text-base">
            <div className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
              <dd>{COMPANY_ADDRESS}</dd>
            </div>
            <div className="flex items-start gap-2.5">
              <Phone className="mt-0.5 size-5 shrink-0 text-primary" />
              <dd>+48 000 000 000 [do uzupełnienia]</dd>
            </div>
            <div className="flex items-start gap-2.5">
              <Mail className="mt-0.5 size-5 shrink-0 text-primary" />
              <dd>kontakt@sprint-trans.pl [do uzupełnienia]</dd>
            </div>
            <div className="flex items-start gap-2.5">
              <FileText className="mt-0.5 size-5 shrink-0 text-primary" />
              <dd>NIP: 000-000-00-00 [do uzupełnienia]</dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold tracking-[0.15em] text-foreground uppercase">Szybkie linki</h3>
          <nav className="flex flex-col gap-3 text-base">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex w-fit items-center py-2.5 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold tracking-[0.15em] text-foreground uppercase">Gdzie nas znajdziesz</h3>
          <div className="aspect-4/3 overflow-hidden rounded-xl border border-border">
            <iframe
              src={COMPANY_MAP_EMBED_SRC}
              title="Lokalizacja SPRINT-TRANS na mapie"
              loading="lazy"
              className="h-full w-full grayscale-[15%]"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <Button render={<Link href="/kontakt" />} nativeButton={false} variant="outline" className="h-11 w-fit">
            Zobacz na mapie
          </Button>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-6 py-5 text-sm lg:px-8">
          <p>© {year} SPRINT-TRANS. Wszelkie prawa zastrzeżone.</p>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            <Link href="/polityka-prywatnosci" className="inline-flex items-center py-2.5 hover:text-foreground">
              Polityka prywatności
            </Link>
            <Link href="/regulamin" className="inline-flex items-center py-2.5 hover:text-foreground">
              Regulamin
            </Link>
            <Link href="/admin/login" className="inline-flex items-center py-2.5 hover:text-foreground">
              Panel administracyjny
            </Link>
            <Link
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 py-2.5 hover:text-foreground"
            >
              Facebook
              <ArrowUpRight className="size-3.5" />
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
