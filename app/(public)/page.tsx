import { HeroSection } from "@/components/sections/HeroSection";
import { CalculatorTeaser } from "@/components/sections/CalculatorTeaser";
import { FleetPreview } from "@/components/sections/FleetPreview";
import { OfferBand } from "@/components/sections/OfferBand";
import { RouteScheduleSection } from "@/components/sections/RouteScheduleSection";
import { MonthlyTicketsTeaser } from "@/components/sections/MonthlyTicketsTeaser";
import { TripsPreview } from "@/components/sections/TripsPreview";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FacebookCta } from "@/components/sections/FacebookCta";
import { GlobalScrollBus } from "@/components/animations/GlobalScrollBus";
import { getPublicTrips } from "@/lib/data/trips";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const trips = await getPublicTrips();

  return (
    <div className="flex-1">
      <GlobalScrollBus />
      <HeroSection />
      <CalculatorTeaser />
      <FleetPreview />
      <OfferBand />
      <RouteScheduleSection />
      <MonthlyTicketsTeaser />
      <TripsPreview trips={trips} />
      <TestimonialsSection />
      <FacebookCta />
    </div>
  );
}
