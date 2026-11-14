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
  rehypeCodeBlocks,
  rehypeCollectToc,
  rehypeResponsiveImages,
  rehypeShiftHeadings,
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
      .use(rehypeShiftHeadings)
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
