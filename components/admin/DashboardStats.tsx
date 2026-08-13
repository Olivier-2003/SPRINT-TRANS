import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface DashboardStat {
  label: string;
  value: string | number;
  icon?: LucideIcon;
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
          <CardContent className="flex items-center gap-4">
            {stat.icon && (
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <stat.icon className="size-5" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
              <p className="truncate text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
