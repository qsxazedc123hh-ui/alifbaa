import { HomePage } from "@/components/home/home-page";
import { db } from "@/lib/db";

async function getData() {
  try {
    const [
      campusItems,
      campusBackgrounds,
      smartBattleVideos,
      generalVideos,
      news,
      appLinks,
      whatsappNumbers,
      socialLinks,
      featuredVideos,
    ] = await Promise.all([
      db.campusItem.findMany({ orderBy: { order: "asc" } }),
      db.campusBackground.findMany({ orderBy: { order: "asc" } }),
      db.video.findMany({
        where: { published: true, deletedAt: null, section: "smart_battle" },
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      }),
      db.video.findMany({
        where: { published: true, deletedAt: null, section: "videos" },
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      }),
      db.news.findMany({
        where: { published: true, deletedAt: null },
        include: { video: true },
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      }),
      db.appLink.findMany({ where: { visible: true, deletedAt: null }, orderBy: { order: "asc" } }),
      db.whatsAppNumber.findMany({ where: { visible: true, deletedAt: null }, orderBy: { order: "asc" } }),
      db.socialLink.findMany({ where: { visible: true, deletedAt: null }, orderBy: { order: "asc" } }),
      db.video.findMany({
        where: { published: true, deletedAt: null, featured: true },
        orderBy: { publishedAt: "desc" },
        take: 4,
      }),
    ]);

    const activeBg = campusBackgrounds.find((b) => b.isActive) || campusBackgrounds[0] || null;

    return {
      campusItems,
      campusBackground: activeBg,
      smartBattleVideos,
      generalVideos,
      news,
      appLinks,
      whatsappNumbers,
      socialLinks,
      featuredVideos,
    };
  } catch (err) {
    console.error("Failed to fetch home data:", err);
    return {
      campusItems: [],
      campusBackground: null,
      smartBattleVideos: [],
      generalVideos: [],
      news: [],
      appLinks: [],
      whatsappNumbers: [],
      socialLinks: [],
      featuredVideos: [],
    };
  }
}

export default async function Page() {
  const data = await getData();
  return <HomePage {...data} />;
}
