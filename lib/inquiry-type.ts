import type { InquiryType } from "@/lib/generated/prisma/client";

export const INQUIRY_TYPES: InquiryType[] = ["WYNAJEM", "WYCIECZKA", "LINIA_REGULARNA", "INNE"];

export const INQUIRY_TYPE_LABELS: Record<InquiryType, string> = {
  WYNAJEM: "Wynajem",
  WYCIECZKA: "Wycieczka",
  LINIA_REGULARNA: "Linia regularna",
  INNE: "Inne",
};
