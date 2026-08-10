import { LineSearchList } from "@/components/public/lines/LineSearchList";
import { getPublicLines } from "@/lib/data/lines";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const lines = await getPublicLines();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rozkład jazdy linii regularnych</h1>
        <p className="text-muted-foreground">
          Wybierz linię, aby zobaczyć przystanki i godziny kursów.
        </p>
      </div>
      <LineSearchList lines={lines} />
    </div>
  );
}
