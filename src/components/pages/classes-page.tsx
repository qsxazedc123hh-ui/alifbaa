"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Subject {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  icon: string | null;
  color: string | null;
  order: number;
}

interface Grade {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  icon: string | null;
  order: number;
  subjects: Subject[];
}

export function ClassesPage({ grades }: { grades: Grade[] }) {
  const t = useTranslations("grades");
  const tCommon = useTranslations("common");
  const locale = useLocale() as "ar" | "en";
  const isRtl = locale === "ar";

  const FALLBACK: Grade[] = [
    { id: "g5", slug: "grade-5", nameAr: "الصف الخامس الابتدائي", nameEn: "Grade 5", descriptionAr: null, descriptionEn: null, icon: "📚", order: 1, subjects: [] },
    { id: "g6", slug: "grade-6", nameAr: "الصف السادس الابتدائي", nameEn: "Grade 6", descriptionAr: null, descriptionEn: null, icon: "✏️", order: 2, subjects: [] },
    { id: "g7", slug: "grade-7", nameAr: "الأول المتوسط", nameEn: "Grade 7", descriptionAr: null, descriptionEn: null, icon: "🎒", order: 3, subjects: [] },
    { id: "g8", slug: "grade-8", nameAr: "الثاني المتوسط", nameEn: "Grade 8", descriptionAr: null, descriptionEn: null, icon: "🧮", order: 4, subjects: [] },
    { id: "g9", slug: "grade-9", nameAr: "الثالث المتوسط", nameEn: "Grade 9", descriptionAr: null, descriptionEn: null, icon: "🔬", order: 5, subjects: [] },
    { id: "g10", slug: "grade-10", nameAr: "الرابع الإعدادي", nameEn: "Grade 10", descriptionAr: null, descriptionEn: null, icon: "📐", order: 6, subjects: [] },
    { id: "g11", slug: "grade-11", nameAr: "الخامس الإعدادي", nameEn: "Grade 11", descriptionAr: null, descriptionEn: null, icon: "🎓", order: 7, subjects: [] },
  ];

  const list = grades.length > 0 ? grades : FALLBACK;

  return (
    <>
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-soft/40 to-background" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">
            Classes & Subjects
          </span>
          <h1 className="font-display font-extrabold text-4xl lg:text-5xl text-foreground">
            {t("title")}
          </h1>
          <p className="mt-3 text-base text-muted-foreground">{t("subtitle")}</p>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {list.map((g, gi) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: gi * 0.05 }}
              className="rounded-3xl border border-border bg-card p-6 lg:p-8 shadow-soft"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                    {g.icon || "📘"}
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-xl lg:text-2xl">
                      {isRtl ? g.nameAr : g.nameEn}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {g.subjects.length} {isRtl ? "مواد دراسية" : "subjects"}
                    </p>
                  </div>
                </div>
              </div>

              {g.subjects.length > 0 ? (
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {g.subjects.map((s) => (
                    <Link
                      key={s.id}
                      href={`/classes/${g.slug}/${s.slug}`}
                      className="group rounded-xl border border-border bg-background p-3 hover:border-primary/30 hover:shadow-soft transition-all"
                    >
                      <div
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm"
                        style={{ backgroundColor: s.color ? `${s.color}15` : undefined }}
                      >
                        {s.icon || "📖"}
                      </div>
                      <h3 className="mt-2 font-semibold text-sm text-foreground leading-tight line-clamp-2">
                        {isRtl ? s.nameAr : s.nameEn}
                      </h3>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {["رياضيات", "علوم", "لغة عربية", "لغة إنجليزية", "اجتماعيات", "تربية إسلامية"].map((subject, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-dashed border-border bg-muted/30 p-3 text-center"
                    >
                      <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <h3 className="mt-2 font-semibold text-sm text-muted-foreground">{subject}</h3>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
