"use client";

import { useCallback, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [mounted, setMounted] = useState(false);

  // Memoized theme application function
  const applyTheme = useCallback((t: "light" | "dark") => {
    try {
      const html = document.documentElement;
      
      // Apply theme via data-theme attribute (primary method)
      html.setAttribute("data-theme", t);
      
      // Also apply .dark class for Tailwind v4 compatibility
      if (t === "dark") {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
      
      // Persist to localStorage
      localStorage.setItem("theme", t);
      
      // Fire custom event for other components
      window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: t } }));
    } catch (error) {
      console.error("Failed to apply theme:", error);
    }
  }, []);

  // Hydrate from localStorage and system preference on mount
  useEffect(() => {
    setMounted(true);
    
    // Get stored preference or system preference
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initial = stored || prefers;
    
    setTheme(initial);
    applyTheme(initial);
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "dark" ? "light" : "dark";
      applyTheme(newTheme);
      return newTheme;
    });
  }, [applyTheme]);

  // Don't render until hydrated (prevents hydration mismatch)
  if (!mounted || theme === null) {
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
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-10 w-10 items-center justify-center rounded-md text-[var(--color-header-foreground)] transition-colors hover:bg-[var(--color-header-foreground)]/15 focus-ring cursor-pointer"
      title={`Current: ${theme} mode • Click to toggle`}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" style={{ animation: "spin-slow 0.6s ease-in-out" }} aria-hidden />
      ) : (
        <Moon className="h-5 w-5" aria-hidden />
      )}
    </button>
  );
}
