"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const LONG_PRESS_DURATION = 800; // ms

/**
 * LongPressAdminTrigger
 * - الضغط المطوّل على أي مكان في الصفحة يفتح نافذة دخول الإعدادات
 * - Password only
 * - لا يظهر زر إعدادات واضح للمستخدم العادي
 * - fallback: زر مخفي صغير في الزاوية
 */
export function LongPressAdminTrigger() {
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  const startPress = () => {
    pressTimer.current = setTimeout(() => {
      setShowModal(true);
    }, LONG_PRESS_DURATION);
  };

  const cancelPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  useEffect(() => {
    // Listen on document for long-press (mobile + desktop)
    const onStart = (e: TouchEvent | MouseEvent) => {
      // Ignore clicks on interactive elements (buttons, links, inputs)
      const target = e.target as HTMLElement;
      if (target.closest("button, a, input, textarea, select, [role='button'], nav, header")) {
        return;
      }
      startPress();
    };
    const onEnd = cancelPress;
    const onMove = cancelPress;

    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchend", onEnd);
    document.addEventListener("touchmove", onMove, { passive: true });
    document.addEventListener("mousedown", onStart);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("mousemove", onMove);

    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("mousedown", onStart);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("mousemove", onMove);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/password-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error(data.error || "كلمة المرور غير صحيحة");
        return;
      }
      toast.success("تم تسجيل الدخول");
      setShowModal(false);
      setPassword("");
      router.push("/admin");
    } catch {
      toast.error("فشل الاتصال");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hidden admin trigger — invisible dot in corner for accessibility */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-2 left-2 z-30 h-6 w-6 rounded-full opacity-0 hover:opacity-100 transition-opacity"
        aria-label="إعدادات الموقع"
        title="إعدادات الموقع"
      />

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-card"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-navy to-navy-deep text-navy-foreground flex items-center justify-center">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-base">دخول إعدادات الموقع</h2>
                    <p className="text-[11px] text-muted-foreground">للمدير فقط</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="password" className="text-xs">كلمة المرور</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                    className="mt-1.5 h-11"
                    placeholder="••••••••"
                  />
                </div>
                <Button type="submit" disabled={loading || !password} className="w-full h-11 gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      جاري التحقق...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      دخول
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
