"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  order: number;
  visible: boolean;
}

const PLATFORMS = ["FACEBOOK", "INSTAGRAM", "TIKTOK", "YOUTUBE"];

export function SocialAdminPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ platform: "FACEBOOK", url: "", order: 0, visible: true });

  const { data } = useQuery<{ links: SocialLink[] }>({
    queryKey: ["social-links"],
    queryFn: async () => {
      const res = await fetch("/api/admin/social-links");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-links"] });
      toast.success("تمت الإضافة");
      setOpen(false);
      setForm({ platform: "FACEBOOK", url: "", order: 0, visible: true });
    },
  });

  const patchMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: string }) => {
      const res = await fetch("/api/admin/social-links", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-links"] });
      toast.success("تم التحديث");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-extrabold text-2xl lg:text-3xl">روابط التواصل</h1>
          <p className="text-sm text-muted-foreground mt-1">Facebook • Instagram • TikTok • YouTube</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة رابط
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>إضافة رابط تواصل</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">المنصة</Label>
                <select
                  value={form.platform}
                  onChange={(e) => setForm({ ...form, platform: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs">الرابط *</Label>
                <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="mt-1" dir="ltr" placeholder="https://..." />
              </div>
              <div>
                <Label className="text-xs">الترتيب</Label>
                <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="mt-1" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={form.visible} onCheckedChange={(v) => setForm({ ...form, visible: v })} />
                ظاهر
              </label>
              <Button onClick={() => createMutation.mutate()} disabled={!form.url} className="w-full gap-2">
                <Plus className="h-4 w-4" />
                إضافة
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {data?.links.map((s) => (
          <Card key={s.id} className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-700 text-white flex items-center justify-center shrink-0">
              <Share2 className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">{s.platform}</Badge>
                {!s.visible && <Badge variant="secondary" className="text-[10px]">مخفي</Badge>}
              </div>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-brand hover:underline truncate block mt-1" dir="ltr">
                {s.url}
              </a>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive h-8 w-8 p-0"
              onClick={() => {
                if (confirm("حذف الرابط؟")) patchMutation.mutate({ id: s.id, action: "delete" });
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </Card>
        ))}
        {data?.links.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Share2 className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>لا توجد روابط بعد</p>
          </div>
        )}
      </div>
    </div>
  );
}
