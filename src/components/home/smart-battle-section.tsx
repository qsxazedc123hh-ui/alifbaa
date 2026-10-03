"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Swords, Trophy, Target, Scale, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SmartBattleSection({ locale }: { locale: "ar" | "en" }) {
  const t = useTranslations("smartBattle");
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  const features = [
    { icon: Target, key: "points" as const, color: "from-gold to-amber-600" },
    { icon: Trophy, key: "ranking" as const, color: "from-violet-500 to-purple-700" },
    { icon: Swords, key: "prizes" as const, color: "from-rose-500 to-rose-700" },
    { icon: Scale, key: "rules" as const, color: "from-sky-500 to-blue-700" },
  ];

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-rose-50 via-background to-violet-50 dark:from-rose-950/20 dark:via-background dark:to-violet-950/20" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Visual */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Tournament podium */}
            <div className="relative rounded-3xl bg-gradient-to-br from-rose-500 to-rose-700 p-8 shadow-card overflow-hidden">
              <div className="absolute inset-0 bg-grid opacity-20" />

              <div className="relative">
                <div className="text-center text-white">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur ring-1 ring-white/20 mb-3">
                    <Trophy className="h-8 w-8" />
                  </div>
                  <h3 className="font-display font-extrabold text-2xl">{t("title")}</h3>
                </div>

                {/* Podium */}
                <div className="mt-8 flex items-end justify-center gap-2 h-40">
                  {/* 2nd place */}
                  <div className="flex-1 max-w-[80px]">
                    <div className="rounded-t-lg bg-white/30 backdrop-blur h-24 flex items-end justify-center pb-2">
                      <span className="text-white font-bold text-xl">٢</span>
                    </div>
                    <div className="mt-2 rounded-lg bg-white/10 py-1.5 text-center text-xs text-white truncate">
                      سارة
                    </div>
                  </div>

                  {/* 1st place */}
                  <div className="flex-1 max-w-[80px] -mt-6">
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="rounded-t-lg bg-gold h-32 flex items-end justify-center pb-2 shadow-gold-glow"
                    >
                      <span className="text-white font-extrabold text-2xl">١</span>
                    </motion.div>
                    <div className="mt-2 rounded-lg bg-gold/20 py-1.5 text-center text-xs text-white font-semibold truncate">
                      أحمد
                    </div>
                  </div>

                  {/* 3rd place */}
                  <div className="flex-1 max-w-[80px]">
                    <div className="rounded-t-lg bg-white/20 backdrop-blur h-16 flex items-end justify-center pb-2">
                      <span className="text-white font-bold text-lg">٣</span>
                    </div>
                    <div className="mt-2 rounded-lg bg-white/10 py-1.5 text-center text-xs text-white truncate">
                      نور
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating stat */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -end-4 rounded-2xl bg-card border border-border p-4 shadow-card"
            >
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-gold" />
                <div>
                  <div className="text-[10px] text-muted-foreground">أعلى نقاط</div>
                  <div className="font-bold text-foreground">٢٤٥٠ نقطة</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-rose-600 dark:text-rose-400 uppercase mb-3">
              Smart Battle
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-foreground text-balance">
              {t("title")}
            </h2>
            <p className="mt-3 text-base text-muted-foreground text-pretty leading-relaxed">
              {t("subtitle")}
            </p>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {t("intro")}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {features.map((f) => (
                <div
                  key={f.key}
                  className="rounded-xl border border-border bg-card p-3.5"
                >
                  <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${f.color} text-white`}>
                    <f.icon className="h-4 w-4" />
                  </div>
                  <h4 className="mt-2.5 font-semibold text-sm text-foreground">
                    {t(`${f.key}`)}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {t(`${f.key}Desc`)}
                  </p>
                </div>
              ))}
            </div>

            <Button asChild className="mt-6 gap-2" size="lg">
              <Link href="/smart-battle">
                {t("joinNow")}
                <Arrow className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
