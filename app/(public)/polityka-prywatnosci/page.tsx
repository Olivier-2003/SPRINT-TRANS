const SECTIONS = [
  "Administrator danych osobowych",
  "Cele i podstawy przetwarzania danych",
  "Odbiorcy danych",
  "Okres przechowywania danych",
  "Prawa osoby, której dane dotyczą",
  "Pliki cookies",
  "Kontakt w sprawach ochrony danych",
];

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-14 md:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Polityka prywatności</h1>
      <p className="text-sm text-muted-foreground">
        Poniższa struktura zgodna jest z wymogami RODO. Docelowa treść zostanie uzupełniona przez
        SPRINT-TRANS przed uruchomieniem produkcyjnym serwisu — w szczególności w zakresie danych
        zbieranych przez formularz zapytania (Etap 4).
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
