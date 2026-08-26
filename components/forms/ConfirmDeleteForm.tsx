"use client";

import { useState, useTransition } from "react";
import { unstable_rethrow } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ConfirmDeleteFormProps {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  confirmMessage: string;
}

export function ConfirmDeleteForm({ action, id, confirmMessage }: ConfirmDeleteFormProps) {
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!window.confirm(confirmMessage)) return;

    setError(undefined);
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      try {
        await action(formData);
      } catch (err) {
        // Akcje usuwające (deleteBus/deleteDriver/...) na sukces i na błąd FK
        // korzystają z redirect() — to rzuca specjalny sygnał kontrolny Next.js,
        // który trzeba przepuścić dalej, a nie potraktować jako prawdziwy błąd.
        unstable_rethrow(err);
        setError(err instanceof Error ? err.message : "Nie udało się usunąć.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="text-destructive hover:text-destructive"
        disabled={isPending}
      >
        {isPending ? "Usuwanie…" : "Usuń"}
      </Button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </form>
  );
}
