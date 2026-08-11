import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Inquiry, RoutePoint } from "@/lib/generated/prisma/client";
import { ROUTE_POINT_TYPE_LABELS } from "@/lib/route-point";

function formatDateTime(date: Date | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleString("pl-PL");
}

function formatDuration(from: Date, to: Date | null): string {
  if (!to) return "—";
  const hours = (to.getTime() - from.getTime()) / (1000 * 60 * 60);
  if (hours <= 0) return "—";
  const days = Math.floor(hours / 24);
  const remainingHours = Math.round(hours % 24);
  if (days === 0) return `${remainingHours} godz.`;
  const dayLabel = days === 1 ? "dzień" : "dni";
  return `${days} ${dayLabel} ${remainingHours} godz.`;
}

interface InquiryOverviewProps {
  inquiry: Inquiry;
  routePoints: RoutePoint[];
}

export function InquiryOverview({ inquiry, routePoints }: InquiryOverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dane klienta</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm">
          <div>
            <span className="text-muted-foreground">Imię i nazwisko: </span>
            {inquiry.customerName}
          </div>
          <div>
            <span className="text-muted-foreground">Telefon: </span>
            <a href={`tel:${inquiry.customerPhone}`} className="underline underline-offset-2">
              {inquiry.customerPhone}
            </a>
          </div>
          <div>
            <span className="text-muted-foreground">E-mail: </span>
            <a href={`mailto:${inquiry.customerEmail}`} className="underline underline-offset-2">
              {inquiry.customerEmail}
            </a>
          </div>
          {inquiry.additionalInfo && (
            <div className="pt-2">
              <span className="text-muted-foreground">Dodatkowe informacje: </span>
              {inquiry.additionalInfo}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Termin i pasażerowie</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1 text-sm">
          <div>
            <span className="text-muted-foreground">Wyjazd: </span>
            {formatDateTime(inquiry.requestedDepartureAt)}
          </div>
          <div>
            <span className="text-muted-foreground">Powrót: </span>
            {formatDateTime(inquiry.requestedReturnAt)}
          </div>
          <div>
            <span className="text-muted-foreground">Przewidywany czas trwania: </span>
            {formatDuration(inquiry.requestedDepartureAt, inquiry.requestedReturnAt)}
          </div>
          <div>
            <span className="text-muted-foreground">Liczba pasażerów: </span>
            {inquiry.passengerCount}
          </div>
        </CardContent>
      </Card>

      <Card className="sm:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Trasa</CardTitle>
        </CardHeader>
        <CardContent>
          {routePoints.length === 0 ? (
            <p className="text-sm text-muted-foreground">Brak zapisanych punktów trasy.</p>
          ) : (
            <ol className="flex flex-col gap-1">
              {routePoints.map((point, index) => (
                <li key={point.id} className="flex items-center gap-3 text-sm">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground">{ROUTE_POINT_TYPE_LABELS[point.pointType]}:</span>
                  <span>{point.label}</span>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
