import type { Metadata } from "next";
import { Cairo, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { BrandThemeLoader } from "@/components/site/brand-theme-loader";
import { NextIntlClientProvider } from "next-intl";
import { cookies } from "next/headers";
import { defaultLocale, locales, type Locale } from "@/i18n/routing";
import ar from "@/i18n/messages/ar.json";
import en from "@/i18n/messages/en.json";

const messages = { ar, en } as const;

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "ألف باء | منصة تعليمية عراقية",
  description:
    "ألف باء منصة تعليمية عراقية تقدّم تجربة دراسية تجمع بين الشرح الواضح، التفاعل ومتابعة التقدّم وفق المنهج العراقي.",
  keywords: ["ألف باء", "تعليم", "العراق", "منصة تعليمية", "صراع الأذكياء"],
  authors: [{ name: "Alif Baa Team" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("alifbaa_locale")?.value as Locale | undefined;
  const locale: Locale =
    cookieLocale && locales.includes(cookieLocale) ? cookieLocale : defaultLocale;
  const isRtl = locale === "ar";

  return (
    <html lang={locale} dir={isRtl ? "rtl" : "ltr"} suppressHydrationWarning>
      <body
        className={`${cairo.variable} ${jakarta.variable} ${mono.variable} font-sans antialiased`}
      >
        <BrandThemeLoader />
        <NextIntlClientProvider locale={locale} messages={messages[locale]}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
        <Toaster />
        <Sonner position="top-center" />
      </body>
    </html>
  );
}
