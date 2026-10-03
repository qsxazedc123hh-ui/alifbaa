import { AdminShell } from "@/components/admin/admin-shell";
import { StubPage } from "@/components/admin/stub-page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const META = {
  title: "إعدادات التواصل",
  subtitle: "إدارة معلومات التواصل وروابط التواصل الاجتماعي",
  description: "سيتم تنفيذ إدارة إعدادات التواصل بالكامل في المرحلة الثانية. البنية الأساسية موجودة في قاعدة البيانات (ContactSetting).",
  nextPhase: ["تحرير: WhatsApp, Phone, Email", "روابط: Facebook, Instagram, TikTok, YouTube, Telegram", "إظهار/إخفاء كل عنصر"],
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login?callbackUrl=/admin/contact");
  return (
    <AdminShell>
      <StubPage {...META} />
    </AdminShell>
  );
}
