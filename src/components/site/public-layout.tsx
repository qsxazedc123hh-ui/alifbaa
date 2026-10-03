import { SiteHeader } from "./header";
import { SiteFooter } from "./footer";

/**
 * Public site shell — wraps every public page with header + footer.
 * Uses min-h-screen + flex-col so footer always sticks to bottom on short pages
 * and is pushed down naturally on long pages.
 */
export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
