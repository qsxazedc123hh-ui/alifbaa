"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface WhatsAppNumber {
  id: string;
  name: string;
  number: string;
  order: number;
  visible: boolean;
}

export function WhatsAppAdminPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", number: "", order: 0, visible: true });

  const { data } = useQuery<{ numbers: WhatsAppNumber[] }>({
    queryKey: ["whatsapp"],
    queryFn: async () => {
      const res = await fetch("/api/admin/whatsapp");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp"] });
      toast.success("تمت الإضافة");
      setOpen(false);
      setForm({ name: "", number: "", order: 0, visible: true });
    },
  });

  const patchMutation = useMutation({
    mutationFn: async ({ id, action, data }: { id: string; action: string; data?: Record<string, unknown> }) => {
      const res = await fetch("/api/admin/whatsapp", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, data }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp"] });
      toast.success("تم التحديث");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-extrabold text-2xl lg:text-3xl">أرقام واتساب</h1>
          <p className="text-sm text-muted-foreground mt-1">إدارة أرقام واتساب المتعددة</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة رقم
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>إضافة رقم واتساب</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">الاسم *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" placeholder="مثال: الدعم الفني" />
              </div>
              <div>
                <Label className="text-xs">الرقم *</Label>
                <Input value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} className="mt-1" dir="ltr" placeholder="+9647700000000" />
              </div>
              <div>
                <Label className="text-xs">الترتيب</Label>
                <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="mt-1" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={form.visible} onCheckedChange={(v) => setForm({ ...form, visible: v })} />
                ظاهر
              </label>
              <Button onClick={() => createMutation.mutate()} disabled={!form.name || !form.number} className="w-full gap-2">
                <Plus className="h-4 w-4" />
                إضافة
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {data?.numbers.map((w) => (
          <Card key={w.id} className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-brand/10 text-cyan-brand flex items-center justify-center shrink-0">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">{w.name}</div>
              <div className="text-xs text-muted-foreground" dir="ltr">{w.number}</div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive h-8 w-8 p-0"
              onClick={() => {
                if (confirm("حذف الرقم؟")) patchMutation.mutate({ id: w.id, action: "delete" });
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </Card>
        ))}
        {data?.numbers.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <MessageCircle className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>لا توجد أرقام بعد</p>
          </div>
        )}
      </div>
    </div>
  );
}
