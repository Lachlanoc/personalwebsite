import rehypeShiki from "@shikijs/rehype";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import type { ImageManifest } from "./images.ts";
import {
  rehypeAbsoluteUrls,
  rehypeCodeBlocks,
  rehypeCodeContrast,
  rehypeCollectToc,
  rehypeNormaliseHeadings,
  rehypeResponsiveImages,
  rehypeTableScroll,
  type TocEntry,
} from "./rehype-plugins.ts";

export type { TocEntry };

export type RenderedMarkdown = {
  html: string;
  /** Section headings, in order, for the table of contents. */
  toc: TocEntry[];
};

function createProcessor(manifest?: ImageManifest) {
  return (
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      // Raw HTML in markdown is dropped, not passed through.
      .use(remarkRehype)
      .use(rehypeNormaliseHeadings)
      .use(rehypeSlug)
      .use(rehypeCollectToc)
      .use(rehypeAutolinkHeadings, {
        behavior: "wrap",
        properties: { className: ["heading-anchor"] },
      })
      .use(rehypeCodeBlocks)
      .use(rehypeShiki, {
        // Both themes are emitted as CSS variables; globals.css picks one.
        themes: { light: "github-light", dark: "github-dark-dimmed" },
        defaultColor: false,
        defaultLanguage: "text",
        fallbackLanguage: "text",
        lazy: true,
      })
      .use(rehypeCodeContrast)
      .use(rehypeTableScroll)
      .use(rehypeResponsiveImages, manifest)
      .use(rehypeStringify)
  );
}

let defaultProcessor: ReturnType<typeof createProcessor> | null = null;

/**
 * Converts a post's markdown to HTML.
 * Pass a manifest to control image lookup (used by tests); by default the
 * manifest written by scripts/optimize-images.mjs is used.
 */
export async function renderMarkdown(
  markdown: string,
  manifest?: ImageManifest,
): Promise<RenderedMarkdown> {
  const processor = manifest
    ? createProcessor(manifest)
    : (defaultProcessor ??= createProcessor());
  const file = await processor.process(markdown);
  return {
    html: String(file),
    toc: (file.data.toc as TocEntry[] | undefined) ?? [],
  };
}

/**
 * Converts a post's markdown to plain HTML for the RSS feed: no copy buttons,
 * highlighting or resized images, since feed readers apply their own styling,
 * and absolute URLs, since the HTML is read away from the site.
 */
export async function renderMarkdownForFeed(
  markdown: string,
  siteUrl: string,
): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeNormaliseHeadings)
    .use(rehypeAbsoluteUrls, siteUrl)
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}
