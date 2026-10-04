import { AdminShell } from "@/components/admin/admin-shell";
import { DashboardHome } from "@/components/admin/dashboard-home";

export default function AdminPage() {
  return (
    <AdminShell>
      <DashboardHome />
    </AdminShell>
  );
}
