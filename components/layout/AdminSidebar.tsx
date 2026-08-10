import Link from "next/link";
import { LogoutButton } from "@/components/forms/LogoutButton";

const NAV_SECTIONS = [
  { label: "Dashboard", href: "/admin", enabled: true },
  { label: "Kalendarz", enabled: false },
  { label: "Zapytania", enabled: false },
  { label: "Zlecenia", enabled: false },
  { label: "Kierowcy", href: "/admin/kierowcy", enabled: true },
  { label: "Autobusy", href: "/admin/autobusy", enabled: true },
  { label: "Linie regularne", href: "/admin/linie", enabled: true },
  { label: "Wycieczki", href: "/admin/wycieczki", enabled: true },
  { label: "Ustawienia kalkulatora", href: "/admin/ustawienia/kalkulator", enabled: true },
];

interface AdminSidebarProps {
  adminName?: string | null;
  adminEmail?: string | null;
}

export function AdminSidebar({ adminName, adminEmail }: AdminSidebarProps) {
  return (
    <aside className="hidden w-60 shrink-0 border-r bg-muted/30 sm:flex sm:flex-col">
      <div className="border-b px-5 py-4 text-sm font-semibold tracking-tight">
        SPRINT-TRANS · Panel
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3 text-sm">
        {NAV_SECTIONS.map((section) =>
          section.enabled && section.href ? (
            <Link
              key={section.label}
              href={section.href}
              className="rounded-md px-3 py-2 hover:bg-muted"
            >
              {section.label}
            </Link>
          ) : (
            <span
              key={section.label}
              className="cursor-not-allowed rounded-md px-3 py-2 text-muted-foreground/60"
              title="Ekran zostanie zbudowany w kolejnych etapach"
            >
              {section.label}
            </span>
          )
        )}
      </nav>
      {(adminName || adminEmail) && (
        <div className="flex flex-col gap-2 border-t p-3">
          <div className="truncate text-xs text-muted-foreground">
            {adminName ?? adminEmail}
          </div>
          <LogoutButton />
        </div>
      )}
    </aside>
  );
}
