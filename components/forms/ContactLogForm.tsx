"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { contactLogSchema, type ContactLogInput } from "@/lib/validation/inquiry-admin";
import type { ActionState } from "@/lib/actions/inquiries";

const CONTACT_TYPE_LABELS: Record<ContactLogInput["contactType"], string> = {
  PROBA_KONTAKTU: "Próba kontaktu",
  ROZMOWA_TELEFONICZNA: "Rozmowa telefoniczna",
  EMAIL: "Kontakt e-mail",
  BRAK_ODPOWIEDZI: "Brak odpowiedzi",
  PROSBA_O_PONOWNY_KONTAKT: "Prośba o ponowny kontakt",
  USTALENIE_CENY: "Ustalenie ceny",
  AKCEPTACJA_KLIENTA: "Akceptacja klienta",
  NOTATKA: "Notatka wewnętrzna",
};

interface ContactLogFormProps {
  inquiryId: string;
  action: (id: string, data: ContactLogInput) => Promise<ActionState>;
}

export function ContactLogForm({ inquiryId, action }: ContactLogFormProps) {
  const [serverError, setServerError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactLogInput>({
    resolver: zodResolver(contactLogSchema),
    defaultValues: { contactType: "NOTATKA", note: "" },
  });

  const onSubmit = (data: ContactLogInput) => {
    setServerError(undefined);
    startTransition(async () => {
      const result = await action(inquiryId, data);
      if (result?.error) setServerError(result.error);
      else reset({ contactType: "NOTATKA", note: "" });
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:w-64">
        <Controller
          control={control}
          name="contactType"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CONTACT_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <Textarea placeholder="Treść notatki / przebieg kontaktu…" rows={2} {...register("note")} />
      {errors.note && <p className="text-sm text-destructive">{errors.note.message}</p>}
      {serverError && <p className="text-sm text-destructive">{serverError}</p>}
      <Button type="submit" size="sm" className="w-fit" disabled={isPending}>
        {isPending ? "Zapisywanie…" : "Dodaj wpis"}
      </Button>
    </form>
  );
}
