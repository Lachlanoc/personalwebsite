// Post dates are plain calendar dates ("2026-09-11"), so they are formatted in
// UTC to read the same wherever the site is built or viewed.
const long = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

// Three-letter months ("Sep", "Jul"); the en-AU short forms vary in length.
const shortMonth = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});

/**
 * long: "11 September 2026".
 * dayMonth: "11 Sep", for lists already grouped by year.
 */
export type DateStyle = "long" | "dayMonth";

export function formatDate(isoDate: string, style: DateStyle = "long"): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (style === "long") return long.format(date);
  return `${date.getUTCDate()} ${shortMonth.format(date)}`;
}

export function yearOf(isoDate: string): string {
  return isoDate.slice(0, 4);
}
