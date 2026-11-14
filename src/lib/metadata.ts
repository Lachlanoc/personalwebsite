import type { Metadata } from "next";
import { socialImage } from "./images.ts";
import { site } from "./site.ts";

type PageDetails = {
  /** Page title without the site name; omit for the home page. */
  title?: string;
  description: string;
  /** Path of the page on the site, e.g. "/posts/dain". */
  path: string;
  /** Post slug whose preview image to use; other pages use the site image. */
  imageKey?: string;
  /** Set for posts: the ISO date it was published. */
  publishedDate?: string;
  tags?: string[];
};

/** A wide image suits the large preview card; anything else gets the small one. */
const WIDE_ASPECT = 1.5;
const WIDE_MIN_WIDTH = 600;

/**
 * Metadata for one page: canonical URL plus what link previews show.
 * Next replaces (rather than merges) nested metadata between layouts and
 * pages, so every page builds the whole set here.
 */
export function pageMetadata({
  title,
  description,
  path,
  imageKey = "site",
  publishedDate,
  tags,
}: PageDetails): Metadata {
  const image = socialImage(imageKey) ?? socialImage("site");
  const isWide =
    image !== undefined &&
    image.width >= WIDE_MIN_WIDTH &&
    image.width / image.height >= WIDE_ASPECT;
  const images = image
    ? [{ url: image.path, width: image.width, height: image.height }]
    : undefined;
  const shareTitle = title ?? site.name;

  return {
    // Left out entirely for the home page, so the site's default title applies.
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      siteName: site.name,
      locale: "en_AU",
      url: path,
      title: shareTitle,
      description,
      images,
      ...(publishedDate
        ? {
            type: "article" as const,
            publishedTime: `${publishedDate}T00:00:00Z`,
            authors: [site.name],
            tags,
          }
        : { type: "website" as const }),
    },
    twitter: {
      card: isWide ? "summary_large_image" : "summary",
      title: shareTitle,
      description,
      images: images?.map((entry) => entry.url),
    },
  };
}
