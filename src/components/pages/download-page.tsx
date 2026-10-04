"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Download, Apple, Calendar, HardDrive, Tag, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Release {
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
  isLatest: boolean;
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
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function DownloadPage({ latest, releases }: { latest: Release | null; releases: Release[] }) {
  const t = useTranslations("download");
  const locale = useLocale() as "ar" | "en";
  const isRtl = locale === "ar";

  return (
    <>
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-soft/40 to-background" />
        <div className="absolute top-1/2 -translate-y-1/2 -end-32 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">
                Download App
              </span>
              <h1 className="font-display font-extrabold text-4xl lg:text-5xl">{t("title")}</h1>
              <p className="mt-3 text-base text-muted-foreground">{t("subtitle")}</p>

              <div className="mt-7 flex flex-wrap gap-3">
                {latest ? (
                  <Button asChild size="lg" className="gap-2 shadow-glow">
                    <a href={latest.apkUrl} download>
                      <Download className="h-5 w-5" />
                      {t("android")}
                    </a>
                  </Button>
                ) : (
                  <Button size="lg" disabled className="gap-2">
                    <Download className="h-5 w-5" />
                    {t("noRelease")}
                  </Button>
                )}
                <Button size="lg" variant="outline" disabled className="gap-2">
                  <Apple className="h-4 w-4" />
                  {t("ios")}
                </Button>
              </div>

              {latest && (
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Stat icon={Tag} label={t("version")} value={latest.version} />
                  <Stat icon={HardDrive} label={t("size")} value={formatBytes(latest.fileSize)} />
                  <Stat icon={Calendar} label={t("releasedAt")} value={formatDate(latest.releasedAt, locale)} />
                </div>
              )}

              {latest && (latest.releaseNotesAr || latest.releaseNotesEn) && (
                <div className="mt-6 rounded-2xl border border-border bg-card p-4">
                  <h3 className="font-display font-bold text-sm mb-2">{t("releaseNotes")}</h3>
                  <p className="text-xs text-muted-foreground whitespace-pre-line">
                    {isRtl ? latest.releaseNotesAr : latest.releaseNotesEn}
                  </p>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex justify-center"
            >
              <div className="relative w-[260px] h-[520px] rounded-[2.5rem] bg-gradient-to-br from-ink to-ink/90 p-2.5 shadow-card">
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-ink rounded-b-2xl z-10" />
                <div className="relative h-full w-full rounded-[2rem] overflow-hidden bg-gradient-to-br from-brand-soft to-gold-soft">
                  <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                    <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-brand to-forest flex items-center justify-center shadow-lg">
                      <span className="text-white font-display font-extrabold text-4xl">أ</span>
                    </div>
                    <h3 className="mt-4 font-display font-extrabold text-2xl text-ink">ألف باء</h3>
                    <p className="text-xs text-muted-foreground mt-1">ادرس • افهم • نافس • اربح</p>

                    <div className="mt-6 w-full space-y-2">
                      <div className="h-10 rounded-xl bg-white/70 flex items-center justify-center text-xs font-semibold text-brand">الدروس</div>
                      <div className="h-10 rounded-xl bg-white/70 flex items-center justify-center text-xs font-semibold text-gold">صراع الأذكياء</div>
                      <div className="h-10 rounded-xl bg-white/70 flex items-center justify-center text-xs font-semibold text-rose-500">الترتيب الأسبوعي</div>
                      <div className="h-10 rounded-xl bg-white/70 flex items-center justify-center text-xs font-semibold text-violet-600">المكتبة</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {releases.length > 1 && (
        <section className="pb-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-extrabold text-2xl mb-6">الإصدارات السابقة</h2>
            <div className="space-y-3">
              {releases.map(r => (
                <div key={r.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <FileDown className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold text-sm">{r.version}{r.isLatest && <span className="ms-2 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">أحدث</span>}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(r.releasedAt, locale)} • {formatBytes(r.fileSize)}</div>
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <a href={r.apkUrl} download>تحميل</a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/50 p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <div className="mt-1 font-display font-bold text-sm text-foreground truncate">{value}</div>
    </div>
  );
}
