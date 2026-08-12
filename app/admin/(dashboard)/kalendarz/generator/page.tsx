import { ScheduleGeneratorClient } from "@/components/admin/schedule/ScheduleGeneratorClient";

export default function ScheduleGeneratorPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Generator propozycji grafiku</h1>
        <p className="text-sm text-muted-foreground">
          System wyłącznie proponuje obsadę na podstawie dostępności, odpoczynku, wymiaru czasu
          pracy i historii — administrator zawsze ręcznie zatwierdza ostateczny przydział.
        </p>
      </div>
      <ScheduleGeneratorClient />
    </div>
  );
}
