import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/** GET /api/public/site — public site payload: brand, homepage sections, contact, seo, nav, latest release */
export async function GET() {
  const [
    assets,
    colors,
    settings,
    homepageSections,
    contactSettings,
    seoSettings,
    navItems,
    grades,
    videos,
    smartBattle,
    latestRelease,
  ] = await Promise.all([
    db.brandAsset.findMany(),
    db.brandColor.findMany(),
    db.brandSetting.findMany(),
    db.homePageSection.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
    db.contactSetting.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
    db.seoSetting.findMany(),
    db.navItem.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
    db.grade.findMany({
      where: { visible: true },
      orderBy: { order: "asc" },
      include: { _count: { select: { subjects: { where: { visible: true } } } } },
    }),
    db.video.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      take: 12,
    }),
    db.smartBattleSection.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
    db.appRelease.findFirst({
      where: { published: true, isLatest: true, platform: "ANDROID" },
      orderBy: { releasedAt: "desc" },
    }),
  ]);

  // Hydrate homepage sections with parsed data
  const sections = homepageSections.map((s) => ({
    ...s,
    data: s.data ? JSON.parse(s.data) : {},
  }));

  return NextResponse.json({
    brand: { assets, colors, settings },
    homepage: sections,
    contact: contactSettings,
    seo: seoSettings,
    nav: navItems,
    grades,
    videos,
    smartBattle,
    latestRelease,
  });
}
