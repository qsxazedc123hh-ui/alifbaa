"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Swords,
  Video,
  Newspaper,
  Info,
  Smartphone,
  MessageCircle,
  MoreHorizontal,
  X,
} from "lucide-react";
import type { CampusItem } from "@/lib/types";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  smart_battle: Swords,
  videos: Video,
  news: Newspaper,
  about: Info,
  download: Smartphone,
  contact: MessageCircle,
};

interface BottomNavigationProps {
  items: CampusItem[];
  onNavigate: (sectionKey: string) => void;
}

/**
 * Bottom Navigation (Mobile-First)
 * - يظهر فقط على الموبايل (lg:hidden)
 * - يختفي عند النزول (scroll down) ويظهر عند الصعود (scroll up)
 * - العناصر الثابتة يحددها المدير (inBottomNav=true)
 * - باقي العناصر تذهب لـ «المزيد» → Bottom Sheet
 */
export function BottomNavigation({ items, onNavigate }: BottomNavigationProps) {
  const [visible, setVisible] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      // Hide on scroll down, show on scroll up
      if (delta > 8 && currentY > 200) {
        setVisible(false);
      } else if (delta < -4 || currentY < 100) {
        setVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bottomNavItems = items
    .filter((i) => i.inBottomNav && i.visible)
    .sort((a, b) => a.bottomNavOrder - b.bottomNavOrder)
    .slice(0, 4); // max 4 + more button

  const moreItems = items
    .filter((i) => i.visible && !i.inBottomNav)
    .sort((a, b) => a.order - b.order);

  const handleNavigate = (sectionKey: string | null) => {
    if (!sectionKey) return;
    onNavigate(sectionKey);
    setMoreOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.nav
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden fixed bottom-0 inset-x-0 z-40 pb-[env(safe-area-inset-bottom)]"
          >
            <div className="mx-3 mb-3 glass-strong rounded-2xl border border-border/60 shadow-card">
              <div className="flex items-center justify-around p-1.5">
                {bottomNavItems.map((item) => {
                  const Icon = ICONS[item.iconKey || ""] || Video;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.sectionKey)}
                      className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-cyan-brand/10 active:scale-95 transition-all min-w-[56px]"
                    >
                      <Icon className="h-5 w-5 text-foreground/80" />
                      <span className="text-[10px] font-semibold text-foreground/70 truncate max-w-[64px]">
                        {item.label}
                      </span>
                    </button>
                  );
                })}

                {/* More button */}
                {moreItems.length > 0 && (
                  <button
                    onClick={() => setMoreOpen(true)}
                    className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-cyan-brand/10 active:scale-95 transition-all min-w-[56px]"
                  >
                    <MoreHorizontal className="h-5 w-5 text-foreground/80" />
                    <span className="text-[10px] font-semibold text-foreground/70">المزيد</span>
                  </button>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* More — Bottom Sheet */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden fixed bottom-0 inset-x-0 z-50 rounded-t-3xl bg-card border-t border-border shadow-card pb-[env(safe-area-inset-bottom)]"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-display font-bold text-base">المزيد</h3>
                <button
                  onClick={() => setMoreOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 grid grid-cols-3 gap-3">
                {moreItems.map((item) => {
                  const Icon = ICONS[item.iconKey || ""] || Video;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.sectionKey)}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-cyan-brand/10 active:scale-95 transition-all"
                    >
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-navy to-navy-deep text-navy-foreground flex items-center justify-center">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-semibold text-foreground text-center">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
