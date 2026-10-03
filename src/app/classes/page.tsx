import { PublicLayout } from "@/components/site/public-layout";
import { ClassesPage } from "@/components/pages/classes-page";
import { db } from "@/lib/db";

export default async function Page() {
  let grades = [];
  try {
    grades = await db.grade.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
      include: {
        subjects: {
          where: { visible: true },
          orderBy: { order: "asc" },
        },
      },
    });
  } catch (err) {
    console.error("Failed to fetch grades:", err);
  }

  return (
    <PublicLayout>
      <ClassesPage grades={grades} />
    </PublicLayout>
  );
}
