"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, Eye, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomePage } from "@/components/home/home-page";
import { useAdminNavigation } from "./admin-navigation-context";
import type {
  CampusItem,
  CampusBackground,
  Video,
  News,
  AppLink,
  WhatsAppNumber,
  SocialLink,
} from "@/lib/types";

interface PreviewPageProps {
  campusItems: CampusItem[];
  campusBackground: CampusBackground | null;
  smartBattleVideos: Video[];
  generalVideos: Video[];
  news: News[];
  appLinks: AppLink[];
  whatsappNumbers: WhatsAppNumber[];
  socialLinks: SocialLink[];
  featuredVideos: Video[];
}

/**
 * Preview Page
 *
 * Renders the actual public website (same HomePage component used at "/")
 * inside a "preview" wrapper that adds:
 *   1. A floating "العودة للوحة التحكم" button.
 *   2. The exit returns to the exact admin page the user came from (previewReferrer).
 *   3. No Splash, no LongPressAdmin — pure preview of the public site.
 *
 * The HomePage is rendered with previewMode={true} which disables:
 *   - Splash Screen
 *   - LongPressAdminTrigger
 *   - URL hash management (no pollution of browser history)
 */
export function PreviewPage(props: PreviewPageProps) {
  const router = useRouter();
  const { previewReferrer } = useAdminNavigation();
  const [showExitBanner, setShowExitBanner] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  // Auto-hide the exit banner after 5 seconds, show on scroll up
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY < lastY || currentY < 100) {
        setShowExitBanner(true);
      } else if (currentY > lastY + 50) {
        setShowExitBanner(false);
      }
      setScrolled(currentY > 50);
      lastY = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const timer = setTimeout(() => setShowExitBanner(false), 5000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  const handleExit = useCallback(() => {
    // Return to the exact admin page the user came from.
    // Use sessionStorage referrer set by AdminShell before opening preview.
    const referrer =
      previewReferrer ||
      (typeof window !== "undefined"
        ? sessionStorage.getItem("alifbaa_admin_preview_referrer")
        : null) ||
      "/admin";
    router.push(referrer);
  }, [router, previewReferrer]);

  // ESC key exits preview
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleExit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleExit]);

  return (
    <div className="relative">
      {/* The actual public website — same HomePage component, in preview mode */}
      <HomePage {...props} previewMode={true} />

      {/* Floating Exit Banner — "العودة للوحة التحكم" */}
      <AnimatePresence>
        {showExitBanner && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-3 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-2"
          >
            <div
              className={`flex items-center gap-2 rounded-full px-3 py-2 shadow-card transition-colors ${
                scrolled ? "glass-strong border border-border" : "bg-navy text-navy-foreground"
              }`}
            >
              <Eye className="h-4 w-4 text-cyan-brand" />
              <span className="text-xs font-semibold hidden sm:inline">وضع المعاينة</span>
              <div className="w-px h-4 bg-border/40 mx-1 hidden sm:block" />
              <Button
                onClick={handleExit}
                size="sm"
                className="h-7 gap-1.5 text-xs px-3 rounded-full"
                variant={scrolled ? "default" : "secondary"}
              >
                <ArrowRight className="h-3.5 w-3.5" />
                العودة للوحة التحكم
              </Button>
              <button
                onClick={() => setShowExitBanner(false)}
                className={`p-1 rounded-full hover:bg-foreground/10 transition-colors ${
                  scrolled ? "text-muted-foreground" : "text-white/70"
                }`}
                aria-label="إخفاء"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating re-show button when banner is hidden */}
      <AnimatePresence>
        {!showExitBanner && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setShowExitBanner(true)}
            className="fixed top-3 left-3 z-[90] h-10 w-10 rounded-full bg-navy text-navy-foreground shadow-card flex items-center justify-center hover:scale-110 transition-transform"
            aria-label="إظهار زر العودة"
            title="العودة للوحة التحكم"
          >
            <ArrowRight className="h-4 w-4 text-cyan-brand" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
