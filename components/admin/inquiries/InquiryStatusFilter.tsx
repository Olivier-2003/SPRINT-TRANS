import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { INQUIRY_STATUSES, INQUIRY_STATUS_LABELS } from "@/lib/inquiry-status";

export function InquiryStatusFilter({ active }: { active?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/admin/zapytania">
        <Badge variant={!active ? "default" : "outline"}>Wszystkie</Badge>
      </Link>
      {INQUIRY_STATUSES.map((status) => (
        <Link key={status} href={`/admin/zapytania?status=${status}`}>
          <Badge variant={active === status ? "default" : "outline"}>
            {INQUIRY_STATUS_LABELS[status]}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
