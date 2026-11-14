// Resizes everything under public/assets into public/_img and writes a manifest.
//
// The site is a static export, so there is no server to resize images on
// request. This runs before `dev` and `build` instead. Outputs are skipped when
// they are newer than their source, so repeat runs are quick.

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, "public", "assets");
const OUTPUT_DIR = path.join(ROOT, "public", "_img");
const TARGET_WIDTHS = [480, 800, 1200, 1600];
const QUALITY = 78;
const EXTENSIONS = new Set([".webp", ".jpg", ".jpeg", ".png"]);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return EXTENSIONS.has(path.extname(entry.name).toLowerCase()) ? [full] : [];
  });
}

function isFresh(output, source) {
  return (
    fs.existsSync(output) &&
    fs.statSync(output).mtimeMs >= fs.statSync(source).mtimeMs
  );
}

const manifest = {};
let written = 0;

for (const source of walk(SOURCE_DIR)) {
  // Site-relative path as it appears in posts, e.g. /assets/blog/dain/cover.webp
  const sitePath = "/" + path.relative(path.join(ROOT, "public"), source).split(path.sep).join("/");
  const { width, height } = await sharp(source).metadata();

  // Never upscale: keep the targets below the original, plus the original
  // width itself when it is smaller than the largest target.
  const widths = TARGET_WIDTHS.filter((target) => target < width);
  if (width <= TARGET_WIDTHS.at(-1)) widths.push(width);

  for (const target of widths) {
    const output = path.join(
      OUTPUT_DIR,
      sitePath.replace(/\.[^./]+$/, "") + `-${target}.webp`,
    );
    if (isFresh(output, source)) continue;
    fs.mkdirSync(path.dirname(output), { recursive: true });
    await sharp(source).resize({ width: target }).webp({ quality: QUALITY }).toFile(output);
    written++;
  }

  manifest[sitePath] = { width, height, widths };
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(
  path.join(OUTPUT_DIR, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);

console.log(
  `optimize-images: ${Object.keys(manifest).length} sources, ${written} files written`,
);
