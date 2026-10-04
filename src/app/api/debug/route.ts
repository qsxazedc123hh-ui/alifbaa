import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET() {
  const db = new PrismaClient();
  try {
    const [campusItems, brandAssets, adminCount] = await Promise.all([
      db.campusItem.findMany(),
      db.brandAsset.findMany(),
      db.adminUser.count(),
    ]);
    return NextResponse.json({
      ok: true,
      DATABASE_URL: process.env.DATABASE_URL,
      campusItems: campusItems.length,
      campusItemKeys: campusItems.map((i) => i.key),
      brandAssets: brandAssets.length,
      adminCount,
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      error: String(err),
      DATABASE_URL: process.env.DATABASE_URL,
    }, { status: 500 });
  } finally {
    await db.$disconnect();
  }
}
