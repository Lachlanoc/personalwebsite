import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/api";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const newest = posts[0]?.date;

  return [
    { url: `${site.url}/`, lastModified: newest },
    { url: `${site.url}/about` },
    { url: `${site.url}/contact` },
    ...posts.map((post) => ({
      url: `${site.url}/posts/${post.slug}`,
      lastModified: post.date,
    })),
    ...getAllTags().map((tag) => ({ url: `${site.url}/tags/${tag.slug}` })),
  ];
}
