"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  BookOpen,
  Brain,
  HelpCircle,
  LineChart,
  Swords,
  Trophy,
} from "lucide-react";

const SERVICES = [
  { icon: BookOpen, key: "learning" as const, color: "from-brand to-forest" },
  { icon: Brain, key: "understanding" as const, color: "from-violet-500 to-purple-700" },
  { icon: HelpCircle, key: "practice" as const, color: "from-gold to-amber-600" },
  { icon: LineChart, key: "tracking" as const, color: "from-sky-500 to-blue-700" },
  { icon: Swords, key: "competition" as const, color: "from-rose-500 to-rose-700" },
  { icon: Trophy, key: "motivation" as const, color: "from-amber-500 to-orange-700" },
];

export function ServicesSection() {
  const t = useTranslations("services");

  return (
    <section className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <span className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">
            Services
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-foreground text-balance">
            {t("title")}
          </h2>
          <p className="mt-3 text-base text-muted-foreground text-pretty">{t("subtitle")}</p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-md`}>
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display font-bold text-lg text-foreground">
                {t(`${s.key}.title`)}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {t(`${s.key}.desc`)}
              </p>

              {/* Decorative number */}
              <span className="absolute top-4 end-5 font-display font-extrabold text-5xl text-muted/30 select-none">
                {String(i + 1).padStart(2, "0")}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
