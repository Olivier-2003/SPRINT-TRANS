import { HeroSection } from "@/components/sections/HeroSection";
import { CalculatorTeaser } from "@/components/sections/CalculatorTeaser";
import { FleetPreview } from "@/components/sections/FleetPreview";
import { OfferBand } from "@/components/sections/OfferBand";
import { MonthlyTicketsTeaser } from "@/components/sections/MonthlyTicketsTeaser";
import { TripsPreview } from "@/components/sections/TripsPreview";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { GlobalScrollBus } from "@/components/animations/GlobalScrollBus";
import { GLOBAL_BUS_ASSET_PATH } from "@/components/animations/global-bus-asset";
import { getPublicBuses } from "@/lib/data/buses";
import { getPublicTrips } from "@/lib/data/trips";
import { publicAssetExists } from "@/lib/public-assets";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [buses, trips] = await Promise.all([getPublicBuses(), getPublicTrips()]);
  const globalBusSrc = publicAssetExists(GLOBAL_BUS_ASSET_PATH) ? `/${GLOBAL_BUS_ASSET_PATH}` : undefined;

  return (
    <div className="flex-1">
      <GlobalScrollBus src={globalBusSrc} />
      <HeroSection />
      <CalculatorTeaser />
      <FleetPreview buses={buses} />
      <OfferBand />
      <MonthlyTicketsTeaser />
      <TripsPreview trips={trips} />
      <TestimonialsSection />
    </div>
  );
}
