export type Post = {
  slug: string;
  title: string;
  /** ISO date, e.g. "2026-09-11". */
  date: string;
  coverImage: string;
  excerpt: string;
  ogImage: {
    url: string;
  };
  tags: string[];
  /** Estimated minutes to read, at least 1. */
  readingTime: number;
  /** Raw markdown body. */
  content: string;
};
