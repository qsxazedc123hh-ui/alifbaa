import { NextRequest, NextResponse } from "next/server";
import { compare, hash } from "bcryptjs";
import { verifyAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

/** POST /api/admin/password — change password */
export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body as {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    };

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
    }
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "كلمتا المرور غير متطابقتين" }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: "كلمة المرور قصيرة جداً (6 أحرف على الأقل)" }, { status: 400 });
    }

    const adminUser = await db.adminUser.findUnique({ where: { id: admin.id } });
    if (!adminUser) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const valid = await compare(currentPassword, adminUser.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "كلمة المرور الحالية غير صحيحة" }, { status: 401 });
    }

    const passwordHash = await hash(newPassword, 12);
    await db.adminUser.update({
      where: { id: admin.id },
      data: { passwordHash },
    });

    await db.auditLog.create({
      data: { adminId: admin.id, action: "PASSWORD_CHANGE", module: "AUTH", entityId: admin.id },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Password change error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

/** PATCH /api/admin/password — update session duration */
export async function PATCH(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { sessionDurationMins } = body as { sessionDurationMins: number };

    if (!sessionDurationMins || sessionDurationMins < 5 || sessionDurationMins > 1440) {
      return NextResponse.json({ error: "مدة غير صالحة (5-1440 دقيقة)" }, { status: 400 });
    }

    await db.adminUser.update({
      where: { id: admin.id },
      data: { sessionDurationMins },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
