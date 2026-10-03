import Link from "next/link";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

/**
 * Alif Baa Logo — reads brand asset from DB if available, otherwise renders the wordmark.
 * Premium educational identity: stylized أ in a soft-rounded badge.
 */
export async function Logo({
  className,
  variant = "auto",
  showWordmark = true,
  href = "/",
}: {
  className?: string;
  variant?: "auto" | "light" | "dark";
  showWordmark?: boolean;
  href?: string | null;
}) {
  let logoUrl: string | null = null;
  try {
    const asset = await db.brandAsset.findUnique({
      where: {
        key: variant === "dark" ? "logo_dark" : variant === "light" ? "logo_light" : "logo",
      },
    });
    if (asset?.url) logoUrl = asset.url;
  } catch {
    // DB not ready yet — fall back to wordmark
  }

  if (logoUrl) {
    const content = (
      <img
        src={logoUrl}
        alt="ألف باء"
        className={cn("h-9 w-auto object-contain", className)}
      />
    );
    if (!href) return content;
    return <Link href={href}>{content}</Link>;
  }

  const content = (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      <LogoMark />
      {showWordmark && <LogoText />}
    </div>
  );

  if (!href) return content;
  return <Link href={href}>{content}</Link>;
}

/** The badge mark — pure SVG so it always renders, even before DB is seeded */
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="ab-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="oklch(0.55 0.13 165)" />
          <stop offset="1" stopColor="oklch(0.42 0.10 165)" />
        </linearGradient>
        <linearGradient id="ab-gold" x1="14" y1="10" x2="34" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="oklch(0.82 0.15 80)" />
          <stop offset="1" stopColor="oklch(0.70 0.18 50)" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#ab-grad)" />
      <rect x="2" y="2" width="44" height="44" rx="14" stroke="oklch(0.70 0.13 165 / 0.5)" strokeWidth="0.5" />
      <path
        d="M17 32 L17 18 Q17 14 21 14 L26 14 L26 32 M26 22 L31 22 Q34 22 34 19 Q34 16 31 16"
        stroke="oklch(0.99 0.01 165)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="29" cy="32" r="2.4" fill="url(#ab-gold)" />
    </svg>
  );
}

export function LogoText({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col leading-none", className)}>
      <span className="font-display font-extrabold text-[1.05rem] tracking-tight text-foreground">
        ألف باء
      </span>
      <span className="font-sans text-[0.62rem] font-medium tracking-[0.18em] text-muted-foreground mt-0.5">
        ALIF BAA
      </span>
    </div>
  );
}
