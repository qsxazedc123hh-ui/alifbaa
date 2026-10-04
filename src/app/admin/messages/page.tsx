import { AdminShell } from "@/components/admin/admin-shell";
import { MessagesAdminPage } from "@/components/admin/messages-admin-page";

export default function Page() {
  return (
    <AdminShell>
      <MessagesAdminPage />
    </AdminShell>
  );
}
