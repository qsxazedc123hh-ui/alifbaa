import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { PreviewPage } from "@/components/admin/preview-page";
import { verifyAdmin } from "@/lib/admin-auth";
import { headers } from "next/headers";

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
    console.error("Failed to fetch preview data:", err);
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
  // Auth guard — only authenticated admins can access preview
  const headerStore = await headers();
  const cookieHeader = headerStore.get("cookie") || "";
  const req = new Request("http://localhost/api/admin/preview", {
    headers: { cookie: cookieHeader },
  });
  const admin = await verifyAdmin(req);
  if (!admin) {
    redirect("/admin");
  }

  const data = await getData();
  return <PreviewPage {...data} />;
}
