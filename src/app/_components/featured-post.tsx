import Link from "next/link";
import type { Post } from "@/interfaces/post";
import DateFormatter from "./date-formatter";
import { SiteImage } from "./site-image";

/** The newest post, given more room than the rows below it. */
export function FeaturedPost({ post }: { post: Post }) {
  return (
    <article className="group relative grid gap-5 md:grid-cols-[11fr_9fr] md:items-center md:gap-10">
      <SiteImage
        src={post.coverImage}
        alt=""
        sizes="(min-width: 60rem) 31rem, (min-width: 48rem) 55vw, 100vw"
        priority
        className="aspect-[2/1] w-full rounded-md border border-line bg-surface object-cover"
      />
      <div>
        <h2 className="text-2xl font-semibold md:text-3xl">
          <Link
            href={`/posts/${post.slug}`}
            className="after:absolute after:inset-0 group-hover:text-accent"
          >
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 text-lg leading-relaxed">{post.excerpt}</p>
        <p className="mt-4 flex gap-5 text-sm text-muted">
          <DateFormatter dateString={post.date} />
          <span>{post.readingTime} min read</span>
        </p>
      </div>
    </article>
  );
}
