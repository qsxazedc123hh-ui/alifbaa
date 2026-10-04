"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Play, ArrowLeft, ArrowRight, Video as VideoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface VideoItem {
  id: string;
  titleAr: string;
  titleEn: string;
  type: string;
  thumbnailMediaId: string | null;
  thumbnailUrl?: string | null;
  videoUrl: string;
  externalUrl?: string | null;
  publishedAt: string;
  featured: boolean;
}

const TYPE_COLORS: Record<string, string> = {
  REEL: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  VIDEO: "bg-sky-500/10 text-sky-600 border-sky-500/20",
  ANNOUNCEMENT: "bg-gold/15 text-amber-700 border-gold/30",
  EDUCATIONAL: "bg-brand/10 text-brand border-brand/20",
  PROMOTIONAL: "bg-violet-500/10 text-violet-600 border-violet-500/20",
};

const TYPE_LABELS: Record<string, string> = {
  REEL: "reels",
  VIDEO: "videos",
  ANNOUNCEMENT: "announcements",
  EDUCATIONAL: "educational",
  PROMOTIONAL: "promotional",
};

export function VideosSection({ videos }: { videos: VideoItem[] }) {
  const t = useTranslations("videos");
  const locale = useLocale() as "ar" | "en";
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  const fallback = [
    {
      id: "demo-1",
      titleAr: "شرح درس الكسور — الصف السادس",
      titleEn: "Fractions Lesson — Grade 6",
      type: "EDUCATIONAL",
      thumbnailUrl: null,
      videoUrl: "#",
      publishedAt: new Date().toISOString(),
      featured: true,
    },
    {
      id: "demo-2",
      titleAr: "إعلان انطلاق صراع الأذكياء",
      titleEn: "Smart Battle Announcement",
      type: "ANNOUNCEMENT",
      thumbnailUrl: null,
      videoUrl: "#",
      publishedAt: new Date().toISOString(),
      featured: false,
    },
    {
      id: "demo-3",
      titleAr: "نصيحة أسبوعية للطلاب",
      titleEn: "Weekly Tip for Students",
      type: "REEL",
      thumbnailUrl: null,
      videoUrl: "#",
      publishedAt: new Date().toISOString(),
      featured: false,
    },
  ];

  const list = videos.length > 0 ? videos : fallback;

  return (
    <section className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10"
        >
          <div className="max-w-xl">
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">
              Videos & Reels
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-foreground text-balance">
              {t("title")}
            </h2>
            <p className="mt-3 text-base text-muted-foreground text-pretty">{t("subtitle")}</p>
          </div>
          <Button asChild variant="outline" className="gap-2 shrink-0">
            <Link href="/videos">
              {t("all")}
              <Arrow className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.slice(0, 6).map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group cursor-pointer"
            >
              <a
                href={v.externalUrl || v.videoUrl}
                target={v.externalUrl ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="block relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-muted/60 border border-border shadow-soft hover:shadow-card transition-all"
              >
                {v.thumbnailUrl ? (
                  <img
                    src={v.thumbnailUrl}
                    alt={isRtl ? v.titleAr : v.titleEn}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/30 via-gold/15 to-forest/30 flex items-center justify-center">
                    <VideoIcon className="h-12 w-12 text-white/50" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-14 w-14 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-lg">
                    <Play className="h-6 w-6 text-rose-600 fill-rose-600 ms-0.5" />
                  </div>
                </div>

                <Badge
                  className={`absolute top-3 end-3 border ${
                    TYPE_COLORS[v.type] || TYPE_COLORS.VIDEO
                  }`}
                  variant="outline"
                >
                  {t((TYPE_LABELS[v.type] || "videos") as "reels")}
                </Badge>

                <div className="absolute bottom-3 inset-x-3">
                  <h3 className="font-display font-bold text-sm text-white line-clamp-2 drop-shadow">
                    {isRtl ? v.titleAr : v.titleEn}
                  </h3>
                </div>
              </a>
            </motion.div>
          ))}
        </div>

        {list.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <VideoIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>{t("noVideos")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
