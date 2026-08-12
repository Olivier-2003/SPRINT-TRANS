"use client";

import { useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScheduleSlotCard } from "@/components/admin/schedule/ScheduleSlotCard";
import { SLOT_STATUS_LABELS, SLOT_STATUS_BADGE_VARIANT } from "@/lib/schedule-status-labels";
import { generateScheduleAction, approveScheduleAction, type ScheduleDecision } from "@/lib/actions/schedule";
import type { ScheduleGenerationResult, SlotStatus, ScheduleBookingSlot } from "@/lib/schedule-proposal";

interface Edit {
  driverId: string | null;
  busId: string | null;
}

function toDateInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function defaultRange(): { start: string; end: string } {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  return { start: toDateInputValue(start), end: toDateInputValue(end) };
}

function effectiveDriverForSlot(slot: ScheduleBookingSlot, edit: Edit | undefined): string | null {
  return edit ? edit.driverId : slot.driverProposal.driverId;
}
function effectiveBusForSlot(slot: ScheduleBookingSlot, edit: Edit | undefined): string | null {
  return edit ? edit.busId : slot.busProposal.busId;
}

function effectiveDriverStatusFor(slot: ScheduleBookingSlot, driverId: string | null): { status: SlotStatus; reason: string } {
  if (driverId === slot.driverProposal.driverId) {
    return { status: slot.driverProposal.status, reason: slot.driverProposal.reason };
  }
  if (driverId === null) {
    return { status: "BRAK_OBSADY", reason: "Pozostawiono bez obsady ręcznie." };
  }
  const alt = slot.driverProposal.alternatives.find((a) => a.driverId === driverId);
  if (!alt) return { status: "BRAK_OBSADY", reason: "Nieznany kierowca." };
  return { status: alt.status === "DOSTEPNY" ? "POPRAWNE" : alt.status, reason: alt.reason };
}

function effectiveBusStatusFor(slot: ScheduleBookingSlot, busId: string | null): { status: SlotStatus; reason: string } {
  if (busId === slot.busProposal.busId) {
    return { status: slot.busProposal.status, reason: slot.busProposal.reason };
  }
  if (busId === null) {
    return { status: "BRAK_OBSADY", reason: "Pozostawiono bez obsady ręcznie." };
  }
  const alt = slot.busProposal.alternatives.find((a) => a.busId === busId);
  if (!alt) return { status: "BRAK_OBSADY", reason: "Nieznany autobus." };
  return { status: alt.status === "DOSTEPNY" ? "POPRAWNE" : alt.status, reason: alt.reason };
}

/** Godziny wspólne dwóch przedziałów — lekka kopia lib/driver-timesheet.ts:overlapHours,
 *  bo ten moduł importuje Prisma i nie może być użyty w komponencie klienckim. */
function overlapHoursClient(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): number {
  const start = Math.max(aStart.getTime(), bStart.getTime());
  const end = Math.min(aEnd.getTime(), bEnd.getTime());
  return end > start ? (end - start) / (1000 * 60 * 60) : 0;
}

export function ScheduleGeneratorClient() {
  const initial = defaultRange();
  const [startDate, setStartDate] = useState(initial.start);
  const [endDate, setEndDate] = useState(initial.end);
  const [result, setResult] = useState<ScheduleGenerationResult | null>(null);
  const [edits, setEdits] = useState<Map<string, Edit>>(new Map());
  const [generateError, setGenerateError] = useState<string | undefined>();
  const [isGenerating, startGenerating] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [conflictAck, setConflictAck] = useState(false);
  const [isApproving, startApproving] = useTransition();
  const [approveError, setApproveError] = useState<string | undefined>();
  const [approveSuccess, setApproveSuccess] = useState<string | undefined>();

  const handleGenerate = () => {
    setGenerateError(undefined);
    setApproveSuccess(undefined);
    setShowConfirm(false);
    startGenerating(async () => {
      const res = await generateScheduleAction(startDate, endDate);
      if (res.error) {
        setGenerateError(res.error);
        setResult(null);
      } else if (res.data) {
        setResult(res.data);
        setEdits(new Map());
      }
    });
  };

  const bookingSummary = useMemo(() => {
    if (!result) return null;
    const tally = { total: result.slots.length, poprawne: 0, ostrzezenie: 0, konflikt: 0, brakObsady: 0 };
    const rank: Record<SlotStatus, number> = { POPRAWNE: 0, OSTRZEZENIE: 1, KONFLIKT: 2, BRAK_OBSADY: 3 };
    for (const slot of result.slots) {
      const edit = edits.get(slot.bookingId);
      const driverId = effectiveDriverForSlot(slot, edit);
      const busId = effectiveBusForSlot(slot, edit);
      const dStatus = effectiveDriverStatusFor(slot, driverId).status;
      const bStatus = effectiveBusStatusFor(slot, busId).status;
      const worst = rank[dStatus] >= rank[bStatus] ? dStatus : bStatus;
      if (worst === "POPRAWNE") tally.poprawne++;
      else if (worst === "OSTRZEZENIE") tally.ostrzezenie++;
      else if (worst === "KONFLIKT") tally.konflikt++;
      else tally.brakObsady++;
    }
    return tally;
  }, [result, edits]);

  const forecast = useMemo(() => {
    if (!result) return [];
    return result.driverForecast.map((entry) => {
      const monthStart = new Date(entry.year, entry.month - 1, 1);
      const monthEnd = new Date(entry.year, entry.month, 1);
      let delta = 0;
      for (const slot of result.slots) {
        const edit = edits.get(slot.bookingId);
        const effectiveDriverId = edit ? edit.driverId : slot.driverProposal.driverId;
        const hours = overlapHoursClient(slot.startAt, slot.endAt, monthStart, monthEnd);
        if (hours <= 0) continue;
        if (effectiveDriverId === entry.driverId && slot.currentDriverId !== entry.driverId) {
          delta += hours;
        }
        if (slot.currentDriverId === entry.driverId && effectiveDriverId !== entry.driverId) {
          delta -= hours;
        }
      }
      const projectedTotalHours = entry.currentPlannedHours + delta;
      const projectedOvertimeHours = entry.monthlyNorm != null ? Math.max(0, projectedTotalHours - entry.monthlyNorm) : null;
      const projectedDeficitHours = entry.monthlyNorm != null ? Math.max(0, entry.monthlyNorm - projectedTotalHours) : null;
      return { ...entry, proposedDeltaHours: delta, projectedTotalHours, projectedOvertimeHours, projectedDeficitHours };
    });
  }, [result, edits]);

  const handleApproveClick = () => {
    setApproveError(undefined);
    setApproveSuccess(undefined);
    setShowConfirm(true);
    setConflictAck(false);
  };

  const handleConfirmApprove = () => {
    if (!result) return;
    const decisions: ScheduleDecision[] = result.slots.map((slot) => {
      const edit = edits.get(slot.bookingId);
      return {
        bookingId: slot.bookingId,
        driverId: effectiveDriverForSlot(slot, edit),
        busId: effectiveBusForSlot(slot, edit),
      };
    });
    startApproving(async () => {
      const res = await approveScheduleAction(decisions);
      if (res?.error) {
        setApproveError(res.error);
      } else {
        setApproveSuccess(
          `Zatwierdzono grafik: zmieniono ${res?.updatedCount ?? 0} przypisań, ${res?.unchangedCount ?? 0} bez zmian.`
        );
        setShowConfirm(false);
        setResult(null);
        setEdits(new Map());
      }
    });
  };

  const hasHardConflicts = (bookingSummary?.konflikt ?? 0) > 0;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Zakres dat</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="scheduleStart">Od</Label>
            <Input id="scheduleStart" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="scheduleEnd">Do</Label>
            <Input id="scheduleEnd" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <Button type="button" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? "Generowanie…" : "Generuj propozycję grafiku"}
          </Button>
          {generateError && <p className="text-sm text-destructive">{generateError}</p>}
        </CardContent>
      </Card>

      {approveSuccess && (
        <Card>
          <CardContent className="pt-6 text-sm text-primary">{approveSuccess}</CardContent>
        </Card>
      )}

      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Prognoza bilansu godzin kierowców</CardTitle>
            </CardHeader>
            <CardContent>
              {forecast.length === 0 ? (
                <p className="text-sm text-muted-foreground">Brak danych do wyliczenia prognozy.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kierowca</TableHead>
                      <TableHead>Miesiąc</TableHead>
                      <TableHead>Wymiar</TableHead>
                      <TableHead>Zaplanowane obecnie</TableHead>
                      <TableHead>Z propozycji</TableHead>
                      <TableHead>Przewidywana suma</TableHead>
                      <TableHead>Nadgodziny</TableHead>
                      <TableHead>Niedobór</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {forecast.map((f) => (
                      <TableRow key={`${f.driverId}-${f.year}-${f.month}`}>
                        <TableCell className="font-medium">{f.driverName}</TableCell>
                        <TableCell>
                          {f.month}/{f.year}
                        </TableCell>
                        <TableCell>{f.monthlyNorm != null ? `${f.monthlyNorm.toFixed(1)} h` : "—"}</TableCell>
                        <TableCell>{f.currentPlannedHours.toFixed(1)} h</TableCell>
                        <TableCell className={f.proposedDeltaHours !== 0 ? "font-medium" : undefined}>
                          {f.proposedDeltaHours > 0 ? "+" : ""}
                          {f.proposedDeltaHours.toFixed(1)} h
                        </TableCell>
                        <TableCell>{f.projectedTotalHours.toFixed(1)} h</TableCell>
                        <TableCell className={f.projectedOvertimeHours ? "text-destructive" : undefined}>
                          {f.projectedOvertimeHours != null ? `${f.projectedOvertimeHours.toFixed(1)} h` : "—"}
                        </TableCell>
                        <TableCell>{f.projectedDeficitHours != null ? `${f.projectedDeficitHours.toFixed(1)} h` : "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">
              Zlecenia w wybranym okresie ({result.slots.length})
            </h2>
            {result.slots.length === 0 ? (
              <p className="text-sm text-muted-foreground">Brak zleceń w wybranym zakresie dat.</p>
            ) : (
              result.slots.map((slot) => {
                const edit = edits.get(slot.bookingId);
                const driverId = effectiveDriverForSlot(slot, edit);
                const busId = effectiveBusForSlot(slot, edit);
                const driverStatus = effectiveDriverStatusFor(slot, driverId);
                const busStatus = effectiveBusStatusFor(slot, busId);
                return (
                  <ScheduleSlotCard
                    key={slot.bookingId}
                    slot={slot}
                    effectiveDriverId={driverId}
                    effectiveDriverStatus={driverStatus.status}
                    effectiveDriverReason={driverStatus.reason}
                    effectiveBusId={busId}
                    effectiveBusStatus={busStatus.status}
                    effectiveBusReason={busStatus.reason}
                    onDriverChange={(newDriverId) => {
                      setEdits((prev) => {
                        const next = new Map(prev);
                        const current = next.get(slot.bookingId) ?? { driverId: slot.driverProposal.driverId, busId: slot.busProposal.busId };
                        next.set(slot.bookingId, { ...current, driverId: newDriverId });
                        return next;
                      });
                    }}
                    onBusChange={(newBusId) => {
                      setEdits((prev) => {
                        const next = new Map(prev);
                        const current = next.get(slot.bookingId) ?? { driverId: slot.driverProposal.driverId, busId: slot.busProposal.busId };
                        next.set(slot.bookingId, { ...current, busId: newBusId });
                        return next;
                      });
                    }}
                  />
                );
              })
            )}
          </div>

          {bookingSummary && result.slots.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Zatwierdzenie grafiku</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-3 text-sm">
                  <span>Zlecenia: {bookingSummary.total}</span>
                  <Badge variant={SLOT_STATUS_BADGE_VARIANT.POPRAWNE}>
                    {SLOT_STATUS_LABELS.POPRAWNE}: {bookingSummary.poprawne}
                  </Badge>
                  <Badge variant={SLOT_STATUS_BADGE_VARIANT.OSTRZEZENIE}>
                    {SLOT_STATUS_LABELS.OSTRZEZENIE}: {bookingSummary.ostrzezenie}
                  </Badge>
                  <Badge variant={SLOT_STATUS_BADGE_VARIANT.KONFLIKT}>
                    {SLOT_STATUS_LABELS.KONFLIKT}: {bookingSummary.konflikt}
                  </Badge>
                  <Badge variant={SLOT_STATUS_BADGE_VARIANT.BRAK_OBSADY}>
                    {SLOT_STATUS_LABELS.BRAK_OBSADY}: {bookingSummary.brakObsady}
                  </Badge>
                </div>

                {!showConfirm ? (
                  <Button type="button" onClick={handleApproveClick} className="w-fit">
                    Zatwierdź grafik
                  </Button>
                ) : (
                  <div className="flex flex-col gap-3 rounded-md border p-3">
                    <p className="text-sm">
                      Zostanie zapisanych/zaktualizowanych maksymalnie {bookingSummary.total * 2} przypisań
                      (kierowca + autobus dla każdego zlecenia). Operacja jest transakcyjna — albo zapiszą się
                      wszystkie zmiany, albo żadna.
                    </p>
                    {hasHardConflicts && (
                      <label className="flex items-start gap-2 text-sm">
                        <Checkbox checked={conflictAck} onCheckedChange={(v) => setConflictAck(!!v)} />
                        <span>
                          Rozumiem, że {bookingSummary.konflikt}{" "}
                          {bookingSummary.konflikt === 1 ? "zlecenie ma" : "zleceń ma"} nierozwiązany twardy konflikt
                          (np. podwójne przypisanie) i mimo to zatwierdzam grafik.
                        </span>
                      </label>
                    )}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={handleConfirmApprove}
                        disabled={isApproving || (hasHardConflicts && !conflictAck)}
                      >
                        {isApproving ? "Zatwierdzanie…" : "Potwierdź zatwierdzenie"}
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => setShowConfirm(false)}>
                        Anuluj
                      </Button>
                    </div>
                    {approveError && <p className="text-sm text-destructive">{approveError}</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
