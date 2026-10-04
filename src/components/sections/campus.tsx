"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Swords,
  Video,
  Newspaper,
  Info,
  Smartphone,
  MessageCircle,
} from "lucide-react";
import type { CampusItem, CampusBackground } from "@/lib/types";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  smart_battle: Swords,
  videos: Video,
  news: Newspaper,
  about: Info,
  download: Smartphone,
  contact: MessageCircle,
};

const COLORS: Record<string, string> = {
  smart_battle: "from-rose-500 to-rose-700",
  videos: "from-sky-500 to-blue-700",
  news: "from-gold to-amber-700",
  about: "from-violet-500 to-purple-700",
  download: "from-teal-500 to-emerald-700",
  contact: "from-cyan-500 to-blue-700",
};

interface CampusProps {
  items: CampusItem[];
  background: CampusBackground | null;
  onNavigate: (sectionKey: string) => void;
}

/**
 * Alif Baa Campus — العنصر البصري الرئيسي
 * - مدرسة حديثة واقعية (background image)
 * - أيقونات تفاعلية فوق الخلفية
 * - light sweep effect عند الظهور
 * - Mobile-First: شبكة منظمة على الموبايل
 */
export function Campus({ items, background, onNavigate }: CampusProps) {
  const visibleItems = items.filter((i) => i.visible).sort((a, b) => a.order - b.order);

  return (
    <section id="campus" className="relative min-h-screen pt-20 lg:pt-24 overflow-hidden">
      {/* Background: campus image with subtle overlays */}
      <div className="absolute inset-0">
        {background?.url && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60 dark:opacity-40"
            style={{ backgroundImage: `url(${background.url})` }}
          />
        )}
        {/* Gradient fade for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/40 to-background" />
        {/* Cyan + Navy glows */}
        <div className="absolute top-1/4 right-0 h-[400px] w-[400px] rounded-full bg-cyan-brand/15 blur-3xl" />
        <div className="absolute bottom-1/4 left-0 h-[400px] w-[400px] rounded-full bg-navy/15 blur-3xl" />
      </div>

      {/* Light sweep effect — passes once on mount */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{ duration: 1.8, ease: "easeInOut", delay: 0.3 }}
        className="absolute top-0 bottom-0 w-1/3 pointer-events-none z-10"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.15), transparent)",
          filter: "blur(20px)",
        }}
      />

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center max-w-2xl mx-auto mb-10 lg:mb-14"
        >
          <span className="inline-block text-xs font-bold tracking-[0.2em] text-cyan-brand uppercase mb-3">
            Alif Baa Campus
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-foreground text-balance">
            حرم ألف باء
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground text-pretty">
            تجربة تعليمية متكاملة في مكان واحد — اختر القسم لتبدأ
          </p>
        </motion.div>

        {/* Campus items grid — Mobile First */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 max-w-4xl mx-auto">
          {visibleItems.map((item, idx) => {
            const Icon = ICONS[item.iconKey || ""];
            const colorClass = COLORS[item.iconKey || ""] || "from-navy to-navy-deep";
            return (
              <motion.button
                key={item.id}
                onClick={() => item.sectionKey && onNavigate(item.sectionKey)}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 + idx * 0.06 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden rounded-2xl bg-card/80 backdrop-blur-sm border border-border/60 shadow-soft hover:shadow-card transition-all p-4 sm:p-5 lg:p-6 text-center"
              >
                {/* Icon */}
                <div
                  className={`mx-auto inline-flex h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${colorClass} text-white shadow-md mb-3 group-hover:scale-110 transition-transform`}
                >
                  {Icon ? <Icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" /> : <Video className="h-5 w-5" />}
                </div>

                {/* Label */}
                <h3 className="font-display font-bold text-sm sm:text-base text-foreground">
                  {item.label}
                </h3>

                {/* Hover shine */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-cyan-brand/10 to-transparent pointer-events-none" />
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
