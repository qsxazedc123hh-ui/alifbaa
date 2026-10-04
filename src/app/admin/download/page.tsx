import { AdminShell } from "@/components/admin/admin-shell";
import { DownloadAdminPage } from "@/components/admin/download-admin-page";

export default function Page() {
  return (
    <AdminShell>
      <DownloadAdminPage />
    </AdminShell>
  );
}
