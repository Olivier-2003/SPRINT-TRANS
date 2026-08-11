import { InquiriesTable } from "@/components/admin/inquiries/InquiriesTable";
import { InquiryStatusFilter } from "@/components/admin/inquiries/InquiryStatusFilter";
import { getInquiries } from "@/lib/data/inquiries";
import { INQUIRY_STATUSES } from "@/lib/inquiry-status";
import type { InquiryStatus } from "@/lib/generated/prisma/client";

function isInquiryStatus(value: string | undefined): value is InquiryStatus {
  return !!value && (INQUIRY_STATUSES as string[]).includes(value);
}

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filterStatus = isInquiryStatus(status) ? status : undefined;
  const inquiries = await getInquiries(filterStatus);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Zapytania</h1>
        <p className="text-sm text-muted-foreground">
          Zapytania złożone przez klientów w kalkulatorze na stronie publicznej trafiają tutaj
          automatycznie.
        </p>
      </div>
      <InquiryStatusFilter active={filterStatus} />
      <InquiriesTable inquiries={inquiries} />
    </div>
  );
}
