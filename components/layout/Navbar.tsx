import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const NAV_ITEMS = [
  { label: "O firmie", href: "/o-firmie" },
  { label: "Oferta", href: "/oferta" },
  { label: "Flota", href: "/flota" },
  { label: "Rozkład jazdy", href: "/rozklad-jazdy" },
  { label: "Wycieczki", href: "/wycieczki" },
  { label: "Kalkulator", href: null },
  { label: "Kontakt", href: "/kontakt" },
];

export function Navbar() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          SPRINT-TRANS
        </Link>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {NAV_ITEMS.map((item) =>
            item.href ? (
              <Link key={item.label} href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span key={item.label} className="flex items-center gap-1">
                {item.label}
                <Badge variant="secondary" className="text-[10px]">
                  wkrótce
                </Badge>
              </span>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
