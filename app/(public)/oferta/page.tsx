import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Oferta przewozów</h1>
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

        <Link href="/flota">
          <Card className="h-full transition-colors hover:border-primary">
            <CardHeader>
              <CardTitle className="text-base">Wynajem autobusów</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
              <span>{buses.length} autobusów dostępnych do wynajmu.</span>
              <Badge variant="secondary" className="w-fit">
                Kalkulator ceny i zapytanie — od Etapu 4
              </Badge>
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
