import { AdminShell } from "@/components/admin/admin-shell";
import { NewsAdminPage } from "@/components/admin/news-admin-page";

export default function Page() {
  return (
    <AdminShell>
      <NewsAdminPage />
    </AdminShell>
  );
}
