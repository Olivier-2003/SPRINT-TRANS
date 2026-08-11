import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { INQUIRY_STATUS_LABELS, INQUIRY_STATUS_BADGE_VARIANT } from "@/lib/inquiry-status";
import type { Inquiry, PriceQuote } from "@/lib/generated/prisma/client";

type InquiryRow = Inquiry & {
  priceQuotes: PriceQuote[];
  booking: { id: string } | null;
};

function effectivePrice(quote?: PriceQuote): number | null {
  if (!quote) return null;
  return Number(quote.manualPrice ?? quote.calculatedPrice);
}

export function InquiriesTable({ inquiries }: { inquiries: InquiryRow[] }) {
  if (inquiries.length === 0) {
    return <p className="text-sm text-muted-foreground">Brak zapytań spełniających kryteria.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Klient</TableHead>
          <TableHead>Kontakt</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Cena orientacyjna</TableHead>
          <TableHead className="text-right">Akcje</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inquiries.map((inquiry) => {
          const price = effectivePrice(inquiry.priceQuotes[0]);
          return (
            <TableRow key={inquiry.id}>
              <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                {new Date(inquiry.createdAt).toLocaleString("pl-PL")}
              </TableCell>
              <TableCell className="font-medium">{inquiry.customerName}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {inquiry.customerPhone}
                <br />
                {inquiry.customerEmail}
              </TableCell>
              <TableCell>
                <Badge variant={INQUIRY_STATUS_BADGE_VARIANT[inquiry.status]}>
                  {INQUIRY_STATUS_LABELS[inquiry.status]}
                </Badge>
                {inquiry.booking && (
                  <Badge variant="outline" className="ml-1">
                    Zlecenie utworzone
                  </Badge>
                )}
              </TableCell>
              <TableCell>{price !== null ? `${price.toFixed(2)} zł` : "—"}</TableCell>
              <TableCell className="text-right">
                <Button
                  render={<Link href={`/admin/zapytania/${inquiry.id}`} />}
                  nativeButton={false}
                  variant="ghost"
                  size="sm"
                >
                  Szczegóły
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
