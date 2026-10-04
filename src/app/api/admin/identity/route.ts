import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from "fs";
import { join, extname } from "path";

const UPLOAD_ROOT = join(process.cwd(), "public", "uploads");

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const VALID_KEYS = new Set(["logo_light", "logo_dark", "bg_light", "bg_dark"]);

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

/** POST /api/admin/identity — upload logo/background with validation */
export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const key = (formData.get("key") as string) || "";
    const label = (formData.get("label") as string) || key;

    // Validate required fields
    if (!file || !key) {
      return NextResponse.json({ error: "file and key required" }, { status: 400 });
    }

    // Validate key is one of the allowed identity slots
    if (!VALID_KEYS.has(key)) {
      return NextResponse.json({ error: "invalid identity key" }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "حجم الملف يتجاوز 5 ميجابايت" },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "الملف فارغ" }, { status: 400 });
    }

    // Validate MIME type
    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json(
        { error: `نوع الملف غير مسموح: ${file.type}. الأنواع المسموحة: JPG, PNG, WEBP` },
        { status: 400 }
      );
    }

    // Validate extension
    const ext = extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: `امتداد الملف غير مسموح: ${ext}` },
        { status: 400 }
      );
    }

    // Determine folder from key
    const folder = key.includes("bg") ? "backgrounds" : "logos";
    const targetDir = join(UPLOAD_ROOT, folder);
    if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });

    // Delete old file if exists (cleanup)
    const existing = await db.brandAsset.findUnique({ where: { key } });
    if (existing?.url) {
      const oldPath = join(process.cwd(), "public", existing.url);
      if (existsSync(oldPath)) {
        try {
          unlinkSync(oldPath);
        } catch {}
      }
    }

    // Write new file with cache-busting timestamp
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const fileName = `${key}-${timestamp}${ext}`;
    writeFileSync(join(targetDir, fileName), buffer);
    const url = `/uploads/${folder}/${fileName}`;

    // Save to DB
    const asset = await db.brandAsset.upsert({
      where: { key },
      update: { label, url },
      create: { key, label, url },
    });

    return NextResponse.json({
      ok: true,
      asset,
      message: "تم حفظ الصورة وتطبيقها على الموقع",
    });
  } catch (err) {
    console.error("Identity upload error:", err);
    return NextResponse.json(
      { error: "فشل حفظ الصورة", details: String(err) },
      { status: 500 }
    );
  }
}

/** DELETE /api/admin/identity — remove an identity asset */
export async function DELETE(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    if (!key || !VALID_KEYS.has(key)) {
      return NextResponse.json({ error: "invalid key" }, { status: 400 });
    }

    const asset = await db.brandAsset.findUnique({ where: { key } });
    if (asset?.url) {
      const fullPath = join(process.cwd(), "public", asset.url);
      if (existsSync(fullPath)) {
        try {
          unlinkSync(fullPath);
        } catch {}
      }
    }

    await db.brandAsset.deleteMany({ where: { key } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
