import { AdminShell } from "@/components/admin/admin-shell";
import { VideosAdminPage } from "@/components/admin/videos-admin-page";

export default function Page() {
  return (
    <AdminShell>
      <VideosAdminPage section="videos" title="الفيديوهات" />
    </AdminShell>
  );
}
