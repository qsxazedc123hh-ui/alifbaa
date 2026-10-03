import { AdminShell } from "@/components/admin/admin-shell";
import { StubPage } from "@/components/admin/stub-page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const META = {
  title: "صراع الأذكياء",
  subtitle: "إدارة محتوى صفحة صراع الأذكياء التعريفية",
  description: "سيتم تنفيذ إدارة محتوى صراع الأذكياء بالكامل في المرحلة الثانية. البنية الأساسية موجودة في قاعدة البيانات (SmartBattleSection).",
  nextPhase: ["تحرير أقسام: النقاط، الترتيب، الجوائز، القواعد", "رفع صور وفيديوهات لكل قسم", "Preview قبل النشر"],
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login?callbackUrl=/admin/smart-battle");
  return (
    <AdminShell>
      <StubPage {...META} />
    </AdminShell>
  );
}
