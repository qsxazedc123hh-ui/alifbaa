"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Download as DownloadIcon, X, Smartphone, Apple, Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppLink } from "@/lib/types";

interface DownloadProps {
  appLinks: AppLink[];
  onBack: () => void;
}

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  APK: Smartphone,
  PLAY_STORE: Smartphone,
  APP_STORE: Apple,
  WEB: Globe,
  OTHER: DownloadIcon,
};

const TYPE_LABELS: Record<string, string> = {
  APK: "Android APK",
  PLAY_STORE: "Google Play",
  APP_STORE: "App Store",
  WEB: "منصة الويب",
  OTHER: "تحميل",
};

/**
 * Download Section — تحميل التطبيق
 * - تصميم فخم مع صورة التطبيق
 * - زر تحميل يفتح Bottom Sheet بكل الروابط
 * - إذا لم توجد روابط: رسالة «التطبيق قيد التجهيز»
 */
export function Download({ appLinks, onBack }: DownloadProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const visibleLinks = appLinks.filter((l) => l.visible).sort((a, b) => a.order - b.order);

  const handleStart = () => {
    if (visibleLinks.length === 0) {
      // Show "التطبيق قيد التجهيز" message
      setSheetOpen(true);
    } else if (visibleLinks.length === 1) {
      // Single link — direct download
      window.open(visibleLinks[0].url, "_blank");
    } else {
      // Multiple links — show bottom sheet
      setSheetOpen(true);
    }
  };

  return (
    <section id="download" className="min-h-screen pt-20 lg:pt-24 pb-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-brand/5 via-background to-navy/5" />
        <div className="absolute top-1/2 -translate-y-1/2 -start-32 h-96 w-96 rounded-full bg-cyan-brand/10 blur-3xl" />
        <div className="absolute top-1/2 -translate-y-1/2 -end-32 h-96 w-96 rounded-full bg-navy/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-foreground">تحميل التطبيق</h2>
            <p className="mt-1 text-sm text-muted-foreground">ابدأ تجربتك التعليمية الآن</p>
          </div>
          <Button onClick={onBack} variant="outline" size="sm" className="gap-2 shrink-0">
            <ArrowRight className="h-4 w-4" />
            رجوع
          </Button>
        </div>

        {/* Content */}
        <div className="relative rounded-3xl border border-border bg-card p-6 sm:p-8 lg:p-12 shadow-card overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-30" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block text-xs font-bold tracking-[0.2em] text-cyan-brand uppercase mb-3">
                Download App
              </span>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-foreground">
                تطبيق ألف باء
              </h3>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground text-pretty">
                احمل تطبيق ألف باء وابدأ تجربتك التعليمية المتكاملة على هاتفك — دروس، أسئلة، ومتابعة تقدّم في مكان واحد.
              </p>

              <div className="mt-6">
                <Button onClick={handleStart} size="lg" className="gap-2 shadow-glow h-12 px-6">
                  <DownloadIcon className="h-5 w-5" />
                  {visibleLinks.length === 0 ? "ابدأ الآن" : "تحميل التطبيق"}
                </Button>
              </div>

              {visibleLinks.length > 0 && (
                <p className="mt-3 text-xs text-muted-foreground">
                  {visibleLinks.length} خيار تحميل متاح
                </p>
              )}
            </motion.div>

            {/* Phone mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center"
            >
              <div className="relative w-[220px] sm:w-[260px] h-[440px] sm:h-[520px] rounded-[2.5rem] bg-gradient-to-br from-navy to-navy-deep p-2.5 shadow-card">
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-navy rounded-b-2xl z-10" />
                <div className="relative h-full w-full rounded-[2rem] overflow-hidden bg-gradient-to-br from-cyan-soft to-background">
                  <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                    <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-navy to-navy-deep flex items-center justify-center shadow-lg">
                      <span className="text-white font-display font-extrabold text-3xl">أ</span>
                    </div>
                    <h3 className="mt-4 font-display font-extrabold text-xl text-foreground">ألف باء</h3>
                    <p className="text-[10px] text-muted-foreground mt-1">ادرس • افهم • نافس • اربح</p>
                    <div className="mt-5 w-full space-y-2">
                      <div className="h-8 rounded-lg bg-cyan-brand/10 flex items-center justify-center text-xs font-semibold text-cyan-brand">الدروس</div>
                      <div className="h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-xs font-semibold text-rose-600">صراع الأذكياء</div>
                      <div className="h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-xs font-semibold text-violet-600">الأخبار</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Sheet — Download links */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheetOpen(false)}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed bottom-0 inset-x-0 z-[60] rounded-t-3xl bg-card border-t border-border shadow-card pb-[env(safe-area-inset-bottom)]"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-display font-bold text-base">
                  {visibleLinks.length === 0 ? "التطبيق قيد التجهيز" : "اختر طريقة التحميل"}
                </h3>
                <button
                  onClick={() => setSheetOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 space-y-2">
                {visibleLinks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    التطبيق قيد التجهيز — تابعنا للحصول على التحديثات قريباً.
                  </p>
                ) : (
                  visibleLinks.map((link) => {
                    const Icon = TYPE_ICONS[link.type] || Download;
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3.5 hover:border-cyan-brand/30 hover:bg-cyan-brand/5 transition-all"
                      >
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-navy to-navy-deep text-navy-foreground flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">{link.name}</div>
                          <div className="text-[11px] text-muted-foreground">{TYPE_LABELS[link.type] || link.type}</div>
                        </div>
                        <DownloadIcon className="h-4 w-4 text-muted-foreground" />
                      </a>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
