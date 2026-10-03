import { AdminShell } from "@/components/admin/admin-shell";
import { StubPage } from "@/components/admin/stub-page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const META = {
  title: "الإعدادات العامة",
  subtitle: "إعدادات عامة للموقع",
  description: "سيتم تنفيذ الإعدادات العامة بالكامل في المرحلة الثانية. البنية الأساسية موجودة في قاعدة البيانات (SiteSetting).",
  nextPhase: ["اسم الموقع", "اللغة الافتراضية", "المظهر الافتراضي", "إعدادات إضافية"],
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login?callbackUrl=/admin/settings");
  return (
    <AdminShell>
      <StubPage {...META} />
    </AdminShell>
  );
}
