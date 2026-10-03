import { PublicLayout } from "@/components/site/public-layout";
import { DownloadPage } from "@/components/pages/download-page";
import { db } from "@/lib/db";

export default async function Page() {
  let releases = [];
  let latest = null;
  try {
    releases = await db.appRelease.findMany({
      where: { published: true },
      orderBy: [{ isLatest: "desc" }, { releasedAt: "desc" }],
    });
    latest = releases.find(r => r.isLatest) ?? releases[0] ?? null;
  } catch (err) {
    console.error(err);
  }
  return (
    <PublicLayout>
      <DownloadPage latest={latest} releases={releases} />
    </PublicLayout>
  );
}
