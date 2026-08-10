import { HeroSection } from "@/components/sections/HeroSection";
import { OfferHighlights } from "@/components/sections/OfferHighlights";
import { getPublicLines } from "@/lib/data/lines";
import { getPublicBuses } from "@/lib/data/buses";
import { getPublicTrips } from "@/lib/data/trips";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [lines, buses, trips] = await Promise.all([
    getPublicLines(),
    getPublicBuses(),
    getPublicTrips(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-10">
      <HeroSection />
      <OfferHighlights lineCount={lines.length} busCount={buses.length} tripCount={trips.length} />
    </div>
  );
}
