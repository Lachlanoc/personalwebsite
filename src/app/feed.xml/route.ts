import { getAllPosts } from "@/lib/api";
import { buildFeed } from "@/lib/feed";
import { renderMarkdownForFeed } from "@/lib/markdown";
import { site } from "@/lib/site";

// Written once at build time as a static file.
export const dynamic = "force-static";

export async function GET() {
  const items = await Promise.all(
    getAllPosts().map(async (post) => ({
      title: post.title,
      url: `${site.url}/posts/${post.slug}`,
      date: post.date,
      summary: post.excerpt,
      tags: post.tags,
      html: await renderMarkdownForFeed(post.content, site.url),
    })),
  );

  const xml = buildFeed({
    title: site.name,
    description: site.description,
    siteUrl: site.url,
    feedUrl: `${site.url}/feed.xml`,
    items,
  });

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
