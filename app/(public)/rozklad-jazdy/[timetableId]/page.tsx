import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTimetable } from "@/lib/timetables";

export default async function TimetableDetailPage({
  params,
}: {
  params: Promise<{ timetableId: string }>;
}) {
  const { timetableId } = await params;
  const timetable = getTimetable(timetableId);
  if (!timetable) notFound();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-14 md:py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Link
            href="/rozklad-jazdy"
            className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Wszystkie rozkłady
          </Link>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{timetable.name}</h1>
          <p className="text-muted-foreground">{timetable.description}</p>
        </div>
        <Button
          render={<a href={timetable.pdfPath} target="_blank" rel="noopener noreferrer" />}
          nativeButton={false}
          variant="outline"
          className="gap-1.5 rounded-full"
        >
          <Download />
          Pobierz / otwórz w nowej karcie
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-muted/30">
        {/* Osadzony podgląd PDF — aktualizacja rozkładu to wyłącznie podmiana pliku
            pod `timetable.pdfPath` (patrz lib/timetables.ts), bez zmian tutaj. */}
        <iframe src={timetable.pdfPath} title={timetable.name} className="h-[75vh] w-full" />
      </div>
    </div>
  );
}
