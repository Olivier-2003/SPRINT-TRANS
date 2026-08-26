"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { cn } from "@/lib/utils";

interface AdminMobileMenuProps {
  adminName?: string | null;
  adminEmail?: string | null;
}

export function AdminMobileMenu({ adminName, adminEmail }: AdminMobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  return (
    <>
      <header className="flex items-center justify-between border-b border-sidebar-border bg-sidebar px-4 py-3 sm:hidden print:hidden">
        <span className="text-sm font-semibold">SPRINT-TRANS · Panel</span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex size-11 items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent"
          aria-label="Otwórz menu"
        >
          <Menu className="size-5" />
        </button>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 transition-opacity sm:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 shadow-2xl transition-transform duration-300 ease-out sm:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="relative h-full">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-3 inline-flex size-8 items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent"
            aria-label="Zamknij menu"
          >
            <X className="size-4" />
          </button>
          <AdminSidebar
            adminName={adminName}
            adminEmail={adminEmail}
            className="h-full w-full"
            onNavigate={() => setOpen(false)}
          />
        </div>
      </div>
    </>
  );
}
