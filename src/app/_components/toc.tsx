import type { TocEntry } from "@/lib/markdown";

/** Links to a post's sections. Works without scripts; TocHighlight adds the current marker. */
export function Toc({ entries }: { entries: TocEntry[] }) {
  return (
    <ol className="space-y-2 text-sm leading-snug">
      {entries.map((entry) => (
        <li key={entry.id} className={entry.depth === 3 ? "pl-4" : undefined}>
          <a
            href={`#${entry.id}`}
            data-toc-link={entry.id}
            className="text-muted hover:text-ink aria-[current=location]:font-medium aria-[current=location]:text-ink"
          >
            {entry.text}
          </a>
        </li>
      ))}
    </ol>
  );
}
