import { AdminShell } from "@/components/admin/admin-shell";
import { DashboardPage } from "@/components/admin/dashboard-page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login?callbackUrl=/admin");
  }
  return (
    <AdminShell>
      <DashboardPage userName={session.user?.name || "Admin"} />
    </AdminShell>
  );
}
