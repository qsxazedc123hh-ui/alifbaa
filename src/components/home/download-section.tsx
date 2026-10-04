"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Download, FileDown, Calendar, HardDrive, Tag, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LatestRelease {
  id: string;
  version: string;
  versionCode: number;
  nameAr: string;
  nameEn: string;
  apkUrl: string;
  fileSize: number;
  releasedAt: string;
  releaseNotesAr: string | null;
  releaseNotesEn: string | null;
}

function formatBytes(bytes: number): string {
  if (!bytes) return "—";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

function formatDate(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleDateString(locale === "ar" ? "ar-IQ" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function DownloadSection({ release }: { release: LatestRelease | null }) {
  const t = useTranslations("download");
  const locale = useLocale() as "ar" | "en";
  const isRtl = locale === "ar";

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-gold/5 to-forest/5" />
        <div className="absolute top-1/2 -translate-y-1/2 -start-32 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute top-1/2 -translate-y-1/2 -end-32 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-border bg-card p-8 lg:p-12 shadow-card overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-30" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">
                Download App
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-foreground text-balance">
                {t("title")}
              </h2>
              <p className="mt-3 text-base text-muted-foreground text-pretty">
                {t("subtitle")}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                {release ? (
                  <Button asChild size="lg" className="gap-2 shadow-glow">
                    <a href={release.apkUrl} download>
                      <Download className="h-5 w-5" />
                      {t("android")}
                    </a>
                  </Button>
                ) : (
                  <Button size="lg" disabled className="gap-2">
                    <Download className="h-5 w-5" />
                    {t("android")}
                  </Button>
                )}

                <Button size="lg" variant="outline" disabled className="gap-2">
                  <Apple className="h-4 w-4" />
                  {t("ios")}
                </Button>
              </div>

              {release && (
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Stat
                    icon={Tag}
                    label={t("version")}
                    value={release.version}
                  />
                  <Stat
                    icon={HardDrive}
                    label={t("size")}
                    value={formatBytes(release.fileSize)}
                  />
                  <Stat
                    icon={Calendar}
                    label={t("releasedAt")}
                    value={formatDate(release.releasedAt, locale)}
                  />
                </div>
              )}
            </motion.div>

            {/* Phone mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative flex justify-center"
            >
              <div className="relative">
                <div className="relative w-[240px] h-[480px] rounded-[2.5rem] bg-gradient-to-br from-ink to-ink/90 p-2.5 shadow-card">
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-ink rounded-b-2xl z-10" />
                  <div className="relative h-full w-full rounded-[2rem] overflow-hidden bg-gradient-to-br from-brand-soft to-gold-soft">
                    {/* Phone content */}
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                      <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-brand to-forest flex items-center justify-center shadow-lg">
                        <span className="text-white font-display font-extrabold text-3xl">أ</span>
                      </div>
                      <h3 className="mt-4 font-display font-extrabold text-xl text-ink">ألف باء</h3>
                      <p className="text-xs text-muted-foreground mt-1">ادرس • افهم • نافس • اربح</p>

                      <div className="mt-6 w-full space-y-2">
                        <div className="h-8 rounded-lg bg-white/70 flex items-center justify-center text-xs font-semibold text-brand">
                          الدروس
                        </div>
                        <div className="h-8 rounded-lg bg-white/70 flex items-center justify-center text-xs font-semibold text-gold">
                          صراع الأذكياء
                        </div>
                        <div className="h-8 rounded-lg bg-white/70 flex items-center justify-center text-xs font-semibold text-rose-500">
                          الترتيب الأسبوعي
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -end-8 rounded-xl bg-card border border-border p-3 shadow-card"
                >
                  <FileDown className="h-5 w-5 text-brand" />
                  <div className="text-[10px] text-muted-foreground mt-1">APK</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/50 p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <div className="mt-1 font-display font-bold text-sm text-foreground truncate">
        {value}
      </div>
    </div>
  );
}
