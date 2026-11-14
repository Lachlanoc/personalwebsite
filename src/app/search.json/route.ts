import { getAllPosts } from "@/lib/api";
import { renderMarkdown } from "@/lib/markdown";
import type { SearchEntry } from "@/lib/search";

// Written once at build time as a static file.
export const dynamic = "force-static";

export async function GET() {
  const index: SearchEntry[] = await Promise.all(
    getAllPosts().map(async (post) => {
      const { toc } = await renderMarkdown(post.content);
      return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        tags: post.tags,
        sections: toc.map(({ id, text }) => ({ id, text })),
      };
    }),
  );

  return Response.json(index);
}
