import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { MonthlyTicketsSection } from "@/components/sections/MonthlyTicketsSection";
import { TIMETABLES } from "@/lib/timetables";

export default function SchedulePage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-14 md:py-16">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Rozkład jazdy linii regularnych</h1>
          <p className="text-lg text-muted-foreground">
            Wybierz kierunek, aby zobaczyć aktualny rozkład jazdy.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {TIMETABLES.map((timetable) => (
            <ScrollReveal key={timetable.id}>
              <Card className="h-full gap-5 rounded-2xl border border-border/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">{timetable.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                  <p className="text-base text-muted-foreground">{timetable.description}</p>
                  <Button
                    render={<Link href={`/rozklad-jazdy/${timetable.id}`} />}
                    nativeButton={false}
                    className="w-fit gap-1.5 rounded-full px-6 text-base"
                  >
                    Zobacz rozkład
                    <ChevronRight />
                  </Button>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <MonthlyTicketsSection />
    </div>
  );
}
