import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildFeed, escapeXml, type FeedItem } from "./feed.ts";
import { renderMarkdownForFeed } from "./markdown.ts";

const item: FeedItem = {
  title: `Caddy & Authelia: a "safe" <setup>`,
  url: "https://example.com/posts/caddy",
  date: "2026-02-16",
  summary: "It's Tom & Jerry's guide.",
  tags: ["homelab", "cyber security"],
  html: "<p>Body with ]]> inside &amp; more</p>",
};

const feed = buildFeed({
  title: "Lachlan O'Connell",
  description: "Projects & ideas",
  siteUrl: "https://example.com",
  feedUrl: "https://example.com/feed.xml",
  items: [item, { ...item, title: "Older", url: "https://example.com/posts/older", date: "2025-07-10" }],
});

describe("escapeXml", () => {
  it("escapes the five characters XML reserves", () => {
    assert.equal(escapeXml(`<a href="x">Tom & Jerry's</a>`), "&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&apos;s&lt;/a&gt;");
  });
});

describe("buildFeed", () => {
  it("starts with an XML declaration and an RSS 2.0 root", () => {
    assert.ok(feed.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"'));
  });

  it("escapes text in titles and descriptions", () => {
    assert.ok(feed.includes("<title>Caddy &amp; Authelia: a &quot;safe&quot; &lt;setup&gt;</title>"));
    assert.ok(feed.includes("<description>It&apos;s Tom &amp; Jerry&apos;s guide.</description>"));
    assert.ok(feed.includes("<description>Projects &amp; ideas</description>"));
  });

  it("has no bare ampersands outside CDATA", () => {
    const outsideCdata = feed.replace(/<!\[CDATA\[[\s\S]*?]]>/g, "");
    assert.equal(/&(?!amp;|lt;|gt;|quot;|apos;)/.test(outsideCdata), false);
  });

  it("keeps a ]]> in the post body from ending the CDATA section early", () => {
    assert.ok(feed.includes("<![CDATA[<p>Body with ]]]]><![CDATA[> inside &amp; more</p>]]>"));
  });

  it("gives each item a permalink, an RFC 822 date and its tags", () => {
    assert.ok(feed.includes('<guid isPermaLink="true">https://example.com/posts/caddy</guid>'));
    assert.ok(feed.includes("<pubDate>Mon, 16 Feb 2026 00:00:00 GMT</pubDate>"));
    assert.ok(feed.includes("<category>cyber security</category>"));
  });

  it("dates the feed by its newest item and links to itself", () => {
    assert.ok(feed.includes("<lastBuildDate>Mon, 16 Feb 2026 00:00:00 GMT</lastBuildDate>"));
    assert.ok(feed.includes('<atom:link href="https://example.com/feed.xml" rel="self" type="application/rss+xml" />'));
  });

  it("opens and closes the same number of items", () => {
    assert.equal(feed.split("<item>").length - 1, 2);
    assert.equal(feed.split("</item>").length - 1, 2);
  });
});

describe("renderMarkdownForFeed", () => {
  it("makes site-relative links and images absolute", async () => {
    const html = await renderMarkdownForFeed(
      "[setup](/posts/vps-setup) ![diagram](/assets/blog/x/diagram.webp) [elsewhere](https://other.example/page)",
      "https://example.com",
    );
    assert.ok(html.includes('href="https://example.com/posts/vps-setup"'));
    assert.ok(html.includes('src="https://example.com/assets/blog/x/diagram.webp"'));
    assert.ok(html.includes('href="https://other.example/page"'));
  });

  it("leaves out page-only controls and keeps code as plain text", async () => {
    const html = await renderMarkdownForFeed("# Setup\n\n```bash\napt install x\n```", "https://example.com");
    assert.ok(!html.includes("<button"));
    assert.ok(!html.includes("<h1"));
    assert.ok(html.includes("<h2>Setup</h2>"));
    assert.ok(html.includes("apt install x"));
  });

  it("drops raw HTML", async () => {
    const html = await renderMarkdownForFeed("<script>alert(1)</script>ok", "https://example.com");
    assert.ok(!html.includes("<script"));
  });
});
