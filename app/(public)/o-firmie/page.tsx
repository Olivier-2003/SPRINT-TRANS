export default function AboutPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">O firmie</h1>
      <p className="text-muted-foreground">
        SPRINT-TRANS zajmuje się przewozem osób autobusami — zarówno na liniach regularnych, jak i
        w ramach wynajmu na wycieczki oraz inne przejazdy. [Docelowy opis firmy, historia i
        doświadczenie zostaną uzupełnione przez SPRINT-TRANS.]
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border p-4">
          <p className="text-2xl font-semibold">—</p>
          <p className="text-sm text-muted-foreground">lat doświadczenia (placeholder)</p>
        </div>
        <div className="rounded-md border p-4">
          <p className="text-2xl font-semibold">—</p>
          <p className="text-sm text-muted-foreground">autobusów we flocie (placeholder)</p>
        </div>
        <div className="rounded-md border p-4">
          <p className="text-2xl font-semibold">—</p>
          <p className="text-sm text-muted-foreground">obsłużonych przejazdów (placeholder)</p>
        </div>
      </div>
    </div>
  );
}
