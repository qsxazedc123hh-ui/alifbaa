import { PublicLayout } from "@/components/site/public-layout";
import { HeroSection } from "@/components/home/hero-section";
import { CampusSection } from "@/components/home/campus-section";
import { ServicesSection } from "@/components/home/services-section";
import { GradesSection } from "@/components/home/grades-section";
import { SmartBattleSection } from "@/components/home/smart-battle-section";
import { VideosSection } from "@/components/home/videos-section";
import { DownloadSection } from "@/components/home/download-section";
import { ContactSection } from "@/components/home/contact-section";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { defaultLocale, locales, type Locale } from "@/i18n/routing";

async function getSiteData() {
  try {
    const [homepageSections, grades, videos, contactSettings, latestRelease] = await Promise.all([
      db.homePageSection.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
      db.grade.findMany({
        where: { visible: true },
        orderBy: { order: "asc" },
        include: { _count: { select: { subjects: { where: { visible: true } } } } },
      }),
      db.video.findMany({
        where: { published: true },
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
        take: 6,
      }),
      db.contactSetting.findMany({ where: { visible: true } }),
      db.appRelease.findFirst({
        where: { published: true, isLatest: true, platform: "ANDROID" },
        orderBy: { releasedAt: "desc" },
      }),
    ]);

    const contact: Record<string, string> = {};
    for (const c of contactSettings) contact[c.key] = c.value;

    const sectionsMap: Record<string, Record<string, unknown>> = {};
    for (const s of homepageSections) {
      sectionsMap[s.key] = s.data ? JSON.parse(s.data) : {};
    }

    // Hydrate videos with thumbnail URLs (lookup from MediaItem)
    const videoIds = videos.map(v => v.thumbnailMediaId).filter(Boolean) as string[];
    const mediaItems = videoIds.length > 0
      ? await db.mediaItem.findMany({ where: { id: { in: videoIds } } })
      : [];
    const mediaMap = new Map(mediaItems.map(m => [m.id, m]));
    const videosWithThumbs = videos.map(v => ({
      ...v,
      thumbnailUrl: v.thumbnailMediaId ? mediaMap.get(v.thumbnailMediaId)?.url ?? null : null,
    }));

    return {
      hero: (sectionsMap.hero ?? {}) as Record<string, unknown>,
      grades,
      videos: videosWithThumbs,
      contact,
      latestRelease,
    };
  } catch (err) {
    console.error("Homepage data fetch failed:", err);
    return {
      hero: {},
      grades: [],
      videos: [],
      contact: {},
      latestRelease: null,
    };
  }
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("alifbaa_locale")?.value as Locale | undefined;
  const locale: Locale =
    cookieLocale && locales.includes(cookieLocale) ? cookieLocale : defaultLocale;
  const data = await getSiteData();

  return (
    <PublicLayout>
      <HeroSection data={data.hero as never} locale={locale} />
      <CampusSection locale={locale} />
      <ServicesSection />
      <GradesSection grades={data.grades} locale={locale} />
      <SmartBattleSection locale={locale} />
      <VideosSection videos={data.videos} />
      <DownloadSection release={data.latestRelease} />
      <ContactSection contact={data.contact} />
    </PublicLayout>
  );
}
