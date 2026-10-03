"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  BookOpen,
  Library,
  Swords,
  Video,
  Smartphone,
  MessageCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

/**
 * Alif Baa Campus — the signature visual identity.
 * Renders a stylized "campus map" with clickable buildings,
 * each representing a section of the platform.
 */
export function CampusSection({ locale }: { locale: "ar" | "en" }) {
  const t = useTranslations("campus");
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  const buildings = [
    {
      href: "/classes",
      icon: BookOpen,
      titleKey: "classes" as const,
      descKey: "classesDesc" as const,
      color: "from-brand to-forest",
      delay: 0,
      span: "lg:col-span-2 lg:row-span-2",
      size: "lg",
    },
    {
      href: "/videos",
      icon: Video,
      titleKey: "videos" as const,
      descKey: "videosDesc" as const,
      color: "from-gold to-amber-600",
      delay: 0.05,
      span: "lg:col-span-1 lg:row-span-1",
      size: "md",
    },
    {
      href: "/smart-battle",
      icon: Swords,
      titleKey: "smartBattle" as const,
      descKey: "smartBattleDesc" as const,
      color: "from-rose-500 to-rose-700",
      delay: 0.1,
      span: "lg:col-span-1 lg:row-span-1",
      size: "md",
    },
    {
      href: "/platform",
      icon: Library,
      titleKey: "library" as const,
      descKey: "libraryDesc" as const,
      color: "from-violet-500 to-purple-700",
      delay: 0.15,
      span: "lg:col-span-1 lg:row-span-1",
      size: "md",
    },
    {
      href: "/download",
      icon: Smartphone,
      titleKey: "download" as const,
      descKey: "downloadDesc" as const,
      color: "from-sky-500 to-blue-700",
      delay: 0.2,
      span: "lg:col-span-1 lg:row-span-1",
      size: "md",
    },
    {
      href: "/contact",
      icon: MessageCircle,
      titleKey: "contact" as const,
      descKey: "contactDesc" as const,
      color: "from-teal-500 to-emerald-700",
      delay: 0.25,
      span: "lg:col-span-1 lg:row-span-1",
      size: "md",
    },
  ];

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/20 to-background" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <span className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">
            Alif Baa Campus
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-foreground text-balance">
            {t("title")}
          </h2>
          <p className="mt-3 text-base text-muted-foreground text-pretty">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-3 gap-4 lg:auto-rows-fr lg:h-[640px]">
          {buildings.map((b) => (
            <motion.div
              key={b.href}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: b.delay }}
              className={b.span}
            >
              <Link
                href={b.href}
                className={`group relative block w-full h-full min-h-[200px] lg:min-h-0 overflow-hidden rounded-3xl bg-gradient-to-br ${b.color} p-6 shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1`}
              >
                {/* Decorative grid */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-grid" />
                </div>

                {/* Window pattern */}
                <div className="absolute top-4 end-4 flex gap-1 opacity-50">
                  {[...Array(b.size === "lg" ? 4 : 3)].map((_, i) => (
                    <div key={i} className="h-1 w-1 rounded-full bg-white/40" />
                  ))}
                </div>

                <div className="relative h-full flex flex-col justify-between text-white">
                  <div>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md ring-1 ring-white/20">
                      <b.icon className="h-6 w-6" />
                    </div>
                    <h3
                      className={`mt-4 font-display font-bold ${
                        b.size === "lg" ? "text-2xl lg:text-3xl" : "text-xl"
                      }`}
                    >
                      {t(b.titleKey)}
                    </h3>
                    <p
                      className={`mt-1.5 text-white/80 ${
                        b.size === "lg" ? "text-base lg:text-lg" : "text-sm"
                      } leading-relaxed`}
                    >
                      {t(b.descKey)}
                    </p>
                  </div>

                  <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold opacity-90 group-hover:gap-2.5 transition-all">
                    {t("explore")}
                    <Arrow className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Hover shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
