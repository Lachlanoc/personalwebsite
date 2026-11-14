"use client";

import { useEffect } from "react";

/** A heading counts as reached once it is this close to the top of the window. */
const REACHED_OFFSET_PX = 120;

/**
 * Marks the table-of-contents link for the section being read.
 * Renders nothing; it only sets aria-current on the links Toc rendered.
 */
export function TocHighlight({ ids }: { ids: string[] }) {
  const key = ids.join(",");

  useEffect(() => {
    const headingIds = key ? key.split(",") : [];
    const headings = headingIds
      .map((id) => document.getElementById(id))
      .filter((heading): heading is HTMLElement => heading !== null);
    const links = document.querySelectorAll<HTMLElement>("[data-toc-link]");

    let frame = 0;
    const update = () => {
      frame = 0;
      // The current section is the last heading that has scrolled past the offset.
      let current: string | null = null;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > REACHED_OFFSET_PX) break;
        current = heading.id;
      }
      for (const link of links) {
        if (link.dataset.tocLink === current) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [key]);

  return null;
}
