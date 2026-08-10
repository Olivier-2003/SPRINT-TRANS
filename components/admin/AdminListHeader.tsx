import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AdminListHeaderProps {
  title: string;
  description?: string;
  addHref: string;
  addLabel: string;
}

export function AdminListHeader({
  title,
  description,
  addHref,
  addLabel,
}: AdminListHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <Button render={<Link href={addHref} />} nativeButton={false}>
        {addLabel}
      </Button>
    </div>
  );
}
