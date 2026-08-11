// Stałe teksty współdzielone między e-mailem (lib/email.ts, server-only) a UI
// (components/forms/InquiryForm.tsx, client) — plik celowo bez zależności
// server-only (bazy danych, Resend), żeby mógł być bezpiecznie importowany
// po stronie klienta.

export const INQUIRY_CONFIRMATION_MESSAGE =
  "Dziękujemy za przesłanie zapytania! Twoje zapytanie zostało przekazane do SPRINT-TRANS. " +
  "Nasz pracownik skontaktuje się z Tobą telefonicznie lub mailowo w celu potwierdzenia " +
  "dostępności autobusu, ostatecznej ceny oraz szczegółów przejazdu. Przesłanie formularza " +
  "nie oznacza potwierdzenia rezerwacji. Wyświetlona wcześniej kalkulacja ma charakter orientacyjny.";
