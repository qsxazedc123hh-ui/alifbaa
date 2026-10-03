import { PublicLayout } from "@/components/site/public-layout";
import { SmartBattlePage } from "@/components/pages/smart-battle-page";
import { db } from "@/lib/db";

export default async function Page() {
  let sections = [];
  try {
    sections = await db.smartBattleSection.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
    });
  } catch (err) {
    console.error(err);
  }
  return (
    <PublicLayout>
      <SmartBattlePage sections={sections} />
    </PublicLayout>
  );
}
