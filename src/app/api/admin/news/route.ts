import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from "fs";
import { join, extname } from "path";

const UPLOAD_ROOT = join(process.cwd(), "public", "uploads", "news");

function ensureDir(dir: string) {
  if (!existsDir(dir)) mkdirSync(dir, { recursive: true });
}
function existsDir(dir: string) {
  try {
    return existsSync(dir);
  } catch {
    return false;
  }
}

/** GET /api/admin/news */
export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const includeDeleted = searchParams.get("deleted") === "true";
    const where: Record<string, unknown> = {};
    if (!includeDeleted) where.deletedAt = null;

    const news = await db.news.findMany({
      where,
      include: { video: true },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    });
    return NextResponse.json({ news });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

/** POST /api/admin/news — create news (image upload or video link) */
export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const title = (formData.get("title") as string) || "";
    const description = (formData.get("description") as string) || "";
    const contentType = (formData.get("contentType") as string) || "IMAGE";
    const featured = formData.get("featured") === "true";
    const videoId = (formData.get("videoId") as string) || null;
    const imageFile = formData.get("image") as File | null;

    if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

    let imageUrl: string | null = null;
    if (contentType === "IMAGE" && imageFile) {
      ensureDir(UPLOAD_ROOT);
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const ext = extname(imageFile.name).toLowerCase() || ".jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
      writeFileSync(join(UPLOAD_ROOT, fileName), buffer);
      imageUrl = `/uploads/news/${fileName}`;
    }

    const news = await db.news.create({
      data: {
        title,
        description: description || null,
        contentType,
        imageUrl,
        videoId: contentType === "VIDEO" ? videoId : null,
        featured,
        published: true,
      },
    });

    await db.auditLog.create({
      data: { adminId: admin.id, action: "CREATE", module: "NEWS", entityId: news.id },
    });

    return NextResponse.json({ ok: true, news });
  } catch (err) {
    console.error("Create news error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

/** PATCH /api/admin/news */
export async function PATCH(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, action } = body as { id: string; action: "feature" | "unfeature" | "publish" | "unpublish" | "delete" | "restore" };

    if (!id || !action) return NextResponse.json({ error: "id and action required" }, { status: 400 });

    if (action === "delete") {
      const news = await db.news.update({
        where: { id },
        data: { deletedAt: new Date(), deletedBy: admin.id },
      });
      return NextResponse.json({ ok: true, news });
    }
    if (action === "restore") {
      const news = await db.news.update({
        where: { id },
        data: { deletedAt: null, deletedBy: null },
      });
      return NextResponse.json({ ok: true, news });
    }

    const updates: Record<string, unknown> = {};
    if (action === "feature") updates.featured = true;
    if (action === "unfeature") updates.featured = false;
    if (action === "publish") updates.published = true;
    if (action === "unpublish") updates.published = false;

    const news = await db.news.update({ where: { id }, data: updates });
    return NextResponse.json({ ok: true, news });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

/** DELETE /api/admin/news — permanent delete */
export async function DELETE(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const news = await db.news.findUnique({ where: { id } });
    if (!news) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (news.imageUrl) {
      const fullPath = join(process.cwd(), "public", news.imageUrl);
      if (existsSync(fullPath)) {
        try { unlinkSync(fullPath); } catch {}
      }
    }

    await db.news.delete({ where: { id } });
    await db.auditLog.create({
      data: { adminId: admin.id, action: "PERMANENT_DELETE", module: "NEWS", entityId: id },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
