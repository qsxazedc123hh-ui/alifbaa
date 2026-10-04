import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [
      videos,
      news,
      smartBattleVideos,
      appLinks,
      whatsappNumbers,
      socialLinks,
      unreadMessages,
      trashVideos,
      trashNews,
      trashAppLinks,
      trashWhatsapp,
      trashSocial,
      trashMessages,
    ] = await Promise.all([
      db.video.count({ where: { deletedAt: null, section: "videos" } }),
      db.news.count({ where: { deletedAt: null } }),
      db.video.count({ where: { deletedAt: null, section: "smart_battle" } }),
      db.appLink.count({ where: { deletedAt: null } }),
      db.whatsAppNumber.count({ where: { deletedAt: null } }),
      db.socialLink.count({ where: { deletedAt: null } }),
      db.contactMessage.count({ where: { isRead: false, deletedAt: null } }),
      db.video.count({ where: { deletedAt: { not: null } } }),
      db.news.count({ where: { deletedAt: { not: null } } }),
      db.appLink.count({ where: { deletedAt: { not: null } } }),
      db.whatsAppNumber.count({ where: { deletedAt: { not: null } } }),
      db.socialLink.count({ where: { deletedAt: { not: null } } }),
      db.contactMessage.count({ where: { deletedAt: { not: null } } }),
    ]);

    return NextResponse.json({
      stats: {
        videos,
        news,
        smartBattleVideos,
        appLinks,
        whatsappNumbers,
        socialLinks,
        unreadMessages,
        trashItems: trashVideos + trashNews + trashAppLinks + trashWhatsapp + trashSocial + trashMessages,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
