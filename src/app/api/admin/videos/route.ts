import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from "fs";
import { join, extname } from "path";

// Note: we use next/server for Request type compatibility
const UPLOAD_ROOT = join(process.cwd(), "public", "uploads");

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function sectionToFolder(section: string): string {
  switch (section) {
    case "smart_battle": return "games";
    case "news": return "news";
    default: return "videos";
  }
}

const ALLOWED_MIME = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-matroska",
]);

const MAX_SIZE = 200 * 1024 * 1024; // 200MB

/** POST /api/admin/videos — upload video with auto-thumbnail */
export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || "";
    const description = (formData.get("description") as string) || "";
    const section = (formData.get("section") as string) || "videos";
    const featured = formData.get("featured") === "true";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json({ error: `File type ${file.type} not allowed` }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File size exceeds 200MB" }, { status: 400 });
    }
    if (!title) {
      return NextResponse.json({ error: "Title required" }, { status: 400 });
    }

    const folder = sectionToFolder(section);
    const targetDir = join(UPLOAD_ROOT, folder);
    ensureDir(targetDir);

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = extname(file.name).toLowerCase() || `.${file.type.split("/")[1]}`;
    const baseName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const fileName = `${baseName}${ext}`;
    const filePath = join(targetDir, fileName);
    writeFileSync(filePath, buffer);

    const relativeUrl = `/uploads/${folder}/${fileName}`;
    const fileSize = file.size;

    // Save to DB — thumbnail will be generated client-side or via separate process
    const video = await db.video.create({
      data: {
        title,
        description: description || null,
        type: section === "smart_battle" ? "GAME" : "VIDEO",
        videoUrl: relativeUrl,
        thumbnailUrl: null, // auto-generated later or by client
        duration: null,
        size: fileSize,
        mimeType: file.type,
        section,
        featured,
        published: true,
      },
    });

    await db.auditLog.create({
      data: { adminId: admin.id, action: "CREATE", module: "VIDEO", entityId: video.id },
    });

    return NextResponse.json({ ok: true, video });
  } catch (err) {
    console.error("Video upload error:", err);
    return NextResponse.json({ error: "Upload failed", details: String(err) }, { status: 500 });
  }
}

/** GET /api/admin/videos — list all videos (admin) */
export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");
    const includeDeleted = searchParams.get("deleted") === "true";

    const where: Record<string, unknown> = {};
    if (section) where.section = section;
    if (!includeDeleted) where.deletedAt = null;

    const videos = await db.video.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }],
    });

    return NextResponse.json({ videos });
  } catch (err) {
    console.error("List videos error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

/** PATCH /api/admin/videos — update featured/published/restore */
export async function PATCH(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, action } = body as { id: string; action: "feature" | "unfeature" | "publish" | "unpublish" | "delete" | "restore" };

    if (!id || !action) {
      return NextResponse.json({ error: "id and action required" }, { status: 400 });
    }

    if (action === "delete") {
      const video = await db.video.update({
        where: { id },
        data: { deletedAt: new Date(), deletedBy: admin.id },
      });
      await db.auditLog.create({
        data: { adminId: admin.id, action: "DELETE", module: "VIDEO", entityId: id },
      });
      return NextResponse.json({ ok: true, video });
    }

    if (action === "restore") {
      const video = await db.video.update({
        where: { id },
        data: { deletedAt: null, deletedBy: null },
      });
      return NextResponse.json({ ok: true, video });
    }

    const updates: Record<string, unknown> = {};
    if (action === "feature") updates.featured = true;
    if (action === "unfeature") updates.featured = false;
    if (action === "publish") updates.published = true;
    if (action === "unpublish") updates.published = false;

    const video = await db.video.update({ where: { id }, data: updates });
    return NextResponse.json({ ok: true, video });
  } catch (err) {
    console.error("Update video error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

/** DELETE /api/admin/videos — permanent delete */
export async function DELETE(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const video = await db.video.findUnique({ where: { id } });
    if (!video) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Delete file from disk
    if (video.videoUrl) {
      const fullPath = join(process.cwd(), "public", video.videoUrl);
      if (existsSync(fullPath)) {
        try {
          unlinkSync(fullPath);
        } catch (e) {
          console.warn("Failed to delete video file:", e);
        }
      }
    }
    if (video.thumbnailUrl) {
      const thumbPath = join(process.cwd(), "public", video.thumbnailUrl);
      if (existsSync(thumbPath)) {
        try {
          unlinkSync(thumbPath);
        } catch (e) {
          console.warn("Failed to delete thumbnail:", e);
        }
      }
    }

    await db.video.delete({ where: { id } });
    await db.auditLog.create({
      data: { adminId: admin.id, action: "PERMANENT_DELETE", module: "VIDEO", entityId: id },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Permanent delete video error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
