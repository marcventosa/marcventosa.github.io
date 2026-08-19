// Dev-only admin backend for the static portfolio.
// Exposes a small JSON API (under /admin-api) and redirects /admin -> the editor UI.
// Only active inside the Vite dev server (`npm run admin`), never in production.

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PROJECTS_PATH = path.join(ROOT, 'projects.json');
const MANIFEST_PATH = path.join(ROOT, 'images-manifest.json');
const IMAGES_DIR = path.join(ROOT, 'images');
const OPTIMIZE_SCRIPT = path.join(ROOT, 'scripts', 'optimize-images.mjs');
const TRANSLATE_SCRIPT = path.join(ROOT, 'scripts', 'translate.mjs');

const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|svg|avif)$/i;
const VARIANT_RE = /@\d+w\.(webp|png|jpe?g)$/i;

const readJson = async (p, fallback) => {
  try {
    return JSON.parse(await fs.readFile(p, 'utf8'));
  } catch {
    return fallback;
  }
};

const writeJson = (p, data) =>
  fs.writeFile(p, JSON.stringify(data, null, 2) + '\n', 'utf8');

const readBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });

const sendJson = (res, status, data) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
};

// Run a Node script in the repo root; resolve with its exit code + output.
const runNode = (scriptPath) =>
  new Promise((resolve) => {
    const child = spawn(process.execPath, [scriptPath], { cwd: ROOT, stdio: 'pipe' });
    let out = '';
    let err = '';
    child.stdout.on('data', (d) => (out += d.toString()));
    child.stderr.on('data', (d) => (err += d.toString()));
    child.on('close', (code) => resolve({ code, out, err }));
  });

const safeSegment = (s) => path.basename(String(s || ''));

async function listImages(projectId) {
  const dir = path.join(IMAGES_DIR, projectId);
  let entries = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((e) => e.isFile() && IMAGE_EXT_RE.test(e.name) && !VARIANT_RE.test(e.name))
    .map((e) => e.name)
    .sort();
}

async function buildState() {
  const projects = await readJson(PROJECTS_PATH, []);
  const manifest = await readJson(MANIFEST_PATH, {});
  const texts = {};
  const images = {};
  for (const p of projects) {
    const id = p.id;
    try {
      texts[id] = await fs.readFile(path.join(IMAGES_DIR, id, 'text.txt'), 'utf8');
    } catch {
      texts[id] = '';
    }
    images[id] = await listImages(id);
  }
  return { projects, manifest, texts, images };
}

async function handleApi(req, res, pathname) {
  try {
    if (pathname === '/admin-api/state' && req.method === 'GET') {
      return sendJson(res, 200, await buildState());
    }

    if (pathname === '/admin-api/projects' && req.method === 'POST') {
      const { projects } = await readBody(req);
      if (!Array.isArray(projects)) throw new Error('projects must be an array');
      await writeJson(PROJECTS_PATH, projects);
      return sendJson(res, 200, { ok: true });
    }

    if (pathname === '/admin-api/text' && req.method === 'POST') {
      const { projectId, content } = await readBody(req);
      if (!projectId) throw new Error('projectId required');
      const dir = path.join(IMAGES_DIR, safeSegment(projectId));
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(path.join(dir, 'text.txt'), String(content ?? ''), 'utf8');
      // Run translation in the background so a slow provider never blocks the UI.
      runNode(TRANSLATE_SCRIPT).then((r) => {
        if (r.code === 0) console.log('[admin] translation done');
        else console.warn('[admin] translation finished with code', r.code);
      });
      return sendJson(res, 200, { ok: true, translating: true });
    }

    if (pathname === '/admin-api/upload' && req.method === 'POST') {
      const { projectId, filename, dataUrl } = await readBody(req);
      if (!projectId || !filename || !dataUrl) {
        throw new Error('projectId, filename and dataUrl required');
      }
      const safeId = safeSegment(projectId);
      const safeName = safeSegment(filename);
      const dir = path.join(IMAGES_DIR, safeId);
      await fs.mkdir(dir, { recursive: true });

      const match = /^data:([^;,]+);base64,(.+)$/s.exec(dataUrl);
      if (!match) throw new Error('invalid dataUrl');
      const buf = Buffer.from(match[2], 'base64');
      await fs.writeFile(path.join(dir, safeName), buf);

      const o = await runNode(OPTIMIZE_SCRIPT);
      return sendJson(res, 200, {
        ok: true,
        src: `images/${safeId}/${safeName}`,
        optimize: { code: o.code }
      });
    }

    if (pathname === '/admin-api/delete-image' && req.method === 'POST') {
      const { projectId, filename } = await readBody(req);
      if (!projectId || !filename) throw new Error('projectId and filename required');
      const safeId = safeSegment(projectId);
      const safeName = safeSegment(filename);
      const dir = path.join(IMAGES_DIR, safeId);

      await fs.unlink(path.join(dir, safeName)).catch(() => {});
      const stem = path.parse(safeName).name;
      let entries = [];
      try {
        entries = await fs.readdir(dir);
      } catch {}
      for (const e of entries) {
        if (e.startsWith(stem + '@') && VARIANT_RE.test(e)) {
          await fs.unlink(path.join(dir, e)).catch(() => {});
        }
      }

      const o = await runNode(OPTIMIZE_SCRIPT);
      return sendJson(res, 200, { ok: true, optimize: { code: o.code } });
    }

    if (pathname === '/admin-api/optimize' && req.method === 'POST') {
      const o = await runNode(OPTIMIZE_SCRIPT);
      return sendJson(res, 200, { ok: true, code: o.code, output: o.out, error: o.err });
    }

    if (pathname === '/admin-api/translate' && req.method === 'POST') {
      const o = await runNode(TRANSLATE_SCRIPT);
      return sendJson(res, 200, { ok: true, code: o.code, output: o.out, error: o.err });
    }

    return sendJson(res, 404, { ok: false, error: 'Not found' });
  } catch (e) {
    return sendJson(res, 500, { ok: false, error: e.message });
  }
}

export default function adminPlugin() {
  return {
    name: 'portfolio-admin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0];
        if (url === '/admin' || url === '/admin/') {
          res.statusCode = 302;
          res.setHeader('Location', '/admin/admin.html');
          res.end();
          return;
        }
        if (url.startsWith('/admin-api/')) {
          handleApi(req, res, url);
          return;
        }
        next();
      });
    }
  };
}
