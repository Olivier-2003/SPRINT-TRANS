import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InquiryOverview } from "@/components/admin/inquiries/InquiryOverview";
import { CurrentQuoteBreakdown } from "@/components/admin/inquiries/CurrentQuoteBreakdown";
import { PriceQuoteHistoryTable } from "@/components/admin/inquiries/PriceQuoteHistoryTable";
import { ContactLogList } from "@/components/admin/inquiries/ContactLogList";
import { InquiryStatusForm } from "@/components/forms/InquiryStatusForm";
import { ContactLogForm } from "@/components/forms/ContactLogForm";
import { ManualPriceQuoteForm } from "@/components/forms/ManualPriceQuoteForm";
import { CreateBookingButton } from "@/components/forms/CreateBookingButton";
import { getInquiry } from "@/lib/data/inquiries";
import { getEffectiveQuoteValues } from "@/lib/price-quote-helpers";
import { INQUIRY_STATUS_LABELS, INQUIRY_STATUS_BADGE_VARIANT } from "@/lib/inquiry-status";
import {
  updateInquiryStatus,
  addContactLogEntry,
  createManualPriceQuote,
  createBookingFromInquiry,
} from "@/lib/actions/inquiries";

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiry = await getInquiry(id);
  if (!inquiry) notFound();

  const currentQuote = inquiry.priceQuotes.find((quote) => quote.isCurrent) ?? inquiry.priceQuotes[0];
  const effective = currentQuote ? getEffectiveQuoteValues(currentQuote) : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Zapytanie: {inquiry.customerName}
          </h1>
          <p className="text-sm text-muted-foreground">
            Złożone {new Date(inquiry.createdAt).toLocaleString("pl-PL")}
          </p>
        </div>
        <Badge variant={INQUIRY_STATUS_BADGE_VARIANT[inquiry.status]}>
          {INQUIRY_STATUS_LABELS[inquiry.status]}
        </Badge>
      </div>

      <InquiryStatusForm
        inquiryId={inquiry.id}
        currentStatus={inquiry.status}
        action={updateInquiryStatus}
      />

      <InquiryOverview inquiry={inquiry} routePoints={inquiry.routePoints} />

      {currentQuote && <CurrentQuoteBreakdown quote={currentQuote} />}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Zlecenie</CardTitle>
        </CardHeader>
        <CardContent>
          {inquiry.booking ? (
            <Button render={<Link href={`/admin/zlecenia/${inquiry.booking.id}`} />} nativeButton={false}>
              Zobacz utworzone zlecenie
            </Button>
          ) : inquiry.status === "ZAAKCEPTOWANE" ? (
            <CreateBookingButton action={createBookingFromInquiry.bind(null, inquiry.id)} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Zlecenie będzie można utworzyć po ustawieniu statusu „Zaakceptowane”.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historia wycen</CardTitle>
        </CardHeader>
        <CardContent>
          <PriceQuoteHistoryTable quotes={inquiry.priceQuotes} />
        </CardContent>
      </Card>

      {currentQuote && effective && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nowa wycena (korekta ręczna)</CardTitle>
          </CardHeader>
          <CardContent>
            <ManualPriceQuoteForm
              inquiryId={inquiry.id}
              action={createManualPriceQuote}
              defaultValues={{
                distanceKm: String(effective.distanceKm),
                tripDays: String(effective.tripDays),
                overnightStays: String(effective.overnightStays),
                driverCount: String(effective.driverCount),
                waitingHours: String(effective.waitingHours),
                extraCosts: effective.extraCosts ? String(effective.extraCosts) : "",
                extraCostsNote: currentQuote.manualExtraCostsNote ?? "",
                finalPrice: String(effective.price),
                note: "",
              }}
              rates={{
                ratePerKm: Number(currentQuote.ratePerKmAtQuote),
                baseFee: Number(currentQuote.baseFeeAtQuote),
                hourlyWaitingRate: Number(currentQuote.hourlyWaitingRateAtQuote),
                driverOvernightRate: Number(currentQuote.driverOvernightRateAtQuote),
              }}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historia kontaktu i notatki wewnętrzne</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ContactLogForm inquiryId={inquiry.id} action={addContactLogEntry} />
          <ContactLogList entries={inquiry.contactLogs} />
        </CardContent>
      </Card>
    </div>
  );
}
