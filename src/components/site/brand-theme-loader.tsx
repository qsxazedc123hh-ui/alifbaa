import { db } from "@/lib/db";

/**
 * Brand Theme Loader (Server Component)
 * Reads brand colors from the database and injects them as CSS custom properties
 * on :root and .dark. This makes the entire color system dynamic and editable
 * from the Brand Identity dashboard.
 *
 * All colors are stored as BrandColor rows with `key` and `value`.
 * Default keys:
 *   - navy            (primary brand navy, e.g. "#0B1F3A")
 *   - navy_deep       (darker navy for gradients)
 *   - navy_soft       (soft navy tint for backgrounds)
 *   - cyan            (accent cyan, e.g. "#06B6D4")
 *   - cyan_soft       (light cyan for backgrounds)
 *   - background_light  (white-first background)
 *   - background_dark   (navy-first background)
 *   - text_light        (navy typography on light)
 *   - text_dark         (light typography on dark)
 *
 * Missing keys fall back to the defaults defined in globals.css.
 */
export async function BrandThemeLoader() {
  let cssVars = "";

  try {
    const colors = await db.brandColor.findMany();
    const map = new Map(colors.map((c) => [c.key, c.value]));

    // Build CSS variable overrides for :root (light theme)
    const lightOverrides: string[] = [];
    const darkOverrides: string[] = [];

    // === Brand tokens (shared) ===
    if (map.get("navy")) {
      lightOverrides.push(`--navy: ${map.get("navy")}`);
      lightOverrides.push(`--primary: ${map.get("navy")}`);
      lightOverrides.push(`--sidebar-primary: ${map.get("navy")}`);
      // In dark theme we keep --primary as cyan, but --navy stays for accents
      darkOverrides.push(`--navy: ${map.get("navy")}`);
    }
    if (map.get("navy_deep")) {
      lightOverrides.push(`--navy-deep: ${map.get("navy_deep")}`);
      darkOverrides.push(`--navy-deep: ${map.get("navy_deep")}`);
    }
    if (map.get("navy_soft")) {
      lightOverrides.push(`--navy-soft: ${map.get("navy_soft")}`);
      darkOverrides.push(`--navy-soft: ${map.get("navy_soft")}`);
    }

    if (map.get("cyan")) {
      lightOverrides.push(`--cyan-brand: ${map.get("cyan")}`);
      lightOverrides.push(`--accent: ${map.get("cyan")}`);
      lightOverrides.push(`--ring: ${map.get("cyan")}`);
      darkOverrides.push(`--cyan-brand: ${map.get("cyan")}`);
      darkOverrides.push(`--primary: ${map.get("cyan")}`);
      darkOverrides.push(`--accent: ${map.get("cyan")}`);
      darkOverrides.push(`--ring: ${map.get("cyan")}`);
      darkOverrides.push(`--sidebar-primary: ${map.get("cyan")}`);
    }
    if (map.get("cyan_soft")) {
      lightOverrides.push(`--cyan-soft: ${map.get("cyan_soft")}`);
      darkOverrides.push(`--cyan-soft: ${map.get("cyan_soft")}`);
    }

    // === Light theme specific ===
    if (map.get("background_light")) {
      lightOverrides.push(`--background: ${map.get("background_light")}`);
      lightOverrides.push(`--card: ${map.get("background_light")}`);
      lightOverrides.push(`--popover: ${map.get("background_light")}`);
    }
    if (map.get("text_light")) {
      lightOverrides.push(`--foreground: ${map.get("text_light")}`);
      lightOverrides.push(`--card-foreground: ${map.get("text_light")}`);
      lightOverrides.push(`--popover-foreground: ${map.get("text_light")}`);
      lightOverrides.push(`--sidebar-foreground: ${map.get("text_light")}`);
    }

    // === Dark theme specific ===
    if (map.get("background_dark")) {
      darkOverrides.push(`--background: ${map.get("background_dark")}`);
    }
    if (map.get("text_dark")) {
      darkOverrides.push(`--foreground: ${map.get("text_dark")}`);
      darkOverrides.push(`--card-foreground: ${map.get("text_dark")}`);
      darkOverrides.push(`--popover-foreground: ${map.get("text_dark")}`);
      darkOverrides.push(`--sidebar-foreground: ${map.get("text_dark")}`);
    }

    if (lightOverrides.length || darkOverrides.length) {
      cssVars = `<style id="brand-theme">
:root { ${lightOverrides.join("; ")}; }
.dark { ${darkOverrides.join("; ")}; }
</style>`;
    }
  } catch (err) {
    console.warn("BrandThemeLoader: failed to load brand colors:", err);
  }

  return <div dangerouslySetInnerHTML={{ __html: cssVars }} />;
}
