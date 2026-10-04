"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { Languages, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const LOCALES = [
  { code: "ar", label: "العربية", short: "AR" },
  { code: "en", label: "English", short: "EN" },
] as const;

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const changeLocale = (next: string) => {
    if (next === locale) return;
    startTransition(() => {
      document.cookie = `alifbaa_locale=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
      document.documentElement.lang = next;
      document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
      window.location.reload();
    });
  };

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={isPending}
          className={cn("gap-1.5 px-2.5 font-medium", className)}
          aria-label="Change language"
        >
          <Languages className="h-4 w-4" />
          <span className="text-xs font-semibold">{current.short}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {LOCALES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => changeLocale(l.code)}
            className="gap-2 cursor-pointer"
          >
            <span className="font-semibold text-xs w-6">{l.short}</span>
            <span className="flex-1">{l.label}</span>
            {l.code === locale && <Check className="h-3.5 w-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
