"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, RotateCcw, Video, Newspaper, Smartphone, MessageCircle, Share2, Mail } from "lucide-react";
import { toast } from "sonner";

interface TrashItem {
  id: string;
  title: string;
  type: string;
  deletedAt: string | null;
  deletedBy: string | null;
}

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  VIDEO: Video,
  NEWS: Newspaper,
  APP_LINK: Smartphone,
  WHATSAPP: MessageCircle,
  SOCIAL: Share2,
  MESSAGE: Mail,
};

const TYPE_LABELS: Record<string, string> = {
  VIDEO: "فيديو",
  NEWS: "خبر",
  APP_LINK: "رابط تطبيق",
  WHATSAPP: "واتساب",
  SOCIAL: "رابط تواصل",
  MESSAGE: "رسالة",
};

export function TrashAdminPage() {
  const queryClient = useQueryClient();

  const { data } = useQuery<{ trash: Record<string, TrashItem[]> }>({
    queryKey: ["trash"],
    queryFn: async () => {
      const res = await fetch("/api/admin/trash");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string; id: string }) => {
      const res = await fetch("/api/admin/trash", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trash"] });
      toast.success("تم الاسترجاع");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string; id: string }) => {
      const res = await fetch(`/api/admin/trash?type=${type}&id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trash"] });
      toast.success("تم الحذف النهائي");
    },
  });

  const allItems: TrashItem[] = data?.trash ? Object.values(data.trash).flat() : [];

  const formatDate = (iso: string | null) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleString("ar-IQ", { dateStyle: "short", timeStyle: "short" });
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl lg:text-3xl">المحذوفات</h1>
        <p className="text-sm text-muted-foreground mt-1">استرجاع العناصر المحذوفة أو حذفها نهائياً</p>
      </div>

      {allItems.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Trash2 className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p>المحذوفات فارغة</p>
        </div>
      ) : (
        <div className="space-y-2">
          {allItems.map((item) => {
            const Icon = TYPE_ICONS[item.type] || Trash2;
            return (
              <Card key={`${item.type}-${item.id}`} className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm truncate">{item.title}</span>
                    <Badge variant="outline" className="text-[9px]">{TYPE_LABELS[item.type] || item.type}</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    حُذف في: {formatDate(item.deletedAt)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 h-8"
                  onClick={() => restoreMutation.mutate({ type: item.type, id: item.id })}
                >
                  <RotateCcw className="h-3 w-3" />
                  استرجاع
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive h-8 w-8 p-0"
                  onClick={() => {
                    if (confirm("حذف نهائي؟ لا يمكن التراجع.")) {
                      deleteMutation.mutate({ type: item.type, id: item.id });
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
