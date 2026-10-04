"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Building2,
  Video,
  Newspaper,
  Swords,
  Smartphone,
  MessageCircle,
  Share2,
  Mail,
  Trash2,
  Shield,
  ArrowRight,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { LogoMark } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/admin/identity", label: "الهوية", icon: ImageIcon },
  { href: "/admin/campus", label: "Campus", icon: Building2 },
  { href: "/admin/videos", label: "الفيديوهات", icon: Video },
  { href: "/admin/news", label: "الأخبار", icon: Newspaper },
  { href: "/admin/smart-battle", label: "صراع الأذكياء", icon: Swords },
  { href: "/admin/download", label: "تحميل التطبيق", icon: Smartphone },
  { href: "/admin/whatsapp", label: "واتساب", icon: MessageCircle },
  { href: "/admin/social", label: "روابط التواصل", icon: Share2 },
  { href: "/admin/messages", label: "الرسائل", icon: Mail },
  { href: "/admin/trash", label: "المحذوفات", icon: Trash2 },
  { href: "/admin/security", label: "الأمان", icon: Shield },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/verify", { credentials: "include" })
      .then((r) => {
        if (!r.ok) {
          router.replace("/");
          setAuthed(false);
        } else {
          setAuthed(true);
        }
      })
      .catch(() => {
        router.replace("/");
        setAuthed(false);
      });
  }, [router]);

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <LogoMark size={48} />
          <div className="h-1 w-32 bg-muted rounded-full overflow-hidden">
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-1/2 bg-cyan-brand"
            />
          </div>
        </div>
      </div>
    );
  }
  if (!authed) return null;

  const logout = async () => {
    document.cookie = "alifbaa_admin_token=; path=/; max-age=0";
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 z-50 w-[240px] flex flex-col bg-sidebar border-s border-sidebar-border transition-transform duration-300 start-0",
          mobileOpen ? "translate-x-0" : "rtl:translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-16 lg:h-20 flex items-center justify-between px-4 border-b border-sidebar-border">
          <Link href="/admin" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
            <LogoMark size={36} />
            <div>
              <div className="font-display font-extrabold text-sm">ألف باء</div>
              <div className="text-[10px] tracking-[0.18em] text-muted-foreground font-medium">CONTROL CENTER</div>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 h-7 w-7"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-cyan-brand/10 text-cyan-brand"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            <span>معاينة الموقع</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:ms-[240px]">
        <header className="sticky top-0 z-30 h-14 lg:h-16 glass-strong border-b border-border flex items-center justify-between px-4 lg:px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-display font-bold text-sm lg:text-base">لوحة تحكم ألف باء</h1>
          <div className="w-9 lg:w-0" />
        </header>

        <main className="p-4 lg:p-6 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
