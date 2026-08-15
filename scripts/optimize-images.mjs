// Optimize images: generate responsive WebP variants + a manifest for the loaders.
// Usage: node scripts/optimize-images.mjs

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'images');
const MANIFEST_PATH = path.join(ROOT, 'images-manifest.json');

const TARGET_WIDTHS = [480, 800, 1200, 1800];
const MAX_WIDTH = 1800;
const QUALITY = 80;

const EXT_RE = /\.(png|jpe?g)$/i;
const VARIANT_RE = /@\d+w\.(webp|png|jpe?g)$/i;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...(await walk(p)));
    } else if (EXT_RE.test(e.name) && !VARIANT_RE.test(e.name)) {
      files.push(p);
    }
  }
  return files;
}

function toPosix(p) {
  return p.split(path.sep).join('/');
}

async function main() {
  const files = await walk(IMAGES_DIR);
  const manifest = {};
  let variantCount = 0;
  let imageCount = 0;

  for (const file of files) {
    const rel = toPosix(path.relative(ROOT, file));
    const meta = await sharp(file).metadata();
    const srcW = meta.width;
    if (!srcW) continue;

    const widths = new Set();
    for (const w of TARGET_WIDTHS) {
      if (w <= srcW) widths.add(w);
    }
    widths.add(Math.min(srcW, MAX_WIDTH));
    const sorted = [...widths].sort((a, b) => a - b);

    const variants = [];
    for (const w of sorted) {
      const outName = `${path.basename(file, path.extname(file))}@${w}w.webp`;
      const outPath = path.join(path.dirname(file), outName);
      await sharp(file)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outPath);
      variants.push({ src: toPosix(path.relative(ROOT, outPath)), w });
      variantCount++;
    }

    manifest[rel] = { variants };
    imageCount++;
    console.log(`  ${rel} -> ${variants.length} variants (source ${srcW}px)`);
  }

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\nDone: ${imageCount} images, ${variantCount} WebP variants.`);
  console.log(`Manifest written to ${toPosix(path.relative(ROOT, MANIFEST_PATH))}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
