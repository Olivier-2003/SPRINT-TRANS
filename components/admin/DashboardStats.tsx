import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface DashboardStat {
  label: string;
  value: string | number;
}

const PLACEHOLDER_STATS: DashboardStat[] = [
  { label: "Nowe zapytania", value: "—" },
  { label: "Oczekujące na decyzję", value: "—" },
  { label: "Nadchodzące zlecenia", value: "—" },
];

export function DashboardStats({ stats = PLACEHOLDER_STATS }: { stats?: DashboardStat[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">{stat.label}</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{stat.value}</CardContent>
        </Card>
      ))}
    </div>
  );
}
