"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  // Apply theme from localStorage on mount (sync with ThemeToggle)
  useEffect(() => {
    const stored = localStorage.getItem("alifbaa_theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Sync html dir/lang with cookie locale
  useEffect(() => {
    const syncLocale = () => {
      const match = document.cookie.match(/alifbaa_locale=([^;]+)/);
      const locale = match?.[1] === "en" ? "en" : "ar";
      const html = document.documentElement;
      html.lang = locale;
      html.dir = locale === "ar" ? "rtl" : "ltr";
    };
    syncLocale();
    window.addEventListener("storage", syncLocale);
    return () => window.removeEventListener("storage", syncLocale);
  }, []);

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
}
