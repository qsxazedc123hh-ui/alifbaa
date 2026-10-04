"use client";

import { useTranslations } from "next-intl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  GripVertical,
  Eye,
  EyeOff,
  Edit3,
  Save,
  Sparkles,
  Home,
  Building2,
  BookOpen,
  Swords,
  Video,
  Smartphone,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Section {
  id: string;
  key: string;
  titleAr: string;
  titleEn: string;
  visible: boolean;
  order: number;
  data: string;
}

const SECTION_META: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  hero: { icon: Sparkles, color: "from-brand to-forest" },
  campus: { icon: Building2, color: "from-gold to-amber-700" },
  services: { icon: Home, color: "from-violet-500 to-purple-700" },
  grades: { icon: BookOpen, color: "from-sky-500 to-blue-700" },
  smart_battle: { icon: Swords, color: "from-rose-500 to-rose-700" },
  videos: { icon: Video, color: "from-teal-500 to-emerald-700" },
  app_download: { icon: Smartphone, color: "from-amber-500 to-orange-700" },
  contact: { icon: MessageCircle, color: "from-cyan-500 to-blue-700" },
};

const DEFAULT_SECTIONS = [
  { key: "hero", titleAr: "القسم الرئيسي", titleEn: "Hero" },
  { key: "campus", titleAr: "حرم ألف باء", titleEn: "Campus" },
  { key: "services", titleAr: "الخدمات", titleEn: "Services" },
  { key: "grades", titleAr: "الصفوف", titleEn: "Grades" },
  { key: "smart_battle", titleAr: "صراع الأذكياء", titleEn: "Smart Battle" },
  { key: "videos", titleAr: "الفيديوهات", titleEn: "Videos" },
  { key: "app_download", titleAr: "تحميل التطبيق", titleEn: "Download" },
  { key: "contact", titleAr: "تواصل معنا", titleEn: "Contact" },
];

export function HomepagePage() {
  const t = useTranslations("admin.homepage");
  const queryClient = useQueryClient();
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const { data, isLoading } = useQuery<{ sections: Section[] }>({
    queryKey: ["homepage"],
    queryFn: async () => {
      const res = await fetch("/api/admin/homepage");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (payload: { key: string; titleAr?: string; titleEn?: string; visible?: boolean; order?: number; data?: Record<string, unknown> }) => {
      const res = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["homepage"] });
      toast.success("تم الحفظ");
    },
    onError: () => toast.error("فشل الحفظ"),
  });

  const reorderMutation = useMutation({
    mutationFn: async (orders: { key: string; order: number }[]) => {
      const res = await fetch("/api/admin/homepage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["homepage"] }),
  });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const sections = data?.sections ?? [];

  // Merge with defaults if empty
  const displaySections = sections.length > 0
    ? sections
    : DEFAULT_SECTIONS.map((s, i) => ({
        id: s.key,
        key: s.key,
        titleAr: s.titleAr,
        titleEn: s.titleEn,
        visible: true,
        order: i,
        data: "{}",
      }));

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = displaySections.findIndex(s => s.key === active.id);
    const newIndex = displaySections.findIndex(s => s.key === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(displaySections, oldIndex, newIndex);
    reorderMutation.mutate(reordered.map((s, i) => ({ key: s.key, order: i })));
  };

  const editingSection = sections.find(s => s.key === editingKey);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl lg:text-3xl">{t("title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-base flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-primary" />
            {t("sectionOrder")}
          </h2>
          <span className="text-xs text-muted-foreground">{t("dragToReorder")}</span>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={displaySections.map(s => s.key)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {displaySections.map(section => (
                  <SortableRow
                    key={section.key}
                    section={section}
                    onToggleVisible={() =>
                      upsertMutation.mutate({ key: section.key, visible: !section.visible })
                    }
                    onEdit={() => setEditingKey(section.key)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </Card>

      {/* Edit dialog */}
      <Dialog open={!!editingKey} onOpenChange={open => !open && setEditingKey(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSection ? `تعديل: ${editingSection.titleAr}` : "تعديل القسم"}
            </DialogTitle>
          </DialogHeader>
          {editingSection && <SectionEditor section={editingSection} onSave={(data) => {
            upsertMutation.mutate({ key: editingSection.key, data });
            setEditingKey(null);
          }} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SortableRow({
  section,
  onToggleVisible,
  onEdit,
}: {
  section: Section;
  onToggleVisible: () => void;
  onEdit: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.key,
  });
  const meta = SECTION_META[section.key] ?? SECTION_META.services;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-shadow ${
        isDragging ? "shadow-card z-10" : ""
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
        aria-label="Drag"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${meta.color} text-white flex items-center justify-center shrink-0`}>
        <meta.icon className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm truncate">{section.titleAr}</div>
        <div className="text-[10px] text-muted-foreground">{section.key}</div>
      </div>

      <Badge variant={section.visible ? "default" : "secondary"} className="text-[10px]">
        {section.visible ? "ظاهر" : "مخفي"}
      </Badge>

      <Button variant="ghost" size="sm" onClick={onToggleVisible} className="p-2 h-8 w-8">
        {section.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </Button>

      <Button variant="ghost" size="sm" onClick={onEdit} className="p-2 h-8 w-8">
        <Edit3 className="h-4 w-4" />
      </Button>
    </div>
  );
}

function SectionEditor({
  section,
  onSave,
}: {
  section: Section;
  onSave: (data: Record<string, unknown>) => void;
}) {
  const t = useTranslations("admin.homepage");
  let parsed: Record<string, unknown> = {};
  try {
    parsed = section.data ? JSON.parse(section.data) : {};
  } catch {
    parsed = {};
  }

  const [data, setData] = useState<Record<string, unknown>>(parsed);

  const fields = (() => {
    switch (section.key) {
      case "hero":
        return [
          { key: "badgeAr", label: "شارة (عربي)", type: "text" },
          { key: "badgeEn", label: "شارة (إنجليزي)", type: "text" },
          { key: "titleAr", label: t("titleAr"), type: "text" },
          { key: "titleEn", label: t("titleEn"), type: "text" },
          { key: "subtitleAr", label: t("subtitleAr"), type: "textarea" },
          { key: "subtitleEn", label: t("subtitleEn"), type: "textarea" },
          { key: "primaryCtaAr", label: t("primaryCtaAr"), type: "text" },
          { key: "primaryCtaEn", label: t("primaryCtaEn"), type: "text" },
          { key: "secondaryCtaAr", label: t("secondaryCtaAr"), type: "text" },
          { key: "secondaryCtaEn", label: t("secondaryCtaEn"), type: "text" },
        ];
      case "campus":
      case "services":
      case "grades":
      case "smart_battle":
      case "videos":
      case "app_download":
      case "contact":
        return [
          { key: "titleAr", label: t("titleAr"), type: "text" },
          { key: "titleEn", label: t("titleEn"), type: "text" },
          { key: "subtitleAr", label: t("subtitleAr"), type: "textarea" },
          { key: "subtitleEn", label: t("subtitleEn"), type: "textarea" },
        ];
      default:
        return [];
    }
  })();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map(f => (
          <div key={f.key} className={f.type === "textarea" ? "col-span-2" : ""}>
            <Label className="text-xs mb-1 block">{f.label}</Label>
            {f.type === "textarea" ? (
              <Textarea
                value={(data[f.key] as string) || ""}
                onChange={e => setData({ ...data, [f.key]: e.target.value })}
                rows={2}
              />
            ) : (
              <Input
                value={(data[f.key] as string) || ""}
                onChange={e => setData({ ...data, [f.key]: e.target.value })}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-3 border-t border-border">
        <Button onClick={() => onSave(data)} className="gap-2">
          <Save className="h-4 w-4" />
          حفظ
        </Button>
      </div>
    </div>
  );
}
