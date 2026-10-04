import { AdminShell } from "@/components/admin/admin-shell";
import { TrashAdminPage } from "@/components/admin/trash-admin-page";

export default function Page() {
  return (
    <AdminShell>
      <TrashAdminPage />
    </AdminShell>
  );
}
