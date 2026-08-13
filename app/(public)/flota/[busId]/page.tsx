import { notFound } from "next/navigation";
import { BusDetails } from "@/components/public/fleet/BusDetails";
import { getPublicBus } from "@/lib/data/buses";

export const dynamic = "force-dynamic";

export default async function BusDetailPage({
  params,
}: {
  params: Promise<{ busId: string }>;
}) {
  const { busId } = await params;
  const bus = await getPublicBus(busId);
  if (!bus) notFound();

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-14 md:py-16">
      <BusDetails bus={bus} />
    </div>
  );
}
