import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales, type Locale } from "@/i18n/routing";

const COOKIE_NAME = "alifbaa_locale";

export function middleware(req: NextRequest) {
  // Skip API, static, and Next internals
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Read locale from cookie, fall back to default
  const cookieLocale = req.cookies.get(COOKIE_NAME)?.value as Locale | undefined;
  const locale: Locale =
    cookieLocale && locales.includes(cookieLocale) ? cookieLocale : defaultLocale;

  // Set Accept-Language to influence next-intl server helpers
  const res = NextResponse.next({
    request: {
      headers: new Headers(req.headers),
    },
  });
  res.headers.set("x-alifbaa-locale", locale);
  res.cookies.set(COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return res;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
