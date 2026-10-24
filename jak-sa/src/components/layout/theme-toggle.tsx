"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  // Hydrate from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initial = stored || prefers;
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const applyTheme = (t: "light" | "dark") => {
    const html = document.documentElement;
    html.setAttribute("data-theme", t);
    localStorage.setItem("theme", t);
    if (t === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  if (theme === null) return null; // Don't render until hydrated

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-10 w-10 items-center justify-center rounded-md text-[var(--color-header-foreground)] transition-colors hover:bg-[var(--color-header-foreground)]/15 focus-ring"
      title={`Current: ${theme} mode`}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" aria-hidden />
      ) : (
        <Moon className="h-5 w-5" aria-hidden />
      )}
    </button>
  );
}
