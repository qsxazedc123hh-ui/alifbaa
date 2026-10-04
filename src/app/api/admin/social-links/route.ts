import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const includeDeleted = searchParams.get("deleted") === "true";
    const where: Record<string, unknown> = {};
    if (!includeDeleted) where.deletedAt = null;
    const links = await db.socialLink.findMany({ where, orderBy: { order: "asc" } });
    return NextResponse.json({ links });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const { platform, url, order, visible } = body as { platform: string; url: string; order?: number; visible?: boolean };
    if (!platform || !url) return NextResponse.json({ error: "platform and url required" }, { status: 400 });
    const link = await db.socialLink.create({
      data: { platform, url, order: order ?? 0, visible: visible ?? true },
    });
    return NextResponse.json({ ok: true, link });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const { id, action, data } = body as { id: string; action: "update" | "delete" | "restore"; data?: Record<string, unknown> };
    if (!id || !action) return NextResponse.json({ error: "id and action required" }, { status: 400 });

    if (action === "delete") {
      const link = await db.socialLink.update({ where: { id }, data: { deletedAt: new Date(), deletedBy: admin.id } });
      return NextResponse.json({ ok: true, link });
    }
    if (action === "restore") {
      const link = await db.socialLink.update({ where: { id }, data: { deletedAt: null, deletedBy: null } });
      return NextResponse.json({ ok: true, link });
    }
    if (action === "update" && data) {
      const link = await db.socialLink.update({ where: { id }, data });
      return NextResponse.json({ ok: true, link });
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await db.socialLink.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
