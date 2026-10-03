import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/** GET /api/admin/stats — dashboard overview numbers */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [videos, grades, media, releases, subjects, sections] = await Promise.all([
    db.video.count(),
    db.grade.count(),
    db.mediaItem.count(),
    db.appRelease.count({ where: { published: true } }),
    db.subject.count(),
    db.homePageSection.count({ where: { visible: true } }),
  ]);

  const recentVideos = await db.video.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, titleAr: true, titleEn: true, type: true, published: true, createdAt: true },
  });

  const recentActivity = await db.auditLog.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    select: { id: true, action: true, module: true, createdAt: true },
  });

  return NextResponse.json({
    stats: { videos, grades, media, releases, subjects, sections },
    recentVideos,
    recentActivity,
  });
}
