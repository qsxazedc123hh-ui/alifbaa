import { AdminShell } from "@/components/admin/admin-shell";
import { AppDownloadsPage } from "@/components/admin/app-downloads-page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login?callbackUrl=/admin/app-downloads");
  return (
    <AdminShell>
      <AppDownloadsPage />
    </AdminShell>
  );
}
