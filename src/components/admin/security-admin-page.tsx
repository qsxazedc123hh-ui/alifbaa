"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function SecurityAdminPage() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [sessionMins, setSessionMins] = useState(60);
  const [sessionLoading, setSessionLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "فشل التغيير");
        return;
      }
      toast.success("تم تغيير كلمة المرور بنجاح");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      toast.error("فشل الاتصال");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSession = async () => {
    setSessionLoading(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionDurationMins: sessionMins }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("تم تحديث مدة الجلسة");
    } catch {
      toast.error("فشل التحديث");
    } finally {
      setSessionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl lg:text-3xl">الأمان</h1>
        <p className="text-sm text-muted-foreground mt-1">تغيير كلمة المرور ومدة الجلسة</p>
      </div>

      {/* Change password */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="h-5 w-5 text-cyan-brand" />
          <h2 className="font-display font-bold text-base">تغيير كلمة المرور</h2>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-3 max-w-md">
          <div>
            <Label className="text-xs">كلمة المرور الحالية</Label>
            <Input
              type="password"
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">كلمة المرور الجديدة</Label>
            <Input
              type="password"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">تأكيد كلمة المرور الجديدة</Label>
            <Input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
              className="mt-1"
            />
          </div>
          <Button type="submit" disabled={loading} className="gap-2">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                تغيير كلمة المرور
              </>
            )}
          </Button>
        </form>
      </Card>

      {/* Session duration */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-cyan-brand" />
          <h2 className="font-display font-bold text-base">مدة الجلسة</h2>
        </div>
        <div className="flex items-end gap-3 max-w-md">
          <div className="flex-1">
            <Label className="text-xs">المدة بالدقائق (5-1440)</Label>
            <Input
              type="number"
              min={5}
              max={1440}
              value={sessionMins}
              onChange={(e) => setSessionMins(Number(e.target.value))}
              className="mt-1"
            />
          </div>
          <Button onClick={handleUpdateSession} disabled={sessionLoading} className="gap-2">
            {sessionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4" />}
            حفظ
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          بعد انتهاء هذه المدة، سيُطلب منك إدخال كلمة المرور مرة أخرى.
        </p>
      </Card>
    </div>
  );
}
