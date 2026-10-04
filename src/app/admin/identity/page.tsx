import { AdminShell } from "@/components/admin/admin-shell";
import { IdentityPage } from "@/components/admin/identity-page";

export default function Page() {
  return (
    <AdminShell>
      <IdentityPage />
    </AdminShell>
  );
}
