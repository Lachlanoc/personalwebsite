"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { formatDate } from "@/lib/dates";
import {
  resultHref,
  searchPosts,
  type SearchEntry,
} from "@/lib/search";

const INDEX_URL = "/search.json";
const LISTBOX_ID = "search-results";

type IndexState =
  | { status: "idle" | "loading" | "failed" }
  | { status: "ready"; entries: SearchEntry[] };

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

/** The header's search button and the dialog it opens. */
export function SearchDialog() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [index, setIndex] = useState<IndexState>({ status: "idle" });
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const results =
    index.status === "ready" ? searchPosts(index.entries, query) : [];
  const active = results[Math.min(activeIndex, results.length - 1)];

  const loadIndex = async () => {
    if (index.status === "ready" || index.status === "loading") return;
    setIndex({ status: "loading" });
    try {
      const response = await fetch(INDEX_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setIndex({ status: "ready", entries: await response.json() });
    } catch {
      setIndex({ status: "failed" });
    }
  };

  const open = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    inputRef.current?.focus();
    void loadIndex();
  };

  const close = () => dialogRef.current?.close();

  const goTo = (href: string) => {
    close();
    router.push(href);
  };

  // "/" and Ctrl/Cmd+K open search from anywhere on the page.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isShortcut =
        (event.key === "k" && (event.metaKey || event.ctrlKey)) ||
        (event.key === "/" && !isTypingTarget(event.target));
      if (!isShortcut) return;
      event.preventDefault();
      open();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (results.length === 0) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex(
        (current) => (current + step + results.length) % results.length,
      );
    } else if (event.key === "Enter" && active) {
      event.preventDefault();
      goTo(resultHref(active));
    }
  };

  const trimmedQuery = query.trim();
  let message: string | null = null;
  if (index.status === "failed") {
    message = "Search could not load. Check your connection, then close and reopen search.";
  } else if (trimmedQuery && index.status === "loading") {
    message = "Loading…";
  } else if (trimmedQuery && results.length === 0 && index.status === "ready") {
    message = `No posts match “${trimmedQuery}”.`;
  } else if (!trimmedQuery) {
    message = "Search post titles, topics and section headings.";
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="Search posts"
        title="Search posts (press /)"
        className="needs-js inline-flex size-9 cursor-pointer items-center justify-center rounded-sm text-muted hover:text-ink"
      >
        <FaMagnifyingGlass aria-hidden="true" className="size-4" />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Search posts"
        // Reset for next time once the dialog has closed, however it was closed.
        onClose={() => {
          setQuery("");
          setActiveIndex(0);
        }}
        // A click on the dimmed area outside the panel closes the dialog.
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="mx-auto mt-[12vh] w-[min(40rem,calc(100vw-2rem))] max-w-none rounded-md border border-line bg-paper p-0 text-ink backdrop:bg-black/50"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <FaMagnifyingGlass aria-hidden="true" className="size-4 flex-none text-muted" />
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-label="Search posts"
            aria-expanded={results.length > 0}
            aria-controls={LISTBOX_ID}
            aria-activedescendant={active ? `search-result-${active.entry.slug}` : undefined}
            autoComplete="off"
            placeholder="Search posts"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onInputKeyDown}
            className="min-w-0 flex-1 bg-transparent py-3.5 text-lg outline-none placeholder:text-muted"
          />
          <button
            type="button"
            onClick={close}
            className="flex-none cursor-pointer rounded-sm border border-line px-2 py-0.5 text-sm text-muted hover:text-ink"
          >
            Close
          </button>
        </div>

        <ul
          id={LISTBOX_ID}
          role="listbox"
          aria-label="Matching posts"
          className="max-h-[60vh] overflow-y-auto empty:hidden"
        >
          {results.map((result) => {
            const href = resultHref(result);
            const isActive = result === active;
            return (
              <li
                key={result.entry.slug}
                id={`search-result-${result.entry.slug}`}
                role="option"
                aria-selected={isActive}
                className="aria-selected:bg-surface"
              >
                <a
                  href={href}
                  tabIndex={-1}
                  onClick={(event) => {
                    // Let modified clicks open a new tab as usual.
                    if (event.metaKey || event.ctrlKey || event.shiftKey) return;
                    event.preventDefault();
                    goTo(href);
                  }}
                  onMouseMove={() => setActiveIndex(results.indexOf(result))}
                  className="flex items-baseline justify-between gap-4 px-4 py-3"
                >
                  <span className="min-w-0">
                    <span className="block font-medium">{result.entry.title}</span>
                    <span className="block truncate text-sm text-muted">
                      {result.section
                        ? `Section: ${result.section.text}`
                        : result.entry.excerpt}
                    </span>
                  </span>
                  <span className="flex-none whitespace-nowrap text-sm text-muted">
                    {formatDate(result.entry.date)}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <p role="status" className="px-4 py-3 text-sm text-muted empty:hidden">
          {message}
        </p>
      </dialog>
    </>
  );
}
