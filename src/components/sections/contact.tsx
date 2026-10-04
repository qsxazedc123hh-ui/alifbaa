"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Send, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { WhatsAppNumber, SocialLink } from "@/lib/types";

interface ContactProps {
  whatsappNumbers: WhatsAppNumber[];
  socialLinks: SocialLink[];
  onBack: () => void;
}

export function Contact({ whatsappNumbers, socialLinks, onBack }: ContactProps) {
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("تم إرسال رسالتك بنجاح");
      setForm({ name: "", contact: "", message: "" });
    } catch {
      toast.error("فشل الإرسال");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="min-h-screen pt-20 lg:pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-foreground">تواصل معنا</h2>
            <p className="mt-1 text-sm text-muted-foreground">نحن هنا للإجابة على أسئلتك</p>
          </div>
          <Button onClick={onBack} variant="outline" size="sm" className="gap-2 shrink-0">
            <ArrowRight className="h-4 w-4" />
            رجوع
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* WhatsApp + Social */}
          <div className="space-y-4">
            {whatsappNumbers.length > 0 && (
              <div>
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">واتساب</h3>
                <div className="space-y-2">
                  {whatsappNumbers.map((w) => (
                    <a
                      key={w.id}
                      href={`https://wa.me/${w.number.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft hover:shadow-card hover:border-cyan-brand/30 transition-all"
                    >
                      <div className="h-10 w-10 rounded-xl bg-cyan-brand/10 text-cyan-brand flex items-center justify-center">
                        <MessageCircle className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">{w.name}</div>
                        <div className="text-xs text-muted-foreground" dir="ltr">{w.number}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {socialLinks.length > 0 && (
              <div>
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">روابطنا</h3>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm hover:border-cyan-brand/30 hover:bg-cyan-brand/5 transition-all"
                    >
                      <span className="font-semibold">{s.platform}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-border bg-card p-5 sm:p-6 lg:p-8 shadow-soft"
          >
            <h3 className="font-display font-bold text-lg mb-4">إرسال رسالة</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-xs flex items-center gap-1.5">
                  <User className="h-3 w-3" /> الاسم
                </Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="mt-1.5 h-11"
                />
              </div>
              <div>
                <Label htmlFor="contact" className="text-xs flex items-center gap-1.5">
                  <Phone className="h-3 w-3" /> رقم الهاتف أو البريد
                </Label>
                <Input
                  id="contact"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  required
                  className="mt-1.5 h-11"
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-xs flex items-center gap-1.5">
                  <MessageCircle className="h-3 w-3" /> الرسالة
                </Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={4}
                  className="mt-1.5"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-11 gap-2">
                {loading ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    إرسال
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
