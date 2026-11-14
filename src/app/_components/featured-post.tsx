import Link from "next/link";
import type { Post } from "@/interfaces/post";
import DateFormatter from "./date-formatter";
import { SiteImage } from "./site-image";

/** The newest post, shown large at the top of the home page. */
export function FeaturedPost({ post }: { post: Post }) {
  return (
    <article className="group relative">
      <SiteImage
        src={post.coverImage}
        alt=""
        sizes="(min-width: 60rem) 57.5rem, 100vw"
        priority
        className="aspect-[2/1] w-full rounded-md border border-line bg-surface object-cover"
      />
      <div className="mt-6 max-w-[44rem]">
        <h2 className="text-3xl font-semibold md:text-4xl">
          <Link
            href={`/posts/${post.slug}`}
            className="after:absolute after:inset-0 underline-offset-4 group-hover:underline"
          >
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 text-lg leading-relaxed">{post.excerpt}</p>
        <p className="mt-4 flex gap-5 text-sm text-muted">
          <span>{post.readingTime} min read</span>
          <DateFormatter dateString={post.date} />
        </p>
      </div>
    </article>
  );
}
