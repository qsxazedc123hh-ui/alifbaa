"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const SLOTS = [
  { key: "logo_light", label: "شعار فاتح", desc: "يظهر على الخلفيات الفاتحة" },
  { key: "logo_dark", label: "شعار داكن", desc: "يظهر على الخلفيات الداكنة" },
  { key: "bg_light", label: "خلفية فاتحة", desc: "خلفية الموقع في الوضع الفاتح" },
  { key: "bg_dark", label: "خلفية داكنة", desc: "خلفية الموقع في الوضع الداكن" },
];

export function IdentityPage() {
  const queryClient = useQueryClient();
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const { data } = useQuery<{ assets: Array<{ id: string; key: string; label: string; url: string | null }> }>({
    queryKey: ["identity"],
    queryFn: async () => {
      const res = await fetch("/api/admin/identity");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ key, file }: { key: string; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("key", key);
      formData.append("label", SLOTS.find((s) => s.key === key)?.label || key);
      const res = await fetch("/api/admin/identity", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["identity"] });
      toast.success("تم الحفظ بنجاح");
    },
    onError: () => toast.error("فشل الرفع"),
  });

  const handleUpload = async (key: string, file: File) => {
    setUploadingKey(key);
    try {
      await uploadMutation.mutateAsync({ key, file });
    } finally {
      setUploadingKey(null);
    }
  };

  const assetMap = new Map(data?.assets.map((a) => [a.key, a]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl lg:text-3xl">الهوية البصرية</h1>
        <p className="text-sm text-muted-foreground mt-1">إدارة الشعارات والخلفيات — الألوان والتصميم ثابتة</p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-cyan-brand/10 border border-cyan-brand/20 px-3 py-1.5 text-xs text-cyan-brand">
          <ImageIcon className="h-3.5 w-3.5" />
          <span>ملاحظة: الألوان والخطوط والتخطيط ثابتة من المبرمج ولا يمكن تغييرها</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SLOTS.map((slot) => {
          const asset = assetMap.get(slot.key);
          return (
            <Card key={slot.key} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-display font-bold text-sm">{slot.label}</h3>
                  <p className="text-[11px] text-muted-foreground">{slot.desc}</p>
                </div>
                {asset?.url && <Badge variant="outline" className="text-[10px]">مرفوع</Badge>}
              </div>
              <div className="aspect-video rounded-lg bg-muted/40 flex items-center justify-center overflow-hidden mb-3 border border-border">
                {asset?.url ? (
                  <img src={asset.url} alt={slot.label} className="h-full w-full object-contain p-2" />
                ) : (
                  <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                )}
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(slot.key, f);
                  }}
                />
                <span className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-xs font-medium hover:border-cyan-brand/40 hover:bg-muted/30 transition-colors">
                  <Upload className="h-3.5 w-3.5" />
                  {uploadingKey === slot.key ? "جاري الرفع..." : "رفع"}
                </span>
              </label>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
