import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OfferHighlightsProps {
  lineCount: number;
  busCount: number;
  tripCount: number;
}

export function OfferHighlights({ lineCount, busCount, tripCount }: OfferHighlightsProps) {
  const highlights = [
    {
      title: "Linie regularne",
      description: `${lineCount} ${lineCount === 1 ? "aktywna linia" : "aktywnych linii"} w rozkładzie jazdy.`,
      href: "/rozklad-jazdy",
    },
    {
      title: "Wynajem autobusów",
      description: `${busCount} autobusów we flocie. Kalkulator i formularz zapytania — od Etapu 4.`,
      href: "/flota",
    },
    {
      title: "Wycieczki",
      description: `${tripCount} ${tripCount === 1 ? "aktywna oferta" : "aktywnych ofert"} wycieczek.`,
      href: "/wycieczki",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {highlights.map((item) => (
        <Link key={item.title} href={item.href}>
          <Card className="h-full transition-colors hover:border-primary">
            <CardHeader>
              <CardTitle className="text-base">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {item.description}
            </CardContent>
          </Card>
        </Link>
      ))}
    </section>
  );
}
