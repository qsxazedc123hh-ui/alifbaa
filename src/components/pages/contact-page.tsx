"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { MessageCircle, Phone, Mail, Send, Facebook, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function ContactPage({ contact }: { contact: Record<string, string> }) {
  const t = useTranslations("contact");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const whatsapp = contact.whatsapp;
  const waLink = whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}` : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (waLink && message) {
      const text = encodeURIComponent(`${name ? `(${name}) ` : ""}${message}`);
      window.open(`${waLink}?text=${text}`, "_blank");
    }
  };

  return (
    <>
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-soft/40 to-background" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">
            Contact
          </span>
          <h1 className="font-display font-extrabold text-4xl lg:text-5xl">{t("title")}</h1>
          <p className="mt-3 text-base text-muted-foreground">{t("subtitle")}</p>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact info */}
          <div>
            <h2 className="font-display font-bold text-xl mb-4">{t("sendMessage")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {waLink && <ContactCard icon={MessageCircle} label="WhatsApp" value={contact.whatsapp} href={waLink} />}
              {contact.phone && <ContactCard icon={Phone} label={t("phone")} value={contact.phone} href={`tel:${contact.phone}`} />}
              {contact.email && <ContactCard icon={Mail} label={t("email")} value={contact.email} href={`mailto:${contact.email}`} />}
              {contact.telegram && <ContactCard icon={Send} label="Telegram" value={contact.telegram} href={contact.telegram} />}
            </div>

            {waLink && (
              <Button asChild size="lg" className="mt-6 gap-2 w-full">
                <a href={waLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" />
                  {t("whatsapp")}
                </a>
              </Button>
            )}

            {/* Social */}
            {(contact.facebook || contact.instagram || contact.youtube) && (
              <div className="mt-8">
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                  {t("followUs")}
                </h3>
                <div className="flex gap-2">
                  {contact.facebook && <Social href={contact.facebook} icon={Facebook} label="Facebook" />}
                  {contact.instagram && <Social href={contact.instagram} icon={Instagram} label="Instagram" />}
                  {contact.youtube && <Social href={contact.youtube} icon={Youtube} label="YouTube" />}
                  {contact.telegram && <Social href={contact.telegram} icon={Send} label="Telegram" />}
                </div>
              </div>
            )}
          </div>

          {/* Message form */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border border-border bg-card p-6 lg:p-8 shadow-soft"
          >
            <h2 className="font-display font-bold text-xl mb-4">{t("sendMessage")}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">{t("name")}</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder={t("name")} />
              </div>
              <div>
                <Label htmlFor="message">{t("message")}</Label>
                <Textarea id="message" value={message} onChange={e => setMessage(e.target.value)} placeholder={t("message")} rows={5} required />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={!message}>
                <Send className="h-4 w-4" />
                {t("send")}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                سيتم فتح واتساب لإرسال رسالتك مباشرة.
              </p>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  );
}

function ContactCard({ icon: Icon, label, value, href }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; href: string }) {
  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="group rounded-2xl border border-border bg-card p-4 shadow-soft hover:shadow-card hover:border-primary/30 transition-all">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors" dir="ltr">{value}</div>
    </a>
  );
}

function Social({ href, icon: Icon, label }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors">
      <Icon className="h-4 w-4" />
    </a>
  );
}
