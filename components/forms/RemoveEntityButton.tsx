"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

interface RemoveEntityButtonProps {
  parentId: string;
  targetId: string;
  action: (parentId: string, targetId: string) => Promise<{ error?: string; success?: boolean } | undefined>;
  confirmMessage: string;
}

export function RemoveEntityButton({ parentId, targetId, action, confirmMessage }: RemoveEntityButtonProps) {
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!window.confirm(confirmMessage)) return;
    setError(undefined);
    startTransition(async () => {
      const result = await action(parentId, targetId);
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
