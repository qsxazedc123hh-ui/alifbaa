"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/site/logo";

interface HeroProps {
  onStart: () => void;
}

/**
 * Hero Section — Mobile First
 * - الشعار
 * - الشعار النصي
 * - جملة تعريف قصيرة
 * - زر «ابدأ الآن» → يفتح قسم تحميل التطبيق
 */
export function Hero({ onStart }: HeroProps) {
  return (
    <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-16 overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 dark:opacity-15"
          style={{ backgroundImage: "url(/brand/campus/hero-bg.png)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-soft/30 via-background to-background" />
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-cyan-brand/10 blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-navy/10 blur-3xl" />
        <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <LogoMark size={80} />
            <motion.div
              animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-2xl border-2 border-cyan-brand"
            />
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-brand/30 bg-cyan-brand/5 px-3.5 py-1.5 text-xs font-semibold text-cyan-brand mb-5"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-brand opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-brand" />
          </span>
          منصة تعليمية عراقية
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="font-display font-extrabold text-3xl sm:text-4xl lg:text-6xl text-foreground text-balance leading-tight"
        >
          تعليم يبدأ من الأساس
          <br />
          <span className="text-cyan-brand">ويصل بك إلى القمة</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-4 text-sm sm:text-base font-semibold text-foreground/80 flex items-center justify-center gap-2 flex-wrap"
        >
          <span>ادرس</span>
          <span className="text-muted-foreground/40">•</span>
          <span>افهم</span>
          <span className="text-muted-foreground/40">•</span>
          <span>نافس</span>
          <span className="text-muted-foreground/40">•</span>
          <span>اربح</span>
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-5 text-sm sm:text-base text-muted-foreground text-pretty max-w-2xl mx-auto leading-relaxed"
        >
          ألف باء منصة تعليمية تجمع بين الشرح الواضح، التفاعل ومتابعة التقدّم — وفق المنهج العراقي.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-3"
        >
          <Button
            onClick={onStart}
            size="lg"
            className="gap-2 shadow-glow h-12 px-6 text-base"
          >
            <Sparkles className="h-4 w-4" />
            ابدأ الآن
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-10 flex items-center justify-center gap-6 sm:gap-10"
        >
          {[
            { value: "٧", label: "صفوف دراسية" },
            { value: "+٣٠", label: "مادة دراسية" },
            { value: "+١٠٠٠", label: "درس مصوّر" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-display font-extrabold text-xl sm:text-2xl lg:text-3xl text-foreground">
                {s.value}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
