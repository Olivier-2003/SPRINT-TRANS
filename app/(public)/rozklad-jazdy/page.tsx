import { LineSearchList } from "@/components/public/lines/LineSearchList";
import { getPublicLines } from "@/lib/data/lines";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const lines = await getPublicLines();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-14 md:py-16">
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Rozkład jazdy linii regularnych</h1>
        <p className="text-muted-foreground">
          Wybierz linię, aby zobaczyć przystanki i godziny kursów.
        </p>
      </div>
      <LineSearchList lines={lines} />
    </div>
  );
}
