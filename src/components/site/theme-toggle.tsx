"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

/**
 * Theme Toggle - direct DOM manipulation
 *
 * Uses onClick to toggle dark/light class on <html> and persists to localStorage.
 * Initial state is read from the DOM (set by inline script in layout.tsx).
 *
 * No useEffect needed — we read from document.documentElement on first render
 * which is safe because this is a client component.
 */
const THEME_KEY = "alifbaa_theme";

function applyTheme(theme: "light" | "dark") {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  if (theme === "dark") {
    html.classList.add("dark");
    html.classList.remove("light");
  } else {
    html.classList.add("light");
    html.classList.remove("dark");
  }
}

function getCurrentTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ThemeToggle({ className }: { className?: string }) {
  // Read initial state lazily — only runs on client
  const [isDark, setIsDark] = useState<"light" | "dark">(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
        ? "dark"
        : "light"
      : "light"
  );

  const toggle = () => {
    const next = isDark === "dark" ? "light" : "dark";
    setIsDark(next);
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // ignore
    }
  };

  const dark = isDark === "dark";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className={className}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
