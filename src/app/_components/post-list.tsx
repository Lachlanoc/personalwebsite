import Link from "next/link";
import type { Post } from "@/interfaces/post";
import DateFormatter from "./date-formatter";
import { SiteImage } from "./site-image";

type Props = {
  posts: Post[];
  /** Heading level for each post title, to fit the page's outline. */
  titleHeading: "h2" | "h3";
};

/** Posts as compact rows, newest first. */
export function PostList({ posts, titleHeading: TitleHeading }: Props) {
  return (
    <ul>
      {posts.map((post) => (
        // The title link stretches over the whole row, so the row is one target.
        <li
          key={post.slug}
          className="group relative grid grid-cols-[7rem_minmax(0,1fr)] items-start gap-x-4 py-3 sm:grid-cols-[13rem_minmax(0,1fr)_auto] sm:gap-x-6"
        >
          <SiteImage
            src={post.coverImage}
            alt=""
            sizes="(min-width: 40rem) 13rem, 7rem"
            className="aspect-[2/1] w-full rounded-[3px] border border-line bg-surface object-cover"
          />
          <div>
            <TitleHeading className="font-medium leading-snug sm:text-lg sm:leading-snug">
              <Link
                href={`/posts/${post.slug}`}
                className="after:absolute after:inset-0 underline-offset-4 group-hover:underline"
              >
                {post.title}
              </Link>
            </TitleHeading>
            <p className="mt-1 hidden text-muted sm:line-clamp-2">
              {post.excerpt}
            </p>
            <p className="mt-1 flex gap-4 text-sm text-muted sm:hidden">
              <span>{post.readingTime} min read</span>
              <DateFormatter dateString={post.date} />
            </p>
          </div>
          <p className="hidden whitespace-nowrap pt-0.5 text-right text-sm text-muted sm:block">
            {post.readingTime} min read
            <DateFormatter dateString={post.date} className="block" />
          </p>
        </li>
      ))}
    </ul>
  );
}
