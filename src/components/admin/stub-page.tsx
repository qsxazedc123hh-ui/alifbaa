"use client";

import { motion } from "framer-motion";
import { Sparkles, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StubPageProps {
  title: string;
  subtitle: string;
  description: string;
  nextPhase: string[];
}

export function StubPage({ title, subtitle, description, nextPhase }: StubPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl lg:text-3xl">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="p-8 lg:p-12">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-forest text-white shadow-glow mb-5">
              <Sparkles className="h-8 w-8" />
            </div>
            <h2 className="font-display font-bold text-xl mb-3">قيد التطوير — المرحلة القادمة</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{description}</p>

            <div className="w-full rounded-2xl bg-muted/40 border border-border p-5 text-start">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">ما الذي سيتم تنفيذه:</h3>
              </div>
              <ul className="space-y-2">
                {nextPhase.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>البنية الأساسية موجودة في قاعدة البيانات</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
