import Link from "next/link";
import type { Post } from "@/interfaces/post";

type Props = {
  older: Post | null;
  newer: Post | null;
};

/** Links to the posts published before and after this one. */
export function PostNav({ older, newer }: Props) {
  if (!older && !newer) return null;

  return (
    <nav
      aria-label="More posts"
      className="mt-16 grid gap-6 border-t border-line pt-6 sm:grid-cols-2"
    >
      {older && (
        <p>
          <span className="block text-sm text-muted">Previous</span>
          <Link
            href={`/posts/${older.slug}`}
            className="font-medium underline-offset-4 hover:underline"
          >
            {older.title}
          </Link>
        </p>
      )}
      {newer && (
        <p className="sm:col-start-2 sm:text-right">
          <span className="block text-sm text-muted">Next</span>
          <Link
            href={`/posts/${newer.slug}`}
            className="font-medium underline-offset-4 hover:underline"
          >
            {newer.title}
          </Link>
        </p>
      )}
    </nav>
  );
}
