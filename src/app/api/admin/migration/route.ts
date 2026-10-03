import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";

/**
 * POST /api/admin/migration
 * One-time endpoint to seed the initial super admin.
 * Safe to call multiple times — only creates if missing.
 */
export async function POST(_req: NextRequest) {
  try {
    const existing = await db.adminUser.findUnique({
      where: { email: "admin@alifbaa.edu" },
    });

    if (existing) {
      return NextResponse.json({
        ok: true,
        message: "Admin already exists",
        email: existing.email,
      });
    }

    const passwordHash = await hash("admin123", 12);

    const admin = await db.adminUser.create({
      data: {
        email: "admin@alifbaa.edu",
        name: "Alif Baa Admin",
        passwordHash,
        role: "SUPER_ADMIN",
        isActive: true,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Super admin created",
      email: admin.email,
      temporaryPassword: "admin123",
      note: "Please change the password immediately after first login.",
    });
  } catch (err) {
    console.error("Migration error:", err);
    return NextResponse.json(
      { ok: false, error: "Migration failed" },
      { status: 500 }
    );
  }
}
