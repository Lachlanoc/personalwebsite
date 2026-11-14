import type { Element, Root } from "hast";
import { toString } from "hast-util-to-string";
import { SKIP, visit } from "unist-util-visit";
import { imageAttrs, type ImageManifest } from "./images.ts";

/** Small transforms applied to a post's HTML tree. See markdown.ts for the order. */

export type TocEntry = { id: string; text: string; depth: 2 | 3 };

type FileLike = { data: Record<string, unknown> };

function element(
  tagName: string,
  properties: Element["properties"],
  children: Element["children"],
): Element {
  return { type: "element", tagName, properties, children };
}

/**
 * Posts use "#" for their sections, but the page already has an <h1> for the
 * title. Move every heading down a level so each page has exactly one <h1>.
 */
export function rehypeShiftHeadings() {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      const match = /^h([1-5])$/.exec(node.tagName);
      if (match) node.tagName = `h${Number(match[1]) + 1}`;
    });
  };
}

/** Records h2/h3 headings (after ids are assigned) for the table of contents. */
export function rehypeCollectToc() {
  return (tree: Root, file: FileLike) => {
    const toc: TocEntry[] = [];
    visit(tree, "element", (node) => {
      const id = node.properties.id;
      if (typeof id !== "string") return;
      if (node.tagName === "h2" || node.tagName === "h3") {
        toc.push({ id, text: toString(node), depth: node.tagName === "h2" ? 2 : 3 });
      }
    });
    file.data.toc = toc;
  };
}

/**
 * Wraps each fenced code block with a header row holding a label and a copy
 * button. The label is the fence's title if it has one, e.g.
 * ```bash title="/etc/caddy/Caddyfile", otherwise its language.
 * Must run before syntax highlighting, which replaces the <pre>.
 */
export function rehypeCodeBlocks() {
  return (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "pre" || !parent || index === undefined) return;

      const code = node.children.find(
        (child): child is Element =>
          child.type === "element" && child.tagName === "code",
      );
      if (!code) return;

      const classNames = Array.isArray(code.properties.className)
        ? code.properties.className.map(String)
        : [];
      const language = classNames
        .find((name) => name.startsWith("language-"))
        ?.slice("language-".length);
      const meta = (code.data as { meta?: string } | undefined)?.meta ?? "";
      const title = /title="([^"]*)"/.exec(meta)?.[1];

      const header = element("div", { className: ["code-block-header"] }, [
        element("span", { className: ["code-block-label"] }, [
          { type: "text", value: title ?? language ?? "" },
        ]),
        element(
          "button",
          { type: "button", className: ["code-copy"], dataCopyCode: "" },
          [{ type: "text", value: "Copy" }],
        ),
      ]);

      parent.children[index] = element("div", { className: ["code-block"] }, [
        header,
        node,
      ]);
      // The <pre> is now inside the wrapper; don't walk into it again.
      return SKIP;
    });
  };
}

/** Lets wide tables scroll sideways on their own instead of widening the page. */
export function rehypeTableScroll() {
  return (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "table" || !parent || index === undefined) return;
      parent.children[index] = element(
        "div",
        {
          className: ["table-scroll"],
          // Focusable so the table can be scrolled from the keyboard.
          tabIndex: 0,
          role: "region",
          ariaLabel: "Table",
        },
        [node],
      );
      return SKIP;
    });
  };
}

/** Points images at their resized copies and reserves their space on the page. */
export function rehypeResponsiveImages(manifest?: ImageManifest) {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      if (node.tagName !== "img") return;
      const src = node.properties.src;
      if (typeof src !== "string") return;

      node.properties.loading = "lazy";
      node.properties.decoding = "async";

      const attrs = imageAttrs(src, manifest);
      if (!attrs.srcSet) return;
      node.properties.src = attrs.src;
      node.properties.srcSet = attrs.srcSet;
      // The reading column is at most 42rem wide.
      node.properties.sizes = "(min-width: 48rem) 42rem, 100vw";
      node.properties.width = attrs.width;
      node.properties.height = attrs.height;
    });
  };
}

/** Turns site-relative links and image sources into absolute ones, for the RSS feed. */
export function rehypeAbsoluteUrls(siteUrl: string) {
  const absolute = (value: unknown) =>
    typeof value === "string" && value.startsWith("/") && !value.startsWith("//")
      ? siteUrl + value
      : value;

  return (tree: Root) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "a") {
        node.properties.href = absolute(node.properties.href) as string;
      } else if (node.tagName === "img") {
        node.properties.src = absolute(node.properties.src) as string;
      }
    });
  };
}
