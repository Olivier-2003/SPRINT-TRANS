import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculatorSettingsForm } from "@/components/forms/CalculatorSettingsForm";
import { updateCalculatorSettings } from "@/lib/actions/calculator-settings";
import { getCalculatorSettings } from "@/lib/data/calculator-settings";

export default async function CalculatorSettingsPage() {
  const settings = await getCalculatorSettings();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Ustawienia kalkulatora</h1>
        <p className="text-sm text-muted-foreground">
          Stawki używane przez kalkulator orientacyjnej ceny na stronie publicznej: kilometry,
          opłata bazowa, postój kierowcy i noclegi przy wyjazdach wielodniowych. Zmiana wpływa
          wyłącznie na przyszłe wyceny — historyczne wyceny (zapisane w zapytaniach) pozostają
          niezmienione.
        </p>
      </div>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-base">Aktualne stawki</CardTitle>
        </CardHeader>
        <CardContent>
          <CalculatorSettingsForm
            action={updateCalculatorSettings}
            defaultValues={
              settings
                ? {
                    ratePerKm: String(settings.ratePerKm),
                    baseFee: String(settings.baseFee),
                    hourlyWaitingRate: String(settings.hourlyWaitingRate),
                    driverOvernightRate: String(settings.driverOvernightRate),
                    averageSpeedKmh: String(settings.averageSpeedKmh),
                  }
                : undefined
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
