import assert from "node:assert/strict";
import fs from "node:fs";
import { describe, it } from "node:test";
import { getAllPosts } from "./api.ts";
import { contrastRatio, ensureContrast, MIN_TEXT_CONTRAST } from "./contrast.ts";
import { renderMarkdown } from "./markdown.ts";
import { CODE_SURFACE } from "./rehype-plugins.ts";

describe("contrastRatio", () => {
  it("is 21 for black on white and 1 for a colour on itself", () => {
    assert.equal(Math.round(contrastRatio("#000000", "#ffffff")), 21);
    assert.equal(contrastRatio("#1f5fbf", "#1f5fbf"), 1);
  });

  it("accepts three-digit hex and ignores case", () => {
    assert.equal(contrastRatio("#FFF", "#000"), contrastRatio("#ffffff", "#000000"));
  });
});

describe("ensureContrast", () => {
  it("leaves a colour alone when it already has enough contrast", () => {
    assert.equal(ensureContrast("#24292e", "#f4f5f7"), "#24292e");
  });

  it("darkens a colour that is too faint on a light background", () => {
    const fixed = ensureContrast("#6a737d", "#f4f5f7");
    assert.notEqual(fixed, "#6a737d");
    assert.ok(contrastRatio(fixed, "#f4f5f7") >= MIN_TEXT_CONTRAST);
    assert.ok(contrastRatio(fixed, "#f4f5f7") < 5.2, "only as far as needed");
  });

  it("lightens a colour that is too faint on a dark background", () => {
    const fixed = ensureContrast("#555b66", "#1c2027");
    assert.ok(contrastRatio(fixed, "#1c2027") >= MIN_TEXT_CONTRAST);
  });

  it("returns colours it cannot parse unchanged", () => {
    assert.equal(ensureContrast("inherit", "#ffffff"), "inherit");
  });
});

describe("code colours on the site", () => {
  it("uses the same code background as the --surface token in globals.css", () => {
    const css = fs.readFileSync("src/app/globals.css", "utf8");
    const match = /--surface:\s*light-dark\((#[0-9a-f]{6}),\s*(#[0-9a-f]{6})\)/i.exec(css);
    assert.ok(match, "--surface token found");
    assert.deepEqual({ light: match[1], dark: match[2] }, CODE_SURFACE);
  });

  it("gives every highlighted token in every post enough contrast in both themes", async () => {
    const failures = new Set<string>();
    for (const post of getAllPosts()) {
      const { html } = await renderMarkdown(post.content, {});
      for (const [, theme, color] of html.matchAll(/--shiki-(light|dark):(#[0-9a-f]{3,8})/gi)) {
        const background = CODE_SURFACE[theme as "light" | "dark"];
        if (contrastRatio(color, background) < MIN_TEXT_CONTRAST) {
          failures.add(`${post.slug}: ${theme} ${color}`);
        }
      }
    }
    assert.deepEqual([...failures], []);
  });
});
