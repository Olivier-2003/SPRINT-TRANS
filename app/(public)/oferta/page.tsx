import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicLines } from "@/lib/data/lines";
import { getPublicTrips } from "@/lib/data/trips";
import { getPublicBuses } from "@/lib/data/buses";

export const dynamic = "force-dynamic";

export default async function OfferPage() {
  const [lines, trips, buses] = await Promise.all([
    getPublicLines(),
    getPublicTrips(),
    getPublicBuses(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-14 md:py-16">
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Oferta przewozów</h1>
        <p className="text-muted-foreground">
          Linie regularne, wynajem autobusów oraz zorganizowane wycieczki.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/rozklad-jazdy">
          <Card className="h-full transition-colors hover:border-primary">
            <CardHeader>
              <CardTitle className="text-base">Linie regularne</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {lines.length} {lines.length === 1 ? "aktywna linia" : "aktywnych linii"} w
              rozkładzie jazdy.
            </CardContent>
          </Card>
        </Link>

        <Link href="/kalkulator">
          <Card className="h-full transition-colors hover:border-primary">
            <CardHeader>
              <CardTitle className="text-base">Wynajem autobusów</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {buses.length} autobusów dostępnych do wynajmu. Sprawdź orientacyjną cenę w
              kalkulatorze.
            </CardContent>
          </Card>
        </Link>

        <Link href="/wycieczki">
          <Card className="h-full transition-colors hover:border-primary">
            <CardHeader>
              <CardTitle className="text-base">Wycieczki</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {trips.length} {trips.length === 1 ? "aktywna oferta" : "aktywnych ofert"} wycieczek.
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
