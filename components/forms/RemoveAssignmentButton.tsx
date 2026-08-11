"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import type { ActionState } from "@/lib/actions/bookings";

interface RemoveAssignmentButtonProps {
  bookingId: string;
  targetId: string;
  action: (bookingId: string, targetId: string) => Promise<ActionState>;
  confirmMessage: string;
}

export function RemoveAssignmentButton({
  bookingId,
  targetId,
  action,
  confirmMessage,
}: RemoveAssignmentButtonProps) {
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!window.confirm(confirmMessage)) return;
    setError(undefined);
    startTransition(async () => {
      const result = await action(bookingId, targetId);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-destructive hover:text-destructive"
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? "Usuwanie…" : "Usuń"}
      </Button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
