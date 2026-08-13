import { HeroSection } from "@/components/sections/HeroSection";
import { CalculatorTeaser } from "@/components/sections/CalculatorTeaser";
import { FleetPreview } from "@/components/sections/FleetPreview";
import { OfferBand } from "@/components/sections/OfferBand";
import { MonthlyTicketsTeaser } from "@/components/sections/MonthlyTicketsTeaser";
import { TripsPreview } from "@/components/sections/TripsPreview";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { GlobalScrollBus } from "@/components/animations/GlobalScrollBus";
import { getPublicBuses } from "@/lib/data/buses";
import { getPublicTrips } from "@/lib/data/trips";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [buses, trips] = await Promise.all([getPublicBuses(), getPublicTrips()]);

  return (
    <div className="flex-1">
      <GlobalScrollBus />
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
