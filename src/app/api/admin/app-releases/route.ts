import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { existsSync, mkdirSync, writeFileSync, statSync } from "fs";
import { join, extname } from "path";

const UPLOAD_ROOT = join(process.cwd(), "public", "uploads", "apk");

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

/** GET /api/admin/app-releases */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const releases = await db.appRelease.findMany({
    orderBy: [{ isLatest: "desc" }, { releasedAt: "desc" }],
  });

  return NextResponse.json({ releases });
}

/** POST /api/admin/app-releases — create new release with APK upload */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const platform = (formData.get("platform") as string) || "ANDROID";
  const version = formData.get("version") as string;
  const versionCode = parseInt((formData.get("versionCode") as string) || "1", 10);
  const nameAr = formData.get("nameAr") as string;
  const nameEn = formData.get("nameEn") as string;
  const descriptionAr = (formData.get("descriptionAr") as string) || null;
  const descriptionEn = (formData.get("descriptionEn") as string) || null;
  const releaseNotesAr = (formData.get("releaseNotesAr") as string) || null;
  const releaseNotesEn = (formData.get("releaseNotesEn") as string) || null;
  const iconMediaId = (formData.get("iconMediaId") as string) || null;
  const isLatest = formData.get("isLatest") === "true";
  const published = formData.get("published") !== "false";
  const releasedAtStr = formData.get("releasedAt") as string;
  const releasedAt = releasedAtStr ? new Date(releasedAtStr) : new Date();
  const file = formData.get("apk") as File | null;

  if (!version || !nameAr || !nameEn) {
    return NextResponse.json(
      { error: "version, nameAr, nameEn required" },
      { status: 400 }
    );
  }

  let apkUrl = formData.get("apkUrl") as string | null;
  let fileSize = 0;

  if (file) {
    if (file.type !== "application/vnd.android.package-archive" && !file.name.toLowerCase().endsWith(".apk")) {
      return NextResponse.json({ error: "File must be an APK" }, { status: 400 });
    }
    if (file.size > 200 * 1024 * 1024) {
      return NextResponse.json({ error: "APK exceeds 200MB" }, { status: 400 });
    }
    ensureDir(UPLOAD_ROOT);
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = extname(file.name).toLowerCase() || ".apk";
    const fileName = `alifbaa-${version}-${versionCode}${ext}`;
    const filePath = join(UPLOAD_ROOT, fileName);
    writeFileSync(filePath, buffer);
    apkUrl = `/uploads/apk/${fileName}`;
    fileSize = file.size;
  } else if (!apkUrl) {
    return NextResponse.json({ error: "APK file or apkUrl required" }, { status: 400 });
  }

  // Unset other latest if this is latest
  if (isLatest) {
    await db.appRelease.updateMany({
      where: { isLatest: true },
      data: { isLatest: false },
    });
  }

  const release = await db.appRelease.create({
    data: {
      platform,
      version,
      versionCode,
      nameAr,
      nameEn,
      descriptionAr,
      descriptionEn,
      releaseNotesAr,
      releaseNotesEn,
      iconMediaId,
      apkUrl: apkUrl!,
      fileSize,
      published,
      isLatest,
      releasedAt,
    },
  });

  await db.auditLog.create({
    data: {
      adminId: session.user.id,
      action: "CREATE",
      module: "APP_RELEASE",
      entityId: release.id,
    },
  });

  return NextResponse.json({ ok: true, release });
}

/** PATCH /api/admin/app-releases — toggle publish / set latest */
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, action } = body as { id: string; action: "publish" | "unpublish" | "latest" | "delete" };

  if (!id || !action) {
    return NextResponse.json({ error: "id and action required" }, { status: 400 });
  }

  if (action === "delete") {
    await db.appRelease.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }

  if (action === "latest") {
    await db.appRelease.updateMany({
      where: { isLatest: true },
      data: { isLatest: false },
    });
    const release = await db.appRelease.update({
      where: { id },
      data: { isLatest: true, published: true },
    });
    return NextResponse.json({ ok: true, release });
  }

  const release = await db.appRelease.update({
    where: { id },
    data: { published: action === "publish" },
  });

  return NextResponse.json({ ok: true, release });
}

// Helper to read file size from disk for verification
export function getFileSize(path: string): number {
  try {
    return statSync(path).size;
  } catch {
    return 0;
  }
}
