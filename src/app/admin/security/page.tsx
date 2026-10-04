import { AdminShell } from "@/components/admin/admin-shell";
import { SecurityAdminPage } from "@/components/admin/security-admin-page";

export default function Page() {
  return (
    <AdminShell>
      <SecurityAdminPage />
    </AdminShell>
  );
}
