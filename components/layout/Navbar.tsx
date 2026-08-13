"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedLogo } from "@/components/animations/AnimatedLogo";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Strona główna", href: "/" },
  { label: "Oferta", href: "/oferta" },
  { label: "Flota", href: "/flota" },
  { label: "Rozkłady jazdy", href: "/rozklad-jazdy" },
  { label: "Wycieczki", href: "/wycieczki" },
  { label: "O firmie", href: "/o-firmie" },
  { label: "Kontakt", href: "/kontakt" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors",
        scrolled || open
          ? "border-brand-navy-border bg-brand-navy/95 backdrop-blur supports-backdrop-filter:bg-brand-navy/80"
          : "border-transparent bg-brand-navy"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="SPRINT-TRANS — strona główna">
          <AnimatedLogo className="h-10" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2.5 text-[15px] font-medium transition-colors",
                  active
                    ? "bg-white/10 text-white"
                    : "text-brand-navy-muted hover:bg-white/5 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Button
            render={<Link href="/kalkulator" />}
            nativeButton={false}
            size="lg"
            className="gap-1.5 rounded-full px-6 text-base"
          >
            Zapytaj o przejazd
            <ArrowRight />
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden"
          aria-label={open ? "Zamknij menu" : "Otwórz menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-brand-navy-border bg-brand-navy transition-[max-height,opacity] duration-300 ease-out lg:hidden",
          open ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-6 py-4">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-white/10 text-white" : "text-brand-navy-muted hover:bg-white/5 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Button
            render={<Link href="/kalkulator" />}
            nativeButton={false}
            className="mt-2 justify-center gap-1.5 rounded-full"
          >
            Zapytaj o przejazd
            <ArrowRight />
          </Button>
        </nav>
      </div>
    </header>
  );
}
