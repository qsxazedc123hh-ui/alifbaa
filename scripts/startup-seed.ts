/**
 * Alif Baa — Startup Seed Script
 * Runs on every Railway deployment to ensure default data exists.
 * Safe to run multiple times (uses upsert / checks existence).
 */
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Running startup seed...");

  // 1. Admin user
  const existingAdmin = await db.adminUser.findFirst();
  if (!existingAdmin) {
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
    console.log("✅ Admin created");
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
  console.log(`✅ ${defaultItems.length} campus items ensured`);

  // 3. Campus Background
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
    console.log("✅ Campus background created");
  }

  // 4. Social Links
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
  console.log(`✅ ${socialDefaults.length} social links ensured`);

  // 5. WhatsApp default
  const waExists = await db.whatsAppNumber.findFirst();
  if (!waExists) {
    await db.whatsAppNumber.create({
      data: { name: "الدعم الفني", number: "+9647700000000", order: 0, visible: true },
    });
    console.log("✅ WhatsApp number created");
  }

  // 6. Brand Assets (identity images) — only if not already set
  const brandAssets = [
    { key: "logo_light", label: "شعار فاتح", url: "/uploads/logos/logo_light-1791094399947.jpeg" },
    { key: "logo_dark", label: "شعار داكن", url: "/uploads/logos/logo_dark-1791094449403.jpeg" },
    { key: "bg_light", label: "خلفية فاتحة", url: "/uploads/backgrounds/bg_light-1791094430491.jpeg" },
    { key: "bg_dark", label: "خلفية داكنة", url: "/uploads/backgrounds/bg_dark-1791094439369.jpeg" },
    { key: "homepage_center", label: "شعار واجهة الصفحة الرئيسية", url: "/uploads/logos/homepage_center-1791095506371.jpeg" },
  ];
  for (const a of brandAssets) {
    const exists = await db.brandAsset.findUnique({ where: { key: a.key } });
    if (!exists) {
      await db.brandAsset.create({ data: a });
      console.log(`✅ Brand asset created: ${a.key}`);
    }
  }

  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    // Don't exit with error code — let the app start anyway
  })
  .finally(async () => {
    await db.$disconnect();
  });
