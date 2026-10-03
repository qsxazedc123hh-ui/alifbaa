"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Video, HelpCircle, LineChart, Swords, Film, Smartphone } from "lucide-react";

const FEATURES = [
  { icon: Video, key: "feature1", color: "from-brand to-forest" },
  { icon: HelpCircle, key: "feature2", color: "from-gold to-amber-700" },
  { icon: LineChart, key: "feature3", color: "from-sky-500 to-blue-700" },
  { icon: Swords, key: "feature4", color: "from-rose-500 to-rose-700" },
  { icon: Film, key: "feature5", color: "from-violet-500 to-purple-700" },
  { icon: Smartphone, key: "feature6", color: "from-teal-500 to-emerald-700" },
] as const;

export function PlatformPage() {
  const t = useTranslations("platform");

  return (
    <>
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-soft/40 to-background" />
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">
              Alif Baa Platform
            </span>
            <h1 className="font-display font-extrabold text-4xl lg:text-6xl text-foreground text-balance">
              {t("title")}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">{t("subtitle")}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-extrabold text-2xl lg:text-3xl text-center mb-12">
            {t("features")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-card transition-all hover:-translate-y-1"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display font-bold text-lg">{t(`${f.key}Title`)}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {t(`${f.key}Desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
