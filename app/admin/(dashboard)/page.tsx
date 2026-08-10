import { DashboardStats } from "@/components/admin/DashboardStats";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Statusy i statystyki zapytań/zleceń pojawią się tutaj od Etapu 5/6.
        </p>
      </div>

      <DashboardStats />
    </div>
  );
}
