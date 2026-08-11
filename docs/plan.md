# SPRINT-TRANS — plan systemu (strona publiczna + panel administracyjny)

## Kontekst

SPRINT-TRANS potrzebuje systemu internetowego składającego się z dwóch części opartych o wspólną bazę danych:
publicznej strony (prezentacja firmy, floty, rozkładów, kalkulator ceny, formularz zapytania) oraz panelu
administracyjnego (obsługa zapytań, zleceń, kierowcy, autobusy, linie regularne, wycieczki, ustawienia
kalkulatora). Priorytety: prostota utrzymania, bezpieczeństwo, niski koszt hostingu, pełna responsywność.
System ma być od razu zaprojektowany tak, by w przyszłości dało się dopisać automatyczny algorytm przydziału
kierowców i autobusów — bez przebudowy schematu bazy. To jest plan projektowy (architektura, baza, ekrany,
przepływ danych, etapy) — **bez implementacji kodu**.

Decyzje potwierdzone z klientem:
- Hosting: rozwiązanie zarządzane (Vercel + Neon/Supabase) — najmniej utrzymania, automatyczne backupy i HTTPS.
- Kalkulator km: automatyczne liczenie trasy przez zewnętrzne API tras (np. OpenRouteService, z darmowym limitem).
- **Brak płatności online.** Formularz na stronie to wyłącznie niewiążące zapytanie o przejazd. Kalkulator
  pokazuje cenę orientacyjną. Żadnej bramki płatniczej (Stripe/PayPal/Przelewy24/BLIK), żadnego przycisku
  sugerującego zakup/rezerwację online. Główne CTA na stronie: **„Wyślij zapytanie o przejazd”**. Po wysłaniu
  klient widzi informację, że pracownik SPRINT-TRANS skontaktuje się telefonicznie/mailowo w celu potwierdzenia
  dostępności, ceny, szczegółów i sposobu płatności poza stroną.
- **Zapytanie (Inquiry) ≠ zlecenie (Booking/Job).** Zapytanie jest niewiążące. Dopiero pracownik SPRINT-TRANS,
  po kontakcie z klientem, ręcznie oznacza je jako zaakceptowane i tworzy z niego zlecenie, które trafia do
  kalendarza i ma przypisanych kierowców/autobusy.

---

## 1. Stack technologiczny

| Warstwa | Wybór | Uzasadnienie |
|---|---|---|
| Framework aplikacji | **Next.js 15 (App Router) + TypeScript** | Jedna aplikacja obsługuje i stronę publiczną, i panel admina (SSR dla SEO na stronie publicznej, React do interaktywnego panelu). Ogromna dokumentacja i społeczność = łatwe utrzymanie. |
| Baza danych | **PostgreSQL** (hostowana na Neon lub Supabase) | Relacyjna, dobrze pasuje do zapytań/zleceń/harmonogramów/statusów i relacji wiele-do-wielu (kierowcy/autobusy ↔ zlecenia). |
| ORM | **Prisma** | Typowane zapytania, czytelne migracje bazy, jeden `schema.prisma` jako źródło prawdy o strukturze danych. |
| Stylowanie / UI | **Tailwind CSS + shadcn/ui** | Szybkie budowanie responsywnych, spójnych ekranów bez pisania frameworku UI od zera. |
| Autoryzacja panelu | **Auth.js (NextAuth) — provider „Credentials”** + hasła hashowane `bcrypt` | Sesje w bezpiecznych ciasteczkach httpOnly, gotowy mechanizm logowania, łatwo rozszerzyć o role w przyszłości. |
| Walidacja formularzy | **Zod + React Hook Form** | Ta sama definicja walidacji może być użyta po stronie klienta i serwera. |
| Zdjęcia (flota, wycieczki) | **Vercel Blob lub Supabase Storage** | Pliki nie trzymane w bazie danych — bezpieczne, tanie przechowywanie z URL-ami do zdjęć. |
| Liczenie km w kalkulatorze | **Zewnętrzne API tras (OpenRouteService — darmowy limit ok. 2000 zapytań/dzień)**, geokodowanie adresów | Automatyczne liczenie trasy drogowej z obsługą wielu punktów pośrednich (matrix/route API). Wynik cache'owany w bazie. |
| Powiadomienia e-mail | **Resend** (lub SMTP przez Nodemailer) | Potwierdzenie dla klienta (z informacją o dalszym kontakcie telefonicznym/mailowym) + powiadomienie dla admina o nowym zapytaniu. |
| Hosting aplikacji | **Vercel** (plan Hobby na start, Pro przy większym ruchu) | Zero-konfiguracyjne wdrożenia z gita, automatyczny HTTPS, dobra integracja z Next.js. |
| Hosting bazy danych | **Neon lub Supabase (plan darmowy → płatny w miarę wzrostu)** | Zarządzane backupy, brak administracji serwerem. |
| Repozytorium / CI | **Git (GitHub) + automatyczny deploy z brancha `main`** | Standardowy, prosty workflow. |

Szacunkowy koszt startowy: **0–25 USD/mies.**, rosnący wraz z ruchem i liczbą zdjęć/e-maili.
**Brak jakiejkolwiek integracji płatniczej** — nie ma kosztów ani ryzyka związanego z obsługą płatności.

---

## 2. Architektura aplikacji

Jedna aplikacja Next.js, logicznie podzielona na dwa segmenty, współdzieląca tę samą bazę danych i tę samą
warstwę dostępu do danych (Prisma):

```
sprint-trans/
├── app/
│   ├── (public)/            → strona publiczna (SEO, SSR/ISR)
│   │   ├── page.tsx                 (strona główna)
│   │   ├── o-firmie/
│   │   ├── oferta/
│   │   ├── flota/[busId]/
│   │   ├── rozklad-jazdy/[lineId]/
│   │   ├── wycieczki/[tripId]/
│   │   ├── kalkulator/              (formularz + wynik + CTA "Wyślij zapytanie o przejazd")
│   │   ├── kontakt/
│   │   ├── regulamin/, polityka-prywatnosci/
│   ├── admin/                → panel administracyjny (chroniony middleware'em)
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── kalendarz/                (widok zleceń/Bookingów)
│   │   ├── zapytania/[id]/           (Inquiry: kontakt z klientem, wycena, decyzja)
│   │   ├── zlecenia/[id]/            (Booking/Job: przypisania, trasa operacyjna, status realizacji)
│   │   ├── kierowcy/[id]/
│   │   ├── autobusy/[id]/
│   │   ├── linie/[id]/
│   │   ├── wycieczki/[id]/
│   │   └── ustawienia/kalkulator/
│   └── api/                  → server actions / route handlers (formularz, kalkulator, webhooki)
├── lib/
│   ├── db.ts                 (Prisma client, singleton)
│   ├── auth.ts                (konfiguracja Auth.js)
│   ├── pricing.ts             (liczenie ceny — czyta bieżące stawki z bazy, tworzy niemutowalny snapshot wyceny)
│   ├── routing.ts             (integracja z API tras, liczenie odległości dla wielopunktowej trasy, cache)
│   └── validation/            (schematy Zod, współdzielone client/server)
├── prisma/
│   └── schema.prisma
└── middleware.ts              (ochrona ścieżek /admin/*)
```

Kluczowe zasady architektury:
- **Middleware** blokuje dostęp do `/admin/*` bez ważnej sesji.
- **Server Actions / Route Handlers** jako jedyna droga zapisu do bazy.
- **Zapytanie (Inquiry) i zlecenie (Booking) to osobne encje**, połączone relacją. Konwersja Inquiry → Booking
  to jawna, ręczna akcja administratora w panelu (nigdy automatyczna, nigdy inicjowana przez klienta).
- **Wyceny są niemutowalne (append-only)**: każda kalkulacja (automatyczna lub ręcznie skorygowana przez
  admina) zapisuje nowy rekord `PriceQuote` powiązany z Inquiry. Zmiana `CalculatorSettings` wpływa tylko na
  przyszłe wyceny — historyczne pozostają nietknięte.
- **Trasa jako lista punktów** (`RoutePoint`), a nie pola origin/destination — obsługuje dowolną liczbę
  przystanków pośrednich (np. baza → miejsce odbioru → punkt 1 → punkt 2 → miejsce powrotu → baza).
- **Wiele kierowców i wiele autobusów na jedno zlecenie** przez tabele łączące (`BookingDriver`, `BookingBus`),
  nie pojedyncze pola FK.
- **„Zajętość” kierowcy/autobusu jest wyliczana, nie przechowywana**: zapytanie o dostępność w danym terminie
  to zapytanie SQL po `Booking` (przedział `startAt`–`endAt`) złączone z `BookingDriver`/`BookingBus` — zawsze
  spójne, bez ryzyka nieaktualnej flagi. To samo zapytanie będzie bazą przyszłego algorytmu przydziału.
- **Zdjęcia floty/wycieczek** trzymane jako pliki w storage, w bazie tylko URL + kolejność.
- **Zero integracji płatniczej** — żadnych pól typu `paymentStatus`, `paidAmount` itp. w tej wersji systemu.

### Frontend: architektura komponentów i theme

Wymóg: właściciel firmy ma móc samodzielnie i łatwo zmieniać wygląd strony w przyszłości, bez ingerencji w
logikę systemu. Dlatego frontend jest zorganizowany modułowo, z jasnym rozdziałem warstwy wizualnej od
logiki biznesowej:

```
components/
├── ui/          → prymitywy shadcn/ui (Button, Input, Label, Card, Badge, ...)
│                   Czysto wizualne, bezstanowe, bez logiki biznesowej. Tu trafiają komponenty
│                   dodawane komendą `npx shadcn add ...`.
├── layout/      → Navbar, Footer, AdminSidebar — stały układ stron publicznych/panelu.
├── sections/    → sekcje stron złożone z komponentów `ui/` (np. Hero, siatka kart oferty,
│                   sekcja kontaktowa). Jedna sekcja = jeden plik = jeden fragment widoczny na stronie.
└── forms/       → formularze (np. LoginForm, w przyszłości InquiryForm, kalkulator).
                    Zawierają WYŁĄCZNIE UI + walidację pól (Zod + React Hook Form). Zapis do bazy,
                    wysyłka e-maili, liczenie ceny — nigdy tutaj; formularz przyjmuje gotową
                    funkcję/Server Action jako prop i tylko ją wywołuje.

app/**/page.tsx  → WYŁĄCZNIE kompozycja: łączy komponenty z components/ i (dla stron serwerowych)
                    przekazuje im dane pobrane z warstwy lib/ jako propsy. Strona nie zawiera
                    bezpośrednio zapytań Prisma, obliczeń cenowych ani reguł biznesowych.

lib/             → logika biznesowa i dostęp do danych, bez JSX: db.ts (Prisma), auth.ts,
                    pricing.ts, routing.ts, lib/actions/ (Server Actions — jedyne miejsce zapisu
                    do bazy), lib/validation/ (schematy Zod współdzielone z formularzami).

app/globals.css  → JEDYNE źródło globalnych tokenów stylistycznych: kolory (zmienne CSS, motyw
                    jasny/ciemny), fonty, promienie zaokrągleń (`--radius`), odstępy. Zmiana
                    wyglądu całej strony (np. kolor marki po dostarczeniu identyfikacji wizualnej
                    przez klienta) = edycja zmiennych w tym jednym pliku, bez dotykania
                    komponentów — komponenty i klasy Tailwind zawsze odwołują się do tych zmiennych
                    (np. `bg-primary`, `text-foreground`, `rounded-lg`), nigdy do zapisanych na
                    sztywno kolorów/wartości.
```

Zasada praktyczna: jeśli ktoś chce zmienić wygląd strony głównej lub formularza zapytania, edytuje plik w
`components/sections/` lub `components/forms/` (oraz ewentualnie tokeny w `app/globals.css`) — nie dotyka
`lib/`. Jeśli ktoś zmienia sposób liczenia ceny lub zapisu do bazy, edytuje `lib/` — nie dotyka JSX. Po
zbudowaniu każdego większego widoku dokumentowane jest, który plik odpowiada za jego wygląd.

---

## 3. Struktura bazy danych (Prisma / PostgreSQL)

**`AdminUser`** — konta panelu
`id, email (unique), passwordHash, name, role (enum: ADMIN), createdAt, lastLoginAt`

**`Driver`** (kierowcy)
`id, firstName, lastName, phone, email, licenseCategories, employmentStatus (enum), notes, createdAt`

**`DriverAvailability`** *(placeholder pod przyszły algorytm — jawna niedostępność, np. urlop)*
`id, driverId → Driver, date, availableFrom, availableTo, note`

**`Bus`** (autobusy)
`id, registrationNumber, brandModel, seats, productionYear, description, features (json), status (enum: ACTIVE/SERVICE/INACTIVE), createdAt`

**`BusPhoto`**
`id, busId → Bus, url, sortOrder`

**`BusAvailability`** *(placeholder, analogicznie do DriverAvailability — np. przegląd techniczny)*
`id, busId → Bus, date, availableFrom, availableTo, note`

**`RegularLine`** (linie regularne)
`id, name, originLabel, destinationLabel, description, active (bool), createdAt`

**`LineStop`** / **`LineSchedule`** — bez zmian względem poprzedniej wersji (przystanki + godziny kursów, do prezentacji rozkładu na stronie publicznej).

**`Trip`** / **`TripPhoto`** — bez zmian (wycieczki/oferty specjalne).

**`CalculatorSettings`** (edytowalne z panelu — jeden aktywny rekord)
`id, ratePerKm (decimal), baseFee (decimal), hourlyWaitingRate (decimal) — stawka za godzinę postoju,
driverOvernightRate (decimal) — koszt noclegu kierowcy za noc, averageSpeedKmh (decimal, domyślnie 55) —
założona średnia prędkość, wyłącznie do orientacyjnego oszacowania czasu jazdy/postoju, updatedAt,
updatedBy → AdminUser`

> **Rozszerzenie Etapu 4:** kalkulator nie wycenia już wyłącznie na podstawie kilometrów — uwzględnia pełny
> czas i charakter realizacji zlecenia (patrz `PriceQuote` niżej). Dokładne reguły naliczania postoju,
> noclegów i dodatkowych kierowców będą doprecyzowywane przez administratora per zapytanie (Etap 5);
> powyższe stawki to pierwsze, orientacyjne przybliżenie.

**`RouteDistanceCache`** (cache odpowiedzi z zewnętrznego API tras dla par punktów)
`id, originText, destinationText, distanceKm, computedAt`

---

### Zapytanie ofertowe (niewiążące)

**`InquiryContactLog`** (chronologiczna historia kontaktu z klientem — widoczna w szczegółach zapytania)
```
id
inquiryId → Inquiry
adminUserId → AdminUser
contactType (enum: PROBA_KONTAKTU, ROZMOWA_TELEFONICZNA, EMAIL, BRAK_ODPOWIEDZI,
                    PROSBA_O_PONOWNY_KONTAKT, USTALENIE_CENY, AKCEPTACJA_KLIENTA, NOTATKA)
note (text, nullable)
createdAt (datetime)
```
Wpisy są append-only (bez edycji/usuwania) i sortowane chronologicznie w widoku zapytania — pełny ślad
kontaktu z klientem od pierwszej próby do decyzji.

**`Inquiry`**
```
id
type (enum: WYNAJEM, WYCIECZKA, LINIA_REGULARNA, INNE)
customerName, customerEmail, customerPhone
requestedDepartureAt (datetime)
requestedReturnAt (datetime, nullable)     → zakres może obejmować wiele dni
passengerCount
additionalInfo (text, nullable)
status (enum: NOWE, DO_KONTAKTU, SKONTAKTOWANO, OCZEKUJE_NA_DECYZJE, ZAAKCEPTOWANE, ODRZUCONE)
relatedLineId (nullable) → RegularLine
relatedTripId (nullable) → Trip
convertedBookingId (nullable) → Booking     → ustawiane dopiero gdy admin utworzy zlecenie
createdAt, updatedAt
```

**`RoutePoint`** (dowolna liczba punktów trasy dla zapytania LUB zlecenia — dokładnie jedno z `inquiryId`/`bookingId` jest ustawione)
```
id
inquiryId (nullable) → Inquiry
bookingId (nullable) → Booking
sequence (int)                    → kolejność: 0, 1, 2, ...
pointType (enum: BAZA_WYJAZD, ODBIOR, PRZYSTANEK, ZWROT, BAZA_POWROT)
label (text)                      → adres / opis punktu
lat, lng (nullable)               → wynik geokodowania, opcjonalny
```

**`PriceQuote`** (niemutowalny snapshot wyceny — append-only, historia zachowana na zawsze)
```
id
inquiryId → Inquiry

// Wejście automatycznej kalkulacji (snapshot stawek/parametrów użytych w tym momencie)
distanceKmAuto (nullable), ratePerKmAtQuote, baseFeeAtQuote,
hourlyWaitingRateAtQuote, driverOvernightRateAtQuote, averageSpeedKmhAtQuote
tripDays (int)                    → liczba dni wyjazdu (kalendarzowo, z dat wyjazd/powrót)
overnightStays (int)              → tripDays - 1, jeśli > 0
driverCount (int, domyślnie 1)    → liczba kierowców uwzględniona w koszcie noclegów
estimatedWaitingHours (decimal)   → szacowany postój = czas wyjazd–powrót minus szacowany czas jazdy
                                     (dystans / averageSpeedKmhAtQuote)

// Wyliczone składowe (przejrzysty podgląd w panelu)
distanceCost, waitingCost, overnightCost (decimal)

// Ręczna korekta administratora (Etap 5) — puste w automatycznej wycenie klienta
manualExtraCosts (nullable), manualExtraCostsNote (nullable)
manualDistanceKm (nullable), manualPrice (nullable) → nadrzędne nad calculatedPrice, jeśli ustawione

calculatedPrice (decimal)         → suma automatyczna: baseFee + distanceCost + waitingCost + overnightCost
isCurrent (bool)                  → oznacza najnowszą/obowiązującą wycenę dla danego Inquiry
createdAt, createdBy (nullable) → AdminUser   → null = wycena automatyczna z formularza klienta
note (text, nullable)
```
Zasada: `calculatedPrice` nigdy nie jest nadpisywany. Każda ręczna korekta admina **tworzy nowy rekord**
`PriceQuote` i oznacza poprzedni jako nieaktualny (`isCurrent = false`). Cena "obowiązująca" to zawsze
najnowszy rekord: `manualPrice ?? calculatedPrice`.

---

### Zlecenie / przejazd (powstaje wyłącznie ręcznie, po akceptacji zapytania)

**`Booking`**
```
id
sourceInquiryId → Inquiry            → z jakiego zapytania powstało
customerName, customerEmail, customerPhone   → skopiowane w momencie utworzenia (niezależne od Inquiry)
startAt (datetime)
endAt (datetime)                     → może obejmować wiele dni
finalPrice (decimal)                 → skopiowana z obowiązującego PriceQuote, edytowalna dalej niezależnie
status (enum: ZAPLANOWANE, W_TRAKCIE, ZAKONCZONE, ANULOWANE)
notes (text, nullable)
createdAt, updatedAt, createdBy → AdminUser
```

**`BookingDriver`** (wielu kierowców na jedno zlecenie)
`id, bookingId → Booking, driverId → Driver, roleOnTrip (enum: GLOWNY/POMOCNICZY, nullable)` — unikalność: (`bookingId`, `driverId`)

**`BookingBus`** (wiele autobusów na jedno zlecenie)
`id, bookingId → Booking, busId → Bus` — unikalność: (`bookingId`, `busId`)

**`RoutePoint`** — jak wyżej, z `bookingId` ustawionym (trasa operacyjna zlecenia; przy tworzeniu Booking z Inquiry punkty trasy są kopiowane, a admin może je dalej edytować niezależnie od pierwotnego zapytania klienta).

**Wyliczanie zajętości** (bez dodatkowej tabeli): kierowca/autobus jest „zajęty” w danym terminie, jeśli
istnieje `Booking` o pokrywającym się przedziale `startAt`–`endAt` (status ≠ ANULOWANE) powiązany z nim przez
`BookingDriver`/`BookingBus`. To zapytanie będzie też rdzeniem przyszłego algorytmu automatycznego przydziału.

---

## 4. Lista ekranów

### Strona publiczna
1. Strona główna
2. O firmie
3. Oferta przewozów (przegląd: linie regularne / wynajem / wycieczki)
4. Flota autobusów — lista
5. Flota autobusów — szczegóły pojazdu (galeria zdjęć, dane techniczne)
6. Rozkład jazdy linii regularnych — lista linii + wyszukiwanie
7. Rozkład jazdy — szczegóły linii (przystanki, godziny)
8. Wycieczki — lista
9. Wycieczki — szczegóły oferty
10. Kalkulator orientacyjnej ceny przejazdu (formularz z możliwością dodania punktów pośrednich, wynik
    oznaczony jako orientacyjny, CTA **„Wyślij zapytanie o przejazd”** — brak jakiegokolwiek CTA sugerującego zakup/płatność)
11. Formularz zapytania — po wysłaniu: ekran/komunikat „Dziękujemy, pracownik SPRINT-TRANS skontaktuje się
    telefonicznie lub mailowo w celu potwierdzenia dostępności, ceny i szczegółów"
12. Kontakt (dane firmy, mapa, formularz kontaktowy)
13. Regulamin / Polityka prywatności (RODO)
14. Strona 404

### Panel administracyjny
1. Logowanie
2. Dashboard (liczba nowych zapytań do kontaktu, zapytania oczekujące na decyzję, nadchodzące zlecenia)
3. Kalendarz (widok **zleceń/Bookingów** — nie surowych zapytań; zakresy wielodniowe, zajętość kierowców/autobusów)
4. Zapytania — lista z filtrami po statusie (NOWE / DO_KONTAKTU / SKONTAKTOWANO / OCZEKUJE_NA_DECYZJE / ZAAKCEPTOWANE / ODRZUCONE)
5. Zapytanie — widok szczegółowy: dane klienta, trasa (punkty), historia wycen (`PriceQuote`), pole ręcznej
   korekty km/ceny, zmiana statusu procesu kontaktu, **chronologiczna historia kontaktu** (`InquiryContactLog`
   — dodawanie wpisów: próba kontaktu, rozmowa telefoniczna, e-mail, brak odpowiedzi, prośba o ponowny
   kontakt, ustalenie ceny, akceptacja klienta, notatka), przycisk **„Utwórz zlecenie z zapytania”** (aktywny po ZAAKCEPTOWANE)
6. Zlecenia — lista (filtrowanie po statusie realizacji i dacie)
7. Zlecenie — widok szczegółowy: trasa operacyjna, przypisani kierowcy (wielu), przypisane autobusy (wiele),
   daty start/koniec, cena końcowa (edytowalna), status realizacji, notatki
8. Kierowcy — lista
9. Kierowcy — dodaj/edytuj/szczegóły (w przyszłości: kalendarz dostępności)
10. Autobusy — lista
11. Autobusy — dodaj/edytuj/szczegóły (zdjęcia, w przyszłości: kalendarz dostępności)
12. Linie regularne — lista
13. Linie regularne — dodaj/edytuj (przystanki, harmonogram, cena)
14. Wycieczki — lista
15. Wycieczki — dodaj/edytuj
16. Ustawienia kalkulatora (stawka/km, opłata bazowa — z informacją, że zmiana nie wpływa na historyczne wyceny)
17. Konta administratorów
18. Profil / zmiana hasła

---

## 5. Przepływ danych

```
KLIENT (strona publiczna)
   │
   │ 1. Kalkulator: klient dodaje punkty trasy (start, ewent. punkty pośrednie, cel), daty, liczbę pasażerów
   ▼
Server Action ──► lib/routing.ts ──► API tras (OpenRouteService) → suma odległości dla wszystkich odcinków trasy
   │                                        │
   │                                        ▼
   │                              RouteDistanceCache (odczyt/zapis, oszczędność limitu API)
   │
   │ 2. lib/pricing.ts: distanceKm × ratePerKm (CalculatorSettings) + baseFee (CalculatorSettings)
   ▼
Wynik ORIENTACYJNY wyświetlony klientowi (wyraźnie opisany jako niewiążący, nie ostateczna oferta)
   │
   │ 3. Klient klika "Wyślij zapytanie o przejazd" (bez żadnej płatności)
   ▼
Server Action zapisuje:
   - Inquiry (status = NOWE)
   - RoutePoint[] (punkty trasy powiązane z Inquiry)
   - PriceQuote (snapshot: distanceKmAuto, ratePerKmAtQuote, baseFeeAtQuote, calculatedPrice, isCurrent=true)
   │
   ├──► e-mail do klienta: potwierdzenie przyjęcia zapytania + info o kontakcie telefonicznym/mailowym
   └──► e-mail do admina: nowe zapytanie do obsłużenia
   │
   ▼
BAZA DANYCH (PostgreSQL — wspólna dla obu części systemu)
   │
   ▼
PANEL ADMINISTRACYJNY
   │ Dashboard/lista "Zapytania" czytają tę samą tabelę Inquiry (ta sama baza, bez synchronizacji)
   │
   │ 4. Admin dzwoni/pisze do klienta → zmienia status: DO_KONTAKTU → SKONTAKTOWANO → OCZEKUJE_NA_DECYZJE
   │    każda interakcja zapisywana jako wpis InquiryContactLog (typ kontaktu, notatka, data, admin)
   │ 5. (opcjonalnie) Admin ręcznie koryguje km/cenę → nowy PriceQuote (poprzedni: isCurrent=false)
   │ 6. Admin ustala status: ZAAKCEPTOWANE lub ODRZUCONE
   ▼
Jeśli ZAAKCEPTOWANE → admin klika "Utwórz zlecenie z zapytania":
   - Booking (kopiowane dane klienta, finalPrice z obowiązującego PriceQuote, startAt/endAt)
   - RoutePoint[] skopiowane z Inquiry, powiązane z bookingId (dalej edytowalne niezależnie)
   - Inquiry.convertedBookingId ustawione na nowy Booking
   ▼
Admin przypisuje kierowców (BookingDriver — wielu) i autobusy (BookingBus — wiele)
   ▼
Zlecenie widoczne w Kalendarzu; zajętość kierowców/autobusów wyliczana z przedziałów Booking.startAt–endAt
```

Dane „referencyjne" (autobusy, kierowcy, linie, wycieczki, ustawienia kalkulatora) płyną w drugą stronę:
admin edytuje je w panelu → strona publiczna czyta te same tabele przy renderowaniu.

---

## 6. Plan realizacji (etapy)

**Etap 0 — Fundament (setup)**
Inicjalizacja repo, projekt Next.js + TypeScript + Tailwind + shadcn/ui, konfiguracja Prisma (na tym etapie:
lokalna baza deweloperska — połączenie z docelową bazą Neon/Supabase spinamy przy właściwym wdrożeniu, nie
blokuje to developmentu), szkielet layoutów (publiczny/admin), podstawowa strona główna z placeholderami,
konfiguracja lint/format, `.env.example`, README z instrukcją uruchomienia. Bez własnej domeny — lokalnie
i (docelowo) na tymczasowym URL-u Vercel; podpięcie domeny klienta nastąpi później i nie jest częścią tego etapu.

**Etap 1 — Baza danych i logowanie do panelu**
Pełny `schema.prisma` (wszystkie tabele z sekcji 3, w tym `Inquiry`/`Booking`/`RoutePoint`/`PriceQuote`/tabele
łączące), migracje, seed danych testowych. Auth.js + logowanie administratora, middleware chroniący `/admin/*`.

**Etap 2 — Dane podstawowe w panelu (CRUD)**
Ekrany: Autobusy (+ zdjęcia), Kierowcy, Linie regularne (+ przystanki/harmonogram), Wycieczki, Ustawienia
kalkulatora.

**Etap 3 — Strona publiczna: treści statyczne i prezentacja danych**
Strona główna, O firmie, Oferta, Kontakt, Regulamin/RODO, Flota, Rozkład jazdy, Wycieczki. Pełna
responsywność (mobile/tablet/desktop).

**Etap 4 — Kalkulator (wielopunktowy) i formularz zapytania**
Integracja z API tras (suma odcinków dla dowolnej liczby punktów), `lib/pricing.ts` tworzące snapshot
`PriceQuote`, formularz zapytania (walidacja Zod), zapis `Inquiry` + `RoutePoint`, e-mail z jasną informacją
o dalszym kontakcie i braku wiążącej rezerwacji/płatności online.

**Etap 5 — Obsługa zapytań w panelu**
Lista i widok zapytań, workflow statusów kontaktu (NOWE → ... → ZAAKCEPTOWANE/ODRZUCONE), ręczna korekta
km/ceny (nowy `PriceQuote`), podgląd historii wycen.

**Etap 6 — Zlecenia (Booking/Job) i kalendarz**
Akcja "Utwórz zlecenie z zapytania", przypisywanie wielu kierowców i wielu autobusów, edycja trasy
operacyjnej, obsługa zleceń wielodniowych, kalendarz z widoczną zajętością zasobów, zmiana statusu
realizacji (ZAPLANOWANE/W_TRAKCIE/ZAKONCZONE/ANULOWANE).

**Etap 7 — Bezpieczeństwo, jakość, zgodność z RODO**
Rate limiting / ochrona formularzy publicznych, przegląd walidacji wejścia, nagłówki bezpieczeństwa, test
responsywności na realnych urządzeniach, treści prawne (regulamin, polityka prywatności, klauzula RODO),
weryfikacja, że nigdzie na stronie nie pojawia się sugestia płatności/zakupu online.

**Etap 8 — Testy end-to-end i wdrożenie produkcyjne**
Testy pełnego przepływu (zapytanie klienta → kontakt → akceptacja → zlecenie → przypisania → kalendarz),
poprawki, konfiguracja domeny produkcyjnej, wprowadzenie do panelu dla obsługi SPRINT-TRANS.

**Etap 9 — (poza obecnym zakresem, przygotowane architektonicznie)**
Automatyczny algorytm proponowania przydziału kierowców i autobusów, wykorzystujący dokładnie te same
zapytania o zajętość (`Booking` + `BookingDriver`/`BookingBus` po przedziałach dat) oraz tabele
`DriverAvailability`/`BusAvailability` — możliwy do dopięcia jako niezależny moduł, bez zmian schematu.

---

## Decyzje uzupełniające (potwierdzone)
- **Domena**: podpinana później, nie blokuje developmentu ani Etapu 0.
- **Wielu administratorów**: `AdminUser` jako osobna tabela (nie pojedynczy zapisany login) od Etapu 1 —
  architektura od razu na to pozwala. Na starcie istnieje jedno konto główne; ekran „Konta administratorów”
  (pkt 17 w sekcji 4) umożliwi później dodanie kolejnych pracowników bez zmian w schemacie.
- **Dane w developmencie**: wyłącznie placeholdery i dane fikcyjne (teksty, logo, zdjęcia floty, seed
  danych — kierowcy, klienci, zapytania). Docelowe treści/zdjęcia firmy dostarczy klient przed Etapem 3.
  **Zakaz używania prawdziwych danych klientów lub kierowców w trakcie developmentu.**
- **Treść komunikatu po wysłaniu zapytania** (finalna, do wdrożenia w Etapie 4):
  > „Dziękujemy za przesłanie zapytania! Twoje zapytanie zostało przekazane do SPRINT-TRANS. Nasz pracownik
  > skontaktuje się z Tobą telefonicznie lub mailowo w celu potwierdzenia dostępności autobusu, ostatecznej
  > ceny oraz szczegółów przejazdu. Przesłanie formularza nie oznacza potwierdzenia rezerwacji. Wyświetlona
  > wcześniej kalkulacja ma charakter orientacyjny.”

## Zakres najbliższej pracy
Architektura zaakceptowana. **Teraz realizowany jest wyłącznie Etap 0 — Fundament.** Po jego zakończeniu:
uruchomienie projektu lokalnie, weryfikacja poprawnego builda, naprawa ewentualnych błędów, dokładne
podsumowanie co powstało oraz instrukcja uruchomienia i podglądu w przeglądarce — a następnie **zatrzymanie
się i oczekiwanie na akceptację przed rozpoczęciem Etapu 1.**
