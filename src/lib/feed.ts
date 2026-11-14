/** Builds the RSS 2.0 feed. Pure string work, so it can be tested directly. */

export type FeedItem = {
  title: string;
  /** Absolute URL of the post. */
  url: string;
  /** ISO date, e.g. "2026-09-11". */
  date: string;
  summary: string;
  tags: string[];
  /** Full post HTML with absolute URLs. */
  html: string;
};

export type FeedDetails = {
  title: string;
  description: string;
  siteUrl: string;
  feedUrl: string;
  items: FeedItem[];
};

export function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Wraps HTML in CDATA, splitting any "]]>" inside it so it cannot end the section early. */
function cdata(html: string): string {
  return `<![CDATA[${html.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

/** RSS wants dates like "Fri, 11 Sep 2026 00:00:00 GMT". */
const rssDate = (isoDate: string) => new Date(`${isoDate}T00:00:00Z`).toUTCString();

export function buildFeed({ title, description, siteUrl, feedUrl, items }: FeedDetails): string {
  const newest = items.map((item) => item.date).sort().at(-1);

  const entries = items.map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.url)}</link>
      <guid isPermaLink="true">${escapeXml(item.url)}</guid>
      <pubDate>${rssDate(item.date)}</pubDate>
      <description>${escapeXml(item.summary)}</description>
${item.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join("\n")}
      <content:encoded>${cdata(item.html)}</content:encoded>
    </item>`,
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(description)}</description>
    <language>en-au</language>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${newest ? `    <lastBuildDate>${rssDate(newest)}</lastBuildDate>\n` : ""}${entries.join("\n")}
  </channel>
</rss>
`;
}
