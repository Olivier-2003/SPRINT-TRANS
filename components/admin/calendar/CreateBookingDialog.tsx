"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, type Control, type UseFormRegister, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RoutePointsEditor } from "@/components/forms/RoutePointsEditor";
import {
  createBookingWithAssignmentsSchema,
  createBookingWithAssignmentsDefaultValues,
  createLineRunBookingSchema,
  createLineRunBookingDefaultValues,
  type CreateBookingWithAssignmentsInput,
  type CreateLineRunBookingInput,
} from "@/lib/validation/booking-admin";
import { BOOKING_STATUSES, BOOKING_STATUS_LABELS } from "@/lib/booking-status";
import { formatDateParam, isoWeekday } from "@/lib/calendar-grid";
import { createBookingWithAssignments, createLineRunBooking } from "@/lib/actions/bookings";
import type { LineOption } from "@/components/admin/calendar/CalendarGrid";

const DEFAULT_TIME = "09:00";

const DRIVER_ROLE_OPTIONS: { value: string; label: string }[] = [
  { value: "NONE", label: "Bez określonej roli" },
  { value: "GLOWNY", label: "Kierowca główny" },
  { value: "POMOCNICZY", label: "Kierowca pomocniczy" },
];

interface ResourceOption {
  id: string;
  label: string;
}

interface CreateBookingDialogProps {
  open: boolean;
  date: Date | null;
  onOpenChange: (open: boolean) => void;
  drivers: ResourceOption[];
  buses: ResourceOption[];
  lines: LineOption[];
}

type EntryType = "BOOKING" | "LINE";

export function CreateBookingDialog({ open, date, onOpenChange, drivers, buses, lines }: CreateBookingDialogProps) {
  const router = useRouter();
  const [entryType, setEntryType] = useState<EntryType>("BOOKING");

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) setEntryType("BOOKING");
  };

  const handleCreated = () => {
    handleOpenChange(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nowy wpis{date ? ` — ${formatDateParam(date)}` : ""}</DialogTitle>
        </DialogHeader>
        {open && (
          <div className="flex flex-col gap-5">
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={entryType === "BOOKING" ? "default" : "outline"}
                onClick={() => setEntryType("BOOKING")}
              >
                Zlecenie
              </Button>
              <Button
                type="button"
                size="sm"
                variant={entryType === "LINE" ? "default" : "outline"}
                onClick={() => setEntryType("LINE")}
              >
                Linia regularna
              </Button>
            </div>

            {entryType === "BOOKING" ? (
              // key = data dnia sprawia, że formularz montuje się od nowa (z poprawną
              // domyślną godziną wyjazdu i czystym stanem błędu) za każdym razem, gdy
              // dialog otwiera się dla nowego dnia — bez efektu resetującego stan ręcznie.
              <CreateBookingDialogForm
                key={date ? formatDateParam(date) : "none"}
                date={date}
                drivers={drivers}
                buses={buses}
                onCancel={() => handleOpenChange(false)}
                onCreated={handleCreated}
              />
            ) : (
              <CreateLineRunDialogForm
                key={date ? formatDateParam(date) : "none"}
                date={date}
                lines={lines}
                drivers={drivers}
                buses={buses}
                onCancel={() => handleOpenChange(false)}
                onCreated={handleCreated}
              />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// --- Pola przypisania kierowcy/autobusu/godzin — współdzielone między formularzem
// zlecenia i formularzem kursu linii, oba mają identyczny kształt tych pól. ---

interface AssignmentFieldValues {
  driverId?: string;
  driverRoleOnTrip?: string;
  driverPlannedHours?: string;
  busId?: string;
  busPlannedHours?: string;
}

function ResourceAssignmentFields<T extends AssignmentFieldValues>({
  control,
  register,
  errors,
  drivers,
  buses,
}: {
  control: Control<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  drivers: ResourceOption[];
  buses: ResourceOption[];
}) {
  const narrowedControl = control as unknown as Control<AssignmentFieldValues>;
  const narrowedErrors = errors as unknown as FieldErrors<AssignmentFieldValues>;
  const narrowedRegister = register as unknown as UseFormRegister<AssignmentFieldValues>;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label>Kierowca (opcjonalnie)</Label>
        <Controller
          control={narrowedControl}
          name="driverId"
          render={({ field }) => (
            <Select value={field.value || "NONE"} onValueChange={(v) => field.onChange(v === "NONE" ? "" : v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Bez kierowcy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">Bez kierowcy</SelectItem>
                {drivers.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>
                    {driver.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <Controller
          control={narrowedControl}
          name="driverRoleOnTrip"
          render={({ field }) => (
            <Select value={field.value || "NONE"} onValueChange={(v) => field.onChange(v === "NONE" ? "" : v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DRIVER_ROLE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <Input
          type="number"
          step="0.5"
          min="0"
          placeholder="Liczba godzin (opcjonalnie)"
          {...narrowedRegister("driverPlannedHours")}
        />
        {narrowedErrors.driverPlannedHours && (
          <p className="text-sm text-destructive">{narrowedErrors.driverPlannedHours.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label>Autobus (opcjonalnie)</Label>
        <Controller
          control={narrowedControl}
          name="busId"
          render={({ field }) => (
            <Select value={field.value || "NONE"} onValueChange={(v) => field.onChange(v === "NONE" ? "" : v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Bez autobusu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">Bez autobusu</SelectItem>
                {buses.map((bus) => (
                  <SelectItem key={bus.id} value={bus.id}>
                    {bus.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <Input
          type="number"
          step="0.5"
          min="0"
          placeholder="Liczba godzin (opcjonalnie)"
          {...narrowedRegister("busPlannedHours")}
        />
        {narrowedErrors.busPlannedHours && (
          <p className="text-sm text-destructive">{narrowedErrors.busPlannedHours.message}</p>
        )}
      </div>
    </div>
  );
}

// --- Formularz "Zlecenie" ---

interface CreateBookingDialogFormProps {
  date: Date | null;
  drivers: ResourceOption[];
  buses: ResourceOption[];
  onCancel: () => void;
  onCreated: () => void;
}

function CreateBookingDialogForm({ date, drivers, buses, onCancel, onCreated }: CreateBookingDialogFormProps) {
  const [serverError, setServerError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBookingWithAssignmentsInput>({
    resolver: zodResolver(createBookingWithAssignmentsSchema),
    defaultValues: {
      ...createBookingWithAssignmentsDefaultValues,
      startAt: date ? `${formatDateParam(date)}T${DEFAULT_TIME}` : "",
    },
  });

  const onSubmit = (data: CreateBookingWithAssignmentsInput) => {
    setServerError(undefined);
    startTransition(async () => {
      const result = await createBookingWithAssignments(data);
      if (result.error) setServerError(result.error);
      else onCreated();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="dlg-customerName">Imię i nazwisko</Label>
          <Input id="dlg-customerName" {...register("customerName")} />
          {errors.customerName && <p className="text-sm text-destructive">{errors.customerName.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="dlg-customerPhone">Telefon</Label>
          <Input id="dlg-customerPhone" {...register("customerPhone")} />
          {errors.customerPhone && <p className="text-sm text-destructive">{errors.customerPhone.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="dlg-customerEmail">E-mail</Label>
          <Input id="dlg-customerEmail" type="email" {...register("customerEmail")} />
          {errors.customerEmail && <p className="text-sm text-destructive">{errors.customerEmail.message}</p>}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="dlg-startAt">Wyjazd</Label>
          <Input id="dlg-startAt" type="datetime-local" {...register("startAt")} />
          {errors.startAt && <p className="text-sm text-destructive">{errors.startAt.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="dlg-endAt">Powrót</Label>
          <Input id="dlg-endAt" type="datetime-local" {...register("endAt")} />
          {errors.endAt && <p className="text-sm text-destructive">{errors.endAt.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="dlg-finalPrice">Cena (PLN)</Label>
          <Input id="dlg-finalPrice" type="number" step="0.01" {...register("finalPrice")} />
          {errors.finalPrice && <p className="text-sm text-destructive">{errors.finalPrice.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:w-56">
        <Label>Status</Label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select value={field.value} onValueChange={(v) => v && field.onChange(v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BOOKING_STATUSES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {BOOKING_STATUS_LABELS[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Trasa</h3>
        <RoutePointsEditor control={control} register={register} errors={errors} />
      </div>

      <ResourceAssignmentFields control={control} register={register} errors={errors} drivers={drivers} buses={buses} />

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Anuluj
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Tworzenie…" : "Utwórz zlecenie"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// --- Formularz "Linia regularna" ---

interface CreateLineRunDialogFormProps {
  date: Date | null;
  lines: LineOption[];
  drivers: ResourceOption[];
  buses: ResourceOption[];
  onCancel: () => void;
  onCreated: () => void;
}

function CreateLineRunDialogForm({ date, lines, drivers, buses, onCancel, onCreated }: CreateLineRunDialogFormProps) {
  const [serverError, setServerError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateLineRunBookingInput>({
    resolver: zodResolver(createLineRunBookingSchema),
    defaultValues: {
      ...createLineRunBookingDefaultValues,
      startAt: date ? `${formatDateParam(date)}T${DEFAULT_TIME}` : "",
    },
  });

  // Gdy admin wybierze linię, spróbuj dopasować jej rozkład do dnia tygodnia klikniętego
  // w kalendarzu — jeśli linia kursuje w ten dzień, godziny i cena wypełniają się same
  // (nadal edytowalne, np. dla kursu dodatkowego poza rozkładem).
  const applyLineSchedule = (lineId: string) => {
    if (!date) return;
    const line = lines.find((l) => l.id === lineId);
    const schedule = line?.schedules.find((s) => s.daysOfWeek.includes(isoWeekday(date)));
    if (!schedule) return;

    const dateParam = formatDateParam(date);
    setValue("startAt", `${dateParam}T${schedule.departureTime}`);
    const arrivesNextDay = schedule.arrivalTime <= schedule.departureTime;
    const endDateParam = arrivesNextDay ? formatDateParam(new Date(date.getTime() + 24 * 60 * 60 * 1000)) : dateParam;
    setValue("endAt", `${endDateParam}T${schedule.arrivalTime}`);
    setValue("finalPrice", String(schedule.price));
  };

  const onSubmit = (data: CreateLineRunBookingInput) => {
    setServerError(undefined);
    startTransition(async () => {
      const result = await createLineRunBooking(data);
      if (result.error) setServerError(result.error);
      else onCreated();
    });
  };

  if (lines.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Brak aktywnych linii regularnych. Dodaj linię w sekcji „Linie regularne&rdquo;, żeby móc zaplanować jej kurs.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label>Linia</Label>
        <Controller
          control={control}
          name="lineId"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(v) => {
                if (!v) return;
                field.onChange(v);
                applyLineSchedule(v);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Wybierz linię" />
              </SelectTrigger>
              <SelectContent>
                {lines.map((line) => (
                  <SelectItem key={line.id} value={line.id}>
                    {line.name} ({line.originLabel} → {line.destinationLabel})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.lineId && <p className="text-sm text-destructive">{errors.lineId.message}</p>}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="dlg-line-startAt">Wyjazd</Label>
          <Input id="dlg-line-startAt" type="datetime-local" {...register("startAt")} />
          {errors.startAt && <p className="text-sm text-destructive">{errors.startAt.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="dlg-line-endAt">Przyjazd</Label>
          <Input id="dlg-line-endAt" type="datetime-local" {...register("endAt")} />
          {errors.endAt && <p className="text-sm text-destructive">{errors.endAt.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="dlg-line-finalPrice">Cena (PLN)</Label>
          <Input id="dlg-line-finalPrice" type="number" step="0.01" {...register("finalPrice")} />
          {errors.finalPrice && <p className="text-sm text-destructive">{errors.finalPrice.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:w-56">
        <Label>Status</Label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select value={field.value} onValueChange={(v) => v && field.onChange(v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BOOKING_STATUSES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {BOOKING_STATUS_LABELS[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Trasa zostanie skopiowana z przystanków tej linii — bez danych klienta, bo kurs linii nie jest wynajmem dla
        jednej osoby.
      </p>

      <ResourceAssignmentFields control={control} register={register} errors={errors} drivers={drivers} buses={buses} />

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Anuluj
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Tworzenie…" : "Zaplanuj kurs"}
        </Button>
      </DialogFooter>
    </form>
  );
}
