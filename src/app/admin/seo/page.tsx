import { AdminShell } from "@/components/admin/admin-shell";
import { StubPage } from "@/components/admin/stub-page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const META = {
  title: "إعدادات SEO",
  subtitle: "إدارة Meta Tags و OpenGraph و Robots",
  description: "سيتم تنفيذ إدارة SEO بالكامل في المرحلة الثانية. البنية الأساسية موجودة في قاعدة البيانات (SeoSetting).",
  nextPhase: ["Meta Title و Description لكل لغة", "OG Image", "Canonical و Sitemap", "Robots.txt"],
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login?callbackUrl=/admin/seo");
  return (
    <AdminShell>
      <StubPage {...META} />
    </AdminShell>
  );
}
