import { PublicLayout } from "@/components/site/public-layout";
import { VideosPage } from "@/components/pages/videos-page";
import { db } from "@/lib/db";

export default async function Page() {
  let videos = [];
  try {
    videos = await db.video.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    });
    const ids = videos.map(v => v.thumbnailMediaId).filter(Boolean) as string[];
    if (ids.length) {
      const media = await db.mediaItem.findMany({ where: { id: { in: ids } } });
      const map = new Map(media.map(m => [m.id, m.url]));
      videos = videos.map(v => ({
        ...v,
        thumbnailUrl: v.thumbnailMediaId ? map.get(v.thumbnailMediaId) ?? null : null,
      }));
    }
  } catch (err) {
    console.error(err);
  }

  return (
    <PublicLayout>
      <VideosPage videos={videos} />
    </PublicLayout>
  );
}
