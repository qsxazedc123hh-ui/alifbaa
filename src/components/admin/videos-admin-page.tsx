"use client";

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
import { Upload, Trash2, Star, Video as VideoIcon, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useState, useRef } from "react";

interface Video {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  thumbnailUrl: string | null;
  size: number;
  mimeType: string | null;
  section: string;
  featured: boolean;
  published: boolean;
  publishedAt: string;
}

export function VideosAdminPage({ section, title }: { section: string; title: string }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", featured: false });
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const { data } = useQuery<{ videos: Video[] }>({
    queryKey: ["videos", section],
    queryFn: async () => {
      const res = await fetch(`/api/admin/videos?section=${section}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("No file");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("section", section);
      formData.append("featured", String(form.featured));

      return new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/admin/videos");
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error("Upload failed"));
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(formData);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos", section] });
      toast.success("تم رفع الفيديو بنجاح");
      setOpen(false);
      setForm({ title: "", description: "", featured: false });
      setFile(null);
      setProgress(0);
    },
    onError: () => toast.error("فشل الرفع"),
    onSettled: () => setUploading(false),
  });

  const patchMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: string }) => {
      const res = await fetch("/api/admin/videos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos", section] });
      toast.success("تم التحديث");
    },
  });

  const handleUpload = () => {
    if (!file || !form.title) {
      toast.error("الرجاء اختيار ملف وإدخال العنوان");
      return;
    }
    setUploading(true);
    uploadMutation.mutate();
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return "—";
    const mb = bytes / (1024 * 1024);
    if (mb < 1) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-extrabold text-2xl lg:text-3xl">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">رفع وإدارة الفيديوهات — يُفضّل بنسبة 9:16</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              رفع فيديو
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>رفع فيديو جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-xs">العنوان *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">الوصف</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">الملف (9:16 مفضل)</Label>
                <label className="cursor-pointer block mt-1">
                  <input
                    ref={fileInput}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <span className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-4 text-sm hover:border-cyan-brand/40 hover:bg-muted/30 transition-colors">
                    {file ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-cyan-brand" />
                        {file.name} ({formatSize(file.size)})
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        اختر ملف فيديو
                      </>
                    )}
                  </span>
                </label>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={form.featured}
                  onCheckedChange={(v) => setForm({ ...form, featured: v })}
                />
                عرض في الصفحة الرئيسية (مميز)
              </label>

              {uploading && (
                <div className="space-y-1">
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-cyan-brand transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">{progress}%</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
                <Button onClick={handleUpload} disabled={uploading || !file || !form.title} className="gap-2">
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      جاري الرفع...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      رفع
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Videos list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {data?.videos.map((v) => (
          <Card key={v.id} className="p-3">
            <div className="aspect-[9/16] rounded-lg bg-black overflow-hidden mb-2 relative">
              <video
                src={v.videoUrl}
                className="h-full w-full object-cover"
                controls
                playsInline
              />
              {v.featured && (
                <Badge className="absolute top-2 right-2 gap-1 text-[10px]">
                  <Star className="h-3 w-3" />
                  مميز
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-sm line-clamp-1">{v.title}</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">{formatSize(v.size)}</p>
            <div className="flex gap-1 mt-2">
              <Button
                size="sm"
                variant={v.featured ? "default" : "outline"}
                className="h-7 text-[10px] gap-1 flex-1"
                onClick={() => patchMutation.mutate({ id: v.id, action: v.featured ? "unfeature" : "feature" })}
              >
                <Star className="h-3 w-3" />
                {v.featured ? "مميز" : "تمييز"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-[10px] text-destructive"
                onClick={() => {
                  if (confirm("هل أنت متأكد من الحذف؟ سيتم نقل الفيديو للمحذوفات.")) {
                    patchMutation.mutate({ id: v.id, action: "delete" });
                  }
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
        {data?.videos.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted-foreground">
            <VideoIcon className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>لا توجد فيديوهات بعد</p>
          </div>
        )}
      </div>
    </div>
  );
}
