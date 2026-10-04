import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join, extname } from "path";

const UPLOAD_ROOT = join(process.cwd(), "public", "uploads");

/** GET /api/admin/identity — list all brand assets */
export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const assets = await db.brandAsset.findMany();
    return NextResponse.json({ assets });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

/** POST /api/admin/identity — upload logo/background */
export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const key = (formData.get("key") as string) || "";
    const label = (formData.get("label") as string) || key;

    if (!file || !key) {
      return NextResponse.json({ error: "file and key required" }, { status: 400 });
    }

    // Determine folder from key
    const folder = key.includes("bg") ? "backgrounds" : "logos";
    const targetDir = join(UPLOAD_ROOT, folder);
    if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = extname(file.name).toLowerCase() || ".png";
    const fileName = `${key}${ext}`;
    writeFileSync(join(targetDir, fileName), buffer);
    const url = `/uploads/${folder}/${fileName}`;

    const asset = await db.brandAsset.upsert({
      where: { key },
      update: { label, url },
      create: { key, label, url },
    });

    return NextResponse.json({ ok: true, asset });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
