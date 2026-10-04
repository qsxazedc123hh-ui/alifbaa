import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/** POST /api/public/contact — submit a contact message */
export async function POST(req: NextRequest) {
  try {
    const { name, contact, message } = await req.json();
    if (!name || !contact || !message) {
      return NextResponse.json({ ok: false, error: "جميع الحقول مطلوبة" }, { status: 400 });
    }
    if (message.length > 5000) {
      return NextResponse.json({ ok: false, error: "الرسالة طويلة جداً" }, { status: 400 });
    }
    await db.contactMessage.create({
      data: { name: String(name).slice(0, 200), contact: String(contact).slice(0, 200), message: String(message) },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact submit error:", err);
    return NextResponse.json({ ok: false, error: "فشل الإرسال" }, { status: 500 });
  }
}
