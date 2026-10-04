import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const items = await db.campusItem.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ items });
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
    const { key, label, iconKey, customUrl, sectionKey, order, visible, inBottomNav, bottomNavOrder } = body;
    if (!key || !label) return NextResponse.json({ error: "key and label required" }, { status: 400 });
    const item = await db.campusItem.create({
      data: {
        key, label,
        iconKey: iconKey || null,
        customUrl: customUrl || null,
        sectionKey: sectionKey || null,
        order: order ?? 0,
        visible: visible ?? true,
        inBottomNav: inBottomNav ?? false,
        bottomNavOrder: bottomNavOrder ?? 0,
      },
    });
    return NextResponse.json({ ok: true, item });
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
    const { id, data } = body as { id: string; data: Record<string, unknown> };
    if (!id || !data) return NextResponse.json({ error: "id and data required" }, { status: 400 });
    const item = await db.campusItem.update({ where: { id }, data });
    return NextResponse.json({ ok: true, item });
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
    await db.campusItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
