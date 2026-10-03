import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Facebook, Instagram, Youtube, Send, Phone, Mail, MessageCircle } from "lucide-react";
import { Logo } from "./logo";
import { db } from "@/lib/db";

async function getContactLinks() {
  try {
    const items = await db.contactSetting.findMany({
      where: { visible: true },
    });
    const map: Record<string, string> = {};
    for (const c of items) map[c.key] = c.value;
    return map;
  } catch {
    return {} as Record<string, string>;
  }
}

export async function SiteFooter() {
  const t = await getTranslations("nav");
  const tFooter = await getTranslations("footer");
  const tCommon = await getTranslations("common");
  const contact = await getContactLinks();

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/platform", label: t("platform") },
    { href: "/classes", label: t("classes") },
    { href: "/smart-battle", label: t("smartBattle") },
    { href: "/videos", label: t("videos") },
    { href: "/download", label: t("download") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <footer className="relative mt-24 border-t border-border bg-gradient-to-b from-background to-muted/30">
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Logo href="/" />
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
              {tFooter("about")}
            </p>
            <p className="mt-4 text-xs tracking-[0.18em] font-semibold text-primary">
              {tCommon("siteTagline")}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground mb-4">
              {tFooter("quickLinks")}
            </h3>
            <ul className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground mb-4">
              {tFooter("connect")}
            </h3>
            <ul className="space-y-2.5">
              {contact.whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp</span>
                  </a>
                </li>
              )}
              {contact.phone && (
                <li>
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    <span dir="ltr">{contact.phone}</span>
                  </a>
                </li>
              )}
              {contact.email && (
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    <span dir="ltr">{contact.email}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-foreground mb-4">
              {tFooter("connect")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {contact.facebook && (
                <SocialButton href={contact.facebook} label="Facebook">
                  <Facebook className="h-4 w-4" />
                </SocialButton>
              )}
              {contact.instagram && (
                <SocialButton href={contact.instagram} label="Instagram">
                  <Instagram className="h-4 w-4" />
                </SocialButton>
              )}
              {contact.youtube && (
                <SocialButton href={contact.youtube} label="YouTube">
                  <Youtube className="h-4 w-4" />
                </SocialButton>
              )}
              {contact.telegram && (
                <SocialButton href={contact.telegram} label="Telegram">
                  <Send className="h-4 w-4" />
                </SocialButton>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {tCommon("siteName")} — {tFooter("rights")}.
          </p>
          <p className="text-xs text-muted-foreground/70">{tFooter("madeWith")}</p>
        </div>
      </div>
    </footer>
  );
}

function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
    >
      {children}
    </a>
  );
}
