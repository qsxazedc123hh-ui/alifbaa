import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";

/**
 * Cookie-based locale strategy (no URL prefix).
 * Simpler routing: /, /about, /admin all work for both locales.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "never",
  localeDetection: true,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
