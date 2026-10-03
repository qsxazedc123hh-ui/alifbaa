"use client";

import { useTranslations } from "next-intl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, Save, Palette, Type, Image as ImageIcon, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface BrandAsset {
  id: string;
  key: string;
  label: string;
  mediaId: string | null;
  url: string | null;
}

interface BrandColor {
  id: string;
  key: string;
  label: string;
  value: string;
}

interface BrandSetting {
  id: string;
  key: string;
  label: string;
  value: string;
}

const LOGO_SLOTS = [
  { key: "logo", labelAr: "الشعار الأساسي", labelEn: "Primary Logo" },
  { key: "logo_light", labelAr: "شعار فاتح", labelEn: "Logo (Light)" },
  { key: "logo_dark", labelAr: "شعار داكن", labelEn: "Logo (Dark)" },
  { key: "favicon", labelAr: "أيقونة الموقع", labelEn: "Favicon" },
];

const COLOR_SLOTS = [
  { key: "primary", labelAr: "اللون الأساسي", labelEn: "Primary Color" },
  { key: "secondary", labelAr: "اللون الثانوي", labelEn: "Secondary Color" },
  { key: "accent", labelAr: "لون التمييز", labelEn: "Accent Color" },
  { key: "background", labelAr: "لون الخلفية", labelEn: "Background Color" },
];

const APPEARANCE_SLOTS = [
  { key: "borderRadius", labelAr: "انحناء الحواف", labelEn: "Border Radius", type: "text", placeholder: "0.875rem" },
  { key: "buttonStyle", labelAr: "نمط الأزرار", labelEn: "Button Style", type: "text", placeholder: "rounded" },
  { key: "cardStyle", labelAr: "نمط البطاقات", labelEn: "Card Style", type: "text", placeholder: "soft" },
  { key: "shadowStyle", labelAr: "نمط الظلال", labelEn: "Shadow Style", type: "text", placeholder: "card" },
];

export function BrandPage() {
  const t = useTranslations("admin.brand");
  const queryClient = useQueryClient();
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const { data, isLoading } = useQuery<{
    assets: BrandAsset[];
    colors: BrandColor[];
    settings: BrandSetting[];
  }>({
    queryKey: ["brand"],
    queryFn: async () => {
      const res = await fetch("/api/admin/brand");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { type: "asset" | "color" | "setting"; key: string; label?: string; value?: string; url?: string; mediaId?: string }) => {
      const res = await fetch("/api/admin/brand", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brand"] });
      toast.success("تم الحفظ بنجاح");
    },
    onError: () => toast.error("فشل الحفظ"),
  });

  const handleUpload = async (key: string, file: File) => {
    setUploadingKey(key);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "LOGOS");
      formData.append("altText", key);
      const upRes = await fetch("/api/media", { method: "POST", body: formData });
      if (!upRes.ok) throw new Error("Upload failed");
      const { media } = await upRes.json();
      await updateMutation.mutateAsync({ type: "asset", key, url: media.url, mediaId: media.id });
    } catch {
      toast.error("فشل رفع الملف");
    } finally {
      setUploadingKey(null);
    }
  };

  const assetMap = new Map(data?.assets.map(a => [a.key, a]));
  const colorMap = new Map(data?.colors.map(c => [c.key, c]));
  const settingMap = new Map(data?.settings.map(s => [s.key, s]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl lg:text-3xl">{t("title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      {/* Logos */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <ImageIcon className="h-5 w-5 text-primary" />
          <h2 className="font-display font-bold text-lg">{t("logos")}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LOGO_SLOTS.map(slot => {
            const asset = assetMap.get(slot.key);
            return (
              <div key={slot.key} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-xs font-semibold">{slot.labelAr}</Label>
                  {asset?.url && <Badge variant="outline" className="text-[10px]">مرفوع</Badge>}
                </div>
                <div className="aspect-video rounded-lg bg-muted/40 flex items-center justify-center overflow-hidden mb-3">
                  {asset?.url ? (
                    <img src={asset.url} alt={slot.labelAr} className="h-full w-full object-contain p-2" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                  )}
                </div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) handleUpload(slot.key, f);
                    }}
                  />
                  <span className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-xs font-medium hover:border-primary/40 hover:bg-muted/30 transition-colors">
                    <Upload className="h-3.5 w-3.5" />
                    {uploadingKey === slot.key ? "جاري الرفع..." : t("uploadLogo")}
                  </span>
                </label>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Colors */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <Palette className="h-5 w-5 text-primary" />
          <h2 className="font-display font-bold text-lg">{t("colors")}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLOR_SLOTS.map(slot => {
            const color = colorMap.get(slot.key);
            const value = color?.value || "#0E7C66";
            return (
              <div key={slot.key} className="rounded-xl border border-border p-4">
                <Label className="text-xs font-semibold mb-2 block">{slot.labelAr}</Label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="color"
                    value={value}
                    onChange={e => {
                      updateMutation.mutate({ type: "color", key: slot.key, label: slot.labelAr, value: e.target.value });
                    }}
                    className="h-10 w-12 rounded-lg border border-border cursor-pointer"
                  />
                  <Input
                    value={value}
                    onChange={e => {
                      updateMutation.mutate({ type: "color", key: slot.key, label: slot.labelAr, value: e.target.value });
                    }}
                    className="font-mono text-xs"
                  />
                </div>
                <div className="h-8 rounded-lg" style={{ backgroundColor: value }} />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Appearance */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-display font-bold text-lg">{t("appearance")}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {APPEARANCE_SLOTS.map(slot => {
            const setting = settingMap.get(slot.key);
            const value = setting?.value || slot.placeholder || "";
            return (
              <div key={slot.key} className="rounded-xl border border-border p-4">
                <Label className="text-xs font-semibold mb-2 block">{slot.labelAr}</Label>
                <Input
                  value={value}
                  placeholder={slot.placeholder}
                  onChange={e => {
                    updateMutation.mutate({ type: "setting", key: slot.key, label: slot.labelEn, value: e.target.value });
                  }}
                  className="font-mono text-xs"
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Campus Assets placeholder */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Type className="h-5 w-5 text-primary" />
          <h2 className="font-display font-bold text-lg">{t("campusAssets")}</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          ستتم إضافة أصول الحرم التعليمي (مبانٍ، خلفيات، أيقونات) في المرحلة القادمة.
        </p>
      </Card>

      {isLoading && <p className="text-sm text-muted-foreground text-center">جاري التحميل...</p>}
    </div>
  );
}
