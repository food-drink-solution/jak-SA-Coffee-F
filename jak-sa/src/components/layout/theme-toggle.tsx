"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

// ── External theme state (localStorage + system preference) ──────────────
// Exposed via useSyncExternalStore so hydration is handled correctly without
// setState-in-effect (react-hooks/set-state-in-effect compliant).

const noListener = () => (): void => {};

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

function resolveTheme(): Theme | null {
  try {
    const stored = localStorage.getItem("theme") as Theme | null;
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    return stored || prefers;
  } catch (error) {
    console.error("Failed to read theme:", error);
    return null;
  }
}

export function ThemeToggle() {
  const mounted = useSyncExternalStore(
    noListener,
    () => true,
    () => false,
  );
  const theme = useSyncExternalStore(subscribeTheme, resolveTheme, () => null);

  // Persist + broadcast the chosen theme (only on explicit interaction).
  const applyTheme = useCallback((next: Theme) => {
    try {
      localStorage.setItem("theme", next);
      window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: next } }));
    } catch (error) {
      console.error("Failed to apply theme:", error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(theme === "dark" ? "light" : "dark");
  }, [applyTheme, theme]);

  const current = mounted && theme !== null ? theme : null;

  // Sync the DOM with the external store (effects are the right place for
  // external-system mutations — no setState needed here).
  useEffect(() => {
    if (current === null) return;
    const html = document.documentElement;
    html.setAttribute("data-theme", current);
    html.classList.toggle("dark", current === "dark");
  }, [current]);

  if (current === null) {
    return (
      <button
        type="button"
        disabled
        className="flex h-10 w-10 items-center justify-center rounded-md text-[var(--color-header-foreground)] transition-colors opacity-50 cursor-not-allowed"
        aria-label="Loading theme..."
      >
        <Moon className="h-5 w-5" aria-hidden />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={current === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-10 w-10 items-center justify-center rounded-md text-[var(--color-header-foreground)] transition-colors hover:bg-[var(--color-header-foreground)]/15 focus-ring cursor-pointer"
      title={`Current: ${current} mode • Click to toggle`}
    >
      {current === "dark" ? (
        <Sun className="h-5 w-5" style={{ animation: "spin-slow 0.6s ease-in-out" }} aria-hidden />
      ) : (
        <Moon className="h-5 w-5" aria-hidden />
      )}
    </button>
  );
}
