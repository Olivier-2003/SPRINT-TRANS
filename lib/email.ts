import { Resend } from "resend";
import { db } from "@/lib/db";
import { INQUIRY_CONFIRMATION_MESSAGE } from "@/lib/inquiry-messages";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.INQUIRY_FROM_EMAIL || "onboarding@resend.dev";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

interface SendInquiryEmailsInput {
  inquiryId: string;
  customerName: string;
  customerEmail: string;
}

/**
 * Wysyłka e-maili po złożeniu zapytania — najlepszy wysiłek (best-effort).
 * Brak klucza API lub błąd wysyłki NIGDY nie blokuje zapisu zapytania w bazie —
 * to ono jest źródłem prawdy, e-mail to tylko powiadomienie.
 */
export async function sendInquiryEmails({
  inquiryId,
  customerName,
  customerEmail,
}: SendInquiryEmailsInput): Promise<void> {
  if (!resend) {
    console.warn(
      `RESEND_API_KEY nie jest ustawiony — pominięto wysyłkę e-maili dla zapytania ${inquiryId}.`
    );
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: "SPRINT-TRANS — potwierdzenie przyjęcia zapytania",
      text: `Cześć ${customerName},\n\n${INQUIRY_CONFIRMATION_MESSAGE}\n\n— SPRINT-TRANS`,
    });
  } catch (error) {
    console.error(`Błąd wysyłki e-maila do klienta dla zapytania ${inquiryId}:`, error);
  }

  try {
    const admins = await db.adminUser.findMany({ select: { email: true } });
    if (admins.length > 0) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: admins.map((admin) => admin.email),
        subject: "Nowe zapytanie o przejazd — SPRINT-TRANS",
        text: `Nowe zapytanie (ID: ${inquiryId}) od ${customerName} (${customerEmail}). Sprawdź szczegóły w panelu administracyjnym.`,
      });
    }
  } catch (error) {
    console.error(`Błąd wysyłki e-maila do administratorów dla zapytania ${inquiryId}:`, error);
  }
}
