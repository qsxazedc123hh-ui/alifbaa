import { AdminShell } from "@/components/admin/admin-shell";
import { CampusAdminPage } from "@/components/admin/campus-admin-page";

export default function Page() {
  return (
    <AdminShell>
      <CampusAdminPage />
    </AdminShell>
  );
}
