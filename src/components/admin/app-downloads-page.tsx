"use client";

import { useTranslations } from "next-intl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Smartphone, Upload, Star, Trash2, UploadCloud, FileDown } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { motion } from "framer-motion";

interface Release {
  id: string;
  platform: string;
  version: string;
  versionCode: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  releaseNotesAr: string | null;
  releaseNotesEn: string | null;
  apkUrl: string;
  fileSize: number;
  published: boolean;
  isLatest: boolean;
  releasedAt: string;
  createdAt: string;
}

function formatBytes(bytes: number): string {
  if (!bytes) return "—";
  const mb = bytes / (1024 * 1024);
  if (mb < 1) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${mb.toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("ar-IQ", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

export function AppDownloadsPage() {
  const t = useTranslations("admin.appDownloads");
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    version: "",
    versionCode: "1",
    nameAr: "تطبيق ألف باء",
    nameEn: "Alif Baa App",
    descriptionAr: "",
    descriptionEn: "",
    releaseNotesAr: "",
    releaseNotesEn: "",
    isLatest: true,
    published: true,
  });
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data, isLoading } = useQuery<{ releases: Release[] }>({
    queryKey: ["app-releases"],
    queryFn: async () => {
      const res = await fetch("/api/admin/app-releases");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!apkFile) throw new Error("APK file required");
      const formData = new FormData();
      formData.append("apk", apkFile);
      formData.append("platform", "ANDROID");
      formData.append("version", form.version);
      formData.append("versionCode", form.versionCode);
      formData.append("nameAr", form.nameAr);
      formData.append("nameEn", form.nameEn);
      formData.append("descriptionAr", form.descriptionAr);
      formData.append("descriptionEn", form.descriptionEn);
      formData.append("releaseNotesAr", form.releaseNotesAr);
      formData.append("releaseNotesEn", form.releaseNotesEn);
      formData.append("isLatest", String(form.isLatest));
      formData.append("published", String(form.published));
      const res = await fetch("/api/admin/app-releases", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app-releases"] });
      toast.success("تم إنشاء الإصدار بنجاح");
      setOpen(false);
      setApkFile(null);
      setForm({ ...form, version: "", versionCode: String(Number(form.versionCode) + 1), releaseNotesAr: "", releaseNotesEn: "" });
    },
    onError: () => toast.error("فشل إنشاء الإصدار"),
  });

  const patchMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: "publish" | "unpublish" | "latest" | "delete" }) => {
      const res = await fetch("/api/admin/app-releases", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app-releases"] });
      toast.success("تم التحديث");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.version || !apkFile) {
      toast.error("الرجاء إدخال الإصدار وملف APK");
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-extrabold text-2xl lg:text-3xl">{t("title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              {t("addRelease")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>{t("addRelease")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">{t("version")} *</Label>
                  <Input value={form.version} onChange={e => setForm({ ...form, version: e.target.value })} placeholder="1.0.0" required />
                </div>
                <div>
                  <Label className="text-xs">{t("versionCode")} *</Label>
                  <Input type="number" value={form.versionCode} onChange={e => setForm({ ...form, versionCode: e.target.value })} required />
                </div>
                <div>
                  <Label className="text-xs">الاسم (عربي)</Label>
                  <Input value={form.nameAr} onChange={e => setForm({ ...form, nameAr: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">الاسم (إنجليزي)</Label>
                  <Input value={form.nameEn} onChange={e => setForm({ ...form, nameEn: e.target.value })} />
                </div>
              </div>

              <div>
                <Label className="text-xs">{t("apkFile")} *</Label>
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    accept=".apk,application/vnd.android.package-archive"
                    className="hidden"
                    onChange={e => setApkFile(e.target.files?.[0] || null)}
                  />
                  <span className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-4 text-sm hover:border-primary/40 hover:bg-muted/30 transition-colors">
                    <UploadCloud className="h-5 w-5 text-primary" />
                    {apkFile ? `${apkFile.name} (${formatBytes(apkFile.size)})` : "اختر ملف APK"}
                  </span>
                </label>
              </div>

              <div>
                <Label className="text-xs">{t("releaseNotes")} (عربي)</Label>
                <Textarea value={form.releaseNotesAr} onChange={e => setForm({ ...form, releaseNotesAr: e.target.value })} rows={3} />
              </div>
              <div>
                <Label className="text-xs">{t("releaseNotes")} (إنجليزي)</Label>
                <Textarea value={form.releaseNotesEn} onChange={e => setForm({ ...form, releaseNotesEn: e.target.value })} rows={3} />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isLatest}
                    onChange={e => setForm({ ...form, isLatest: e.target.checked })}
                    className="rounded"
                  />
                  {t("isLatest")}
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={e => setForm({ ...form, published: e.target.checked })}
                    className="rounded"
                  />
                  {t("publish")}
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={createMutation.isPending || uploading} className="gap-2">
                  {createMutation.isPending ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                      جاري الرفع...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      إنشاء
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Releases list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : data?.releases?.length ? (
        <div className="space-y-3">
          {data.releases.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <Card className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${r.isLatest ? "bg-gradient-to-br from-brand to-forest text-white" : "bg-primary/10 text-primary"}`}>
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-bold text-base">{r.nameAr}</span>
                      <Badge variant="outline" className="text-[10px]">v{r.version}</Badge>
                      <Badge variant="outline" className="text-[10px]">#{r.versionCode}</Badge>
                      {r.isLatest && (
                        <Badge className="text-[10px] gap-1">
                          <Star className="h-3 w-3" />
                          {t("isLatest")}
                        </Badge>
                      )}
                      <Badge variant={r.published ? "default" : "secondary"} className="text-[10px]">
                        {r.published ? "منشور" : "مسودة"}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t("platform")}: {r.platform} · {formatBytes(r.fileSize)} · {formatDate(r.releasedAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button asChild size="sm" variant="outline" className="gap-1">
                    <a href={r.apkUrl} download>
                      <FileDown className="h-3.5 w-3.5" />
                      تحميل
                    </a>
                  </Button>
                  {!r.isLatest && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => patchMutation.mutate({ id: r.id, action: "latest" })}
                      className="gap-1"
                    >
                      <Star className="h-3.5 w-3.5" />
                      {t("setLatest")}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant={r.published ? "secondary" : "default"}
                    onClick={() => patchMutation.mutate({ id: r.id, action: r.published ? "unpublish" : "publish" })}
                  >
                    {r.published ? t("unpublish") : t("publish")}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (confirm("هل أنت متأكد من الحذف؟")) {
                        patchMutation.mutate({ id: r.id, action: "delete" });
                      }
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <Smartphone className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>لا توجد إصدارات بعد. ابدأ برفع أول إصدار APK.</p>
        </div>
      )}
    </div>
  );
}
