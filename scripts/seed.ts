/**
 * Alif Baa — Initial Seed Script (Navy + Cyan Edition)
 * Creates the default super admin and seeds default brand tokens.
 * Run via: bun run /home/z/my-project/scripts/seed.ts
 */
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Alif Baa database (Navy + Cyan theme)...");

  // 1. Create super admin if missing
  const existing = await db.adminUser.findUnique({
    where: { email: "admin@alifbaa.edu" },
  });
  if (!existing) {
    const passwordHash = await hash("admin123", 12);
    await db.adminUser.create({
      data: {
        email: "admin@alifbaa.edu",
        name: "Alif Baa Admin",
        passwordHash,
        role: "SUPER_ADMIN",
        isActive: true,
      },
    });
    console.log("✅ Super admin created: admin@alifbaa.edu / admin123");
  } else {
    console.log("ℹ️  Admin already exists");
  }

  // 2. Seed default homepage sections
  const defaultSections = [
    { key: "hero", titleAr: "القسم الرئيسي", titleEn: "Hero", order: 0, data: { badgeAr: "منصة تعليمية عراقية", badgeEn: "Iraqi Educational Platform" } },
    { key: "campus", titleAr: "حرم ألف باء", titleEn: "Campus", order: 1, data: {} },
    { key: "services", titleAr: "الخدمات", titleEn: "Services", order: 2, data: {} },
    { key: "grades", titleAr: "الصفوف", titleEn: "Grades", order: 3, data: {} },
    { key: "smart_battle", titleAr: "صراع الأذكياء", titleEn: "Smart Battle", order: 4, data: {} },
    { key: "videos", titleAr: "الفيديوهات", titleEn: "Videos", order: 5, data: {} },
    { key: "app_download", titleAr: "تحميل التطبيق", titleEn: "Download", order: 6, data: {} },
    { key: "contact", titleAr: "تواصل معنا", titleEn: "Contact", order: 7, data: {} },
  ];
  for (const s of defaultSections) {
    await db.homePageSection.upsert({
      where: { key: s.key },
      update: {},
      create: {
        key: s.key,
        titleAr: s.titleAr,
        titleEn: s.titleEn,
        visible: true,
        order: s.order,
        data: JSON.stringify(s.data),
      },
    });
  }
  console.log(`✅ Seeded ${defaultSections.length} homepage sections`);

  // 3. Seed Brand Identity Design Tokens (Navy + Cyan system)
  const brandColors = [
    // Brand tokens
    { key: "navy", label: "Navy (Primary)", value: "#0B1F3A" },
    { key: "navy_deep", label: "Navy Deep (Gradients)", value: "#050E1F" },
    { key: "navy_soft", label: "Navy Soft (Backgrounds)", value: "#E2E8F0" },
    { key: "cyan", label: "Cyan (Accent)", value: "#06B6D4" },
    { key: "cyan_soft", label: "Cyan Soft", value: "#ECFEFF" },
    // Light theme
    { key: "background_light", label: "Light Background (White)", value: "#FFFFFF" },
    { key: "text_light", label: "Light Text (Navy)", value: "#0B1F3A" },
    // Dark theme
    { key: "background_dark", label: "Dark Background (Navy)", value: "#050E1F" },
    { key: "text_dark", label: "Dark Text (Light)", value: "#F0F9FF" },
  ];
  for (const c of brandColors) {
    await db.brandColor.upsert({
      where: { key: c.key },
      update: { value: c.value }, // Update value to ensure latest defaults
      create: c,
    });
  }
  console.log(`✅ Seeded ${brandColors.length} brand design tokens (Navy + Cyan)`);

  // 4. Seed default contact settings
  const defaultContact = [
    { key: "whatsapp", label: "WhatsApp", value: "+9647700000000", order: 0 },
    { key: "phone", label: "Phone", value: "+9647500000000", order: 1 },
    { key: "email", label: "Email", value: "info@alifbaa.edu", order: 2 },
    { key: "facebook", label: "Facebook", value: "https://facebook.com/alifbaa", order: 3 },
    { key: "instagram", label: "Instagram", value: "https://instagram.com/alifbaa", order: 4 },
    { key: "youtube", label: "YouTube", value: "https://youtube.com/@alifbaa", order: 5 },
    { key: "telegram", label: "Telegram", value: "https://t.me/alifbaa", order: 6 },
  ];
  for (const c of defaultContact) {
    await db.contactSetting.upsert({
      where: { key: c.key },
      update: {},
      create: { ...c, visible: true },
    });
  }
  console.log(`✅ Seeded ${defaultContact.length} contact settings`);

  // 5. Seed default grades
  const defaultGrades = [
    { slug: "grade-5", nameAr: "الصف الخامس الابتدائي", nameEn: "Grade 5 Primary", icon: "📚", order: 0 },
    { slug: "grade-6", nameAr: "الصف السادس الابتدائي", nameEn: "Grade 6 Primary", icon: "✏️", order: 1 },
    { slug: "grade-7", nameAr: "الأول المتوسط", nameEn: "Grade 7 (1st Intermediate)", icon: "🎒", order: 2 },
    { slug: "grade-8", nameAr: "الثاني المتوسط", nameEn: "Grade 8 (2nd Intermediate)", icon: "🧮", order: 3 },
    { slug: "grade-9", nameAr: "الثالث المتوسط", nameEn: "Grade 9 (3rd Intermediate)", icon: "🔬", order: 4 },
    { slug: "grade-10", nameAr: "الرابع الإعدادي", nameEn: "Grade 10 (4th Preparatory)", icon: "📐", order: 5 },
    { slug: "grade-11", nameAr: "الخامس الإعدادي", nameEn: "Grade 11 (5th Preparatory)", icon: "🎓", order: 6 },
  ];
  for (const g of defaultGrades) {
    await db.grade.upsert({
      where: { slug: g.slug },
      update: {},
      create: { ...g, visible: true },
    });
  }
  console.log(`✅ Seeded ${defaultGrades.length} grades`);

  // 6. Seed default SEO settings
  const defaultSeo = [
    { key: "meta_title", valueAr: "ألف باء | منصة تعليمية عراقية", valueEn: "Alif Baa | Iraqi Educational Platform" },
    { key: "meta_description", valueAr: "منصة تعليمية عراقية تجمع الشرح الواضح والتفاعل ومتابعة التقدم.", valueEn: "Iraqi educational platform combining clear explanations, interactivity, and progress tracking." },
    { key: "canonical", valueAr: "https://alifbaa.edu", valueEn: "https://alifbaa.edu" },
  ];
  for (const s of defaultSeo) {
    await db.seoSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log(`✅ Seeded ${defaultSeo.length} SEO settings`);

  console.log("\n🎉 Seed complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎨 Design System: Navy (#0B1F3A) + Cyan (#06B6D4)");
  console.log("🌙 Dark Theme: Navy-first + Cyan accent");
  console.log("☀️ Light Theme: White-first + Cyan accent + Navy typography");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔐 Admin Login:");
  console.log("   Email: admin@alifbaa.edu");
  console.log("   Password: admin123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch(e => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
