import Link from "next/link";
import { MapPin, Phone, Mail, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedLogo } from "@/components/animations/AnimatedLogo";

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
    <footer className="relative border-t border-brand-navy-border bg-brand-navy text-brand-navy-muted">
      <div className="mx-auto grid max-w-7xl gap-x-10 gap-y-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8 lg:px-8">
        <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">
          <AnimatedLogo className="h-9" />
          <p className="max-w-xs text-base leading-relaxed">
            SPRINT-TRANS zajmuje się przewozem osób — linie regularne, wynajem autobusów oraz
            wycieczki. Dane firmy to na razie placeholder, do uzupełnienia przez SPRINT-TRANS.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold tracking-[0.15em] text-white uppercase">Dane firmy</h3>
          <dl className="flex flex-col gap-3.5 text-base">
            <div className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
              <dd>ul. Transportowa 1, 00-000 Miejscowość [do uzupełnienia]</dd>
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
          <h3 className="text-sm font-semibold tracking-[0.15em] text-white uppercase">Szybkie linki</h3>
          <nav className="flex flex-col gap-3 text-base">
            {QUICK_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="w-fit transition-colors hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold tracking-[0.15em] text-white uppercase">Gdzie nas znajdziesz</h3>
          <div className="flex aspect-4/3 items-center justify-center rounded-xl border border-brand-navy-border bg-white/5 text-sm">
            <div className="flex flex-col items-center gap-2 text-brand-navy-muted">
              <MapPin className="size-8" />
              <span>Mapa — do podpięcia po uzupełnieniu adresu</span>
            </div>
          </div>
          <Button
            render={<Link href="/kontakt" />}
            nativeButton={false}
            variant="outline"
            className="w-fit border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            Zobacz na mapie
          </Button>
        </div>
      </div>

      <div className="border-t border-brand-navy-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-5 text-sm lg:px-8">
          <p>© {year} SPRINT-TRANS. Wszelkie prawa zastrzeżone.</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-1.5">
            <Link href="/polityka-prywatnosci" className="hover:text-white">
              Polityka prywatności
            </Link>
            <Link href="/regulamin" className="hover:text-white">
              Regulamin
            </Link>
            <Link href="/admin/login" className="hover:text-white">
              Panel administracyjny
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
