"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import { Video, BookOpen, Image as ImageIcon, Smartphone, ArrowLeft, ArrowRight, Plus, Home, Palette, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StatsData {
  stats: {
    videos: number;
    grades: number;
    media: number;
    releases: number;
    subjects: number;
    sections: number;
  };
  recentVideos: Array<{
    id: string;
    titleAr: string;
    titleEn: string;
    type: string;
    published: boolean;
    createdAt: string;
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    module: string;
    createdAt: string;
  }>;
}

export function DashboardPage({ userName }: { userName: string }) {
  const t = useTranslations("admin.dashboard");
  const tSidebar = useTranslations("admin.sidebar");
  const locale = useLocale() as "ar" | "en";
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  const { data, isLoading } = useQuery<StatsData>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const stats = data?.stats ?? { videos: 0, grades: 0, media: 0, releases: 0, subjects: 0, sections: 0 };

  const STATS = [
    { key: "videos", value: stats.videos, icon: Video, color: "from-rose-500 to-rose-700", href: "/admin/videos" },
    { key: "grades", value: stats.grades, icon: BookOpen, color: "from-brand to-forest", href: "/admin/classes" },
    { key: "media", value: stats.media, icon: ImageIcon, color: "from-gold to-amber-700", href: "/admin/media" },
    { key: "releases", value: stats.releases, icon: Smartphone, color: "from-sky-500 to-blue-700", href: "/admin/app-downloads" },
  ] as const;

  const QUICK_ACTIONS = [
    { label: tSidebar("homepage"), icon: Home, href: "/admin/homepage" },
    { label: tSidebar("brand"), icon: Palette, href: "/admin/brand" },
    { label: tSidebar("media"), icon: ImageIcon, href: "/admin/media" },
    { label: tSidebar("appDownloads"), icon: Smartphone, href: "/admin/app-downloads" },
    { label: tSidebar("classes"), icon: BookOpen, href: "/admin/classes" },
    { label: tSidebar("videos"), icon: Video, href: "/admin/videos" },
    { label: tSidebar("settings"), icon: Settings, href: "/admin/settings" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl lg:text-3xl">{t("title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("welcome", { name: userName })}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Link href={s.href}>
              <Card className="p-5 hover:shadow-card transition-all hover:-translate-y-0.5 cursor-pointer">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="mt-3 font-display font-extrabold text-2xl lg:text-3xl">
                  {isLoading ? "—" : isRtl ? toArabicNum(String(s.value)) : s.value}
                </div>
                <div className="text-xs text-muted-foreground">{t(`stats.${s.key}` as never)}</div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent videos */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-base">{t("recentVideos")}</h2>
            <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
              <Link href="/admin/videos">
                {t("recentVideos") === "Recent Videos" ? "All" : "الكل"}
                <Arrow className="h-3 w-3" />
              </Link>
            </Button>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : data?.recentVideos?.length ? (
            <ul className="space-y-2">
              {data.recentVideos.map(v => (
                <li key={v.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm truncate">
                      {isRtl ? v.titleAr : v.titleEn}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      {v.type} · {new Date(v.createdAt).toLocaleDateString(isRtl ? "ar-IQ" : "en-US")}
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${v.published ? "bg-brand/10 text-brand" : "bg-muted text-muted-foreground"}`}>
                    {v.published ? (isRtl ? "منشور" : "Published") : (isRtl ? "مسودة" : "Draft")}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10 text-muted-foreground text-sm">
              <Video className="h-10 w-10 mx-auto mb-2 opacity-30" />
              {t("recentVideos") === "Recent Videos" ? "No videos yet" : "لا توجد فيديوهات بعد"}
            </div>
          )}
        </Card>

        {/* Quick actions */}
        <Card className="p-5">
          <h2 className="font-display font-bold text-base mb-4">{t("quickActions")}</h2>
          <div className="space-y-2">
            {QUICK_ACTIONS.map(a => (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center gap-3 rounded-lg border border-border p-2.5 hover:bg-muted/50 transition-colors text-sm"
              >
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <a.icon className="h-4 w-4" />
                </div>
                <span className="flex-1 font-medium">{a.label}</span>
                <Arrow className="h-3 w-3 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function toArabicNum(s: string): string {
  return s.replace(/[0-9]/g, d => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
}
