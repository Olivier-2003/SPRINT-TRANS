import { Inbox, Clock, ClipboardList } from "lucide-react";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { getDashboardStats } from "@/lib/data/dashboard";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Skrót statusu zapytań i nadchodzących zleceń.
        </p>
      </div>

      <DashboardStats
        stats={[
          { label: "Nowe zapytania", value: stats.newInquiries, icon: Inbox },
          { label: "Wycenione / oczekujące na klienta", value: stats.awaitingDecision, icon: Clock },
          { label: "Nadchodzące zlecenia", value: stats.upcomingBookings, icon: ClipboardList },
        ]}
      />
    </div>
  );
}
