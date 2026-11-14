/**
 * Search over the posts. The index is built at build time and served as
 * /search.json; matching runs in the browser. Nothing here touches the file
 * system, so both sides can import it.
 */

export type SearchEntry = {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date, e.g. "2026-09-11". */
  date: string;
  tags: string[];
  /** Section headings within the post. */
  sections: { id: string; text: string }[];
};

export type SearchResult = {
  entry: SearchEntry;
  /** Set when the query matched a section heading rather than the title. */
  section?: { id: string; text: string };
};

// How much a match in each field counts. Titles matter most.
const TITLE_WEIGHT = 10;
const TITLE_WORD_START_BONUS = 5;
const TAG_WEIGHT = 6;
const SECTION_WEIGHT = 3;
const EXCERPT_WEIGHT = 2;

const normalise = (text: string) => text.toLowerCase();

const startsAWord = (text: string, term: string) =>
  text.split(/[^\p{L}\p{N}]+/u).some((word) => word.startsWith(term));

/**
 * Posts matching every word of the query, best match first.
 * Ties go to the newer post. An empty query matches nothing.
 */
export function searchPosts(index: SearchEntry[], query: string): SearchResult[] {
  const terms = normalise(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const scored: { result: SearchResult; score: number }[] = [];

  for (const entry of index) {
    const title = normalise(entry.title);
    const excerpt = normalise(entry.excerpt);
    const tags = entry.tags.map(normalise);

    let score = 0;
    let matchedEveryTerm = true;
    let titleMatchedEveryTerm = true;
    let matchedSection: SearchResult["section"];

    for (const term of terms) {
      let termScore = 0;

      if (title.includes(term)) {
        termScore += TITLE_WEIGHT;
        if (startsAWord(title, term)) termScore += TITLE_WORD_START_BONUS;
      } else {
        titleMatchedEveryTerm = false;
      }
      if (tags.some((tag) => tag.includes(term))) termScore += TAG_WEIGHT;
      const section = entry.sections.find((candidate) =>
        normalise(candidate.text).includes(term),
      );
      if (section) {
        termScore += SECTION_WEIGHT;
        matchedSection ??= section;
      }
      if (excerpt.includes(term)) termScore += EXCERPT_WEIGHT;

      if (termScore === 0) {
        matchedEveryTerm = false;
        break;
      }
      score += termScore;
    }

    if (!matchedEveryTerm) continue;
    scored.push({
      score,
      result: {
        entry,
        // Point at the section only when the title alone does not explain the match.
        section: titleMatchedEveryTerm ? undefined : matchedSection,
      },
    });
  }

  return scored
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.result.entry.date.localeCompare(a.result.entry.date),
    )
    .map(({ result }) => result);
}

export function resultHref(result: SearchResult): string {
  const base = `/posts/${result.entry.slug}`;
  return result.section ? `${base}#${result.section.id}` : base;
}
