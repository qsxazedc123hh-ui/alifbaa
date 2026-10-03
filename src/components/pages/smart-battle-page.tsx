"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Trophy, Target, Swords, Scale } from "lucide-react";

interface Section {
  id: string;
  key: string;
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
  order: number;
}

export function SmartBattlePage({ sections }: { sections: Section[] }) {
  const t = useTranslations("smartBattle");
  const locale = useLocale() as "ar" | "en";
  const isRtl = locale === "ar";

  const FEATURES = [
    { icon: Target, key: "points" as const, color: "from-gold to-amber-700" },
    { icon: Trophy, key: "ranking" as const, color: "from-violet-500 to-purple-700" },
    { icon: Swords, key: "prizes" as const, color: "from-rose-500 to-rose-700" },
    { icon: Scale, key: "rules" as const, color: "from-sky-500 to-blue-700" },
  ];

  const sectionsMap = new Map(sections.map(s => [s.key, s]));

  return (
    <>
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-rose-50 via-background to-violet-50 dark:from-rose-950/20 dark:via-background dark:to-violet-950/20" />
        <div className="absolute top-0 left-0 h-[400px] w-[400px] rounded-full bg-rose-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-3xl" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 text-white mb-4 shadow-glow">
              <Swords className="h-8 w-8" />
            </div>
            <span className="block text-xs font-bold tracking-[0.2em] text-rose-600 dark:text-rose-400 uppercase mb-2">
              Smart Battle
            </span>
            <h1 className="font-display font-extrabold text-4xl lg:text-6xl text-foreground text-balance">
              {t("title")}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">{t("subtitle")}</p>
            <p className="mt-4 text-base text-foreground/85 max-w-2xl mx-auto leading-relaxed">
              {t("intro")}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => {
              const section = sectionsMap.get(f.key);
              const title = section ? (isRtl ? section.titleAr : section.titleEn) : t(f.key);
              const desc = section ? (isRtl ? section.contentAr : section.contentEn) : t(`${f.key}Desc`);
              return (
                <motion.div
                  key={f.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="rounded-2xl border border-border bg-card p-6 shadow-soft"
                >
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white`}>
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display font-bold text-lg">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-10 rounded-3xl bg-gradient-to-br from-rose-500 to-violet-700 p-8 lg:p-12 text-white text-center shadow-card"
          >
            <Trophy className="h-12 w-12 mx-auto mb-4" />
            <h2 className="font-display font-extrabold text-2xl lg:text-3xl">
              {t("joinNow")}
            </h2>
          </motion.div>
        </div>
      </section>
    </>
  );
}
