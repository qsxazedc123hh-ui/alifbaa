import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { db } from "@/lib/db";
import { SignJWT } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "alifbaa-dev-secret-change-in-production"
);

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    if (!password) {
      return NextResponse.json({ ok: false, error: "كلمة المرور مطلوبة" }, { status: 400 });
    }

    const admin = await db.adminUser.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });

    if (!admin) {
      return NextResponse.json({ ok: false, error: "لا يوجد مدير مُعد" }, { status: 500 });
    }

    const valid = await compare(password, admin.passwordHash);
    if (!valid) {
      return NextResponse.json({ ok: false, error: "كلمة المرور غير صحيحة" }, { status: 401 });
    }

    await db.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    await db.auditLog.create({
      data: { adminId: admin.id, action: "LOGIN", module: "AUTH", entityId: admin.id },
    });

    const durationMins = admin.sessionDurationMins || 60;
    const token = await new SignJWT({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${durationMins}m`)
      .sign(SECRET);

    const res = NextResponse.json({ ok: true });
    res.cookies.set("alifbaa_admin_token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: durationMins * 60,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("Password login error:", err);
    return NextResponse.json({ ok: false, error: "فشل تسجيل الدخول" }, { status: 500 });
  }
}
