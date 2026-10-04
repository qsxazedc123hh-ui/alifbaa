import { AdminShell } from "@/components/admin/admin-shell";
import { SocialAdminPage } from "@/components/admin/social-admin-page";

export default function Page() {
  return (
    <AdminShell>
      <SocialAdminPage />
    </AdminShell>
  );
}
