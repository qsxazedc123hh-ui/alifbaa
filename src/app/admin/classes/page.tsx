import { AdminShell } from "@/components/admin/admin-shell";
import { StubPage } from "@/components/admin/stub-page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const META = {
  title: "إدارة الصفوف والمواد",
  subtitle: "إضافة وتعديل وترتيب الصفوف والمواد الدراسية",
  description: "سيتم تنفيذ إدارة الصفوف والمواد بالكامل في المرحلة الثانية. البنية الأساسية موجودة في قاعدة البيانات (Grade, Subject).",
  nextPhase: ["إضافة صف مع صورة وأيقونة", "إضافة مادة لكل صف", "ربط المادة بالدروس والفيديوهات", "ترتيب وإظهار/إخفاء"],
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login?callbackUrl=/admin/classes");
  return (
    <AdminShell>
      <StubPage {...META} />
    </AdminShell>
  );
}
