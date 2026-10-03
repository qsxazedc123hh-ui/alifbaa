"use client";

import { useTranslations } from "next-intl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, Search, Trash2, Copy, X, FileVideo, FileImage } from "lucide-react";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";

interface MediaItem {
  id: string;
  name: string;
  altText: string | null;
  category: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  url: string;
  thumbnailUrl: string | null;
  tags: string | null;
  createdAt: string;
}

const CATEGORIES = [
  { value: "ALL", labelKey: "ALL" },
  { value: "LOGOS", labelKey: "LOGOS" },
  { value: "BACKGROUNDS", labelKey: "BACKGROUNDS" },
  { value: "CAMPUS", labelKey: "CAMPUS" },
  { value: "VIDEOS", labelKey: "VIDEOS" },
  { value: "REELS", labelKey: "REELS" },
  { value: "CLASSES", labelKey: "CLASSES" },
  { value: "SUBJECTS", labelKey: "SUBJECTS" },
  { value: "APP_ASSETS", labelKey: "APP_ASSETS" },
  { value: "GENERAL", labelKey: "GENERAL" },
] as const;

function formatBytes(bytes: number): string {
  if (!bytes) return "—";
  const mb = bytes / (1024 * 1024);
  if (mb < 1) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${mb.toFixed(1)} MB`;
}

export function MediaPage() {
  const t = useTranslations("admin.media");
  const queryClient = useQueryClient();
  const [category, setCategory] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [uploadCat, setUploadCat] = useState<string>("GENERAL");
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useQuery<{ items: MediaItem[]; total: number }>({
    queryKey: ["media", category, search],
    queryFn: async () => {
      const params = new URLSearchParams({ category, search, pageSize: "48" });
      const res = await fetch(`/api/media?${params}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const results = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", uploadCat);
        formData.append("altText", file.name);
        const res = await fetch("/api/media", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Upload failed");
        results.push(await res.json());
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("تم رفع الملفات بنجاح");
    },
    onError: () => toast.error("فشل رفع الملف"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/media?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("تم الحذف");
      setPreview(null);
    },
  });

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    uploadMutation.mutate(Array.from(files));
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("تم نسخ الرابط");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl lg:text-3xl">{t("title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      {/* Upload zone */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-base">{t("upload")}</h2>
          <select
            value={uploadCat}
            onChange={e => setUploadCat(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
          >
            {CATEGORIES.filter(c => c.value !== "ALL").map(c => (
              <option key={c.value} value={c.value}>
                {t(`categories.${c.labelKey}` as never)}
              </option>
            ))}
          </select>
        </div>
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInput.current?.click()}
          className={`rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/30"
          }`}
        >
          <input
            ref={fileInput}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={e => handleFiles(e.target.files)}
          />
          <Upload className="h-10 w-10 mx-auto mb-3 text-primary" />
          <p className="font-semibold text-sm">{t("dragDrop")}</p>
          <p className="text-xs text-muted-foreground mt-1">{t("maxSize")} · {t("supportedTypes")}</p>
          {uploadMutation.isPending && (
            <div className="mt-3 inline-flex items-center gap-2 text-xs text-primary">
              <span className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              جاري الرفع...
            </div>
          )}
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="ps-9"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map(c => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                category === c.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {t(`categories.${c.labelKey}` as never)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : data?.items?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {data.items.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-card transition-all"
            >
              <button
                onClick={() => setPreview(item)}
                className="block w-full aspect-square bg-muted relative overflow-hidden"
              >
                {item.mimeType.startsWith("image/") ? (
                  <img src={item.thumbnailUrl || item.url} alt={item.altText || item.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                ) : item.mimeType.startsWith("video/") ? (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-brand/20 to-gold/20">
                    <FileVideo className="h-8 w-8 text-muted-foreground" />
                  </div>
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-muted">
                    <FileImage className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </button>
              <div className="p-2.5">
                <p className="text-xs font-medium truncate">{item.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-muted-foreground">{formatBytes(item.size)}</span>
                  <Badge variant="outline" className="text-[9px] py-0 px-1.5">
                    {t(`categories.${item.category}` as never)}
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <FileImage className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>{t("noResults")}</p>
        </div>
      )}

      {/* Preview modal */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreview(null)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card rounded-2xl border border-border max-w-2xl w-full max-h-[90vh] overflow-auto"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-sm truncate">{preview.name}</h3>
                <Button variant="ghost" size="sm" onClick={() => setPreview(null)} className="p-1 h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4">
                <div className="rounded-xl bg-muted overflow-hidden mb-4 flex items-center justify-center min-h-[200px]">
                  {preview.mimeType.startsWith("image/") ? (
                    <img src={preview.url} alt={preview.altText || preview.name} className="max-h-[400px] w-auto object-contain" />
                  ) : (
                    <video src={preview.url} controls className="max-h-[400px] w-full" />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <Info label="النوع" value={preview.mimeType} />
                  <Info label="الحجم" value={formatBytes(preview.size)} />
                  <Info label="الأبعاد" value={preview.width && preview.height ? `${preview.width}×${preview.height}` : "—"} />
                  <Info label="التصنيف" value={t(`categories.${preview.category}` as never)} />
                </div>
                <div className="mt-4">
                  <Label className="text-xs font-semibold block mb-1">الرابط</Label>
                  <div className="flex gap-2">
                    <Input value={preview.url} readOnly className="text-xs font-mono" />
                    <Button size="sm" variant="outline" onClick={() => copyUrl(preview.url)} className="shrink-0">
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-4 gap-2"
                  onClick={() => deleteMutation.mutate(preview.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  حذف
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-2.5">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="font-semibold truncate">{value}</div>
    </div>
  );
}
