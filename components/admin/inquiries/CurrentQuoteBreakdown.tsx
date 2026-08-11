import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getEffectiveQuoteValues } from "@/lib/price-quote-helpers";
import type { PriceQuote } from "@/lib/generated/prisma/client";

export function CurrentQuoteBreakdown({ quote }: { quote: PriceQuote }) {
  const effective = getEffectiveQuoteValues(quote);
  const ratePerKm = Number(quote.ratePerKmAtQuote);
  const baseFee = Number(quote.baseFeeAtQuote);
  const hourlyWaitingRate = Number(quote.hourlyWaitingRateAtQuote);
  const driverOvernightRate = Number(quote.driverOvernightRateAtQuote);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-base">Obowiązująca wycena</CardTitle>
        {effective.isManuallyAdjusted && <Badge variant="outline">skorygowana ręcznie</Badge>}
      </CardHeader>
      <CardContent className="flex flex-col gap-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Dystans</span>
          <span>{effective.distanceKm.toFixed(1)} km</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Koszt kilometrów ({ratePerKm.toFixed(2)} zł/km)</span>
          <span>{(effective.distanceKm * ratePerKm).toFixed(2)} zł</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Opłata bazowa</span>
          <span>{baseFee.toFixed(2)} zł</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Postój ({effective.waitingHours.toFixed(1)} h × {hourlyWaitingRate.toFixed(2)} zł/h)
          </span>
          <span>{(effective.waitingHours * hourlyWaitingRate).toFixed(2)} zł</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Noclegi ({effective.overnightStays} × {effective.driverCount} kier. ×{" "}
            {driverOvernightRate.toFixed(2)} zł)
          </span>
          <span>
            {(effective.overnightStays * effective.driverCount * driverOvernightRate).toFixed(2)} zł
          </span>
        </div>
        {effective.extraCosts !== 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Dodatkowe koszty{quote.manualExtraCostsNote ? ` (${quote.manualExtraCostsNote})` : ""}
            </span>
            <span>{effective.extraCosts.toFixed(2)} zł</span>
          </div>
        )}
        <div className="mt-2 flex justify-between border-t pt-2 text-base font-semibold">
          <span>Razem (orientacyjnie)</span>
          <span>{effective.price.toFixed(2)} zł</span>
        </div>
        {quote.note && <p className="mt-1 text-xs text-muted-foreground">Notatka: {quote.note}</p>}
      </CardContent>
    </Card>
  );
}
