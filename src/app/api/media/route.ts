import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import sharp from "sharp";
import { existsSync, mkdirSync, writeFileSync, statSync, unlinkSync } from "fs";
import { join, extname } from "path";

const UPLOAD_ROOT = join(process.cwd(), "public", "uploads");

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "video/mp4",
  "video/webm",
]);

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function categoryToFolder(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "GENERAL";
    const altText = (formData.get("altText") as string) || "";
    const tags = (formData.get("tags") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json(
        { error: `File type ${file.type} not allowed` },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 50MB limit" },
        { status: 400 }
      );
    }

    const folder = categoryToFolder(category);
    const targetDir = join(UPLOAD_ROOT, folder);
    ensureDir(targetDir);

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = extname(file.name).toLowerCase() || `.${file.type.split("/")[1]}`;
    const baseName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const fileName = `${baseName}${ext}`;
    const filePath = join(targetDir, fileName);
    writeFileSync(filePath, buffer);

    const relativeUrl = `/uploads/${folder}/${fileName}`;
    let thumbnailUrl: string | null = null;
    let width: number | null = null;
    let height: number | null = null;

    if (file.type.startsWith("image/") && file.type !== "image/svg+xml") {
      try {
        const meta = await sharp(buffer).metadata();
        width = meta.width ?? null;
        height = meta.height ?? null;

        // Generate thumbnail for large images
        if ((width ?? 0) > 400) {
          const thumbName = `${baseName}-thumb.webp`;
          const thumbPath = join(targetDir, thumbName);
          await sharp(buffer)
            .resize(400, 400, { fit: "inside", withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(thumbPath);
          thumbnailUrl = `/uploads/${folder}/${thumbName}`;
        }
      } catch (err) {
        console.warn("Image metadata extraction failed:", err);
      }
    }

    const media = await db.mediaItem.create({
      data: {
        name: file.name,
        altText: altText || null,
        category: category.toUpperCase(),
        mimeType: file.type,
        size: file.size,
        width,
        height,
        url: relativeUrl,
        thumbnailUrl,
        tags: tags || null,
      },
    });

    return NextResponse.json({ ok: true, media });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Upload failed", details: String(err) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "ALL";
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "24", 10);

    const where: Record<string, unknown> = {};
    if (category !== "ALL") where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { altText: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    const [items, total] = await Promise.all([
      db.mediaItem.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      db.mediaItem.count({ where }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (err) {
    console.error("List media error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const media = await db.mediaItem.findUnique({ where: { id } });
    if (!media) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Delete file from disk
    const fullPath = join(process.cwd(), "public", media.url);
    if (existsSync(fullPath)) {
      try {
        unlinkSync(fullPath);
      } catch (e) {
        console.warn("Failed to delete file:", e);
      }
    }
    if (media.thumbnailUrl) {
      const thumbPath = join(process.cwd(), "public", media.thumbnailUrl);
      if (existsSync(thumbPath)) {
        try {
          unlinkSync(thumbPath);
        } catch (e) {
          console.warn("Failed to delete thumbnail:", e);
        }
      }
    }

    await db.mediaItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete media error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

// Helper: get file size for verification
export function getFileSize(path: string): number {
  try {
    return statSync(path).size;
  } catch {
    return 0;
  }
}
