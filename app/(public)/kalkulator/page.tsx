import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InquiryForm } from "@/components/forms/InquiryForm";

export default function CalculatorPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kalkulator ceny przejazdu</h1>
        <p className="text-muted-foreground">
          Podaj trasę, daty i liczbę pasażerów, aby zobaczyć orientacyjną cenę wynajmu autobusu.
          Wyliczona cena nie stanowi ostatecznej oferty ani potwierdzenia rezerwacji — po
          przesłaniu zapytania nasz pracownik skontaktuje się z Tobą, aby potwierdzić
          dostępność, ostateczną cenę i szczegóły przejazdu.
        </p>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Zapytanie o wynajem autobusu</CardTitle>
        </CardHeader>
        <CardContent>
          <InquiryForm />
        </CardContent>
      </Card>
    </div>
  );
}
