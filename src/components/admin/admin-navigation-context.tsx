"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

/**
 * AdminNavigationContext
 *
 * Tracks the user's navigation history WITHIN /admin/* routes (excluding /admin/preview).
 * This provides a reliable "back" behavior that:
 *   1. Returns to the last admin page the user was on (not random browser history).
 *   2. Falls back to /admin (dashboard) when no history exists.
 *   3. Preserves state by using Next.js router.back() when safe.
 *
 * It also tracks the "referrer" — the admin page the user was on before opening
 * the Preview mode. The preview's exit button uses this to return to the exact
 * page the user came from.
 */

interface AdminNavigationState {
  /** Stack of admin paths visited (most recent last). Excludes /admin/preview. */
  history: string[];
  /** The admin path the user was on before opening preview. */
  previewReferrer: string | null;
  /** Push a new admin path onto the history stack. */
  pushPath: (path: string) => void;
  /** Navigate back. Uses router.back() if history exists, else goes to /admin. */
  goBack: () => void;
  /** Set the preview referrer (called when opening preview). */
  setPreviewReferrer: (path: string) => void;
  /** Whether there's a meaningful back target. */
  canGoBack: boolean;
}

const AdminNavigationContext = createContext<AdminNavigationState | null>(null);

const STORAGE_KEY = "alifbaa_admin_nav";
const PREVIEW_REFERRER_KEY = "alifbaa_admin_preview_referrer";

export function AdminNavigationProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<string[]>([]);
  const [previewReferrer, setPreviewReferrerState] = useState<string | null>(null);

  // Load from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setHistory(parsed);
        }
      }
      const ref = sessionStorage.getItem(PREVIEW_REFERRER_KEY);
      if (ref) {
        setPreviewReferrerState(ref);
      }
    } catch {}
  }, []);

  // Persist history
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {}
  }, [history]);

  const pushPath = useCallback((path: string) => {
    // Don't track preview route or external routes
    if (!path.startsWith("/admin") || path === "/admin/preview") return;
    setHistory((prev) => {
      // Avoid duplicate consecutive entries
      if (prev[prev.length - 1] === path) return prev;
      // Cap history at 20 entries
      const next = [...prev, path].slice(-20);
      return next;
    });
  }, []);

  const goBack = useCallback(() => {
    setHistory((prev) => {
      if (prev.length <= 1) {
        // No meaningful back — go to dashboard
        window.location.href = "/admin";
        return prev;
      }
      // Pop current, the previous is the target
      const target = prev[prev.length - 2];
      const remaining = prev.slice(0, -1);
      // Use full page navigation to ensure clean state
      window.location.href = target;
      return remaining;
    });
  }, []);

  const setPreviewReferrer = useCallback((path: string) => {
    setPreviewReferrerState(path);
    try {
      sessionStorage.setItem(PREVIEW_REFERRER_KEY, path);
    } catch {}
  }, []);

  // Sync history with browser navigation
  useEffect(() => {
    const onPop = () => {
      setHistory((prev) => {
        if (prev.length > 1) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const canGoBack = history.length > 1;

  return (
    <AdminNavigationContext.Provider
      value={{ history, previewReferrer, pushPath, goBack, setPreviewReferrer, canGoBack }}
    >
      {children}
    </AdminNavigationContext.Provider>
  );
}

export function useAdminNavigation() {
  const ctx = useContext(AdminNavigationContext);
  if (!ctx) {
    // Fallback for components used outside the provider
    return {
      history: [],
      previewReferrer: null,
      pushPath: () => {},
      goBack: () => {
        if (typeof window !== "undefined") window.location.href = "/admin";
      },
      setPreviewReferrer: () => {},
      canGoBack: false,
    };
  }
  return ctx;
}
