"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SplashScreen } from "@/components/site/splash-screen";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { BottomNavigation } from "@/components/site/bottom-navigation";
import { LongPressAdminTrigger } from "@/components/site/long-press-admin";
import { Hero } from "@/components/sections/hero";
import { Campus } from "@/components/sections/campus";
import { SmartBattle } from "@/components/sections/smart-battle";
import { Videos } from "@/components/sections/videos";
import { NewsSection } from "@/components/sections/news";
import { About } from "@/components/sections/about";
import { Download } from "@/components/sections/download";
import { Contact } from "@/components/sections/contact";
import type {
  CampusItem,
  CampusBackground,
  Video,
  News,
  AppLink,
  WhatsAppNumber,
  SocialLink,
} from "@/lib/types";

type SectionKey =
  | "campus"
  | "smart_battle"
  | "videos"
  | "news"
  | "about"
  | "download"
  | "contact";

interface HomePageProps {
  campusItems: CampusItem[];
  campusBackground: CampusBackground | null;
  smartBattleVideos: Video[];
  generalVideos: Video[];
  news: News[];
  appLinks: AppLink[];
  whatsappNumbers: WhatsAppNumber[];
  socialLinks: SocialLink[];
  featuredVideos: Video[];
  /** Preview mode — disables Splash, LongPressAdmin, and URL hash management */
  previewMode?: boolean;
}

export function HomePage({
  campusItems,
  campusBackground,
  smartBattleVideos,
  generalVideos,
  news,
  appLinks,
  whatsappNumbers,
  socialLinks,
  featuredVideos,
  previewMode = false,
}: HomePageProps) {
  const [activeSection, setActiveSection] = useState<SectionKey>("campus");

  // One Page Navigation — smooth scroll + section switching
  const navigateTo = useCallback((section: SectionKey) => {
    setActiveSection(section);
    // Smooth scroll to top of main content
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleStart = useCallback(() => {
    navigateTo("download");
  }, [navigateTo]);

  // Listen to hash changes for back button behavior (skip in preview mode)
  useEffect(() => {
    if (previewMode) return;
    const onPop = () => {
      const hash = window.location.hash.replace("#", "") as SectionKey;
      if (hash && ["campus", "smart_battle", "videos", "news", "about", "download", "contact"].includes(hash)) {
        setActiveSection(hash);
      } else {
        setActiveSection("campus");
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [previewMode]);

  // Update URL hash when section changes (for back button) — skip in preview
  useEffect(() => {
    if (previewMode) return;
    if (activeSection !== "campus") {
      window.history.pushState(null, "", `#${activeSection}`);
    } else if (window.location.hash) {
      window.history.pushState(null, "", window.location.pathname);
    }
  }, [activeSection, previewMode]);

  return (
    <>
      {/* Splash + LongPress admin only on public site, NOT in preview */}
      {!previewMode && <SplashScreen />}
      {!previewMode && <LongPressAdminTrigger />}
      <SiteHeader />

      <main className="min-h-screen">
        <AnimatePresence mode="wait">
          {activeSection === "campus" && (
            <motion.div
              key="campus"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Hero onStart={handleStart} />
              <Campus
                items={campusItems}
                background={campusBackground}
                onNavigate={(key) => navigateTo(key as SectionKey)}
              />

              {/* Featured Videos Preview */}
              {featuredVideos.length > 0 && (
                <section className="py-12 lg:py-16">
                  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="font-display font-extrabold text-xl sm:text-2xl">مختارات من الفيديوهات</h2>
                      <button
                        onClick={() => navigateTo("videos")}
                        className="text-xs font-semibold text-cyan-brand hover:underline"
                      >
                        عرض الكل
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {featuredVideos.slice(0, 4).map((v) => (
                        <button
                          key={v.id}
                          onClick={() => navigateTo("videos")}
                          className="group relative aspect-[9/16] rounded-xl overflow-hidden bg-muted"
                        >
                          {v.thumbnailUrl && (
                            <img src={v.thumbnailUrl} alt={v.title} className="absolute inset-0 h-full w-full object-cover" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                          <p className="absolute bottom-2 inset-x-2 text-white text-[11px] font-semibold line-clamp-2">{v.title}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Featured News Preview */}
              {news.filter((n) => n.featured).length > 0 && (
                <section className="py-12 lg:py-16 bg-muted/20">
                  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="font-display font-extrabold text-xl sm:text-2xl">مختارات من الأخبار</h2>
                      <button
                        onClick={() => navigateTo("news")}
                        className="text-xs font-semibold text-cyan-brand hover:underline"
                      >
                        عرض الكل
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {news.filter((n) => n.featured).slice(0, 3).map((n) => (
                        <button
                          key={n.id}
                          onClick={() => navigateTo("news")}
                          className="group rounded-2xl overflow-hidden border border-border bg-card shadow-soft hover:shadow-card transition-all text-start"
                        >
                          {n.imageUrl && (
                            <div className="aspect-[16/10] bg-muted overflow-hidden">
                              <img src={n.imageUrl} alt={n.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                            </div>
                          )}
                          <div className="p-3">
                            <h3 className="font-display font-bold text-sm line-clamp-2">{n.title}</h3>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              <SiteFooter whatsappNumbers={whatsappNumbers} socialLinks={socialLinks} />
            </motion.div>
          )}

          {activeSection === "smart_battle" && (
            <motion.div
              key="smart_battle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SmartBattle videos={smartBattleVideos} onBack={() => navigateTo("campus")} />
            </motion.div>
          )}

          {activeSection === "videos" && (
            <motion.div
              key="videos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Videos videos={generalVideos} onBack={() => navigateTo("campus")} />
            </motion.div>
          )}

          {activeSection === "news" && (
            <motion.div
              key="news"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <NewsSection news={news} onBack={() => navigateTo("campus")} />
            </motion.div>
          )}

          {activeSection === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <About onBack={() => navigateTo("campus")} />
            </motion.div>
          )}

          {activeSection === "download" && (
            <motion.div
              key="download"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Download appLinks={appLinks} onBack={() => navigateTo("campus")} />
            </motion.div>
          )}

          {activeSection === "contact" && (
            <motion.div
              key="contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Contact
                whatsappNumbers={whatsappNumbers}
                socialLinks={socialLinks}
                onBack={() => navigateTo("campus")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation — Mobile only */}
      <BottomNavigation items={campusItems} onNavigate={(key) => navigateTo(key as SectionKey)} />
    </>
  );
}
