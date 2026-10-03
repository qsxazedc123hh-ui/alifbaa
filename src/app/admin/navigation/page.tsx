import { AdminShell } from "@/components/admin/admin-shell";
import { StubPage } from "@/components/admin/stub-page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const META = {
  title: "إدارة القوائم",
  subtitle: "إدارة عناصر القائمة في الـHeader والـFooter",
  description: "سيتم تنفيذ إدارة القوائم بالكامل في المرحلة الثانية. البنية الأساسية موجودة في قاعدة البيانات (NavItem).",
  nextPhase: ["إضافة/تعديل/حذف عناصر القائمة", "ترتيب بالسحب والإفلات", "إظهار/إخفاء عناصر القائمة"],
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login?callbackUrl=/admin/navigation");
  return (
    <AdminShell>
      <StubPage {...META} />
    </AdminShell>
  );
}
