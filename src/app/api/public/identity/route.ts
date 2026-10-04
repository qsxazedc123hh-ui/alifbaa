import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/public/identity
 * Returns all brand assets (logos + backgrounds) for the public site.
 * No auth required — this is read-only public data.
 *
 * Used by SiteHeader, SiteFooter, and the public site to display the
 * admin-uploaded logos and backgrounds (instead of hardcoded defaults).
 *
 * Response includes a cache-busting query param `?v=<timestamp>` on each
 * asset URL so browsers always fetch the latest version.
 */
export async function GET() {
  try {
    const assets = await db.brandAsset.findMany();
    // Map by key for easy lookup
    const map: Record<string, { url: string | null; label: string; updatedAt: string }> = {};
    for (const a of assets) {
      // Append cache-busting param to bypass browser cache
      const cacheBust = a.updatedAt ? `?v=${new Date(a.updatedAt).getTime()}` : "";
      map[a.key] = {
        url: a.url ? `${a.url}${cacheBust}` : null,
        label: a.label,
        updatedAt: a.updatedAt?.toISOString() || "",
      };
    }
    return NextResponse.json({ assets: map });
  } catch (err) {
    console.error("Public identity fetch error:", err);
    return NextResponse.json({ assets: {} });
  }
}
