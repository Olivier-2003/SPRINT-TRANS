import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineForm } from "@/components/forms/LineForm";
import { createLine } from "@/lib/actions/lines";

export default function NewLinePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Nowa linia regularna</h1>
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="text-base">Dane linii</CardTitle>
        </CardHeader>
        <CardContent>
          <LineForm action={createLine} submitLabel="Dodaj linię" />
        </CardContent>
      </Card>
    </div>
  );
}
