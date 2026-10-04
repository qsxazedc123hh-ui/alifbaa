"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Video,
  Newspaper,
  Swords,
  Smartphone,
  MessageCircle,
  Share2,
  Mail,
  Trash2,
  Shield,
  Image as ImageIcon,
  Building2,
  ArrowLeft,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const QUICK_LINKS = [
  { href: "/admin/identity", label: "الهوية", icon: ImageIcon, desc: "الشعارات والخلفيات", color: "from-violet-500 to-purple-700" },
  { href: "/admin/campus", label: "Campus", icon: Building2, desc: "إدارة عناصر الحرم", color: "from-cyan-500 to-blue-700" },
  { href: "/admin/videos", label: "الفيديوهات", icon: Video, desc: "رفع وإدارة الفيديوهات", color: "from-sky-500 to-blue-700" },
  { href: "/admin/news", label: "الأخبار", icon: Newspaper, desc: "نشر الأخبار", color: "from-gold to-amber-700" },
  { href: "/admin/smart-battle", label: "صراع الأذكياء", icon: Swords, desc: "فيديوهات اللعبة", color: "from-rose-500 to-rose-700" },
  { href: "/admin/download", label: "تحميل التطبيق", icon: Smartphone, desc: "روابط التحميل", color: "from-teal-500 to-emerald-700" },
  { href: "/admin/whatsapp", label: "واتساب", icon: MessageCircle, desc: "أرقام واتساب", color: "from-green-500 to-emerald-700" },
  { href: "/admin/social", label: "روابط التواصل", icon: Share2, desc: "Social media links", color: "from-pink-500 to-rose-700" },
  { href: "/admin/messages", label: "الرسائل", icon: Mail, desc: "رسائل الزوار", color: "from-amber-500 to-orange-700" },
  { href: "/admin/trash", label: "المحذوفات", icon: Trash2, desc: "استرجاع أو حذف نهائي", color: "from-slate-500 to-slate-700" },
  { href: "/admin/security", label: "الأمان", icon: Shield, desc: "كلمة المرور والجلسة", color: "from-navy to-navy-deep" },
];

interface Stats {
  videos: number;
  news: number;
  smartBattleVideos: number;
  appLinks: number;
  whatsappNumbers: number;
  socialLinks: number;
  unreadMessages: number;
  trashItems: number;
}

export function DashboardHome() {
  const { data: stats } = useQuery<{ stats: Stats }>({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const s = stats?.stats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl lg:text-3xl">مرحباً بك في مركز التحكم</h1>
        <p className="text-sm text-muted-foreground mt-1">إدارة محتوى موقع ألف باء</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "الفيديوهات", value: s?.videos ?? "—", icon: Video, color: "from-sky-500 to-blue-700" },
          { label: "الأخبار", value: s?.news ?? "—", icon: Newspaper, color: "from-gold to-amber-700" },
          { label: "صراع الأذكياء", value: s?.smartBattleVideos ?? "—", icon: Swords, color: "from-rose-500 to-rose-700" },
          { label: "الرسائل غير المقروءة", value: s?.unreadMessages ?? "—", icon: Mail, color: "from-amber-500 to-orange-700" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-4">
              <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color} text-white mb-2`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <div className="font-display font-extrabold text-xl">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick links grid */}
      <div>
        <h2 className="font-display font-bold text-base mb-3">الأقسام</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {QUICK_LINKS.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.03 }}
            >
              <Link href={link.href}>
                <Card className="p-4 hover:shadow-card hover:-translate-y-0.5 transition-all cursor-pointer h-full">
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${link.color} text-white mb-2`}>
                    <link.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-bold text-sm">{link.label}</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{link.desc}</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
