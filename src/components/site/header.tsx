"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";

/**
 * Site Header — رسمي + Mobile-First
 * - شعار ألف باء + الاسم + الشعار النصي
 * - لا يوجد زر لغة (العربية فقط)
 * - لا يوجد Profile/Avatar
 * - لا يوجد Theme Toggle ظاهر (يتبع إعداد الجهاز)
 * - على الموبايل: تصغير ذكي بدون ازدحام
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled
          ? "glass-strong border-b border-border/60 shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 lg:h-20 items-center justify-between gap-3">
          {/* Logo + Name + Tagline */}
          <Logo href="#campus" showWordmark={true} />

          {/* Tagline (desktop only — hidden on mobile to avoid clutter) */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-cyan-brand tracking-wide">
            <span>ادرس</span>
            <span className="text-muted-foreground/40">•</span>
            <span>افهم</span>
            <span className="text-muted-foreground/40">•</span>
            <span>نافس</span>
            <span className="text-muted-foreground/40">•</span>
            <span>اربح</span>
          </div>

          {/* Empty right side for spacing symmetry */}
          <div className="w-8 lg:w-32" />
        </div>
      </div>
    </header>
  );
}
