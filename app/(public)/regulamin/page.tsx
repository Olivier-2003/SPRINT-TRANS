const SECTIONS = [
  "Postanowienia ogólne",
  "Zakres usług",
  "Zasady rezerwacji i zapytań o przejazd",
  "Płatności i rozliczenia",
  "Odpowiedzialność stron",
  "Reklamacje",
  "Postanowienia końcowe",
];

export default function TermsPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-14 md:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Regulamin</h1>
      <p className="text-sm text-muted-foreground">
        Poniższa struktura regulaminu zostanie uzupełniona docelową treścią przez SPRINT-TRANS
        przed uruchomieniem produkcyjnym serwisu.
      </p>
      <ol className="flex flex-col gap-4">
        {SECTIONS.map((section, index) => (
          <li key={section}>
            <h2 className="font-semibold">
              {index + 1}. {section}
            </h2>
            <p className="text-sm text-muted-foreground">[Treść do uzupełnienia]</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
