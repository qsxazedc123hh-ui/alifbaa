import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "backgrounds");

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const backgrounds = await db.campusBackground.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ backgrounds });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const label = (formData.get("label") as string) || "خلفية";
    const setActive = formData.get("active") === "true";

    if (!file) return NextResponse.json({ error: "file required" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || "png";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
    if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });
    writeFileSync(join(UPLOAD_DIR, fileName), buffer);
    const url = `/uploads/backgrounds/${fileName}`;

    // Unset others if setActive
    if (setActive) {
      await db.campusBackground.updateMany({ where: { isActive: true }, data: { isActive: false } });
    }

    const bg = await db.campusBackground.create({
      data: { label, url, isActive: setActive, order: 0 },
    });

    return NextResponse.json({ ok: true, background: bg });
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
    const { id, action } = body as { id: string; action: "activate" | "delete" };

    if (action === "activate") {
      await db.campusBackground.updateMany({ where: { isActive: true }, data: { isActive: false } });
      const bg = await db.campusBackground.update({ where: { id }, data: { isActive: true } });
      return NextResponse.json({ ok: true, background: bg });
    }
    if (action === "delete") {
      await db.campusBackground.delete({ where: { id } });
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
