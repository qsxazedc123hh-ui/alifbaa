/**
 * Alif Baa — Seed Script v2
 * Creates default admin + campus items + campus background + social links
 */
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Alif Baa v2...");

  // 1. Admin
  const existing = await db.adminUser.findFirst();
  if (!existing) {
    const passwordHash = await hash("admin123", 12);
    await db.adminUser.create({
      data: {
        email: "admin@alifbaa.edu",
        name: "Alif Baa Admin",
        passwordHash,
        role: "SUPER_ADMIN",
        isActive: true,
        sessionDurationMins: 60,
      },
    });
    console.log("✅ Admin created: admin123");
  } else {
    console.log("ℹ️  Admin exists");
  }

  // 2. Campus Items (default 6 items)
  const defaultItems = [
    { key: "smart_battle", label: "صراع الأذكياء", iconKey: "smart_battle", sectionKey: "smart_battle", order: 0, visible: true, inBottomNav: true, bottomNavOrder: 0 },
    { key: "videos", label: "الفيديوهات", iconKey: "videos", sectionKey: "videos", order: 1, visible: true, inBottomNav: true, bottomNavOrder: 1 },
    { key: "news", label: "الأخبار", iconKey: "news", sectionKey: "news", order: 2, visible: true, inBottomNav: true, bottomNavOrder: 2 },
    { key: "about", label: "من نحن", iconKey: "about", sectionKey: "about", order: 3, visible: true, inBottomNav: false, bottomNavOrder: 0 },
    { key: "download", label: "تحميل التطبيق", iconKey: "download", sectionKey: "download", order: 4, visible: true, inBottomNav: true, bottomNavOrder: 3 },
    { key: "contact", label: "تواصل معنا", iconKey: "contact", sectionKey: "contact", order: 5, visible: true, inBottomNav: false, bottomNavOrder: 0 },
  ];
  for (const item of defaultItems) {
    await db.campusItem.upsert({
      where: { key: item.key },
      update: {},
      create: item,
    });
  }
  console.log(`✅ Seeded ${defaultItems.length} campus items`);

  // 3. Campus Background (use existing campus-hero.png)
  const bgExists = await db.campusBackground.findFirst();
  if (!bgExists) {
    await db.campusBackground.create({
      data: {
        label: "حرم ألف باء الافتراضي",
        url: "/brand/campus/campus-hero.png",
        isActive: true,
        order: 0,
      },
    });
    console.log("✅ Seeded default campus background");
  }

  // 4. Social Links defaults
  const socialDefaults = [
    { platform: "FACEBOOK", url: "https://facebook.com/alifbaa", order: 0, visible: true },
    { platform: "INSTAGRAM", url: "https://instagram.com/alifbaa", order: 1, visible: true },
    { platform: "YOUTUBE", url: "https://youtube.com/@alifbaa", order: 2, visible: true },
    { platform: "TIKTOK", url: "https://tiktok.com/@alifbaa", order: 3, visible: true },
  ];
  for (const s of socialDefaults) {
    const exists = await db.socialLink.findFirst({ where: { platform: s.platform } });
    if (!exists) {
      await db.socialLink.create({ data: s });
    }
  }
  console.log(`✅ Seeded ${socialDefaults.length} social links`);

  // 5. WhatsApp default
  const waExists = await db.whatsAppNumber.findFirst();
  if (!waExists) {
    await db.whatsAppNumber.create({
      data: { name: "الدعم الفني", number: "+9647700000000", order: 0, visible: true },
    });
    console.log("✅ Seeded default WhatsApp number");
  }

  console.log("\n🎉 Seed complete!");
  console.log("🔐 Admin: admin@alifbaa.edu / admin123");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
