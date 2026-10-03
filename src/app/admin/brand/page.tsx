import { AdminShell } from "@/components/admin/admin-shell";
import { BrandPage } from "@/components/admin/brand-page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login?callbackUrl=/admin/brand");
  return (
    <AdminShell>
      <BrandPage />
    </AdminShell>
  );
}
