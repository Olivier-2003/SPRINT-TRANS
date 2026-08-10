import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineForm } from "@/components/forms/LineForm";
import { updateLine } from "@/lib/actions/lines";
import { getLine } from "@/lib/data/lines";

function toDateInputValue(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export default async function EditLinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const line = await getLine(id);
  if (!line) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Edycja linii: {line.name}</h1>
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="text-base">Dane linii</CardTitle>
        </CardHeader>
        <CardContent>
          <LineForm
            action={updateLine.bind(null, line.id)}
            defaultValues={{
              name: line.name,
              originLabel: line.originLabel,
              destinationLabel: line.destinationLabel,
              description: line.description ?? "",
              active: line.active,
              stops: line.stops.map((stop) => ({
                stopName: stop.stopName,
                arrivalOffsetMinutes: stop.arrivalOffsetMinutes,
              })),
              schedules: line.schedules.map((schedule) => ({
                daysOfWeek: schedule.daysOfWeek,
                departureTime: schedule.departureTime,
                arrivalTime: schedule.arrivalTime,
                price: Number(schedule.price),
                validFrom: toDateInputValue(schedule.validFrom),
                validTo: toDateInputValue(schedule.validTo),
              })),
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
