import { AdminShell } from "@/components/admin/admin-shell";
import { StubPage } from "@/components/admin/stub-page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const META = {
  title: "حرم ألف باء",
  subtitle: "إدارة أقسام الحرم التعليمي وأصوله البصرية",
  description: "سيتم تنفيذ إدارة الحرم بالكامل في المرحلة الثانية، بما في ذلك تخصيص كل مبنى في الـCampus وربطه بصفحته.",
  nextPhase: ["تخصيص ألوان وروابط كل مبنى", "إضافة أصول بصرية للحرم", "Custom illustrations"],
};

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login?callbackUrl=/admin/campus");
  return (
    <AdminShell>
      <StubPage {...META} />
    </AdminShell>
  );
}
