/** Colour contrast per WCAG 2, for keeping syntax colours readable on the code background. */

type Rgb = [number, number, number];

/** Normal-size text needs at least this ratio against its background (WCAG AA). */
export const MIN_TEXT_CONTRAST = 4.5;

function parseHex(color: string): Rgb | null {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
  if (!match) return null;
  const hex =
    match[1].length === 3
      ? [...match[1]].map((digit) => digit + digit).join("")
      : match[1];
  return [0, 2, 4].map((start) => parseInt(hex.slice(start, start + 2), 16)) as Rgb;
}

const toHex = (rgb: Rgb) =>
  "#" + rgb.map((channel) => Math.round(channel).toString(16).padStart(2, "0")).join("");

function luminance([r, g, b]: Rgb): number {
  const linear = (channel: number) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** Contrast ratio between two hex colours, from 1 (identical) to 21 (black on white). */
export function contrastRatio(first: string, second: string): number {
  const a = parseHex(first);
  const b = parseHex(second);
  if (!a || !b) return NaN;
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Returns the colour unchanged if it already meets the minimum contrast on the
 * background; otherwise the nearest shade of it that does, moving towards black
 * on a light background or white on a dark one. Colours that are not plain hex
 * are returned as they are.
 */
export function ensureContrast(
  color: string,
  background: string,
  minimum = MIN_TEXT_CONTRAST,
): string {
  const rgb = parseHex(color);
  const backgroundRgb = parseHex(background);
  if (!rgb || !backgroundRgb) return color;
  if (contrastRatio(color, background) >= minimum) return color;

  const target: Rgb = luminance(backgroundRgb) > 0.5 ? [0, 0, 0] : [255, 255, 255];
  for (let step = 1; step <= 50; step++) {
    const amount = step / 50;
    const mixed = rgb.map(
      (channel, index) => channel + (target[index] - channel) * amount,
    ) as Rgb;
    const candidate = toHex(mixed);
    if (contrastRatio(candidate, background) >= minimum) return candidate;
  }
  return toHex(target);
}
