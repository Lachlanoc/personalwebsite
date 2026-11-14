import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getAllPosts } from "./api.ts";
import type { ImageManifest } from "./images.ts";
import { renderMarkdown } from "./markdown.ts";

const manifest: ImageManifest = {
  "/assets/blog/example/photo.webp": {
    width: 2000,
    height: 1000,
    widths: [480, 800, 1200, 1600],
  },
};

const count = (html: string, needle: string) => html.split(needle).length - 1;

describe("renderMarkdown", () => {
  it("moves headings down a level so the page title is the only h1", async () => {
    const { html } = await renderMarkdown("# Section\n\n## Sub\n\n### Detail", manifest);
    assert.ok(!html.includes("<h1"));
    assert.match(html, /<h2 id="section">/);
    assert.match(html, /<h3 id="sub">/);
    assert.match(html, /<h4 id="detail">/);
  });

  it("lists h2 and h3 headings in the table of contents, in order", async () => {
    const { toc } = await renderMarkdown("# One\n\ntext\n\n## One point one\n\n### Too deep\n\n# Two", manifest);
    assert.deepEqual(toc, [
      { id: "one", text: "One", depth: 2 },
      { id: "one-point-one", text: "One point one", depth: 3 },
      { id: "two", text: "Two", depth: 2 },
    ]);
  });

  it("gives repeated headings distinct ids", async () => {
    const { toc } = await renderMarkdown("# Setup\n\n# Setup", manifest);
    assert.deepEqual(toc.map((entry) => entry.id), ["setup", "setup-1"]);
  });

  it("makes each heading link to itself", async () => {
    const { html } = await renderMarkdown("# Setup", manifest);
    assert.match(html, /<h2 id="setup"><a class="heading-anchor" href="#setup">Setup<\/a><\/h2>/);
  });

  it("wraps code blocks with a language label and copy button, and highlights them", async () => {
    const { html } = await renderMarkdown("```bash\napt install apcupsd\n```", manifest);
    assert.match(
      html,
      /<div class="code-block"><div class="code-block-header"><span class="code-block-label">bash<\/span><button type="button" class="code-copy" data-copy-code="">Copy<\/button><\/div><pre class="shiki/,
    );
    assert.match(html, /--shiki-light:#[0-9A-Fa-f]{6};--shiki-dark:#[0-9A-Fa-f]{6}/);
  });

  it("does not treat a # comment inside a code block as a heading", async () => {
    const { html, toc } = await renderMarkdown("```bash\n# /etc/hosts\n```", manifest);
    assert.deepEqual(toc, []);
    assert.ok(!html.includes("<h2"));
  });

  it("labels the block with the file name when the fence has a title", async () => {
    const { html } = await renderMarkdown('```yaml title="/etc/app/config.yml"\nkey: value\n```', manifest);
    assert.match(html, /<span class="code-block-label">\/etc\/app\/config.yml<\/span>/);
  });

  it("handles fences with no language or an unknown one", async () => {
    const { html } = await renderMarkdown("```\nplain <SERVER_IP>\n```\n\n```notalanguage\nx\n```", manifest);
    assert.equal(count(html, 'class="code-block"'), 2);
    assert.match(html, /<span class="code-block-label"><\/span>/, "no label without a language");
    assert.ok(html.includes("plain &#x3C;SERVER_IP>"));
  });

  it("drops raw HTML instead of passing it through", async () => {
    const { html } = await renderMarkdown('before <script>alert(1)</script> <b onclick="x()">after</b>', manifest);
    assert.ok(!html.includes("<script"));
    assert.ok(!html.includes("onclick"));
    assert.ok(!html.includes("<b"));
  });

  it("wraps tables in a keyboard-scrollable region", async () => {
    const { html } = await renderMarkdown("| a | b |\n|---|---|\n| 1 | 2 |", manifest);
    assert.match(html, /<div class="table-scroll" tabindex="0" role="region" aria-label="Table"><table>/);
  });

  it("points known images at their resized copies and reserves their space", async () => {
    const { html } = await renderMarkdown("![A photo](/assets/blog/example/photo.webp)", manifest);
    assert.match(html, /src="\/_img\/assets\/blog\/example\/photo-800\.webp"/);
    assert.match(html, /srcset="[^"]*photo-480\.webp 480w, [^"]*photo-1600\.webp 1600w"/);
    assert.match(html, /width="2000" height="1000"/);
    assert.match(html, /alt="A photo"/);
    assert.match(html, /loading="lazy"/);
  });

  it("leaves images it has no copies of pointing at the original", async () => {
    const { html } = await renderMarkdown("![x](https://example.com/x.png)", manifest);
    assert.match(html, /src="https:\/\/example\.com\/x\.png"/);
    assert.ok(!html.includes("srcset"));
    assert.match(html, /loading="lazy"/);
  });
});

describe("every published post", () => {
  for (const post of getAllPosts()) {
    it(`${post.slug} renders with sound structure`, async () => {
      const { html, toc } = await renderMarkdown(post.content, manifest);

      assert.ok(!html.includes("<h1"), "no h1 in the body");
      assert.equal(count(html, 'class="code-block"'), count(html, "<pre"), "every code block is wrapped");
      assert.equal(count(html, 'class="table-scroll"'), count(html, "<table"), "every table is wrapped");

      const ids = toc.map((entry) => entry.id);
      assert.equal(new Set(ids).size, ids.length, "heading ids are unique");
      for (const id of ids) assert.ok(html.includes(`id="${id}"`), `heading ${id} exists`);
      assert.equal(toc.length, count(html, "<h2") + count(html, "<h3"), "toc covers every h2 and h3");
    });
  }
});
