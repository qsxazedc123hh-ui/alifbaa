"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Image as ImageIcon,
  Save,
  X,
  CheckCircle2,
  Loader2,
  AlertCircle,
  FileImage,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";

interface BrandAsset {
  id: string;
  key: string;
  label: string;
  url: string | null;
  updatedAt?: string;
}

const SLOTS = [
  { key: "logo_light", label: "شعار فاتح", desc: "يظهر على الخلفيات الفاتحة" },
  { key: "logo_dark", label: "شعار داكن", desc: "يظهر على الخلفيات الداكنة" },
  { key: "bg_light", label: "خلفية فاتحة", desc: "خلفية الموقع في الوضع الفاتح" },
  { key: "bg_dark", label: "خلفية داكنة", desc: "خلفية الموقع في الوضع الداكن" },
  { key: "homepage_center", label: "شعار / صورة واجهة الصفحة الرئيسية", desc: "العنصر البصري في منتصف الـHero — مستقل عن شعار الـHeader" },
] as const;

const ALLOWED_MIME = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

type SlotStatus = "empty" | "ready_to_save" | "saving" | "saved" | "error";

interface SlotState {
  status: SlotStatus;
  selectedFile: File | null;
  previewUrl: string | null;
  errorMsg: string | null;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function IdentityPage() {
  const queryClient = useQueryClient();
  const [slots, setSlots] = useState<Record<string, SlotState>>({
    logo_light: { status: "empty", selectedFile: null, previewUrl: null, errorMsg: null },
    logo_dark: { status: "empty", selectedFile: null, previewUrl: null, errorMsg: null },
    bg_light: { status: "empty", selectedFile: null, previewUrl: null, errorMsg: null },
    bg_dark: { status: "empty", selectedFile: null, previewUrl: null, errorMsg: null },
    homepage_center: { status: "empty", selectedFile: null, previewUrl: null, errorMsg: null },
  });

  const { data, isLoading, refetch } = useQuery<{ assets: BrandAsset[] }>({
    queryKey: ["identity"],
    queryFn: async () => {
      const res = await fetch("/api/admin/identity", { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const assetMap = new Map(data?.assets.map((a) => [a.key, a]));

  const uploadMutation = useMutation({
    mutationFn: async ({ key, file }: { key: string; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("key", key);
      formData.append("label", SLOTS.find((s) => s.key === key)?.label || key);
      const res = await fetch("/api/admin/identity", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      return data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate both admin and public identity queries
      queryClient.invalidateQueries({ queryKey: ["identity"] });
      queryClient.invalidateQueries({ queryKey: ["public-identity"] });
      setSlots((prev) => ({
        ...prev,
        [variables.key]: {
          status: "saved",
          selectedFile: null,
          previewUrl: null,
          errorMsg: null,
        },
      }));
      toast.success("تم حفظ الصورة وتطبيقها على الموقع");
      // Refetch to show the new saved image
      refetch();
    },
    onError: (err: Error, variables) => {
      setSlots((prev) => ({
        ...prev,
        [variables.key]: {
          ...prev[variables.key],
          status: "error",
          errorMsg: err.message,
        },
      }));
      toast.error(err.message || "فشل الحفظ");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (key: string) => {
      const res = await fetch(`/api/admin/identity?key=${key}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      return data;
    },
    onSuccess: (_data, key) => {
      queryClient.invalidateQueries({ queryKey: ["identity"] });
      queryClient.invalidateQueries({ queryKey: ["public-identity"] });
      setSlots((prev) => ({
        ...prev,
        [key]: { status: "empty", selectedFile: null, previewUrl: null, errorMsg: null },
      }));
      toast.success("تم حذف الصورة والعودة إلى الافتراضية");
      refetch();
    },
    onError: () => toast.error("فشل الحذف"),
  });

  const handleDelete = (key: string) => {
    if (!confirm("هل تريد حذف هذه الصورة والعودة إلى الافتراضية؟")) return;
    deleteMutation.mutate(key);
  };

  const handleSelectFile = (key: string, file: File) => {
    // Validate type
    if (!ALLOWED_MIME.includes(file.type)) {
      toast.error(`نوع الملف غير مسموح. الأنواع المسموحة: JPG, PNG, WEBP`);
      setSlots((prev) => ({
        ...prev,
        [key]: { status: "error", selectedFile: null, previewUrl: null, errorMsg: "نوع ملف غير مسموح" },
      }));
      return;
    }
    // Validate size
    if (file.size > MAX_SIZE) {
      toast.error("حجم الملف يتجاوز 5 ميجابايت");
      setSlots((prev) => ({
        ...prev,
        [key]: { status: "error", selectedFile: null, previewUrl: null, errorMsg: "حجم الملف كبير جداً" },
      }));
      return;
    }
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setSlots((prev) => ({
      ...prev,
      [key]: { status: "ready_to_save", selectedFile: file, previewUrl, errorMsg: null },
    }));
  };

  const handleSave = (key: string) => {
    const slot = slots[key];
    if (!slot.selectedFile) return;
    setSlots((prev) => ({ ...prev, [key]: { ...prev[key], status: "saving" } }));
    uploadMutation.mutate({ key, file: slot.selectedFile });
  };

  const handleCancel = (key: string) => {
    const slot = slots[key];
    if (slot.previewUrl) URL.revokeObjectURL(slot.previewUrl);
    setSlots((prev) => ({
      ...prev,
      [key]: { status: "empty", selectedFile: null, previewUrl: null, errorMsg: null },
    }));
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(slots).forEach((s) => {
        if (s.previewUrl) URL.revokeObjectURL(s.previewUrl);
      });
    };
  }, [slots]);

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

      {isLoading && (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ms-2 text-sm">جاري التحميل...</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SLOTS.map((slot) => {
          const asset = assetMap.get(slot.key);
          const state = slots[slot.key];
          const cacheBust = asset?.updatedAt ? `?v=${new Date(asset.updatedAt).getTime()}` : "";
          const savedUrl = asset?.url ? `${asset.url}${cacheBust}` : null;

          return (
            <Card key={slot.key} className="p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-display font-bold text-sm">{slot.label}</h3>
                  <p className="text-[11px] text-muted-foreground">{slot.desc}</p>
                </div>
                <StatusBadge status={state.status} hasSaved={!!savedUrl} />
              </div>

              {/* Image preview area */}
              <div className="aspect-video rounded-lg bg-muted/40 flex items-center justify-center overflow-hidden mb-3 border border-border relative">
                {/* Show selected preview (highest priority) */}
                {state.previewUrl && state.status === "ready_to_save" ? (
                  <img
                    src={state.previewUrl}
                    alt="معاينة الصورة الجديدة"
                    className="h-full w-full object-contain p-2"
                  />
                ) : state.status === "saving" ? (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-brand" />
                    <span className="text-xs">جاري الحفظ والتطبيق...</span>
                  </div>
                ) : state.status === "saved" ? (
                  <div className="flex flex-col items-center gap-2 text-cyan-brand">
                    <CheckCircle2 className="h-10 w-10" />
                    <span className="text-xs font-semibold">تم تطبيق الصورة على الموقع</span>
                  </div>
                ) : state.status === "error" ? (
                  <div className="flex flex-col items-center gap-2 text-destructive">
                    <AlertCircle className="h-8 w-8" />
                    <span className="text-xs">{state.errorMsg}</span>
                  </div>
                ) : savedUrl ? (
                  <img
                    src={savedUrl}
                    alt={slot.label}
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-muted-foreground/40">
                    <ImageIcon className="h-8 w-8" />
                    <span className="text-[10px]">لم يتم اختيار صورة</span>
                  </div>
                )}
              </div>

              {/* File info (when selected) */}
              {state.selectedFile && state.status === "ready_to_save" && (
                <div className="mb-3 flex items-center gap-2 rounded-lg bg-cyan-brand/5 border border-cyan-brand/20 px-3 py-2">
                  <FileImage className="h-4 w-4 text-cyan-brand shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate">{state.selectedFile.name}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {formatSize(state.selectedFile.size)} • {state.selectedFile.type}
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="space-y-2">
                {state.status === "ready_to_save" ? (
                  /* Save / Cancel buttons when a file is selected */
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSave(slot.key)}
                      className="flex-1 gap-1.5"
                      size="sm"
                    >
                      <Save className="h-3.5 w-3.5" />
                      حفظ وتطبيق
                    </Button>
                    <Button
                      onClick={() => handleCancel(slot.key)}
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                    >
                      <X className="h-3.5 w-3.5" />
                      إلغاء
                    </Button>
                  </div>
                ) : state.status === "error" ? (
                  /* Retry button on error */
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleSelectFile(slot.key, f);
                        e.target.value = "";
                      }}
                    />
                    <span className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-destructive/40 py-2 text-xs font-medium hover:bg-destructive/5 transition-colors">
                      <RefreshCw className="h-3.5 w-3.5" />
                      إعادة المحاولة
                    </span>
                  </label>
                ) : (
                  /* Default state: upload button + delete button (if saved image exists) */
                  <div className="space-y-2">
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        className="hidden"
                        disabled={state.status === "saving"}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleSelectFile(slot.key, f);
                          e.target.value = "";
                        }}
                      />
                      <span
                        className={`flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-xs font-medium hover:border-cyan-brand/40 hover:bg-muted/30 transition-colors ${
                          state.status === "saving" ? "opacity-50 pointer-events-none" : ""
                        }`}
                      >
                        <Upload className="h-3.5 w-3.5" />
                        {savedUrl ? "تغيير الصورة" : "رفع صورة"}
                      </span>
                    </label>
                    {savedUrl && (
                      <Button
                        onClick={() => handleDelete(slot.key)}
                        variant="outline"
                        size="sm"
                        className="w-full gap-1.5 text-destructive hover:bg-destructive/5 hover:text-destructive"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {deleteMutation.isPending ? "جاري الحذف..." : "حذف الصورة"}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Info footer */}
      <div className="rounded-lg bg-muted/30 border border-border p-3 text-xs text-muted-foreground">
        <p className="font-semibold mb-1">ملاحظات:</p>
        <ul className="space-y-0.5 list-disc list-inside">
          <li>الأنواع المسموحة: JPG, JPEG, PNG, WEBP</li>
          <li>الحجم الأقصى: 5 ميجابايت</li>
          <li>بعد الحفظ، تظهر الصورة فوراً في الموقع العام وفي المعاينة</li>
          <li>تغيير الصورة يستبدل القديمة تلقائياً</li>
        </ul>
      </div>
    </div>
  );
}

function StatusBadge({ status, hasSaved }: { status: SlotStatus; hasSaved: boolean }) {
  if (status === "saving") {
    return (
      <Badge className="text-[10px] gap-1 bg-cyan-brand/10 text-cyan-brand border-cyan-brand/20">
        <Loader2 className="h-2.5 w-2.5 animate-spin" />
        جاري الحفظ
      </Badge>
    );
  }
  if (status === "saved") {
    return (
      <Badge className="text-[10px] gap-1 bg-green-500/10 text-green-600 border-green-500/20">
        <CheckCircle2 className="h-2.5 w-2.5" />
        تم التطبيق
      </Badge>
    );
  }
  if (status === "ready_to_save") {
    return (
      <Badge className="text-[10px] gap-1 bg-amber-500/10 text-amber-600 border-amber-500/20">
        <FileImage className="h-2.5 w-2.5" />
        جاهز للحفظ
      </Badge>
    );
  }
  if (status === "error") {
    return (
      <Badge className="text-[10px] gap-1 bg-destructive/10 text-destructive border-destructive/20">
        <AlertCircle className="h-2.5 w-2.5" />
        خطأ
      </Badge>
    );
  }
  if (hasSaved) {
    return (
      <Badge variant="outline" className="text-[10px] gap-1">
        <CheckCircle2 className="h-2.5 w-2.5" />
        مفعّل
      </Badge>
    );
  }
  return null;
}
