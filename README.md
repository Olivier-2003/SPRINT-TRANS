# SPRINT-TRANS

System internetowy dla firmy przewozowej SPRINT-TRANS: publiczna strona (oferta, flota, rozkłady, kalkulator
orientacyjnej ceny, formularz zapytania) oraz panel administracyjny (zapytania, zlecenia, kierowcy, autobusy,
linie regularne, wycieczki), oparte o wspólną bazę danych.

Pełny plan projektu (stack, architektura, struktura bazy, lista ekranów, przepływ danych, etapy) znajduje się
w `docs/plan.md`.

**Status: Etap 3 — strona publiczna (treści i struktura, bez finalnego designu).** Poza panelem z Etapów 1–2
działa publiczna prezentacja danych: strona główna, o firmie, oferta, flota (+ szczegóły), rozkład jazdy
(+ wyszukiwanie i szczegóły), wycieczki (+ szczegóły), kontakt, regulamin, polityka prywatności, 404 — w całości
zasilana danymi z panelu (dynamiczne renderowanie, bez cache'owania strony przy zmianie danych). Warstwa
wizualna jest celowo minimalna (komponenty shadcn/ui bez customizacji) — ostateczny design zaprojektuje
klient. Kalkulator ceny i formularz zapytania — Etap 4.

## Stack

Next.js 16 (App Router) + TypeScript, Tailwind CSS + shadcn/ui, Prisma + PostgreSQL (`@prisma/adapter-pg`),
Auth.js (Credentials + bcrypt).

## Wymagania

- Node.js 20+ (zainstalowane: sprawdź `node -v`)
- npm (dołączony do Node.js)

## Uruchomienie lokalne

```bash
npm install
cp .env.example .env   # uzupełnij DATABASE_URL i AUTH_SECRET (patrz niżej)
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000) — strona publiczna.
Panel administracyjny: [http://localhost:3000/admin](http://localhost:3000/admin) (przekieruje do logowania,
jeśli nie jesteś zalogowany/a).

**Dane logowania (dev, z seeda — wyłącznie fikcyjne):** `admin@sprint-trans.pl` / `ZmienToHaslo123!`

## Zmienne środowiskowe

Skopiuj `.env.example` do `.env` i uzupełnij:

- `DATABASE_URL` — połączenie z PostgreSQL. Lokalnie najprościej: `npx prisma dev` (uruchamia lokalną bazę
  bez Dockera, wypisuje gotowy `DATABASE_URL` do wklejenia). Docelowo: Neon/Supabase.
- `AUTH_SECRET` — sekret do podpisywania sesji logowania. Wygeneruj: `npx auth secret` (osobny sekret na
  dev i na produkcji, nigdy nie commitować).

> **Uwaga (lokalny dev):** `npx prisma dev` po dłuższej przerwie bezczynności potrafi chwilowo przestać
> odpowiadać (błąd „Connection terminated unexpectedly” w konsoli serwera). Wystarczy odświeżyć stronę —
> jeśli to nie pomoże, uruchom ponownie `npx prisma dev` w osobnym terminalu.

## Struktura katalogów

```
app/
  layout.tsx              — layout główny (czcionki, <html>/<body>)
  not-found.tsx             — strona 404
  (public)/                  — strona publiczna
    o-firmie/, oferta/, kontakt/, regulamin/, polityka-prywatnosci/   — treści statyczne
    flota/, flota/[busId]/                                             — flota (lista + szczegóły)
    rozklad-jazdy/, rozklad-jazdy/[lineId]/                            — linie (lista + szczegóły)
    wycieczki/, wycieczki/[tripId]/                                    — wycieczki (lista + szczegóły)
  admin/
    login/page.tsx           — logowanie (bez sidebaru panelu)
    (dashboard)/              — wszystko za logowaniem: layout z sidebarem + strony panelu
      kierowcy/, autobusy/, linie/, wycieczki/   — listy + /nowy + /[id] (CRUD)
      ustawienia/kalkulator/                       — edycja stawek kalkulatora
  api/auth/[...nextauth]/     — endpoint Auth.js

components/
  ui/          — prymitywy shadcn/ui (Button, Input, Card, Table, Select, Switch, ...)
  layout/      — Navbar, Footer, AdminSidebar
  sections/    — sekcje strony głównej (Hero, oferta, ...)
  forms/       — formularze (LoginForm, DriverForm, BusForm, LineForm, TripForm,
                  CalculatorSettingsForm, ConfirmDeleteForm) — tylko UI, logika w lib/
  admin/       — komponenty widoków panelu (tabele list, DashboardStats, AdminListHeader)
  public/      — komponenty widoków publicznych (PhotoGallery, FleetGrid, BusDetails,
                  LineSearchList, LineTimetable, TripsGrid, TripDetails)

lib/
  db.ts               — singleton klienta Prisma
  auth.ts              — pełna konfiguracja Auth.js (Node.js runtime — DB, bcrypt)
  auth.config.ts        — konfiguracja bezpieczna dla Edge (używana w proxy.ts/middleware)
  actions/               — Server Actions (jedyne miejsce zapisu do bazy) — drivers, buses, lines,
                            trips, calculator-settings, auth
  data/                   — funkcje odczytu z bazy (getDrivers, getBuses, getPublicBuses, ...)
                            używane w page.tsx; funkcje "public" filtrują tylko aktywne rekordy
  validation/              — schematy Zod (źródło prawdy o kształcie danych każdej encji)
  prisma-errors.ts          — rozpoznawanie błędów Prisma (unikalność, klucz obcy)
  generated/prisma/          — wygenerowany klient Prisma (nie commitować, patrz .gitignore)

prisma/
  schema.prisma   — pełny schemat bazy danych
  seed.ts          — dane deweloperskie (wyłącznie fikcyjne)
  migrations/       — historia migracji

proxy.ts     — middleware Next.js 16 (ochrona /admin/*)
docs/plan.md  — pełny plan projektu zaakceptowany przed implementacją
```

## Mapa widoków → plik odpowiadający za wygląd

| Widok | Kompozycja (`app/**/page.tsx`) | Wygląd do edycji |
|---|---|---|
| Strona główna | `app/(public)/page.tsx` | `components/sections/HeroSection.tsx`, `components/sections/OfferHighlights.tsx` |
| Nawigacja / stopka (publiczne) | `app/(public)/layout.tsx` | `components/layout/Navbar.tsx`, `components/layout/Footer.tsx` |
| O firmie | `app/(public)/o-firmie/page.tsx` | bezpośrednio w pliku strony (treść statyczna) |
| Oferta | `app/(public)/oferta/page.tsx` | bezpośrednio w pliku strony |
| Flota (lista / szczegóły) | `app/(public)/flota/**` | `components/public/fleet/FleetGrid.tsx`, `components/public/fleet/BusDetails.tsx`, `components/public/PhotoGallery.tsx` |
| Rozkład jazdy (lista+szukajka / szczegóły) | `app/(public)/rozklad-jazdy/**` | `components/public/lines/LineSearchList.tsx`, `components/public/lines/LineTimetable.tsx` |
| Wycieczki (lista / szczegóły) | `app/(public)/wycieczki/**` | `components/public/trips/TripsGrid.tsx`, `components/public/trips/TripDetails.tsx`, `components/public/PhotoGallery.tsx` |
| Kontakt | `app/(public)/kontakt/page.tsx` | bezpośrednio w pliku strony |
| Regulamin / Polityka prywatności | `app/(public)/regulamin/`, `app/(public)/polityka-prywatnosci/` | bezpośrednio w plikach stron |
| Strona 404 | `app/not-found.tsx` | bezpośrednio w pliku |
| Logowanie do panelu | `app/admin/login/page.tsx` | `components/forms/LoginForm.tsx` |
| Sidebar panelu | `app/admin/(dashboard)/layout.tsx` | `components/layout/AdminSidebar.tsx`, `components/forms/LogoutButton.tsx` |
| Dashboard panelu | `app/admin/(dashboard)/page.tsx` | `components/admin/DashboardStats.tsx` |
| Kierowcy (lista / formularz) | `app/admin/(dashboard)/kierowcy/**` | `components/admin/drivers/DriversTable.tsx`, `components/forms/DriverForm.tsx` |
| Autobusy (lista / formularz) | `app/admin/(dashboard)/autobusy/**` | `components/admin/buses/BusesTable.tsx`, `components/forms/BusForm.tsx` |
| Linie regularne (lista / formularz) | `app/admin/(dashboard)/linie/**` | `components/admin/lines/LinesTable.tsx`, `components/forms/LineForm.tsx` |
| Wycieczki (lista / formularz) | `app/admin/(dashboard)/wycieczki/**` | `components/admin/trips/TripsTable.tsx`, `components/forms/TripForm.tsx` |
| Ustawienia kalkulatora | `app/admin/(dashboard)/ustawienia/kalkulator/page.tsx` | `components/forms/CalculatorSettingsForm.tsx` |
| Nagłówek listy (przycisk „Dodaj…”) | — | `components/admin/AdminListHeader.tsx` |
| Kolory, fonty, promienie (całość) | — | `app/globals.css` (jedyne źródło tokenów motywu) |

Zasada na przyszłość: zmiana wyglądu = edycja pliku z kolumny „Wygląd do edycji” (lub `app/globals.css` dla
kolorów/fontów globalnie), bez dotykania `lib/` (logika, baza danych, kalkulacja ceny).

## Przydatne komendy

```bash
npm run dev             # serwer deweloperski
npm run build           # build produkcyjny
npm run start            # uruchomienie builda produkcyjnego
npm run lint              # ESLint
npx prisma dev             # lokalna baza PostgreSQL (bez Dockera)
npx prisma migrate dev      # nowa migracja po zmianie schema.prisma
npx prisma db seed           # ponowne załadowanie danych deweloperskich
npx prisma generate           # regeneracja klienta Prisma
npx auth secret                # wygenerowanie AUTH_SECRET
```
