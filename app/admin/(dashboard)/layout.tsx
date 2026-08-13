import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminMobileMenu } from "@/components/layout/AdminMobileMenu";
import { auth } from "@/lib/auth";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="dark flex min-h-full flex-1 bg-background text-foreground">
      <div className="hidden shrink-0 border-r border-sidebar-border print:hidden sm:flex">
        <AdminSidebar adminName={session?.user?.name} adminEmail={session?.user?.email} />
      </div>
      <div className="flex flex-1 flex-col">
        <AdminMobileMenu adminName={session?.user?.name} adminEmail={session?.user?.email} />
        <main className="flex-1 bg-background p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
