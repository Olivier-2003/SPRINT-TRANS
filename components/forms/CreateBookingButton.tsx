"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import type { ActionState } from "@/lib/actions/inquiries";

interface CreateBookingButtonProps {
  action: () => Promise<ActionState>;
}

export function CreateBookingButton({ action }: CreateBookingButtonProps) {
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    if (!window.confirm("Utworzyć zlecenie z tego zapytania?")) return;
    setError(undefined);
    startTransition(async () => {
      const result = await action();
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" onClick={onClick} disabled={isPending}>
        {isPending ? "Tworzenie…" : "Utwórz zlecenie z zapytania"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
