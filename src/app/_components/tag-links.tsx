import Link from "next/link";
import { tagSlug } from "@/lib/api";

type Props = {
  tags: string[];
  /** Slug of the tag whose page this is, if any. */
  currentSlug?: string;
};

/** Tags as plain text links to their listing pages. */
export function TagLinks({ tags, currentSlug }: Props) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1">
      {tags.map((tag) => {
        const slug = tagSlug(tag);
        return (
          <li key={slug}>
            <Link
              href={`/tags/${slug}`}
              aria-current={slug === currentSlug ? "page" : undefined}
              className="text-muted hover:text-ink aria-[current=page]:text-ink aria-[current=page]:underline aria-[current=page]:decoration-accent aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-4"
            >
              {tag}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
