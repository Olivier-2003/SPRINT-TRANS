import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InquiryForm } from "@/components/forms/InquiryForm";

export default async function CalculatorPage({
  searchParams,
}: {
  searchParams: Promise<{ origin?: string; destination?: string; departureAt?: string; passengers?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-14 md:py-16">
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Kalkulator ceny przejazdu</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
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
          <InquiryForm
            initialValues={{
              origin: params.origin,
              destination: params.destination,
              requestedDepartureAt: params.departureAt,
              passengerCount: params.passengers,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
