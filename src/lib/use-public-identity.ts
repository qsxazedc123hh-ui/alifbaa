"use client";

import { useQuery } from "@tanstack/react-query";

/**
 * usePublicIdentity
 *
 * Fetches the public brand identity (logos + backgrounds) from
 * /api/public/identity. Used by SiteHeader, SiteFooter, and the
 * public site to display admin-uploaded logos.
 *
 * Returns:
 *   logoLightUrl  — URL for logo on light backgrounds (or null)
 *   logoDarkUrl   — URL for logo on dark backgrounds (or null)
 *   bgLightUrl    — URL for light background (or null)
 *   bgDarkUrl     — URL for dark background (or null)
 *
 * The URLs include cache-busting query params (?v=<timestamp>) so
 * browsers always fetch the latest version after admin updates.
 */

interface IdentityData {
  logoLightUrl: string | null;
  logoDarkUrl: string | null;
  bgLightUrl: string | null;
  bgDarkUrl: string | null;
}

const EMPTY: IdentityData = {
  logoLightUrl: null,
  logoDarkUrl: null,
  bgLightUrl: null,
  bgDarkUrl: null,
};

interface ApiResponse {
  assets: Record<string, { url: string | null; label: string; updatedAt: string }>;
}

export function usePublicIdentity() {
  const { data } = useQuery<IdentityData>({
    queryKey: ["public-identity"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/public/identity");
        if (!res.ok) return EMPTY;
        const json: ApiResponse = await res.json();
        return {
          logoLightUrl: json.assets.logo_light?.url || null,
          logoDarkUrl: json.assets.logo_dark?.url || null,
          bgLightUrl: json.assets.bg_light?.url || null,
          bgDarkUrl: json.assets.bg_dark?.url || null,
        };
      } catch {
        return EMPTY;
      }
    },
    staleTime: 30 * 1000, // 30s
    refetchOnWindowFocus: false,
  });

  return data || EMPTY;
}
