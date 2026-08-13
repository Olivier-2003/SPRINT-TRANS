export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-14 md:py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">O firmie</h1>
      <p className="max-w-2xl text-muted-foreground">
        SPRINT-TRANS zajmuje się przewozem osób autobusami — zarówno na liniach regularnych, jak i
        w ramach wynajmu na wycieczki oraz inne przejazdy. [Docelowy opis firmy, historia i
        doświadczenie zostaną uzupełnione przez SPRINT-TRANS.]
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border p-5">
          <p className="text-3xl font-semibold text-primary">—</p>
          <p className="text-sm text-muted-foreground">lat doświadczenia (placeholder)</p>
        </div>
        <div className="rounded-2xl border p-5">
          <p className="text-3xl font-semibold text-primary">—</p>
          <p className="text-sm text-muted-foreground">autobusów we flocie (placeholder)</p>
        </div>
        <div className="rounded-2xl border p-5">
          <p className="text-3xl font-semibold text-primary">—</p>
          <p className="text-sm text-muted-foreground">obsłużonych przejazdów (placeholder)</p>
        </div>
      </div>
    </div>
  );
}
