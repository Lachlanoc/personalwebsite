// Post dates are plain calendar dates ("2026-09-11"), so they are formatted in
// UTC to read the same wherever the site is built or viewed.
const format = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** "2026-09-01" -> "1 September 2026" */
export function formatDate(isoDate: string): string {
  return format.format(new Date(`${isoDate}T00:00:00Z`));
}
