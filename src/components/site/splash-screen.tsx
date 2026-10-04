"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogoMark } from "@/components/site/logo";

/**
 * Splash Screen — يظهر عند أول تحميل فقط
 * - شعار ألف باء + Animation أنيق
 * - الشعار النصي: ادرس • افهم • نافس • اربح
 * - لا يمكن تعديله من الإعدادات
 */
const SPLASH_KEY = "alifbaa_splash_seen";
const SPLASH_DURATION = 2200; // ms

export function SplashScreen() {
  const [show, setShow] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(SPLASH_KEY);
    if (!seen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(true);
      // Show welcome after main splash
      const t1 = setTimeout(() => setShowWelcome(true), 1200);
      const t2 = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem(SPLASH_KEY, "1");
      }, SPLASH_DURATION);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden"
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-cyan-brand/10 blur-3xl" />
            <div className="absolute top-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-navy/10 blur-3xl" />
          </div>

          {/* Logo + Animation */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center"
          >
            {/* Logo with cyan glow ring */}
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <LogoMark size={96} />
              </motion.div>
              {/* Pulsing ring */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-2xl border-2 border-cyan-brand"
              />
            </div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-6 font-display font-extrabold text-3xl text-foreground"
            >
              ألف باء
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-1 text-[0.65rem] tracking-[0.3em] text-muted-foreground font-semibold"
            >
              ALIF BAA
            </motion.p>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-5 flex items-center gap-2 text-sm font-semibold text-cyan-brand"
            >
              <span>ادرس</span>
              <span className="text-muted-foreground/40">•</span>
              <span>افهم</span>
              <span className="text-muted-foreground/40">•</span>
              <span>نافس</span>
              <span className="text-muted-foreground/40">•</span>
              <span>اربح</span>
            </motion.div>

            {/* Welcome overlay (first visit only) */}
            <AnimatePresence>
              {showWelcome && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="absolute -bottom-32 whitespace-nowrap text-center"
                >
                  <p className="font-display font-bold text-lg text-foreground">
                    مرحباً بك في ألف باء
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    ادرس • افهم • نافس • اربح
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "120px" }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            className="absolute bottom-20 h-0.5 bg-gradient-to-r from-transparent via-cyan-brand to-transparent rounded-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
