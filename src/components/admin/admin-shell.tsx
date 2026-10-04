"use client";

import { useState, useEffect, useCallback } from "react";
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
  Eye,
} from "lucide-react";
import { LogoMark } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AdminNavigationProvider,
  useAdminNavigation,
} from "./admin-navigation-context";

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

const SECTION_TITLES: Record<string, string> = {
  "/admin": "الرئيسية",
  "/admin/identity": "الهوية",
  "/admin/campus": "Campus",
  "/admin/videos": "الفيديوهات",
  "/admin/news": "الأخبار",
  "/admin/smart-battle": "صراع الأذكياء",
  "/admin/download": "تحميل التطبيق",
  "/admin/whatsapp": "واتساب",
  "/admin/social": "روابط التواصل",
  "/admin/messages": "الرسائل",
  "/admin/trash": "المحذوفات",
  "/admin/security": "الأمان",
};

function AdminShellInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { pushPath, goBack, setPreviewReferrer, canGoBack } = useAdminNavigation();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Verify auth on mount and on route change
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

  // Track navigation — push each admin path to the navigation context
  useEffect(() => {
    if (authed && pathname && pathname.startsWith("/admin") && pathname !== "/admin/preview") {
      pushPath(pathname);
    }
  }, [pathname, authed, pushPath]);

  // Close mobile drawer on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  // ESC key closes mobile drawer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleOpenPreview = useCallback(() => {
    // Save current admin path as referrer so preview can return to it
    if (pathname && pathname.startsWith("/admin") && pathname !== "/admin/preview") {
      setPreviewReferrer(pathname);
    } else {
      setPreviewReferrer("/admin");
    }
    router.push("/admin/preview");
  }, [pathname, setPreviewReferrer, router]);

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

  const currentTitle = SECTION_TITLES[pathname] || "لوحة التحكم";
  const isDashboard = pathname === "/admin";

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
          {/* Preview Mode button — opens /admin/preview with referrer tracking */}
          <button
            onClick={handleOpenPreview}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-cyan-brand hover:bg-cyan-brand/10 transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>معاينة الموقع</span>
          </button>
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
        <header className="sticky top-0 z-30 h-14 lg:h-16 glass-strong border-b border-border flex items-center justify-between px-4 lg:px-6 gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 shrink-0"
              aria-label="القائمة"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Back button — visible on all admin pages except Dashboard.
                Uses navigation context to return to last admin page. */}
            {!isDashboard && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                disabled={!canGoBack}
                className="gap-1.5 shrink-0 hover:bg-muted"
                aria-label="رجوع"
                title={canGoBack ? "الرجوع للصفحة السابقة" : "لا يوجد سابق"}
              >
                <ArrowRight className="h-4 w-4" />
                <span className="hidden sm:inline">رجوع</span>
              </Button>
            )}

            <h1 className="font-display font-bold text-sm lg:text-base truncate">{currentTitle}</h1>
          </div>

          {/* Preview button in topbar (always visible) */}
          <Button
            onClick={handleOpenPreview}
            variant="outline"
            size="sm"
            className="gap-1.5 shrink-0"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">معاينة الموقع</span>
          </Button>
        </header>

        <main className="p-4 lg:p-6 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}

/**
 * AdminShell — wraps admin pages with navigation context, sidebar, and auth guard.
 * Use this as the outermost wrapper for any /admin/* page.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminNavigationProvider>
      <AdminShellInner>{children}</AdminShellInner>
    </AdminNavigationProvider>
  );
}
