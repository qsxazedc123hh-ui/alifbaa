"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Eye, Target, Compass, Scale, Heart, Sparkles, Award, BookOpen } from "lucide-react";

export function AboutPage() {
  const t = useTranslations("about");
  const tCommon = useTranslations("common");

  const values = [
    { icon: BookOpen, key: "الفهم", desc: "نركّز على الفهم الحقيقي لا الحفظ." },
    { icon: Award, key: "الجودة", desc: "محتوى دقيق ومنظّم يليق بالطالب." },
    { icon: Scale, key: "الإنصاف", desc: "فرص متكافئة لكل طالب للمنافسة." },
    { icon: Eye, key: "الشفافية", desc: "نتائج واضحة ومتابعة صادقة." },
    { icon: Sparkles, key: "التحفيز", desc: "حوافز تشجّع على الاستمرار." },
    { icon: Heart, key: "المسؤولية", desc: "نلتزم تجاه الطالب والأسرة." },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-soft/40 to-background" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">
              About Alif Baa
            </span>
            <h1 className="font-display font-extrabold text-4xl lg:text-6xl text-foreground text-balance">
              {t("title")}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">{t("subtitle")}</p>
          </motion.div>
        </div>
      </section>

      {/* Description */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-border bg-card p-8 lg:p-12 shadow-soft"
          >
            <p className="text-base lg:text-lg text-foreground/90 leading-relaxed text-pretty">
              {t("description")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-12 lg:py-16 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-gradient-to-br from-brand to-forest p-8 text-white shadow-card"
          >
            <Eye className="h-10 w-10 mb-4" />
            <h2 className="font-display font-bold text-2xl">{t("visionTitle")}</h2>
            <p className="mt-3 text-white/85 leading-relaxed">{t("vision")}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-gradient-to-br from-gold to-amber-700 p-8 text-white shadow-card"
          >
            <Target className="h-10 w-10 mb-4" />
            <h2 className="font-display font-bold text-2xl">{t("missionTitle")}</h2>
            <p className="mt-3 text-white/85 leading-relaxed">{t("mission")}</p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-center mb-10">
            {t("valuesTitle")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {values.map((v, i) => (
              <motion.div
                key={v.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="rounded-2xl border border-border bg-card p-5 text-center"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-3 font-display font-bold text-base">{v.key}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-12 lg:py-20 bg-muted/20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <Compass className="h-7 w-7 text-primary" />
              <h2 className="font-display font-extrabold text-2xl lg:text-3xl">{t("storyTitle")}</h2>
            </div>
            <p className="text-base text-foreground/85 leading-loose text-pretty">{t("story")}</p>
          </motion.div>
        </div>
      </section>

      {/* Difference */}
      <section className="py-12 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display font-extrabold text-2xl lg:text-3xl mb-4">
              {t("differenceTitle")}
            </h2>
            <p className="text-base text-foreground/85 leading-loose text-pretty">{t("difference")}</p>
          </motion.div>
        </div>
      </section>

      {/* Goals */}
      <section className="py-12 lg:py-20 bg-muted/20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-extrabold text-2xl lg:text-3xl mb-6">{t("goalsTitle")}</h2>
          <ul className="space-y-3">
            {(["مساعدة الطالب على فهم المنهج العراقي وإتقان موضوعاته.",
               "تنظيم الدراسة وتسهيل الوصول إلى الدروس والأسئلة.",
               "تشجيع الطالب على المراجعة والتطبيق بصورة مستمرة.",
               "مساعدة الطالب على اكتشاف نقاط قوته والجوانب التي تحتاج إلى تحسين.",
               "دعم أولياء الأمور في متابعة تقدّم أبنائهم.",
               "تحويل المنافسة التعليمية إلى دافع للتعلّم والمثابرة."
            ]).map((goal, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-start gap-3 rounded-xl bg-card border border-border p-4"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">
                  {i + 1}
                </span>
                <span className="text-sm text-foreground/85">{goal}</span>
              </motion.li>
            ))}
          </ul>

          <div className="mt-8 rounded-2xl bg-gradient-to-br from-brand to-forest p-6 text-white">
            <h3 className="font-display font-bold text-lg">{t("audienceTitle")}</h3>
            <p className="mt-2 text-white/85 text-sm leading-relaxed">{t("audience")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
