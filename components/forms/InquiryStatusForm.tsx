"use client";

import { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { INQUIRY_STATUSES, INQUIRY_STATUS_LABELS } from "@/lib/inquiry-status";
import type { InquiryStatus } from "@/lib/generated/prisma/client";
import type { InquiryStatusInput } from "@/lib/validation/inquiry-admin";
import type { ActionState } from "@/lib/actions/inquiries";

interface InquiryStatusFormProps {
  inquiryId: string;
  currentStatus: InquiryStatus;
  action: (id: string, data: InquiryStatusInput) => Promise<ActionState>;
}

export function InquiryStatusForm({ inquiryId, currentStatus, action }: InquiryStatusFormProps) {
  const [status, setStatus] = useState<InquiryStatus>(currentStatus);
  const [error, setError] = useState<string | undefined>();
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onSave = () => {
    setError(undefined);
    setSaved(false);
    startTransition(async () => {
      const result = await action(inquiryId, { status });
      if (result?.error) setError(result.error);
      if (result?.success) setSaved(true);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Select
          value={status}
          onValueChange={(value) => {
            if (value) setStatus(value as InquiryStatus);
          }}
        >
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {INQUIRY_STATUSES.map((value) => (
              <SelectItem key={value} value={value}>
                {INQUIRY_STATUS_LABELS[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" size="sm" onClick={onSave} disabled={isPending || status === currentStatus}>
          {isPending ? "Zapisywanie…" : "Zmień status"}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {saved && <p className="text-sm text-primary">Status zaktualizowany.</p>}
    </div>
  );
}
