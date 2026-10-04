"use client";

import { motion } from "framer-motion";
import { ArrowRight, Newspaper, Play, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { News } from "@/lib/types";

interface NewsSectionProps {
  news: News[];
  onBack: () => void;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("ar-IQ", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return iso;
  }
}

/**
 * News Section — الأخبار
 * - أحدث خبر بارز في الأعلى
 * - بقية الأخبار كبطاقات أنيقة
 * - يدعم صورة أو فيديو
 */
export function NewsSection({ news, onBack }: NewsSectionProps) {
  const sorted = [...news].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
  const featured = sorted.find((n) => n.featured) || sorted[0];
  const rest = sorted.filter((n) => n.id !== featured?.id);

  return (
    <section id="news" className="min-h-screen pt-20 lg:pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-foreground">الأخبار</h2>
            <p className="mt-1 text-sm text-muted-foreground">آخر أخبار و更新ات منصة ألف باء</p>
          </div>
          <Button onClick={onBack} variant="outline" size="sm" className="gap-2 shrink-0">
            <ArrowRight className="h-4 w-4" />
            رجوع
          </Button>
        </div>

        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Newspaper className="h-12 w-12 mx-auto mb-3 opacity-30 text-muted-foreground" />
            <p className="text-muted-foreground">لا توجد أخبار حالياً</p>
          </div>
        ) : (
          <>
            {/* Featured news */}
            {featured && (
              <motion.article
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 rounded-3xl overflow-hidden border border-border bg-card shadow-card"
              >
                {featured.contentType === "IMAGE" && featured.imageUrl && (
                  <div className="aspect-[16/9] sm:aspect-[21/9] bg-muted overflow-hidden">
                    <img src={featured.imageUrl} alt={featured.title} className="h-full w-full object-cover" />
                  </div>
                )}
                {featured.contentType === "VIDEO" && featured.video?.videoUrl && (
                  <div className="aspect-[16/9] sm:aspect-[21/9] bg-black overflow-hidden relative">
                    <video
                      src={featured.video.videoUrl}
                      poster={featured.video.thumbnailUrl || undefined}
                      controls
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5 sm:p-6 lg:p-8">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(featured.publishedAt)}</span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-brand/10 text-cyan-brand font-semibold">مميز</span>
                  </div>
                  <h3 className="font-display font-extrabold text-xl sm:text-2xl lg:text-3xl text-foreground">{featured.title}</h3>
                  {featured.description && (
                    <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">{featured.description}</p>
                  )}
                </div>
              </motion.article>
            )}

            {/* Rest of news as cards */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {rest.map((item, idx) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="rounded-2xl overflow-hidden border border-border bg-card shadow-soft hover:shadow-card transition-all"
                  >
                    {item.contentType === "IMAGE" && item.imageUrl && (
                      <div className="aspect-[16/10] bg-muted overflow-hidden">
                        <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                      </div>
                    )}
                    {item.contentType === "VIDEO" && item.video?.videoUrl && (
                      <div className="aspect-[16/10] bg-muted overflow-hidden relative">
                        <img
                          src={item.video.thumbnailUrl || ""}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center">
                            <Play className="h-5 w-5 text-navy fill-navy ms-0.5" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1.5">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(item.publishedAt)}</span>
                      </div>
                      <h3 className="font-display font-bold text-sm sm:text-base text-foreground line-clamp-2">{item.title}</h3>
                      {item.description && (
                        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                      )}
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
