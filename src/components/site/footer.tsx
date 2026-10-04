"use client";

import { Logo } from "./logo";
import { usePublicIdentity } from "@/lib/use-public-identity";
import type { WhatsAppNumber, SocialLink } from "@/lib/types";
import { MessageCircle } from "lucide-react";

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  FACEBOOK: MessageCircle,
  INSTAGRAM: MessageCircle,
  YOUTUBE: MessageCircle,
  TIKTOK: MessageCircle,
};

export function SiteFooter({
  whatsappNumbers,
  socialLinks,
}: {
  whatsappNumbers: WhatsAppNumber[];
  socialLinks: SocialLink[];
}) {
  const { logoLightUrl, logoDarkUrl } = usePublicIdentity();
  // Footer is on a dark gradient background, prefer dark logo
  const logoUrl = logoDarkUrl || logoLightUrl;

  return (
    <footer className="relative mt-24 border-t border-border bg-gradient-to-b from-background to-muted/30">
      <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <Logo logoUrl={logoUrl} />
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
              منصة تعليمية عراقية تجمع الشرح الواضح والتفاعل ومتابعة التقدّم وفق المنهج العراقي.
            </p>
            <p className="mt-4 text-xs tracking-[0.18em] font-semibold text-cyan-brand">
              ادرس • افهم • نافس • اربح
            </p>
          </div>

          {/* WhatsApp numbers */}
          {whatsappNumbers.length > 0 && (
            <div>
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground mb-4">
                تواصل عبر واتساب
              </h3>
              <ul className="space-y-2.5">
                {whatsappNumbers.map((w) => (
                  <li key={w.id}>
                    <a
                      href={`https://wa.me/${w.number.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-cyan-brand transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{w.name}</span>
                      <span dir="ltr" className="text-xs">{w.number}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Social */}
          {socialLinks.length > 0 && (
            <div>
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground mb-4">
                روابطنا
              </h3>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((s) => {
                  const Icon = PLATFORM_ICONS[s.platform] || MessageCircle;
                  return (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.platform}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-cyan-brand hover:border-cyan-brand/30 transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 pt-6 border-t border-border/60 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ألف باء — جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
}
