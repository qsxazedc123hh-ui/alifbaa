import { AdminShell } from "@/components/admin/admin-shell";
import { StubPage } from "@/components/admin/stub-page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const META = {
  title: "إدارة الفيديوهات",
  subtitle: "رفع وإدارة الفيديوهات و Reels والإعلانات",
  description: "سيتم تنفيذ إدارة الفيديوهات بالكامل في المرحلة الثانية. البنية الأساسية موجودة في قاعدة البيانات (Video).",
  nextPhase: ["رفع فيديو مع Thumbnail", "تصنيف: Reel/Video/Announcement/Educational/Promotional", "Tags وFeatured", "حالة النشر وتاريخ النشر"],
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login?callbackUrl=/admin/videos");
  return (
    <AdminShell>
      <StubPage {...META} />
    </AdminShell>
  );
}
