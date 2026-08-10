"use client";

import { Button } from "@/components/ui/button";

interface ConfirmDeleteFormProps {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  confirmMessage: string;
}

export function ConfirmDeleteForm({ action, id, confirmMessage }: ConfirmDeleteFormProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="ghost" size="sm" className="text-destructive hover:text-destructive">
        Usuń
      </Button>
    </form>
  );
}
