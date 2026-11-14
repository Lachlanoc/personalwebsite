import fs from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import type { Post } from "../interfaces/post.ts";

const postsDirectory = join(process.cwd(), "_posts");
const WORDS_PER_MINUTE = 220;

export function getPostSlugs(): string[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function readingTime(markdown: string): number {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function getPostBySlug(slug: string): Post | null {
  const realSlug = slug.replace(/\.md$/, "");
  // Slugs come from the URL, so only accept plain file names.
  if (!/^[\w-]+$/.test(realSlug)) return null;

  const fullPath = join(postsDirectory, `${realSlug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const { data, content } = matter(fs.readFileSync(fullPath, "utf8"));

  return {
    ...data,
    slug: realSlug,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readingTime: readingTime(content),
    content,
  } as Post;
}

let cachedPosts: Post[] | null = null;

/** All posts, newest first. */
export function getAllPosts(): Post[] {
  // Posts never change during a production build; in dev, re-read so edits show up.
  if (cachedPosts && process.env.NODE_ENV === "production") return cachedPosts;

  cachedPosts = getPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
  return cachedPosts;
}

/** Tags with how many posts use each, most used first, then alphabetical. */
export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

/** The posts published just before and just after the given one. */
export function getAdjacentPosts(slug: string): {
  older: Post | null;
  newer: Post | null;
} {
  const posts = getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return { older: null, newer: null };
  return {
    newer: posts[index - 1] ?? null,
    older: posts[index + 1] ?? null,
  };
}
