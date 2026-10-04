import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";

/** GET /api/admin/verify — check if admin session is valid */
export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    return NextResponse.json({
      ok: true,
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}
