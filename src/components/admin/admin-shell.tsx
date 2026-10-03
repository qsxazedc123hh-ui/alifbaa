"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Home,
  Palette,
  Building2,
  BookOpen,
  Swords,
  Video,
  Smartphone,
  Image,
  Phone,
  Search,
  Menu,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
} from "lucide-react";
import { LogoMark } from "@/components/site/logo";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  href: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CONTENT_NAV: NavItem[] = [
  { href: "/admin/homepage", labelKey: "homepage", icon: Home },
  { href: "/admin/brand", labelKey: "brand", icon: Palette },
  { href: "/admin/campus", labelKey: "campus", icon: Building2 },
  { href: "/admin/classes", labelKey: "classes", icon: BookOpen },
  { href: "/admin/smart-battle", labelKey: "smartBattle", icon: Swords },
  { href: "/admin/videos", labelKey: "videos", icon: Video },
  { href: "/admin/app-downloads", labelKey: "appDownloads", icon: Smartphone },
  { href: "/admin/media", labelKey: "media", icon: Image },
];

const SYSTEM_NAV: NavItem[] = [
  { href: "/admin/contact", labelKey: "contact", icon: Phone },
  { href: "/admin/seo", labelKey: "seo", icon: Search },
  { href: "/admin/navigation", labelKey: "navigation", icon: Menu },
  { href: "/admin/settings", labelKey: "settings", icon: Settings },
];

function NavGroup({
  title,
  items,
  collapsed,
  pathname,
  onNavigate,
  t,
}: {
  title: string;
  items: NavItem[];
  collapsed: boolean;
  pathname: string | null;
  onNavigate: () => void;
  t: (key: never) => string;
}) {
  return (
    <div className="space-y-1">
      <p className={cn("px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-2", collapsed && "text-center")}>
        {collapsed ? "•" : title}
      </p>
      {items.map(item => {
        const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? t(item.labelKey as never) : undefined}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="truncate">{t(item.labelKey as never)}</span>}
            {isActive && !collapsed && (
              <span className="ms-auto h-1.5 w-1.5 rounded-full bg-primary" />
            )}
          </Link>
        );
      })}
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations("admin.sidebar");
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace(`/admin/login?callbackUrl=${encodeURIComponent(pathname || "/admin")}`);
    }
  }, [session, status, router, pathname]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <LogoMark size={48} />
          <div className="h-1 w-32 bg-muted rounded-full overflow-hidden">
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-1/2 bg-primary"
            />
          </div>
          <p className="text-xs text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const backLabel = t("backToSite" as never);

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 z-50 flex flex-col bg-sidebar border-s border-sidebar-border transition-all duration-300",
          collapsed ? "w-[72px]" : "w-[260px]",
          "start-0 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand */}
        <div className="h-16 lg:h-20 flex items-center justify-between gap-2 px-4 border-b border-sidebar-border">
          <Link href="/admin" className="flex items-center gap-2.5 min-w-0">
            <LogoMark size={36} />
            {!collapsed && (
              <div className="min-w-0">
                <div className="font-display font-extrabold text-sm truncate">ألف باء</div>
                <div className="text-[10px] tracking-[0.18em] text-muted-foreground font-medium">ADMIN PANEL</div>
              </div>
            )}
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(v => !v)}
            className="hidden lg:inline-flex p-1 h-7 w-7"
          >
            {collapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
          {/* Dashboard */}
          <div className="space-y-1">
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === "/admin"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? t("dashboard" as never) : undefined}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{t("dashboard" as never)}</span>}
            </Link>
          </div>

          <NavGroup
            title={t("content" as never)}
            items={CONTENT_NAV}
            collapsed={collapsed}
            pathname={pathname}
            onNavigate={() => setMobileOpen(false)}
            t={t as unknown as (key: never) => string}
          />
          <NavGroup
            title={t("system" as never)}
            items={SYSTEM_NAV}
            collapsed={collapsed}
            pathname={pathname}
            onNavigate={() => setMobileOpen(false)}
            t={t as unknown as (key: never) => string}
          />
        </nav>

        {/* User */}
        <div className="border-t border-sidebar-border p-3">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand to-forest text-white flex items-center justify-center font-bold text-xs shrink-0">
              {session.user?.name?.[0] || "A"}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold truncate">{session.user?.name}</div>
                <div className="text-[10px] text-muted-foreground truncate">{session.user?.email}</div>
              </div>
            )}
            {!collapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="p-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                title={t("logout" as never)}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className={cn("transition-all duration-300", collapsed ? "lg:ms-[72px]" : "lg:ms-[260px]")}>
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 lg:h-20 glass-strong border-b border-border flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" target="_blank" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              ← {backLabel}
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </header>

        <main className="p-4 lg:p-6 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
