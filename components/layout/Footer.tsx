import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-6 text-sm text-muted-foreground">
        <p>SPRINT-TRANS — przewozy autobusowe (dane firmy: placeholder, do uzupełnienia).</p>
        <nav className="flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/kontakt" className="underline underline-offset-2">
            Kontakt
          </Link>
          <Link href="/regulamin" className="underline underline-offset-2">
            Regulamin
          </Link>
          <Link href="/polityka-prywatnosci" className="underline underline-offset-2">
            Polityka prywatności
          </Link>
          <Link href="/admin/login" className="underline underline-offset-2">
            Panel administracyjny
          </Link>
        </nav>
      </div>
    </footer>
  );
}
