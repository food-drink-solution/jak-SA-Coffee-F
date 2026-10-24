import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle, type ThemeToggleLabels } from "@/components/layout/theme-toggle";
import { THEME_STORAGE_KEY } from "@/lib/theme";

const labels: ThemeToggleLabels = {
  label: "Theme",
  light: "Light",
  dark: "Dark",
  switchToLight: "Switch to light mode",
  switchToDark: "Switch to dark mode",
  loading: "Loading theme…",
};

function stubMatchMedia(prefersDark: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: prefersDark,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

beforeEach(() => {
  localStorage.clear();
  stubMatchMedia(false);
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.classList.remove("dark");
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ThemeToggle", () => {
  it("follows the system preference when nothing is stored", () => {
    render(<ThemeToggle labels={labels} />);
    expect(screen.getByRole("button", { name: labels.switchToDark })).toBeInTheDocument();
  });

  it("prefers a stored theme over the system preference", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    stubMatchMedia(false);
    render(<ThemeToggle labels={labels} />);
    expect(screen.getByRole("button", { name: labels.switchToLight })).toBeInTheDocument();
  });

  it("ignores invalid stored values", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "sepia");
    render(<ThemeToggle labels={labels} />);
    expect(screen.getByRole("button", { name: labels.switchToDark })).toBeInTheDocument();
  });

  it("persists the chosen theme and updates the document", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle labels={labels} />);

    await user.click(screen.getByRole("button", { name: labels.switchToDark }));

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(document.documentElement).toHaveClass("dark");
    expect(screen.getByRole("button", { name: labels.switchToLight })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: labels.switchToLight }));

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(document.documentElement).not.toHaveClass("dark");
  });
});
