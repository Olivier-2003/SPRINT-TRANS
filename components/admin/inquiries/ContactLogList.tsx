import type { InquiryContactLog, AdminUser } from "@/lib/generated/prisma/client";

const CONTACT_TYPE_LABELS: Record<InquiryContactLog["contactType"], string> = {
  PROBA_KONTAKTU: "Próba kontaktu",
  ROZMOWA_TELEFONICZNA: "Rozmowa telefoniczna",
  EMAIL: "Kontakt e-mail",
  BRAK_ODPOWIEDZI: "Brak odpowiedzi",
  PROSBA_O_PONOWNY_KONTAKT: "Prośba o ponowny kontakt",
  USTALENIE_CENY: "Ustalenie ceny",
  AKCEPTACJA_KLIENTA: "Akceptacja klienta",
  NOTATKA: "Notatka wewnętrzna",
};

type LogEntry = InquiryContactLog & { adminUser: Pick<AdminUser, "name"> };

export function ContactLogList({ entries }: { entries: LogEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Brak wpisów historii kontaktu ani notatek.</p>
    );
  }

  return (
    <ol className="flex flex-col gap-3">
      {entries.map((entry) => (
        <li key={entry.id} className="rounded-md border p-3 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {CONTACT_TYPE_LABELS[entry.contactType]}
            </span>
            <span>
              {entry.adminUser.name} · {new Date(entry.createdAt).toLocaleString("pl-PL")}
            </span>
          </div>
          {entry.note && <p className="mt-1">{entry.note}</p>}
        </li>
      ))}
    </ol>
  );
}
