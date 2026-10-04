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
import { Upload, Trash2, Star, Newspaper, Image as ImageIcon, Video as VideoIcon, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface News {
  id: string;
  title: string;
  description: string | null;
  contentType: string;
  imageUrl: string | null;
  videoId: string | null;
  featured: boolean;
  published: boolean;
  publishedAt: string;
}

interface Video {
  id: string;
  title: string;
  section: string;
}

export function NewsAdminPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", contentType: "IMAGE", featured: false, videoId: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data } = useQuery<{ news: News[] }>({
    queryKey: ["news"],
    queryFn: async () => {
      const res = await fetch("/api/admin/news");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const { data: videosData } = useQuery<{ videos: Video[] }>({
    queryKey: ["news-videos"],
    queryFn: async () => {
      const res = await fetch("/api/admin/videos?section=news");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("contentType", form.contentType);
      formData.append("featured", String(form.featured));
      if (form.contentType === "VIDEO") {
        formData.append("videoId", form.videoId);
      }
      if (form.contentType === "IMAGE" && imageFile) {
        formData.append("image", imageFile);
      }
      const res = await fetch("/api/admin/news", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast.success("تم إنشاء الخبر");
      setOpen(false);
      setForm({ title: "", description: "", contentType: "IMAGE", featured: false, videoId: "" });
      setImageFile(null);
    },
    onError: () => toast.error("فشل الإنشاء"),
  });

  const patchMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: string }) => {
      const res = await fetch("/api/admin/news", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast.success("تم التحديث");
    },
  });

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("ar-IQ", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-extrabold text-2xl lg:text-3xl">الأخبار</h1>
          <p className="text-sm text-muted-foreground mt-1">نشر وإدارة الأخبار (صورة أو فيديو)</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              إضافة خبر
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>إضافة خبر جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-xs">العنوان *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">الوصف</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">نوع المحتوى</Label>
                <div className="flex gap-2 mt-1">
                  <Button
                    type="button"
                    size="sm"
                    variant={form.contentType === "IMAGE" ? "default" : "outline"}
                    onClick={() => setForm({ ...form, contentType: "IMAGE" })}
                    className="gap-1"
                  >
                    <ImageIcon className="h-3 w-3" /> صورة
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={form.contentType === "VIDEO" ? "default" : "outline"}
                    onClick={() => setForm({ ...form, contentType: "VIDEO" })}
                    className="gap-1"
                  >
                    <VideoIcon className="h-3 w-3" /> فيديو
                  </Button>
                </div>
              </div>
              {form.contentType === "IMAGE" && (
                <div>
                  <Label className="text-xs">صورة الخبر</Label>
                  <label className="cursor-pointer block mt-1">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    />
                    <span className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-3 text-sm hover:border-cyan-brand/40 transition-colors">
                      {imageFile ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-cyan-brand" />
                          {imageFile.name}
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          اختر صورة
                        </>
                      )}
                    </span>
                  </label>
                </div>
              )}
              {form.contentType === "VIDEO" && (
                <div>
                  <Label className="text-xs">اختر فيديو</Label>
                  <select
                    value={form.videoId}
                    onChange={(e) => setForm({ ...form, videoId: e.target.value })}
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="">— اختر —</option>
                    {videosData?.videos.map((v) => (
                      <option key={v.id} value={v.id}>{v.title}</option>
                    ))}
                  </select>
                </div>
              )}
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={form.featured}
                  onCheckedChange={(v) => setForm({ ...form, featured: v })}
                />
                خبر مميز (يظهر في الأعلى)
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
                <Button
                  onClick={() => createMutation.mutate()}
                  disabled={createMutation.isPending || !form.title}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  نشر
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {data?.news.map((n) => (
          <Card key={n.id} className="overflow-hidden">
            {n.contentType === "IMAGE" && n.imageUrl && (
              <div className="aspect-[16/10] bg-muted">
                <img src={n.imageUrl} alt={n.title} className="h-full w-full object-cover" />
              </div>
            )}
            {n.contentType === "VIDEO" && (
              <div className="aspect-[16/10] bg-muted flex items-center justify-center">
                <VideoIcon className="h-8 w-8 text-muted-foreground/40" />
              </div>
            )}
            <div className="p-3">
              <div className="flex items-center gap-2 mb-1">
                {n.featured && <Badge className="text-[9px] gap-1"><Star className="h-3 w-3" />مميز</Badge>}
                <span className="text-[10px] text-muted-foreground">{formatDate(n.publishedAt)}</span>
              </div>
              <h3 className="font-semibold text-sm line-clamp-2">{n.title}</h3>
              <div className="flex gap-1 mt-2">
                <Button
                  size="sm"
                  variant={n.featured ? "default" : "outline"}
                  className="h-7 text-[10px] gap-1 flex-1"
                  onClick={() => patchMutation.mutate({ id: n.id, action: n.featured ? "unfeature" : "feature" })}
                >
                  <Star className="h-3 w-3" />
                  {n.featured ? "مميز" : "تمييز"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-[10px] text-destructive"
                  onClick={() => {
                    if (confirm("حذف الخبر؟")) patchMutation.mutate({ id: n.id, action: "delete" });
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {data?.news.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted-foreground">
            <Newspaper className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>لا توجد أخبار بعد</p>
          </div>
        )}
      </div>
    </div>
  );
}
