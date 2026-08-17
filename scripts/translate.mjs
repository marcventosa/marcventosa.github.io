// Translate project texts + UI strings (Catalan -> English).
// Usage: npm run translate
//
// - Each //-block's BODY (after the first single "/") is translated.
// - Title (*...*) and the subtitle's FIRST line (workshop name) are NOT
//   translated (proper names). The subtitle's remaining lines (project
//   purpose) are translated like the body.
// - $italic$ spans in the translated parts are translated too.
// - Incremental: results are cached by source hash in .translate-cache.json, so
//   re-running only re-translates blocks whose Catalan text changed.
//
// Config (env vars):
//   TRANSLATE_DELAY   ms between requests (default 1200)
//   TRANSLATE_RETRIES retries on failure (default 4, with backoff)

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { Translator } from 'deepl-node';
import { watch } from 'chokidar';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'images');
const CACHE_PATH = path.join(ROOT, '.translate-cache.json');
const STRINGS_PATH = path.join(ROOT, 'strings.json');
const STRINGS_EN_PATH = path.join(ROOT, 'strings.en.json');

const DELAY = Number(process.env.TRANSLATE_DELAY) || 1200;
const RETRIES = Number(process.env.TRANSLATE_RETRIES) || 3;

// Providers, tried in order:
//  1. LibreTranslate — self-hosted (default http://localhost:5000), no rate limit.
//     Run: docker compose up -d  (see docker-compose.yml)
//  2. DeepL        — set DEEPL_API_KEY (best quality, free tier available)
//  3. MyMemory     — free, no key (always tried last)
const DEEPL_KEY = process.env.DEEPL_API_KEY || '';
const LIBRE_URL = process.env.LIBRE_URL || 'http://localhost:5000';
const deepl = DEEPL_KEY ? new Translator(DEEPL_KEY) : null;
let libreAvailable = false;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const hash = (s) => crypto.createHash('sha1').update(s).digest('hex');

async function loadCache() {
  try {
    return JSON.parse(await fs.readFile(CACHE_PATH, 'utf8'));
  } catch {
    return {};
  }
}

async function saveCache(cache) {
  await fs.writeFile(CACHE_PATH, JSON.stringify(cache, null, 2) + '\n', 'utf8');
}

async function translateDeepL(text) {
  const res = await deepl.translateText(text, 'ca', 'en-US');
  return res.text;
}

async function translateLibre(text) {
  const res = await fetch(`${LIBRE_URL}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: text, source: 'ca', target: 'en', format: 'text' })
  });
  if (!res.ok) throw new Error(`LibreTranslate ${res.status}`);
  const json = await res.json();
  if (!json.translatedText) throw new Error('LibreTranslate empty response');
  return json.translatedText;
}

// Quick reachability check so we only use LibreTranslate when a server is up.
async function checkLibre() {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3000);
    const res = await fetch(`${LIBRE_URL}/languages`, { signal: ctrl.signal });
    clearTimeout(t);
    return res.ok;
  } catch {
    return false;
  }
}

async function translateMyMemory(text) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ca|en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MyMemory ${res.status}`);
  const json = await res.json();
  const out = json.responseData && json.responseData.translatedText;
  if (!out) throw new Error('MyMemory empty response');
  return out;
}

async function translateOne(text) {
  if (!text || !text.trim()) return text;

  const providers = [];
  if (libreAvailable) providers.push(['libre', translateLibre]);
  if (deepl) providers.push(['deepl', translateDeepL]);
  providers.push(['mymemory', translateMyMemory]);

  for (const [name, fn] of providers) {
    let lastErr;
    for (let attempt = 0; attempt <= RETRIES; attempt++) {
      try {
        return await fn(text);
      } catch (e) {
        lastErr = e;
        if (attempt < RETRIES) {
          const wait = DELAY * Math.pow(2, attempt);
          console.warn(`  ${name}: retrying in ${wait}ms (${e.message})`);
          await sleep(wait);
        }
      }
    }
    console.warn(`  ${name}: failed, trying next provider (${lastErr && lastErr.message})`);
  }

  console.warn('  all providers failed, keeping original');
  return text;
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(p)));
    else if (e.name === 'text.txt') files.push(p);
  }
  return files;
}

// Translate text while protecting $italic$ spans (translated separately, then
// restored).
async function translateWithItalics(text) {
  const italics = [];
  const protectedText = text.replace(/\$([^$]+)\$/g, (_, inner) => {
    italics.push(inner);
    return `⟦${italics.length - 1}⟧`;
  });

  let out = await translateOne(protectedText);
  await sleep(DELAY);

  for (let i = 0; i < italics.length; i++) {
    const it = await translateOne(italics[i]);
    await sleep(DELAY);
    out = out.replace(new RegExp(`⟦${i}⟧`), `$${it}$`);
  }
  return out;
}

// Translate a block's translatable text, preserving the untranslatable parts:
// the *title* and the subtitle's first line (workshop name). The subtitle's
// remaining lines (project purpose) and the body are translated.
async function translateBlock(block, cache) {
  const key = hash('v2:' + block);
  if (cache[key] != null) return cache[key];

  let header = block;
  let body = '';
  const sep = block.indexOf('/');
  if (sep !== -1) {
    header = block.slice(0, sep).trim();
    body = block.slice(sep + 1).trim();
  }

  // Parse header: *title* + subtitle (line 1 = workshop name, untranslated;
  // the rest = purpose, translated like the body).
  let title = '';
  let workshop = '';
  let purpose = '';
  const titleMatch = header.match(/\*([^*]+)\*/);
  let headerRest = header;
  if (titleMatch) {
    title = titleMatch[0];
    headerRest = header.replace(/\*[^*]+\*/, '').trim();
  }
  const headerLines = headerRest.split('\n');
  workshop = (headerLines[0] || '').trim();
  purpose = headerLines.slice(1).join('\n').trim();

  const translatedPurpose = purpose ? await translateWithItalics(purpose) : '';
  const translatedBody = body ? await translateWithItalics(body) : '';

  const newHeader = [title, workshop, translatedPurpose].filter(Boolean).join('\n');
  const result = newHeader ? `${newHeader}\n/\n${translatedBody}` : translatedBody;
  cache[key] = result;
  await saveCache(cache);
  return result;
}

async function translateStrings(cache) {
  try {
    const src = JSON.parse(await fs.readFile(STRINGS_PATH, 'utf8'));
    const out = {};
    for (const [key, value] of Object.entries(src)) {
      const ckey = 's:' + key;
      if (cache[ckey] != null && cache[`${ckey}:src`] === hash(value)) {
        out[key] = cache[ckey];
      } else {
        out[key] = await translateOne(value);
        await sleep(DELAY);
        cache[ckey] = out[key];
        cache[`${ckey}:src`] = hash(value);
        await saveCache(cache);
      }
    }
    await fs.writeFile(STRINGS_EN_PATH, JSON.stringify(out, null, 2) + '\n', 'utf8');
    console.log('Translated strings: strings.json -> strings.en.json');
  } catch (e) {
    console.warn('Could not translate strings.json:', e.message);
  }
}

async function translateProfile(cache) {
  const srcPath = path.join(ROOT, 'profile.txt');
  try {
    const content = (await fs.readFile(srcPath, 'utf8')).replace(/\r\n?/g, '\n').trim();
    const key = 'profile';
    let out;
    if (cache[key] != null && cache[`${key}:src`] === hash(content)) {
      out = cache[key];
    } else {
      out = await translateOne(content);
      await sleep(DELAY);
      cache[key] = out;
      cache[`${key}:src`] = hash(content);
      await saveCache(cache);
    }
    const outPath = path.join(ROOT, 'profile.en.txt');
    await fs.writeFile(outPath, out + '\n', 'utf8');
    console.log('Translated profile: profile.txt -> profile.en.txt');
  } catch (e) {
    console.warn('Could not translate profile.txt:', e.message);
  }
}

async function main() {
  const cache = await loadCache();
  libreAvailable = await checkLibre();
  if (libreAvailable) console.log(`LibreTranslate: ${LIBRE_URL}`);
  else console.warn(`LibreTranslate not reachable at ${LIBRE_URL} — using fallbacks.`);

  const files = await walk(IMAGES_DIR);
  if (!files.length) {
    console.log('No text.txt files found.');
  } else {
    for (const file of files) {
      const content = (await fs.readFile(file, 'utf8')).replace(/\r\n?/g, '\n');
      const blocks = content.split('//').map((b) => b.trim()).filter((b) => b);

      const outBlocks = [];
      for (const block of blocks) {
        outBlocks.push(await translateBlock(block, cache));
      }

      const out = outBlocks.join('\n\n//\n\n');
      const outPath = file.replace(/text\.txt$/, 'text.en.txt');
      await fs.writeFile(outPath, out + '\n', 'utf8');
      console.log(`Translated: ${path.relative(ROOT, file)} -> ${path.relative(ROOT, outPath)}`);
    }
  }

  await translateStrings(cache);
  await translateProfile(cache);

  console.log('\nDone. Review/edit generated files (titles/subtitles left untranslated).');
  console.log('Re-run any time — only changed blocks will be re-translated.');
}

const isWatch = process.argv.includes('--watch');

async function run() {
  try {
    await main();
  } catch (e) {
    console.error(e);
  }
}

if (isWatch) {
  let timer = null;
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      run();
    }, 500); // debounce
  };

  const watcher = watch(
    ['images/**/text.txt', 'strings.json', 'profile.txt'],
    {
      ignoreInitial: true,
      ignored: ['**/*.en.txt', '.translate-cache.json', '**/node_modules/**']
    }
  );
  watcher.on('add', schedule);
  watcher.on('change', schedule);
  watcher.on('unlink', schedule);

  console.log('Watching for .txt changes — Ctrl+C to stop.');
  run();
} else {
  run();
}
