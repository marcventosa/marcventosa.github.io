// One-off migration: move all inline text (and text-only entries) into each
// project's text.txt as extra fragments. Entries become `text: "textN"` refs,
// text-only entries are removed, and text.txt is normalized to the canonical
// `//`-separated format. Idempotent: existing `textN` refs are preserved.
//
// Usage: node scripts/migrate-inline-text.mjs

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PROJECTS_PATH = path.join(ROOT, 'projects.json');
const IMAGES_DIR = path.join(ROOT, 'images');

const LABEL_RE = /^text\d+$/;

// Serialize a {title, subtitle, body} fragment into a text.txt block.
function serializeFragment(f) {
  const title = (f.title || '').trim();
  const subtitle = (f.subtitle || '').trim();
  const body = (f.body || '').trim();
  const lines = [];
  if (title) lines.push(`*${title}*`);
  if (subtitle) lines.push(subtitle);
  const header = lines.join('\n');
  if (header && body) return `${header}\n/\n${body}`;
  if (header) return header;
  return body;
}

// Turn an inline text value into a fragment {title, subtitle, body}.
function fragmentFromText(text, firstWord) {
  if (text && typeof text === 'object' && !Array.isArray(text)) {
    return {
      title: text.title || text.firstWord || '',
      subtitle: text.subtitle || '',
      body: Array.isArray(text.body) ? text.body.join('\n\n') : (text.body || text.text || '')
    };
  }
  const body = Array.isArray(text) ? text.join('\n\n') : String(text ?? '');
  return { title: firstWord || '', subtitle: '', body };
}

// True when a `text` value is a reference label (text1, text2, ...).
const isLabel = (t) => typeof t === 'string' && LABEL_RE.test(t.trim().toLowerCase());

async function main() {
  const projects = JSON.parse(await fs.readFile(PROJECTS_PATH, 'utf8'));

  for (const project of projects) {
    const id = project.id;
    const textDir = path.join(IMAGES_DIR, id);
    const textPath = path.join(textDir, 'text.txt');
    let raw = '';
    try {
      raw = (await fs.readFile(textPath, 'utf8')).replace(/\r\n?/g, '\n');
    } catch {}

    const blocks = raw.split('//').map((b) => b.trim()).filter(Boolean);

    const newEntries = [];
    for (const item of project.gallery || []) {
      const hasSrc = !!item.src;
      const layoutText = item.layout && item.layout.text;
      const inlineText = item.text != null && !isLabel(item.text) ? item.text : null;
      const hasFirstWord = typeof item.firstWord === 'string';

      const textValue = layoutText != null ? layoutText : inlineText;
      const isTextOnly = !hasSrc && (inlineText != null || hasFirstWord);

      if (isTextOnly) {
        // Remove the entry; push its text as a fragment.
        blocks.push(serializeFragment(fragmentFromText(textValue, item.firstWord)));
        continue;
      }

      if (hasSrc && (inlineText != null || layoutText != null || hasFirstWord)) {
        const frag = fragmentFromText(textValue, item.firstWord);
        blocks.push(serializeFragment(frag));
        const label = `text${blocks.length}`;
        const clean = { ...item };
        delete clean.firstWord;
        delete clean.text;
        if (clean.layout) {
          delete clean.layout.text;
          if (Object.keys(clean.layout).length === 0) delete clean.layout;
        }
        clean.text = label;
        newEntries.push(clean);
        continue;
      }

      newEntries.push(item);
    }

    project.gallery = newEntries;

    if (blocks.length) {
      await fs.mkdir(textDir, { recursive: true });
      await fs.writeFile(textPath, blocks.join('\n\n//\n\n') + '\n', 'utf8');
      console.log(`  ${id}: ${blocks.length} fragment(s) written to text.txt`);
    }
  }

  await fs.writeFile(PROJECTS_PATH, JSON.stringify(projects, null, 2) + '\n', 'utf8');
  console.log('Migration complete: projects.json updated.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
