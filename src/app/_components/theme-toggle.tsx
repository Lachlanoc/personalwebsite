"use client";

import { FaMoon, FaSun } from "react-icons/fa6";
import { THEME_STORAGE_KEY } from "@/lib/theme";

function resolvedTheme(): "light" | "dark" {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === "light" || chosen === "dark") return chosen;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  const toggle = () => {
    const next = resolvedTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode); the choice then lasts for this page only.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      title="Switch theme"
      className="inline-flex size-9 cursor-pointer items-center justify-center rounded-sm text-muted hover:text-ink"
    >
      {/* Both icons render; CSS shows the one for the theme you would switch to. */}
      <FaMoon aria-hidden="true" className="size-4 dark:hidden" />
      <FaSun aria-hidden="true" className="hidden size-4 dark:block" />
    </button>
  );
}
