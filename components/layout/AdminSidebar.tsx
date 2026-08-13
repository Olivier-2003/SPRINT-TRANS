"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  Inbox,
  ClipboardList,
  Users,
  Clock,
  Bus,
  Route,
  MapPin,
  Settings,
} from "lucide-react";
import { LogoutButton } from "@/components/forms/LogoutButton";
import { cn } from "@/lib/utils";

const NAV_SECTIONS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Kalendarz", href: "/admin/kalendarz", icon: Calendar },
  { label: "Generator grafiku", href: "/admin/kalendarz/generator", icon: Sparkles },
  { label: "Zapytania", href: "/admin/zapytania", icon: Inbox },
  { label: "Zlecenia", href: "/admin/zlecenia", icon: ClipboardList },
  { label: "Kierowcy", href: "/admin/kierowcy", icon: Users },
  { label: "Czas pracy kierowców", href: "/admin/kierowcy/rozliczenie", icon: Clock },
  { label: "Autobusy", href: "/admin/autobusy", icon: Bus },
  { label: "Linie regularne", href: "/admin/linie", icon: Route },
  { label: "Wycieczki", href: "/admin/wycieczki", icon: MapPin },
  { label: "Ustawienia kalkulatora", href: "/admin/ustawienia/kalkulator", icon: Settings },
];

interface AdminSidebarProps {
  adminName?: string | null;
  adminEmail?: string | null;
  className?: string;
  onNavigate?: () => void;
}

export function AdminSidebar({ adminName, adminEmail, className, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn("flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground", className)}>
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Bus className="size-4.5" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-tight">SPRINT-TRANS</p>
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Panel administratora</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2 text-sm">
        {NAV_SECTIONS.map((section) => {
          const active = section.exact ? pathname === section.href : pathname.startsWith(section.href);
          const Icon = section.icon;
          return (
            <Link
              key={section.label}
              href={section.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{section.label}</span>
            </Link>
          );
        })}
      </nav>

      {(adminName || adminEmail) && (
        <div className="flex flex-col gap-3 border-t border-sidebar-border p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
              {(adminName ?? adminEmail ?? "?").slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{adminName ?? adminEmail}</p>
              <p className="truncate text-[11px] text-muted-foreground">Administrator</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      )}
    </aside>
  );
}

export { NAV_SECTIONS };
