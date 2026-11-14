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

/** A JPEG made for link previews on social sites and chat apps. */
export type SocialImage = { path: string; width: number; height: number };

const socialPath = join(process.cwd(), "public", "_img", "social.json");

let cachedSocial: Record<string, SocialImage> | null = null;

/**
 * The preview image for a post (by slug), or "site" for any other page.
 * Returns undefined if the image script has not produced one.
 */
export function socialImage(key: string): SocialImage | undefined {
  if (!cachedSocial || process.env.NODE_ENV !== "production") {
    cachedSocial = fs.existsSync(socialPath)
      ? (JSON.parse(fs.readFileSync(socialPath, "utf8")) as Record<string, SocialImage>)
      : {};
  }
  return cachedSocial[key];
}
