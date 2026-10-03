import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/** GET /api/admin/homepage — list all sections ordered */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sections = await db.homePageSection.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ sections });
}

/** PUT /api/admin/homepage — upsert section by key */
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { key, titleAr, titleEn, visible, order, data } = body as {
    key: string;
    titleAr?: string;
    titleEn?: string;
    visible?: boolean;
    order?: number;
    data?: Record<string, unknown>;
  };

  if (!key) {
    return NextResponse.json({ error: "key required" }, { status: 400 });
  }

  const result = await db.homePageSection.upsert({
    where: { key },
    update: {
      ...(titleAr !== undefined && { titleAr }),
      ...(titleEn !== undefined && { titleEn }),
      ...(visible !== undefined && { visible }),
      ...(order !== undefined && { order }),
      ...(data !== undefined && { data: JSON.stringify(data) }),
    },
    create: {
      key,
      titleAr: titleAr ?? key,
      titleEn: titleEn ?? key,
      visible: visible ?? true,
      order: order ?? 0,
      data: JSON.stringify(data ?? {}),
    },
  });

  await db.auditLog.create({
    data: {
      adminId: session.user.id,
      action: "UPDATE",
      module: "HOMEPAGE",
      entityId: key,
    },
  });

  return NextResponse.json({ ok: true, section: result });
}

/** PATCH /api/admin/homepage — bulk reorder sections */
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { orders: { key: string; order: number; visible?: boolean }[] };

  await Promise.all(
    body.orders.map((item) =>
      db.homePageSection.update({
        where: { key: item.key },
        data: {
          order: item.order,
          ...(item.visible !== undefined && { visible: item.visible }),
        },
      })
    )
  );

  return NextResponse.json({ ok: true });
}
