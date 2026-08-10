import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { auth } from "@/lib/auth";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-full flex-1">
      <AdminSidebar adminName={session?.user?.name} adminEmail={session?.user?.email} />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b px-6 py-4 sm:hidden">
          <span className="text-sm font-semibold">SPRINT-TRANS · Panel</span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
