"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Sparkles, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/site/logo";

interface HeroData {
  titleAr?: string;
  titleEn?: string;
  subtitleAr?: string;
  subtitleEn?: string;
  primaryCtaAr?: string;
  primaryCtaEn?: string;
  secondaryCtaAr?: string;
  secondaryCtaEn?: string;
  badgeAr?: string;
  badgeEn?: string;
}

export function HeroSection({ data, locale }: { data?: HeroData; locale: "ar" | "en" }) {
  const t = useTranslations("hero");
  const isRtl = locale === "ar";

  const title = (isRtl ? data?.titleAr : data?.titleEn) || t("title");
  const subtitle = (isRtl ? data?.subtitleAr : data?.subtitleEn) || t("subtitle");
  const primaryCta = (isRtl ? data?.primaryCtaAr : data?.primaryCtaEn) || t("primaryCta");
  const secondaryCta = (isRtl ? data?.secondaryCtaAr : data?.secondaryCtaEn) || t("secondaryCta");
  const badge = (isRtl ? data?.badgeAr : data?.badgeEn) || t("badge");
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-soft/40 via-background to-background" />
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute inset-0 bg-grid opacity-[0.3] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text content */}
          <div className="lg:col-span-7 text-center lg:text-start">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold text-primary"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              {badge}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mt-5 font-display font-extrabold tracking-tight text-foreground text-balance text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem] leading-[1.1]"
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-5 text-base sm:text-lg text-muted-foreground text-pretty max-w-2xl mx-auto lg:mx-0"
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-3"
            >
              <Button asChild size="lg" className="gap-2 shadow-glow">
                <Link href="/platform">
                  <Sparkles className="h-4 w-4" />
                  {primaryCta}
                  <Arrow className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link href="/about">
                  <GraduationCap className="h-4 w-4" />
                  {secondaryCta}
                </Link>
              </Button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10 flex items-center justify-center lg:justify-start gap-6 lg:gap-10"
            >
              {[
                { value: "٧", label: isRtl ? "صفوف دراسية" : "Grades" },
                { value: "+٣٠", label: isRtl ? "مادة دراسية" : "Subjects" },
                { value: "+١٠٠٠", label: isRtl ? "درس مصوّر" : "Video Lessons" },
              ].map((s, i) => (
                <div key={i} className="text-center lg:text-start">
                  <div className="font-display font-extrabold text-2xl lg:text-3xl text-foreground">
                    {s.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Visual: Campus preview card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <HeroVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto max-w-md">
      {/* Glowing background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-gold/10 to-transparent rounded-3xl blur-2xl" />

      {/* Card */}
      <div className="relative rounded-3xl border border-border bg-card/80 backdrop-blur-xl p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-400/70" />
            <div className="h-2 w-2 rounded-full bg-yellow-400/70" />
            <div className="h-2 w-2 rounded-full bg-green-400/70" />
          </div>
          <span className="text-xs text-muted-foreground font-mono">alifbaa.app</span>
        </div>

        {/* Mock UI */}
        <div className="rounded-2xl bg-gradient-to-br from-brand to-forest p-5 text-brand-foreground">
          <div className="flex items-center justify-between">
            <LogoMark size={36} />
            <div className="text-end">
              <div className="text-xs opacity-70">المستوى الحالي</div>
              <div className="font-bold">المبتدئ ⭐</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {["رياضيات", "علوم", "لغة عربية"].map((s) => (
              <div key={s} className="rounded-lg bg-white/10 backdrop-blur p-2 text-center">
                <div className="text-[10px] opacity-70">مادة</div>
                <div className="text-xs font-semibold">{s}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="opacity-70">نقاط صراع الأذكياء</span>
            <span className="font-bold text-gold">١٢٥٠ نقطة</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-white/20 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "68%" }}
              transition={{ duration: 1.2, delay: 0.5 }}
              className="h-full bg-gold rounded-full"
            />
          </div>
        </div>

        {/* Floating badges */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-3 -start-3 rounded-xl bg-card border border-border px-3 py-2 shadow-card"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🏆</span>
            <div>
              <div className="text-[10px] text-muted-foreground">الترتيب الأسبوعي</div>
              <div className="text-xs font-bold text-foreground">#٣</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute -bottom-3 -end-3 rounded-xl bg-card border border-border px-3 py-2 shadow-card"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">📚</span>
            <div>
              <div className="text-[10px] text-muted-foreground">الدرس الحالي</div>
              <div className="text-xs font-bold text-foreground">الكسور</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
