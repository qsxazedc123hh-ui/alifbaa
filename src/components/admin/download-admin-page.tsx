"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Globe, Smartphone, Apple, Download } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface AppLink {
  id: string;
  name: string;
  url: string;
  type: string;
  icon: string | null;
  order: number;
  visible: boolean;
}

const TYPES = [
  { value: "APK", label: "Android APK" },
  { value: "PLAY_STORE", label: "Google Play" },
  { value: "APP_STORE", label: "App Store" },
  { value: "WEB", label: "منصة الويب" },
  { value: "OTHER", label: "أخرى" },
];

export function DownloadAdminPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", url: "", type: "APK", order: 0, visible: true });

  const { data } = useQuery<{ links: AppLink[] }>({
    queryKey: ["app-links"],
    queryFn: async () => {
      const res = await fetch("/api/admin/app-links");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/app-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app-links"] });
      toast.success("تمت الإضافة");
      setOpen(false);
      setForm({ name: "", url: "", type: "APK", order: 0, visible: true });
    },
  });

  const patchMutation = useMutation({
    mutationFn: async ({ id, action, data }: { id: string; action: string; data?: Record<string, unknown> }) => {
      const res = await fetch("/api/admin/app-links", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, data }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["app-links"] });
      toast.success("تم التحديث");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-extrabold text-2xl lg:text-3xl">تحميل التطبيق</h1>
          <p className="text-sm text-muted-foreground mt-1">إدارة روابط التحميل (APK, Play Store, App Store, Web)</p>
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
              <DialogTitle>إضافة رابط تحميل</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">الاسم *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" placeholder="مثال: تحميل Android" />
              </div>
              <div>
                <Label className="text-xs">الرابط *</Label>
                <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="mt-1" dir="ltr" placeholder="https://..." />
              </div>
              <div>
                <Label className="text-xs">النوع</Label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  {TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs">الترتيب</Label>
                <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="mt-1" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={form.visible} onCheckedChange={(v) => setForm({ ...form, visible: v })} />
                ظاهر
              </label>
              <Button onClick={() => createMutation.mutate()} disabled={!form.name || !form.url} className="w-full gap-2">
                <Plus className="h-4 w-4" />
                إضافة
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {data?.links.map((link) => (
          <Card key={link.id} className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-navy to-navy-deep text-navy-foreground flex items-center justify-center shrink-0">
              {link.type === "APK" || link.type === "PLAY_STORE" ? (
                <Smartphone className="h-5 w-5" />
              ) : link.type === "APP_STORE" ? (
                <Apple className="h-5 w-5" />
              ) : link.type === "WEB" ? (
                <Globe className="h-5 w-5" />
              ) : (
                <Download className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{link.name}</span>
                <Badge variant="outline" className="text-[9px]">{link.type}</Badge>
                {!link.visible && <Badge variant="secondary" className="text-[9px]">مخفي</Badge>}
              </div>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-cyan-brand hover:underline truncate block" dir="ltr">
                {link.url}
              </a>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive h-8 w-8 p-0"
              onClick={() => {
                if (confirm("حذف الرابط؟")) patchMutation.mutate({ id: link.id, action: "delete" });
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </Card>
        ))}
        {data?.links.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Download className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>لا توجد روابط تحميل بعد</p>
          </div>
        )}
      </div>
    </div>
  );
}
