"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Play, Video as VideoIcon, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VideoItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  type: string;
  thumbnailUrl?: string | null;
  videoUrl: string;
  externalUrl?: string | null;
  publishedAt: string;
  featured: boolean;
}

const TYPE_FILTERS = [
  { value: "ALL", key: "all" },
  { value: "REEL", key: "reels" },
  { value: "VIDEO", key: "videos" },
  { value: "ANNOUNCEMENT", key: "announcements" },
  { value: "EDUCATIONAL", key: "educational" },
  { value: "PROMOTIONAL", key: "promotional" },
] as const;

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

export function VideosPage({ videos }: { videos: VideoItem[] }) {
  const t = useTranslations("videos");
  const locale = useLocale() as "ar" | "en";
  const isRtl = locale === "ar";
  const [filter, setFilter] = useState<string>("ALL");

  const filtered = filter === "ALL" ? videos : videos.filter(v => v.type === filter);

  return (
    <>
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-soft/40 to-background" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">
            Videos & Reels
          </span>
          <h1 className="font-display font-extrabold text-4xl lg:text-5xl">{t("title")}</h1>
          <p className="mt-3 text-base text-muted-foreground">{t("subtitle")}</p>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {TYPE_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  filter === f.value
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {t(f.key)}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <VideoIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>{t("noVideos")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((v, i) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="group cursor-pointer"
                >
                  <a
                    href={v.externalUrl || v.videoUrl}
                    target={v.externalUrl ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="block relative aspect-video rounded-2xl overflow-hidden bg-muted border border-border shadow-soft hover:shadow-card transition-all"
                  >
                    {v.thumbnailUrl ? (
                      <img src={v.thumbnailUrl} alt={isRtl ? v.titleAr : v.titleEn} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-brand/30 via-gold/15 to-forest/30 flex items-center justify-center">
                        <VideoIcon className="h-12 w-12 text-white/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="h-14 w-14 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
                        {v.externalUrl ? <ExternalLink className="h-5 w-5" /> : <Play className="h-6 w-6 text-rose-600 fill-rose-600 ms-0.5" />}
                      </div>
                    </div>
                    <Badge className={`absolute top-3 end-3 border ${TYPE_COLORS[v.type] || TYPE_COLORS.VIDEO}`} variant="outline">
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
          )}
        </div>
      </section>
    </>
  );
}
