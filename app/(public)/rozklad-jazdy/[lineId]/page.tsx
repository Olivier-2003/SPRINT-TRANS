import { notFound } from "next/navigation";
import { LineTimetable } from "@/components/public/lines/LineTimetable";
import { getPublicLine } from "@/lib/data/lines";

export const dynamic = "force-dynamic";

export default async function LineDetailPage({
  params,
}: {
  params: Promise<{ lineId: string }>;
}) {
  const { lineId } = await params;
  const line = await getPublicLine(lineId);
  if (!line) notFound();

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-14 md:py-16">
      <LineTimetable line={line} />
    </div>
  );
}
