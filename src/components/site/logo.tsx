import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Alif Baa Logo — Client Component
 *
 * Pure SVG logo (no DB access) so it can be used inside Client Components.
 * The DB-backed custom logo is loaded separately via BrandAsset and injected
 * as a prop by server components (e.g. SiteFooter).
 *
 * For client components (e.g. SiteHeader), use this directly — it renders
 * the default SVG mark + wordmark.
 */
export function Logo({
  className,
  showWordmark = true,
  href = "/",
  logoUrl,
}: {
  className?: string;
  showWordmark?: boolean;
  href?: string | null;
  logoUrl?: string | null;
}) {
  const content = (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      {logoUrl ? (
        <img src={logoUrl} alt="ألف باء" className="h-9 w-auto object-contain" />
      ) : (
        <LogoMark />
      )}
      {showWordmark && <LogoText />}
    </div>
  );

  if (!href) return content;
  return <Link href={href}>{content}</Link>;
}

/**
 * The badge mark — pure SVG, uses CSS variables (navy + cyan)
 * so it adapts to whatever brand colors are configured.
 */
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
        <linearGradient id="ab-navy" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--navy)" />
          <stop offset="1" stopColor="var(--navy-deep)" />
        </linearGradient>
        <linearGradient id="ab-cyan" x1="14" y1="10" x2="34" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--cyan-brand)" />
          <stop offset="1" stopColor="var(--cyan-brand)" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {/* Rounded navy badge */}
      <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#ab-navy)" />
      <rect x="2" y="2" width="44" height="44" rx="14" stroke="var(--cyan-brand)" strokeOpacity="0.3" strokeWidth="0.5" />
      {/* Arabic أ stylized in white */}
      <path
        d="M17 32 L17 18 Q17 14 21 14 L26 14 L26 32 M26 22 L31 22 Q34 22 34 19 Q34 16 31 16"
        stroke="var(--navy-foreground)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Cyan dot accent — represents باء dot */}
      <circle cx="29" cy="32" r="2.4" fill="url(#ab-cyan)" />
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

/**
 * Async server component version — fetches logo URL from DB.
 * Use this ONLY in server components (e.g. SiteFooter).
 */
export async function AsyncLogo({
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
    const { db } = await import("@/lib/db");
    const asset = await db.brandAsset.findUnique({
      where: {
        key: variant === "dark" ? "logo_dark" : variant === "light" ? "logo_light" : "logo",
      },
    });
    if (asset?.url) logoUrl = asset.url;
  } catch {
    // DB not ready — fall back to default
  }

  return (
    <Logo className={className} showWordmark={showWordmark} href={href} logoUrl={logoUrl} />
  );
}
