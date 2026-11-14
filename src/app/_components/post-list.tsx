import Link from "next/link";
import type { Post } from "@/interfaces/post";
import { yearOf } from "@/lib/dates";
import DateFormatter from "./date-formatter";
import { SiteImage } from "./site-image";

type Props = {
  posts: Post[];
  /** Heading level for each year; post titles sit one level below it. */
  yearHeading: "h2" | "h3";
};

/** Posts as compact rows, grouped under the year they were published. */
export function PostList({ posts, yearHeading: YearHeading }: Props) {
  const TitleHeading = YearHeading === "h2" ? "h3" : "h4";

  const years = new Map<string, Post[]>();
  for (const post of posts) {
    const year = yearOf(post.date);
    years.set(year, [...(years.get(year) ?? []), post]);
  }

  return (
    <div className="space-y-8">
      {[...years].map(([year, yearPosts]) => (
        <section key={year} aria-labelledby={`year-${year}`}>
          <YearHeading
            id={`year-${year}`}
            className="mb-1 text-sm font-medium text-muted"
          >
            {year}
          </YearHeading>
          <ul>
            {yearPosts.map((post) => (
              // The title link stretches over the whole row, so the row is one target.
              <li
                key={post.slug}
                className="group relative grid grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-x-4 py-3 sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:gap-x-6"
              >
                <SiteImage
                  src={post.coverImage}
                  alt=""
                  sizes="(min-width: 40rem) 10rem, 5.5rem"
                  className="aspect-[2/1] w-full rounded-[3px] border border-line bg-surface object-cover"
                />
                <div>
                  <TitleHeading className="font-medium leading-snug sm:text-lg sm:leading-snug">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="after:absolute after:inset-0 group-hover:text-accent"
                    >
                      {post.title}
                    </Link>
                  </TitleHeading>
                  <p className="mt-1 hidden text-muted sm:line-clamp-2">
                    {post.excerpt}
                  </p>
                  <p className="mt-1 flex gap-4 text-sm text-muted sm:hidden">
                    <DateFormatter dateString={post.date} style="dayMonth" />
                    <span>{post.readingTime} min read</span>
                  </p>
                </div>
                <p className="hidden whitespace-nowrap pt-0.5 text-right text-sm text-muted sm:block">
                  <DateFormatter
                    dateString={post.date}
                    style="dayMonth"
                    className="block"
                  />
                  {post.readingTime} min read
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
