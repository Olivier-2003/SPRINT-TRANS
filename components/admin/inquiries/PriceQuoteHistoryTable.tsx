import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getEffectiveQuoteValues } from "@/lib/price-quote-helpers";
import type { PriceQuote, AdminUser } from "@/lib/generated/prisma/client";

type QuoteRow = PriceQuote & { createdBy: Pick<AdminUser, "name"> | null };

export function PriceQuoteHistoryTable({ quotes }: { quotes: QuoteRow[] }) {
  if (quotes.length === 0) {
    return <p className="text-sm text-muted-foreground">Brak wycen.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Autor</TableHead>
          <TableHead>Dystans</TableHead>
          <TableHead>Dni / noclegi / kierowcy</TableHead>
          <TableHead>Postój</TableHead>
          <TableHead>Cena</TableHead>
          <TableHead>Notatka</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quotes.map((quote) => {
          const effective = getEffectiveQuoteValues(quote);
          return (
            <TableRow key={quote.id}>
              <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                {new Date(quote.createdAt).toLocaleString("pl-PL")}
                {quote.isCurrent && (
                  <Badge variant="default" className="ml-2">
                    obowiązująca
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {quote.createdBy?.name ?? "automatyczna (klient)"}
              </TableCell>
              <TableCell>{effective.distanceKm.toFixed(1)} km</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {effective.tripDays} dni / {effective.overnightStays} noc. /{" "}
                {effective.driverCount} kier.
              </TableCell>
              <TableCell>{effective.waitingHours.toFixed(1)} h</TableCell>
              <TableCell className="font-medium">{effective.price.toFixed(2)} zł</TableCell>
              <TableCell className="text-sm text-muted-foreground">{quote.note ?? "—"}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
