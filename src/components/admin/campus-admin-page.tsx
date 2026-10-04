"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Upload, Trash2, Star, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface CampusItem {
  id: string;
  key: string;
  label: string;
  iconKey: string | null;
  sectionKey: string | null;
  order: number;
  visible: boolean;
  inBottomNav: boolean;
  bottomNavOrder: number;
}

interface CampusBackground {
  id: string;
  label: string;
  url: string;
  isActive: boolean;
}

const ICON_OPTIONS = [
  { value: "smart_battle", label: "صراع الأذكياء" },
  { value: "videos", label: "الفيديوهات" },
  { value: "news", label: "الأخبار" },
  { value: "about", label: "من نحن" },
  { value: "download", label: "تحميل التطبيق" },
  { value: "contact", label: "تواصل معنا" },
];

export function CampusAdminPage() {
  const queryClient = useQueryClient();
  const [bgUploading, setBgUploading] = useState(false);

  const { data: itemsData } = useQuery<{ items: CampusItem[] }>({
    queryKey: ["campus-items"],
    queryFn: async () => {
      const res = await fetch("/api/admin/campus-items");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const { data: bgData } = useQuery<{ backgrounds: CampusBackground[] }>({
    queryKey: ["campus-backgrounds"],
    queryFn: async () => {
      const res = await fetch("/api/admin/campus-backgrounds");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const res = await fetch("/api/admin/campus-items", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, data }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campus-items"] });
      toast.success("تم التحديث");
    },
  });

  const uploadBgMutation = useMutation({
    mutationFn: async ({ file, label, active }: { file: File; label: string; active: boolean }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("label", label);
      formData.append("active", String(active));
      const res = await fetch("/api/admin/campus-backgrounds", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campus-backgrounds"] });
      toast.success("تم رفع الخلفية");
    },
  });

  const activateBgMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/admin/campus-backgrounds", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "activate" }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campus-backgrounds"] });
      toast.success("تم تفعيل الخلفية");
    },
  });

  const deleteBgMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/campus-backgrounds`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "delete" }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campus-backgrounds"] });
      toast.success("تم الحذف");
    },
  });

  const handleBgUpload = async (file: File) => {
    setBgUploading(true);
    try {
      await uploadBgMutation.mutateAsync({ file, label: "خلفية Campus", active: true });
    } finally {
      setBgUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl lg:text-3xl">إدارة الـCampus</h1>
        <p className="text-sm text-muted-foreground mt-1">رفع الخلفيات وإدارة عناصر الحرم — هيكل الـCampus ثابت</p>
      </div>

      {/* Backgrounds */}
      <Card className="p-5">
        <h2 className="font-display font-bold text-base mb-4">خلفيات الـCampus</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
          {bgData?.backgrounds.map((bg) => (
            <div key={bg.id} className="rounded-xl border border-border overflow-hidden">
              <div className="aspect-video bg-muted">
                <img src={bg.url} alt={bg.label} className="h-full w-full object-cover" />
              </div>
              <div className="p-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold truncate">{bg.label}</span>
                  {bg.isActive && <Badge className="text-[9px]">فعّالة</Badge>}
                </div>
                <div className="flex gap-1 mt-2">
                  {!bg.isActive && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[10px] gap-1 flex-1"
                      onClick={() => activateBgMutation.mutate(bg.id)}
                    >
                      <Star className="h-3 w-3" />
                      تفعيل
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-[10px] text-destructive"
                    onClick={() => deleteBgMutation.mutate(bg.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleBgUpload(f);
              }}
            />
            <div className="aspect-video rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center hover:border-cyan-brand/40 hover:bg-muted/30 transition-colors">
              <Upload className="h-6 w-6 text-muted-foreground mb-1" />
              <span className="text-xs font-medium">{bgUploading ? "جاري..." : "رفع خلفية"}</span>
            </div>
          </label>
        </div>
      </Card>

      {/* Items management */}
      <Card className="p-5">
        <h2 className="font-display font-bold text-base mb-4">عناصر الـCampus</h2>
        <div className="space-y-2">
          {itemsData?.items.sort((a, b) => a.order - b.order).map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <Label className="text-[10px]">الاسم</Label>
                  <Input
                    value={item.label}
                    onChange={(e) => updateMutation.mutate({ id: item.id, data: { label: e.target.value } })}
                    className="h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-[10px]">الأيقونة</Label>
                  <select
                    value={item.iconKey || ""}
                    onChange={(e) => updateMutation.mutate({ id: item.id, data: { iconKey: e.target.value } })}
                    className="h-8 w-full rounded-md border border-border bg-background px-2 text-sm"
                  >
                    {ICON_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-[10px]">الترتيب</Label>
                  <Input
                    type="number"
                    value={item.order}
                    onChange={(e) => updateMutation.mutate({ id: item.id, data: { order: Number(e.target.value) } })}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-1.5 text-[11px]">
                  <Switch
                    checked={item.visible}
                    onCheckedChange={(v) => updateMutation.mutate({ id: item.id, data: { visible: v } })}
                  />
                  {item.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                </label>
                <label className="flex items-center gap-1.5 text-[11px]">
                  <Switch
                    checked={item.inBottomNav}
                    onCheckedChange={(v) => updateMutation.mutate({ id: item.id, data: { inBottomNav: v } })}
                  />
                  Bottom
                </label>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
