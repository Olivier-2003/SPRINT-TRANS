"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { bookingNotesSchema, type BookingNotesInput } from "@/lib/validation/inquiry-admin";

type ActionState = { error?: string; success?: boolean } | undefined;

interface BookingNotesFormProps {
  bookingId: string;
  defaultNotes: string;
  action: (id: string, data: BookingNotesInput) => Promise<ActionState>;
}

export function BookingNotesForm({ bookingId, defaultNotes, action }: BookingNotesFormProps) {
  const [serverError, setServerError] = useState<string | undefined>();
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit } = useForm<BookingNotesInput>({
    resolver: zodResolver(bookingNotesSchema),
    defaultValues: { notes: defaultNotes },
  });

  const onSubmit = (data: BookingNotesInput) => {
    setServerError(undefined);
    setSaved(false);
    startTransition(async () => {
      const result = await action(bookingId, data);
      if (result?.error) setServerError(result.error);
      if (result?.success) setSaved(true);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <Textarea
        rows={4}
        placeholder="Notatki wewnętrzne dotyczące tego zlecenia…"
        {...register("notes")}
      />
      {serverError && <p className="text-sm text-destructive">{serverError}</p>}
      {saved && <p className="text-sm text-primary">Notatki zapisane.</p>}
      <Button type="submit" size="sm" className="w-fit" disabled={isPending}>
        {isPending ? "Zapisywanie…" : "Zapisz notatki"}
      </Button>
    </form>
  );
}
