import { AdminShell } from "@/components/admin/admin-shell";
import { MediaPage } from "@/components/admin/media-page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login?callbackUrl=/admin/media");
  return (
    <AdminShell>
      <MediaPage />
    </AdminShell>
  );
}
