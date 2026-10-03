import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/** GET /api/admin/brand — returns all brand assets, colors, settings */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [assets, colors, settings] = await Promise.all([
    db.brandAsset.findMany(),
    db.brandColor.findMany(),
    db.brandSetting.findMany(),
  ]);

  return NextResponse.json({ assets, colors, settings });
}

/** PUT /api/admin/brand — upsert brand asset / color / setting */
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { type, key, label, value, url, mediaId } = body as {
    type: "asset" | "color" | "setting";
    key: string;
    label?: string;
    value?: string;
    url?: string;
    mediaId?: string;
  };

  if (!type || !key) {
    return NextResponse.json({ error: "type and key required" }, { status: 400 });
  }

  let result;
  if (type === "asset") {
    result = await db.brandAsset.upsert({
      where: { key },
      update: { label: label ?? key, mediaId: mediaId ?? null, url: url ?? null },
      create: { key, label: label ?? key, mediaId: mediaId ?? null, url: url ?? null },
    });
  } else if (type === "color") {
    if (!value) {
      return NextResponse.json({ error: "value required for color" }, { status: 400 });
    }
    result = await db.brandColor.upsert({
      where: { key },
      update: { label: label ?? key, value },
      create: { key, label: label ?? key, value },
    });
  } else if (type === "setting") {
    if (!value) {
      return NextResponse.json({ error: "value required for setting" }, { status: 400 });
    }
    result = await db.brandSetting.upsert({
      where: { key },
      update: { label: label ?? key, value },
      create: { key, label: label ?? key, value },
    });
  } else {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  await db.auditLog.create({
    data: {
      adminId: session.user.id,
      action: "UPDATE",
      module: "BRAND",
      entityId: key,
      details: `Updated ${type} ${key}`,
    },
  });

  return NextResponse.json({ ok: true, result });
}
