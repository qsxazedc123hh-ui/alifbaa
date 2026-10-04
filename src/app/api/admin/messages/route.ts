import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // unread | all
    const where: Record<string, unknown> = {};
    if (filter === "unread") where.isRead = false;
    const messages = await db.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ messages });
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
    const { id, action } = body as { id: string; action: "read" | "unread" | "delete" | "restore" };
    if (!id || !action) return NextResponse.json({ error: "id and action required" }, { status: 400 });

    if (action === "delete") {
      const msg = await db.contactMessage.update({
        where: { id },
        data: { deletedAt: new Date(), deletedBy: admin.id },
      });
      return NextResponse.json({ ok: true, msg });
    }
    if (action === "restore") {
      const msg = await db.contactMessage.update({
        where: { id },
        data: { deletedAt: null, deletedBy: null },
      });
      return NextResponse.json({ ok: true, msg });
    }
    const updates: Record<string, unknown> = {};
    if (action === "read") { updates.isRead = true; updates.readAt = new Date(); }
    if (action === "unread") { updates.isRead = false; updates.readAt = null; }
    const msg = await db.contactMessage.update({ where: { id }, data: updates });
    return NextResponse.json({ ok: true, msg });
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
    await db.contactMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
