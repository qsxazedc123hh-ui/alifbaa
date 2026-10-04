"use client";

import { motion } from "framer-motion";
import { ArrowRight, Eye, Target, Compass, Scale, Heart, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AboutProps {
  onBack: () => void;
}

const VALUES = [
  { icon: BookOpen, label: "الفهم", desc: "نركّز على الفهم الحقيقي لا الحفظ" },
  { icon: Sparkles, label: "الجودة", desc: "محتوى دقيق ومنظّم يليق بالطالب" },
  { icon: Scale, label: "الإنصاف", desc: "فرص متكافئة لكل طالب للمنافسة" },
  { icon: Eye, label: "الشفافية", desc: "نتائج واضحة ومتابعة صادقة" },
  { icon: Target, label: "التحفيز", desc: "حوافز تشجّع على الاستمرار" },
  { icon: Heart, label: "المسؤولية", desc: "نلتزم تجاه الطالب والأسرة" },
];

const GOALS = [
  "مساعدة الطالب على فهم المنهج العراقي وإتقان موضوعاته.",
  "تنظيم الدراسة وتسهيل الوصول إلى الدروس والأسئلة.",
  "تشجيع الطالب على المراجعة والتطبيق بصورة مستمرة.",
  "مساعدة الطالب على اكتشاف نقاط قوته والجوانب التي تحتاج إلى تحسين.",
  "دعم أولياء الأمور في متابعة دراسة أبنائهم.",
  "تحويل المنافسة التعليمية إلى دافع للتعلّم والمثابرة.",
];

/**
 * About Section — من نحن (نص رسمي بدون صور)
 */
export function About({ onBack }: AboutProps) {
  return (
    <section id="about" className="min-h-screen pt-20 lg:pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-foreground">من نحن</h2>
            <p className="mt-1 text-sm text-muted-foreground">قصة ألف باء ورؤيتها للتعليم في العراق</p>
          </div>
          <Button onClick={onBack} variant="outline" size="sm" className="gap-2 shrink-0">
            <ArrowRight className="h-4 w-4" />
            رجوع
          </Button>
        </div>

        {/* نبذة */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-border bg-card p-5 sm:p-6 lg:p-8 shadow-soft mb-6"
        >
          <p className="text-sm sm:text-base text-foreground/90 leading-loose">
            ألف باء منصة تعليمية عراقية تقدّم تجربة دراسية تجمع بين الشرح الواضح، التفاعل ومتابعة التقدّم. نقدّم دروساً مصوّرة وفق المنهج العراقي، وأسئلة تساعد الطالب على اختبار فهمه، ومنافسات تعليمية تحفّزه على الاستمرار، تحت شعار:
            <span className="block mt-3 text-cyan-brand font-bold text-base sm:text-lg">ادرس • افهم • نافس • اربح</span>
          </p>
        </motion.div>

        {/* رؤيتنا + رسالتنا */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 mb-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl bg-gradient-to-br from-navy to-navy-deep p-5 sm:p-6 text-navy-foreground shadow-card"
          >
            <Eye className="h-8 w-8 mb-3" />
            <h3 className="font-display font-bold text-lg sm:text-xl mb-2">رؤيتنا</h3>
            <p className="text-sm text-white/85 leading-relaxed">
              أن نكون منصة تعليمية يثق بها الطالب العراقي وأسرته، وأن نجعل الدراسة تجربة محبّبة تبني الفهم والثقة، وتمنح كل طالب فرصة للتقدّم وإظهار قدراته.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl bg-gradient-to-br from-cyan-brand to-blue-700 p-5 sm:p-6 text-white shadow-card"
          >
            <Target className="h-8 w-8 mb-3" />
            <h3 className="font-display font-bold text-lg sm:text-xl mb-2">رسالتنا</h3>
            <p className="text-sm text-white/85 leading-relaxed">
              تقديم تعليم واضح ومنظّم وسهل الوصول، يساعد الطالب على فهم دروسه وتطبيق ما يتعلّمه، ويمنح الأسرة صورة أوضح عن مستواه، مع توظيف التفاعل والمنافسة لتشجيعه على الدراسة.
            </p>
          </motion.div>
        </div>

        {/* قيمنا */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h3 className="font-display font-extrabold text-xl sm:text-2xl mb-4">قيمنا</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {VALUES.map((v, i) => (
              <div key={v.label} className="rounded-2xl border border-border bg-card p-4 text-center">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-brand/10 text-cyan-brand mx-auto mb-2">
                  <v.icon className="h-5 w-5" />
                </div>
                <h4 className="font-display font-bold text-sm">{v.label}</h4>
                <p className="text-[11px] text-muted-foreground mt-1">{v.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* قصة التأسيس */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-border bg-muted/30 p-5 sm:p-6 lg:p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <Compass className="h-6 w-6 text-cyan-brand" />
            <h3 className="font-display font-extrabold text-lg sm:text-xl">قصة تأسيس ألف باء</h3>
          </div>
          <p className="text-sm sm:text-base text-foreground/85 leading-loose">
            بدأت فكرة ألف باء من سؤال بسيط: كيف نجعل الطالب يحب الدراسة ويستمر بها؟ من هذا السؤال، انطلق العمل على بناء منصة تجمع الدرس الواضح، والسؤال الذي يختبر الفهم، والتحدّي الذي يشجّع على التقدّم. تأسست ألف باء عام ٢٠٢٦ لتقدّم للطالب العراقي تجربة مترابطة، ينتقل فيها من التعلّم إلى التطبيق، ثم المنافسة والإنجاز.
          </p>
          <p className="mt-4 text-sm sm:text-base text-foreground/85 leading-loose">
            واسم «ألف باء» يعبّر عن إيماننا بأن كل إنجاز كبير يبدأ بخطوة، وأن الأساس الصحيح يفتح الطريق لمستقبل أفضل.
          </p>
        </motion.div>

        {/* ما الذي يميز ألف باء */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h3 className="font-display font-extrabold text-lg sm:text-xl mb-3">ما الذي يميّز ألف باء؟</h3>
          <p className="text-sm sm:text-base text-foreground/85 leading-loose">
            تجمع ألف باء عناصر الدراسة في تجربة واحدة: دروس مصوّرة وفق المنهج العراقي، وأسئلة تفاعلية، ومتابعة لمستوى الطالب، ومنافسات مستمدّة من دراسته. ومن خلال «صراع الأذكياء»، يصبح ما يتعلّمه الطالب جزءاً من تحدٍّ تعليمي يجمع فيه النقاط وينافس على المراكز والجوائز الأسبوعية. هكذا يرتبط الحافز بالفهم والتطبيق، ويصبح لكل درس دور في تقدّمه.
          </p>
        </motion.div>

        {/* أهدافنا */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="font-display font-extrabold text-lg sm:text-xl mb-4">أهدافنا</h3>
          <ul className="space-y-2.5">
            {GOALS.map((goal, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-brand text-white font-bold text-[10px]">
                  {i + 1}
                </span>
                <span className="text-sm text-foreground/85">{goal}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
