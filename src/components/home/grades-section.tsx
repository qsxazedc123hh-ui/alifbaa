"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GradesSectionProps {
  grades: Array<{
    id: string;
    slug: string;
    nameAr: string;
    nameEn: string;
    descriptionAr: string | null;
    descriptionEn: string | null;
    coverMediaId: string | null;
    icon: string | null;
    _count: { subjects: number };
  }>;
  locale: "ar" | "en";
}

const FALLBACK_GRADES = [
  { slug: "grade-5", nameAr: "الصف الخامس الابتدائي", nameEn: "Grade 5 Primary", icon: "📚", _count: { subjects: 6 } },
  { slug: "grade-6", nameAr: "الصف السادس الابتدائي", nameEn: "Grade 6 Primary", icon: "✏️", _count: { subjects: 6 } },
  { slug: "grade-7", nameAr: "الأول المتوسط", nameEn: "Grade 7 (1st Intermediate)", icon: "🎒", _count: { subjects: 8 } },
  { slug: "grade-8", nameAr: "الثاني المتوسط", nameEn: "Grade 8 (2nd Intermediate)", icon: "🧮", _count: { subjects: 8 } },
  { slug: "grade-9", nameAr: "الثالث المتوسط", nameEn: "Grade 9 (3rd Intermediate)", icon: "🔬", _count: { subjects: 8 } },
  { slug: "grade-10", nameAr: "الرابع الإعدادي", nameEn: "Grade 10 (4th Preparatory)", icon: "📐", _count: { subjects: 7 } },
  { slug: "grade-11", nameAr: "الخامس الإعدادي", nameEn: "Grade 11 (5th Preparatory)", icon: "🎓", _count: { subjects: 7 } },
];

export function GradesSection({ grades, locale }: GradesSectionProps) {
  const t = useTranslations("grades");
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  const list = grades.length > 0 ? grades : FALLBACK_GRADES;

  return (
    <section className="relative py-20 lg:py-28 bg-muted/20">
      <div className="absolute inset-0 bg-dots opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10"
        >
          <div className="max-w-xl">
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">
              Classes
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-foreground text-balance">
              {t("title")}
            </h2>
            <p className="mt-3 text-base text-muted-foreground text-pretty">{t("subtitle")}</p>
          </div>
          <Button asChild variant="outline" className="gap-2 shrink-0">
            <Link href="/classes">
              {t("exploreSubjects")}
              <Arrow className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {list.map((g, i) => (
            <motion.div
              key={g.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <Link
                href={`/classes/${g.slug}`}
                className="group block rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-card hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                    {"icon" in g && g.icon ? g.icon : "📘"}
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {g._count.subjects} {isRtl ? "مواد" : "subjects"}
                  </span>
                </div>
                <h3 className="mt-4 font-display font-bold text-base text-foreground leading-tight">
                  {isRtl ? g.nameAr : (g as { nameEn?: string }).nameEn || g.nameAr}
                </h3>
                {("descriptionAr" in g || "descriptionEn" in g) && (
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {isRtl ? (g as { descriptionAr?: string }).descriptionAr : (g as { descriptionEn?: string }).descriptionEn}
                  </p>
                )}
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:gap-2.5 transition-all">
                  {t("exploreSubjects")}
                  <Arrow className="h-3 w-3" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
