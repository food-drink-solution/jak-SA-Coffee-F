"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import {
  applyThemeToDocument,
  isTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/lib/theme";

export interface ThemeToggleLabels {
  label: string;
  light: string;
  dark: string;
  switchToLight: string;
  switchToDark: string;
  loading: string;
}

interface ThemeToggleProps {
  labels: ThemeToggleLabels;
  /** "header" = white icon on purple nav; "surface" = adaptive text on panels. */
  variant?: "header" | "surface";
}

// ── External theme state (localStorage + system preference) ──────────────
// Exposed via useSyncExternalStore so hydration is handled correctly without
// setState-in-effect (react-hooks/set-state-in-effect compliant).

function subscribeTheme(onChange: () => void): () => void {
  const handler = (): void => onChange();
  window.addEventListener("themechange", handler);
  window.addEventListener("storage", handler);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", handler);
  return () => {
    window.removeEventListener("themechange", handler);
    window.removeEventListener("storage", handler);
    mq.removeEventListener("change", handler);
  };
}

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isTheme(stored)) return stored;
  } catch {
    // Storage can be unavailable in privacy modes; fall back to the system.
  }
  return getSystemTheme();
}

export function ThemeToggle({ labels, variant = "header" }: ThemeToggleProps) {
  const theme = useSyncExternalStore(subscribeTheme, resolveTheme, () => null);

  // Persist + broadcast the chosen theme (only on explicit interaction).
  // Apply immediately so the click feels instant, then broadcast so every
  // toggle instance stays in sync.
  const toggleTheme = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyThemeToDocument(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // The visual change still works for this session.
    }
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: next } }));
  }, [theme]);

  // Sync the DOM with the external store (effects are the right place for
  // external-system mutations — no setState needed here).
  useEffect(() => {
    if (theme !== null) applyThemeToDocument(theme);
  }, [theme]);

  const isDark = theme === "dark";
  const variantClass =
    variant === "header"
      ? "text-[var(--color-header-foreground)] hover:bg-[var(--color-header-foreground)]/15 focus-ring-inverse"
      : "text-[var(--color-primary-text)] hover:bg-[var(--color-ghost-hover)] focus-ring";

  if (theme === null) {
    return (
      <button
        type="button"
        disabled
        className={`flex h-11 w-11 items-center justify-center rounded-md opacity-50 cursor-not-allowed ${variantClass}`}
        aria-label={labels.loading}
      >
        <Moon className="h-5 w-5" aria-hidden />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? labels.switchToLight : labels.switchToDark}
      title={`${labels.label}: ${isDark ? labels.dark : labels.light}`}
      className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-md transition-colors ${variantClass}`}
    >
      {isDark ? (
        <Sun className="h-5 w-5 animate-spin-slow" aria-hidden />
      ) : (
        <Moon className="h-5 w-5" aria-hidden />
      )}
    </button>
  );
}
