import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

/** GET /api/admin/trash — list all soft-deleted items */
export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [videos, news, appLinks, whatsappNumbers, socialLinks, messages] = await Promise.all([
      db.video.findMany({ where: { deletedAt: { not: null } }, orderBy: { deletedAt: "desc" } }),
      db.news.findMany({ where: { deletedAt: { not: null } }, orderBy: { deletedAt: "desc" } }),
      db.appLink.findMany({ where: { deletedAt: { not: null } }, orderBy: { deletedAt: "desc" } }),
      db.whatsAppNumber.findMany({ where: { deletedAt: { not: null } }, orderBy: { deletedAt: "desc" } }),
      db.socialLink.findMany({ where: { deletedAt: { not: null } }, orderBy: { deletedAt: "desc" } }),
      db.contactMessage.findMany({ where: { deletedAt: { not: null } }, orderBy: { deletedAt: "desc" } }),
    ]);

    return NextResponse.json({
      trash: {
        videos: videos.map(v => ({ id: v.id, title: v.title, type: "VIDEO", deletedAt: v.deletedAt, deletedBy: v.deletedBy })),
        news: news.map(n => ({ id: n.id, title: n.title, type: "NEWS", deletedAt: n.deletedAt, deletedBy: n.deletedBy })),
        appLinks: appLinks.map(l => ({ id: l.id, title: l.name, type: "APP_LINK", deletedAt: l.deletedAt, deletedBy: l.deletedBy })),
        whatsapp: whatsappNumbers.map(w => ({ id: w.id, title: w.name, type: "WHATSAPP", deletedAt: w.deletedAt, deletedBy: w.deletedBy })),
        social: socialLinks.map(s => ({ id: s.id, title: s.platform, type: "SOCIAL", deletedAt: s.deletedAt, deletedBy: s.deletedBy })),
        messages: messages.map(m => ({ id: m.id, title: m.name + " — " + m.message.substring(0, 50), type: "MESSAGE", deletedAt: m.deletedAt, deletedBy: m.deletedBy })),
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

/** PATCH /api/admin/trash — restore item */
export async function PATCH(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { type, id } = body as { type: string; id: string };

    const restoreData = { deletedAt: null, deletedBy: null };

    switch (type) {
      case "VIDEO":
        await db.video.update({ where: { id }, data: restoreData });
        break;
      case "NEWS":
        await db.news.update({ where: { id }, data: restoreData });
        break;
      case "APP_LINK":
        await db.appLink.update({ where: { id }, data: restoreData });
        break;
      case "WHATSAPP":
        await db.whatsAppNumber.update({ where: { id }, data: restoreData });
        break;
      case "SOCIAL":
        await db.socialLink.update({ where: { id }, data: restoreData });
        break;
      case "MESSAGE":
        await db.contactMessage.update({ where: { id }, data: restoreData });
        break;
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

/** DELETE /api/admin/trash — permanent delete */
export async function DELETE(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");
    if (!type || !id) return NextResponse.json({ error: "type and id required" }, { status: 400 });

    switch (type) {
      case "VIDEO":
        await db.video.delete({ where: { id } });
        break;
      case "NEWS":
        await db.news.delete({ where: { id } });
        break;
      case "APP_LINK":
        await db.appLink.delete({ where: { id } });
        break;
      case "WHATSAPP":
        await db.whatsAppNumber.delete({ where: { id } });
        break;
      case "SOCIAL":
        await db.socialLink.delete({ where: { id } });
        break;
      case "MESSAGE":
        await db.contactMessage.delete({ where: { id } });
        break;
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
