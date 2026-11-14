"use client";

import { useEffect } from "react";

const RESET_AFTER_MS = 2000;

/**
 * Makes the "Copy" buttons in rendered posts work.
 * The buttons are part of the post HTML, so one listener on the document
 * handles all of them. Renders nothing itself.
 */
export function CodeCopy() {
  useEffect(() => {
    const onClick = async (event: MouseEvent) => {
      const button = (event.target as Element).closest<HTMLButtonElement>(
        "button[data-copy-code]",
      );
      const code = button?.closest(".code-block")?.querySelector("pre");
      if (!button || !code) return;

      try {
        await navigator.clipboard.writeText(code.textContent ?? "");
        button.textContent = "Copied";
      } catch {
        button.textContent = "Copy failed";
      }
      setTimeout(() => {
        button.textContent = "Copy";
      }, RESET_AFTER_MS);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
