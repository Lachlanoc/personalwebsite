import fs from "node:fs";
import { join } from "node:path";

/**
 * Responsive image lookup.
 *
 * scripts/optimize-images.mjs writes resized copies of everything under
 * public/assets to public/_img and records them in a manifest. This module
 * turns an original path such as "/assets/blog/dain/cover.webp" into the
 * attributes an <img> needs to pick the right copy.
 */

export type ImageManifest = Record<
  string,
  { width: number; height: number; widths: number[] }
>;

export type ImageAttrs = {
  src: string;
  srcSet?: string;
  width?: number;
  height?: number;
};

const manifestPath = join(process.cwd(), "public", "_img", "manifest.json");

let cachedManifest: ImageManifest | null = null;

export function loadImageManifest(): ImageManifest {
  if (cachedManifest && process.env.NODE_ENV === "production") {
    return cachedManifest;
  }
  // Without a manifest (script not run yet) images fall back to the originals.
  cachedManifest = fs.existsSync(manifestPath)
    ? (JSON.parse(fs.readFileSync(manifestPath, "utf8")) as ImageManifest)
    : {};
  return cachedManifest;
}

export function variantPath(src: string, width: number): string {
  return `/_img${src.replace(/\.[^./]+$/, "")}-${width}.webp`;
}

export function imageAttrs(
  src: string,
  manifest: ImageManifest = loadImageManifest(),
): ImageAttrs {
  const entry = manifest[src];
  if (!entry) return { src };

  // The middle size is the fallback for browsers that ignore srcset.
  const fallback = entry.widths[Math.floor((entry.widths.length - 1) / 2)];
  return {
    src: variantPath(src, fallback),
    srcSet: entry.widths
      .map((width) => `${variantPath(src, width)} ${width}w`)
      .join(", "),
    width: entry.width,
    height: entry.height,
  };
}
