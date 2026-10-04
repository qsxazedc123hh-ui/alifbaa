"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Trash2, Check, MailOpen } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Message {
  id: string;
  name: string;
  contact: string;
  message: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export function MessagesAdminPage() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Message | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const { data } = useQuery<{ messages: Message[] }>({
    queryKey: ["messages", filter],
    queryFn: async () => {
      const url = filter === "unread" ? "/api/admin/messages?filter=unread" : "/api/admin/messages";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const patchMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: string }) => {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  const openMessage = (msg: Message) => {
    setSelected(msg);
    if (!msg.isRead) {
      patchMutation.mutate({ id: msg.id, action: "read" });
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString("ar-IQ", { dateStyle: "short", timeStyle: "short" });
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-extrabold text-2xl lg:text-3xl">الرسائل</h1>
          <p className="text-sm text-muted-foreground mt-1">رسائل الزوار من نموذج التواصل</p>
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            الكل
          </Button>
          <Button
            size="sm"
            variant={filter === "unread" ? "default" : "outline"}
            onClick={() => setFilter("unread")}
          >
            غير مقروءة
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {data?.messages.map((msg) => (
          <Card
            key={msg.id}
            className={`p-4 flex items-center gap-3 cursor-pointer hover:shadow-card transition-all ${!msg.isRead ? "border-cyan-brand/30 bg-cyan-brand/5" : ""}`}
            onClick={() => openMessage(msg)}
          >
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${msg.isRead ? "bg-muted text-muted-foreground" : "bg-cyan-brand/10 text-cyan-brand"}`}>
              {msg.isRead ? <MailOpen className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{msg.name}</span>
                {!msg.isRead && <Badge className="text-[9px]">جديد</Badge>}
              </div>
              <p className="text-xs text-muted-foreground truncate">{msg.message}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{formatDate(msg.createdAt)}</p>
            </div>
          </Card>
        ))}
        {data?.messages.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Mail className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>لا توجد رسائل</p>
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>رسالة من {selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3">
              <div>
                <div className="text-[10px] text-muted-foreground uppercase">معلومات التواصل</div>
                <p className="text-sm font-mono mt-0.5" dir="ltr">{selected.contact}</p>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase">الرسالة</div>
                <p className="text-sm mt-0.5 leading-relaxed">{selected.message}</p>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase">التاريخ</div>
                <p className="text-xs mt-0.5">{formatDate(selected.createdAt)}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => patchMutation.mutate({ id: selected.id, action: selected.isRead ? "unread" : "read" })}
                >
                  <Check className="h-3 w-3" />
                  {selected.isRead ? "تحديد كغير مقروءة" : "تحديد كمقروءة"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive gap-1"
                  onClick={() => {
                    if (confirm("حذف الرسالة؟")) {
                      patchMutation.mutate({ id: selected.id, action: "delete" });
                      setSelected(null);
                    }
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                  حذف
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
