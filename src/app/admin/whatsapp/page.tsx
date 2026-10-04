import { AdminShell } from "@/components/admin/admin-shell";
import { WhatsAppAdminPage } from "@/components/admin/whatsapp-admin-page";

export default function Page() {
  return (
    <AdminShell>
      <WhatsAppAdminPage />
    </AdminShell>
  );
}
