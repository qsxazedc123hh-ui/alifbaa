"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { MessageCircle, Phone, Mail, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactSection({
  contact,
}: {
  contact: Record<string, string>;
}) {
  const t = useTranslations("contact");
  const locale = useLocale() as "ar" | "en";
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  const whatsapp = contact.whatsapp;
  const waLink = whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}` : null;

  return (
    <section className="relative py-20 lg:py-28 bg-muted/20">
      <div className="absolute inset-0 bg-dots opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">
              Contact
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-foreground text-balance">
              {t("title")}
            </h2>
            <p className="mt-3 text-base text-muted-foreground text-pretty">
              {t("subtitle")}
            </p>

            <div className="mt-7 space-y-3">
              {waLink && (
                <Button asChild size="lg" className="gap-2 w-full sm:w-auto">
                  <a href={waLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5" />
                    {t("whatsapp")}
                  </a>
                </Button>
              )}
              <Button asChild variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                <Link href="/contact">
                  {t("sendMessage")}
                  <Arrow className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {contact.phone && (
              <ContactCard icon={Phone} label={t("phone")} value={contact.phone} href={`tel:${contact.phone}`} />
            )}
            {contact.email && (
              <ContactCard icon={Mail} label={t("email")} value={contact.email} href={`mailto:${contact.email}`} />
            )}
            {waLink && (
              <ContactCard icon={MessageCircle} label="WhatsApp" value={contact.whatsapp} href={waLink} />
            )}
            {contact.telegram && (
              <ContactCard icon={MessageCircle} label="Telegram" value={contact.telegram} href={contact.telegram} />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="group rounded-2xl border border-border bg-card p-4 shadow-soft hover:shadow-card hover:border-primary/30 transition-all"
    >
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors" dir="ltr">
        {value}
      </div>
    </a>
  );
}
