// Admin UI: visual editor for projects, gallery entries, text fragments and images.

const $ = (sel) => document.querySelector(sel);

let state = null; // { projects, manifest, fragments:{id:[...]}, images:{id:[...]}, orphans }
let currentId = null;
let uploadMode = 'library';

async function api(path, body) {
  const res = await fetch(path, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) throw new Error(data.error || 'HTTP ' + res.status);
  return data;
}

let statusTimer = null;
function status(msg, isError = false) {
  const el = $('#status');
  el.textContent = msg;
  el.classList.toggle('error', isError);
  clearTimeout(statusTimer);
  if (msg) statusTimer = setTimeout(() => { el.textContent = ''; }, 7000);
}

function setBusy(on) {
  document.querySelectorAll('button').forEach((b) => (b.disabled = on));
}

function btn(label, onClick, cls = '') {
  const b = document.createElement('button');
  b.textContent = label;
  if (cls) b.className = cls;
  b.addEventListener('click', onClick);
  return b;
}

function imgUrl(id, name) {
  return '/images/' + encodeURIComponent(id) + '/' + encodeURIComponent(name);
}

const srcToFilename = (src) => String(src).split('/').pop();

const fragLabel = (i) => 'text' + (i + 1);
function labelToIndex(label) {
  const m = /^text(\d+)$/.exec(String(label || '').trim().toLowerCase());
  return m ? parseInt(m[1], 10) - 1 : null;
}

function project() {
  return state.projects.find((p) => p.id === currentId);
}
function frags() {
  if (!state.fragments[currentId]) state.fragments[currentId] = [];
  return state.fragments[currentId];
}
function library() {
  return state.images[currentId] || [];
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

// ---- Load / resolve ----

async function loadState() {
  state = await api('/admin-api/state');
  resolveLinks();
  const ids = state.projects.map((p) => p.id);
  if (!ids.includes(currentId)) currentId = ids[0] || null;
  renderAll();
}

function resolveLinks() {
  for (const p of state.projects) {
    const fr = state.fragments[p.id] || [];
    for (const e of p.gallery || []) {
      const i = labelToIndex(e.text);
      e.__frag = i != null && i < fr.length ? i : null;
    }
  }
}

function renderAll() {
  renderProjectSelect();
  renderOrphans();
  renderGallery();
  renderFragments();
  renderLibrary();
  syncHiddenCheckbox();
}

// ---- Project select / hidden / orphans ----

function renderProjectSelect() {
  const sel = $('#project-select');
  const prev = currentId;
  sel.innerHTML = '';
  for (const p of state.projects) {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.hidden ? p.id + ' (hidden)' : p.id;
    if (p.id === currentId) opt.selected = true;
    sel.appendChild(opt);
  }
  currentId = prev;
}

function syncHiddenCheckbox() {
  const p = project();
  $('#project-hidden').checked = !!p?.hidden;
}

function renderOrphans() {
  const wrap = $('#orphans');
  wrap.innerHTML = '';
  const list = state.orphans || [];
  if (!list.length) return;
  const label = document.createElement('span');
  label.className = 'orphans-label';
  label.textContent = 'Orphan folders: ';
  wrap.appendChild(label);
  for (const o of list) {
    const b = document.createElement('button');
    b.textContent = `+ ${o.id}`;
    b.title = 'Create project from folder';
    b.addEventListener('click', () => createProject(o.id));
    wrap.appendChild(b);
  }
}

async function createProject(id) {
  setBusy(true);
  try {
    await api('/admin-api/create-project', { id });
    await loadState();
    currentId = id;
    renderAll();
    status('Created project ' + id);
  } catch (e) {
    status('Create failed: ' + e.message, true);
  }
  setBusy(false);
}

// ---- Gallery ----

function entryType(e) {
  if (Array.isArray(e.src) && e.src.length >= 2) return 'dual';
  if (e.src) return e.__frag != null ? 'imgtext' : 'img';
  return 'text';
}

function summarize(e) {
  let s;
  if (Array.isArray(e.src)) s = e.src.map(srcToFilename).join(' + ');
  else if (e.src) s = srcToFilename(e.src);
  else s = '(no image)';
  if (e.bw) s += ' · B&W';
  return s;
}

function renderGallery() {
  const list = $('#gallery-list');
  list.innerHTML = '';
  const p = project();
  if (!p) return;
  if (!p.gallery.length) {
    list.innerHTML = '<li class="empty">No entries yet. Add one above.</li>';
    return;
  }
  p.gallery.forEach((entry, idx) => list.appendChild(buildEntryCard(entry, idx)));
}

function buildEntryCard(entry, idx) {
  const li = document.createElement('li');
  li.className = 'entry';

  const head = document.createElement('div');
  head.className = 'entry-head';

  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.textContent = { img: 'IMG', dual: 'IMG×2', imgtext: 'IMG+TXT', text: 'TXT' }[entryType(entry)];
  head.appendChild(badge);

  const thumb = document.createElement('div');
  thumb.className = 'thumb';
  if (Array.isArray(entry.src)) {
    entry.src.forEach((s) => {
      const im = document.createElement('img');
      im.src = imgUrl(currentId, srcToFilename(s));
      im.loading = 'lazy';
      thumb.appendChild(im);
    });
  } else if (entry.src) {
    const im = document.createElement('img');
    im.src = imgUrl(currentId, srcToFilename(entry.src));
    im.loading = 'lazy';
    thumb.appendChild(im);
  }
  head.appendChild(thumb);

  const summary = document.createElement('span');
  summary.className = 'summary';
  summary.textContent = summarize(entry);
  head.appendChild(summary);

  const actions = document.createElement('div');
  actions.className = 'actions';
  actions.append(
    btn('↑', () => moveEntry(idx, -1)),
    btn('↓', () => moveEntry(idx, 1)),
    btn('✎', () => toggleRawJson(li, idx)),
    btn('✕', () => removeEntry(idx))
  );
  head.appendChild(actions);

  li.appendChild(head);

  // Editor body
  const body = document.createElement('div');
  body.className = 'entry-body';
  body.appendChild(buildEntryEditor(entry, idx));
  li.appendChild(body);

  // Raw JSON editor (hidden)
  const json = document.createElement('div');
  json.className = 'json-editor';
  li.appendChild(json);

  return li;
}

function buildEntryEditor(entry, idx) {
  const wrap = document.createElement('div');
  wrap.className = 'editor-grid';
  const type = entryType(entry);

  // Image select(s)
  if (type === 'dual') {
    wrap.appendChild(field('Image left', imageSelect(entry, 0)));
    wrap.appendChild(field('Image right', imageSelect(entry, 1)));
  } else if (type === 'img' || type === 'imgtext') {
    wrap.appendChild(field('Image', imageSelect(entry, 0)));
  }

  // Height slider(s)
  if (type === 'dual') {
    wrap.appendChild(field('Height left', heightSlider(entry, 0)));
    wrap.appendChild(field('Height right', heightSlider(entry, 1)));
  } else if (type === 'img' || type === 'imgtext') {
    wrap.appendChild(field('Height', heightSlider(entry, 0)));
  }

  // Alt + B&W
  if (type !== 'text') {
    wrap.appendChild(field('Alt', altInput(entry)));
    wrap.appendChild(field('B&W', bwInput(entry)));
  }

  // Text link + side (single images only; dual excluded per scope)
  if (type === 'img' || type === 'imgtext') {
    wrap.appendChild(field('Linked text', fragSelect(entry)));
    if (entry.__frag != null) {
      wrap.appendChild(field('Text side', textSideSelect(entry)));
    }
  }

  return wrap;
}

function field(label, control) {
  const d = document.createElement('label');
  d.className = 'field';
  const s = document.createElement('span');
  s.textContent = label;
  d.appendChild(s);
  d.appendChild(control);
  return d;
}

function imageSelect(entry, slot) {
  const sel = document.createElement('select');
  sel.innerHTML = '<option value="">(none)</option>';
  for (const name of library()) {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    sel.appendChild(opt);
  }
  const current = slot === 0 ? entry.src : (Array.isArray(entry.src) ? entry.src[1] : undefined);
  const curName = current ? srcToFilename(current) : '';
  if (curName) sel.value = curName;

  sel.addEventListener('change', () => {
    const name = sel.value;
    if (!name) {
      if (slot === 0) delete entry.src;
      else if (Array.isArray(entry.src)) entry.src.splice(1, 1);
    } else {
      const src = 'images/' + currentId + '/' + name;
      if (slot === 0) entry.src = src;
      else {
        if (!Array.isArray(entry.src)) entry.src = [entry.src, src];
        else entry.src[1] = src;
      }
      rerenderEntrySummary();
    }
    markDirty();
  });
  return sel;
}

function heightSlider(entry, slot) {
  const wrap = document.createElement('div');
  wrap.className = 'height';

  const range = document.createElement('input');
  range.type = 'range';
  range.min = 0;
  range.max = 100;
  range.step = 1;

  const num = document.createElement('input');
  num.type = 'number';
  num.min = 0;
  num.max = 100;
  num.placeholder = 'auto';
  num.style.width = '3.2rem';

  const auto = document.createElement('input');
  auto.type = 'checkbox';
  auto.title = 'Auto (no height cap)';

  const autoLbl = document.createElement('label');
  autoLbl.className = 'check';
  autoLbl.appendChild(auto);
  autoLbl.appendChild(document.createTextNode('auto'));

  function getVal() {
    if (slot === 0) {
      return typeof entry.imageHeight === 'number' ? entry.imageHeight : null;
    }
    if (Array.isArray(entry.imageHeight)) {
      return typeof entry.imageHeight[1] === 'number' ? entry.imageHeight[1] : null;
    }
    return null;
  }
  function setVal(v) {
    if (slot === 0) {
      if (v == null) delete entry.imageHeight;
      else entry.imageHeight = v;
    } else {
      const arr = Array.isArray(entry.imageHeight) ? entry.imageHeight.slice() : [entry.imageHeight, null];
      arr[1] = v;
      if (arr[0] == null && arr[1] == null) delete entry.imageHeight;
      else entry.imageHeight = arr;
    }
  }

  const v = getVal();
  range.value = v == null ? 60 : v;
  num.value = v == null ? '' : v;
  auto.checked = v == null;

  range.addEventListener('input', () => {
    num.value = range.value;
    setVal(parseInt(range.value, 10));
    auto.checked = false;
    markDirty();
  });
  num.addEventListener('input', () => {
    const n = num.value === '' ? null : parseInt(num.value, 10);
    if (n == null) { auto.checked = true; setVal(null); }
    else { range.value = Math.max(0, Math.min(100, n)); setVal(Math.max(0, Math.min(100, n))); }
    markDirty();
  });
  auto.addEventListener('change', () => {
    if (auto.checked) { setVal(null); num.value = ''; }
    else { setVal(parseInt(range.value, 10)); num.value = range.value; }
    markDirty();
  });

  wrap.append(range, num, autoLbl);
  return wrap;
}

function altInput(entry) {
  const inp = document.createElement('input');
  inp.type = 'text';
  inp.value = entry.alt || '';
  inp.placeholder = 'alt text';
  inp.addEventListener('input', () => { entry.alt = inp.value; markDirty(); });
  return inp;
}

function bwInput(entry) {
  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.checked = !!entry.bw;
  cb.title = 'Render this image in black & white';
  cb.addEventListener('change', () => {
    if (cb.checked) entry.bw = true;
    else delete entry.bw;
    markDirty();
  });
  return cb;
}

function fragSelect(entry) {
  const sel = document.createElement('select');
  sel.innerHTML = '<option value="">(no text)</option>';
  frags().forEach((f, i) => {
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = fragLabel(i) + (f.title ? ': ' + f.title.slice(0, 24) : '');
    sel.appendChild(opt);
  });
  const optNew = document.createElement('option');
  optNew.value = 'new';
  optNew.textContent = '+ new fragment';
  sel.appendChild(optNew);

  sel.value = entry.__frag != null ? String(entry.__frag) : '';

  sel.addEventListener('change', () => {
    if (sel.value === 'new') {
      frags().push({ title: '', subtitle: '', body: '' });
      entry.__frag = frags().length - 1;
    } else if (sel.value === '') {
      entry.__frag = null;
    } else {
      entry.__frag = parseInt(sel.value, 10);
    }
    renderGallery();
    renderFragments();
    markDirty();
  });
  return sel;
}

function textSideSelect(entry) {
  const sel = document.createElement('select');
  ['right', 'left', 'center'].forEach((side) => {
    const o = document.createElement('option');
    o.value = side;
    o.textContent = side;
    sel.appendChild(o);
  });
  sel.value = entry.textSide || 'right';
  sel.addEventListener('change', () => {
    entry.textSide = sel.value;
    if (entry.layout && entry.layout.textSide) entry.layout.textSide = sel.value;
    markDirty();
  });
  return sel;
}

function rerenderEntrySummary() {
  // Re-render summaries/thumbs after image changes (cheap full re-render).
  renderGallery();
}

// Gallery mutations

function moveEntry(idx, delta) {
  const p = project();
  const arr = p.gallery;
  const to = idx + delta;
  if (to < 0 || to >= arr.length) return;
  [arr[idx], arr[to]] = [arr[to], arr[idx]];
  renderGallery();
  markDirty();
}

function removeEntry(idx) {
  const p = project();
  if (!confirm('Remove this gallery entry?')) return;
  p.gallery.splice(idx, 1);
  renderGallery();
  markDirty();
}

function toggleRawJson(li, idx) {
  const editor = li.querySelector('.json-editor');
  if (editor.style.display === 'block') {
    editor.style.display = 'none';
    editor.innerHTML = '';
    return;
  }
  editor.style.display = 'block';
  editor.innerHTML = '';
  const entry = project().gallery[idx];
  const ta = document.createElement('textarea');
  ta.value = JSON.stringify(entry, null, 2);
  ta.rows = 10;
  ta.spellcheck = false;
  const apply = btn('Apply', () => {
    try {
      const parsed = JSON.parse(ta.value);
      project().gallery[idx] = parsed;
      const i = labelToIndex(parsed.text);
      parsed.__frag = i != null && i < frags().length ? i : null;
      renderGallery();
      renderFragments();
      markDirty();
    } catch (e) {
      alert('Invalid JSON: ' + e.message);
    }
  });
  const cancel = btn('Close', () => {
    editor.style.display = 'none';
    editor.innerHTML = '';
  });
  editor.append(ta, apply, cancel);
}

// ---- Fragments panel ----

function renderFragments() {
  const list = $('#fragment-list');
  list.innerHTML = '';
  const fr = frags();
  if (!fr.length) {
    list.innerHTML = '<li class="empty">No fragments.</li>';
    return;
  }
  fr.forEach((f, i) => list.appendChild(buildFragmentItem(f, i)));
}

function buildFragmentItem(f, i) {
  const li = document.createElement('li');
  li.className = 'fragment';

  const head = document.createElement('div');
  head.className = 'frag-head';
  const label = document.createElement('span');
  label.className = 'badge';
  label.textContent = fragLabel(i);
  const actions = document.createElement('div');
  actions.className = 'actions';
  actions.append(
    btn('↑', () => moveFragment(i, -1)),
    btn('↓', () => moveFragment(i, 1)),
    btn('✕', () => removeFragment(i))
  );
  head.append(label, actions);
  li.appendChild(head);

  const title = document.createElement('input');
  title.type = 'text';
  title.placeholder = 'Title';
  title.value = f.title;
  title.addEventListener('input', () => { f.title = title.value; markDirty(); });

  const sub = document.createElement('textarea');
  sub.placeholder = 'Subtitle (workshop, purpose…)';
  sub.rows = 2;
  sub.value = f.subtitle;
  sub.addEventListener('input', () => { f.subtitle = sub.value; markDirty(); });

  const body = document.createElement('textarea');
  body.placeholder = 'Body';
  body.rows = 6;
  body.value = f.body;
  body.addEventListener('input', () => { f.body = body.value; markDirty(); });

  li.append(title, sub, body);
  return li;
}

function moveFragment(i, delta) {
  const fr = frags();
  const to = i + delta;
  if (to < 0 || to >= fr.length) return;
  [fr[i], fr[to]] = [fr[to], fr[i]];
  swapEntryLinks(i, to);
  renderGallery();
  renderFragments();
  markDirty();
}

function removeFragment(i) {
  const fr = frags();
  if (!confirm('Delete fragment ' + fragLabel(i) + '?')) return;
  fr.splice(i, 1);
  for (const e of project().gallery) {
    if (e.__frag === i) e.__frag = null;
    else if (e.__frag != null && e.__frag > i) e.__frag -= 1;
  }
  renderGallery();
  renderFragments();
  markDirty();
}

function swapEntryLinks(a, b) {
  for (const e of project().gallery) {
    if (e.__frag === a) e.__frag = b;
    else if (e.__frag === b) e.__frag = a;
  }
}

// ---- Library ----

function renderLibrary() {
  const list = $('#library-list');
  list.innerHTML = '';
  const imgs = library();
  if (!imgs.length) {
    list.innerHTML = '<li class="empty">No images in this project folder.</li>';
    return;
  }
  for (const name of imgs) {
    const li = document.createElement('li');
    li.className = 'library-item';
    const im = document.createElement('img');
    im.src = imgUrl(currentId, name);
    im.loading = 'lazy';
    im.width = 90;
    const span = document.createElement('span');
    span.textContent = name;
    const addBtn = btn('＋', () => { project().gallery.push({ src: 'images/' + currentId + '/' + name, alt: name }); renderGallery(); markDirty(); });
    const delBtn = btn('🗑', () => deleteImage(name));
    li.append(im, span, addBtn, delBtn);
    list.appendChild(li);
  }
}

// ---- Server actions ----

let saving = false;
let dirty = false;
let saveTimer = null;

// Debounced autosave: call on any detected change.
function markDirty() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveTimer = null;
    saveAll({ translate: false, silent: true });
  }, 1500);
}

function clearAutoSave() {
  clearTimeout(saveTimer);
  saveTimer = null;
}

async function saveAll(opts = {}) {
  const { translate = true, silent = false } = opts;
  if (saving) { dirty = true; return; }
  saving = true;
  if (!silent) setBusy(true);
  try {
    do {
      dirty = false;
      const clean = JSON.parse(JSON.stringify(state.projects));
      for (const p of clean) {
        for (const e of p.gallery || []) {
          if (e.__frag != null) e.text = fragLabel(e.__frag);
          else delete e.text;
          delete e.__frag;
        }
      }
      await api('/admin-api/projects', { projects: clean });
      if (currentId) {
        await api('/admin-api/text', { projectId: currentId, fragments: frags(), translate });
      }
    } while (dirty);
    status(translate ? 'Saved (translated in background)' : (silent ? 'Auto-saved' : 'Saved'));
  } catch (e) {
    status('Save failed: ' + e.message, true);
  } finally {
    saving = false;
    if (!silent) setBusy(false);
  }
}

async function refreshImages() {
  setBusy(true);
  status('Refreshing…');
  try {
    const fresh = await api('/admin-api/state');
    state.images = fresh.images;
    state.orphans = fresh.orphans;
    state.manifest = fresh.manifest;
    renderLibrary();
    renderOrphans();
    status('Images refreshed');
  } catch (e) {
    status('Refresh failed: ' + e.message, true);
  }
  setBusy(false);
}

async function runOptimize() {
  setBusy(true);
  status('Optimizing images…');
  try {
    const r = await api('/admin-api/optimize');
    status(r.code === 0 ? 'Images optimized' : 'Optimize finished (code ' + r.code + ')');
    await loadState();
  } catch (e) {
    status('Optimize failed: ' + e.message, true);
  }
  setBusy(false);
}

async function runTranslate() {
  setBusy(true);
  status('Translating…');
  try {
    const r = await api('/admin-api/translate');
    status(r.code === 0 ? 'Translation done' : 'Translate finished (code ' + r.code + ')');
  } catch (e) {
    status('Translate failed: ' + e.message, true);
  }
  setBusy(false);
}

async function runMigrate() {
  if (!confirm('Migrate any inline text into text.txt? (idempotent)')) return;
  setBusy(true);
  status('Migrating…');
  try {
    const r = await api('/admin-api/migrate');
    status(r.code === 0 ? 'Migration done' : 'Migrate finished (code ' + r.code + ')');
    await loadState();
  } catch (e) {
    status('Migrate failed: ' + e.message, true);
  }
  setBusy(false);
}

async function uploadOne(file) {
  const dataUrl = await readFileAsDataURL(file);
  return api('/admin-api/upload', { projectId: currentId, filename: file.name, dataUrl });
}

async function handleUpload(files, mode) {
  if (!files || !files.length) return;
  setBusy(true);
  status('Uploading + optimizing…');
  try {
    const srcs = [];
    for (const f of files) {
      const r = await uploadOne(f);
      srcs.push(r.src);
    }
    const p = project();
    if (mode === 'single') {
      p.gallery.push({ src: srcs[0], alt: srcToFilename(srcs[0]) });
    } else if (mode === 'dual') {
      p.gallery.push({ src: srcs.slice(0, 2), alt: srcs.map(srcToFilename).join(' + ') });
    } else if (mode === 'imgtext') {
      frags().push({ title: '', subtitle: '', body: '' });
      p.gallery.push({ src: srcs[0], alt: srcToFilename(srcs[0]), __frag: frags().length - 1, textSide: 'right' });
    } else {
      // library only
    }
    await saveAll();
    await loadState();
    status('Uploaded ' + files.length + ' image(s)');
  } catch (e) {
    status('Upload failed: ' + e.message, true);
  }
  setBusy(false);
}

async function deleteImage(filename) {
  if (!confirm('Delete image "' + filename + '" and its WebP variants?')) return;
  setBusy(true);
  status('Deleting + optimizing…');
  try {
    await api('/admin-api/delete-image', { projectId: currentId, filename });
    await loadState();
    status('Deleted ' + filename);
  } catch (e) {
    status('Delete failed: ' + e.message, true);
  }
  setBusy(false);
}

// ---- Wiring ----

$('#project-select').addEventListener('change', (e) => {
  currentId = e.target.value;
  renderAll();
});
$('#project-hidden').addEventListener('change', (e) => {
  const p = project();
  if (!p) return;
  p.hidden = e.target.checked;
  renderProjectSelect();
  markDirty();
});
$('#btn-save').addEventListener('click', () => {
  clearAutoSave();
  saveAll({ translate: true });
});
$('#btn-optimize').addEventListener('click', runOptimize);
$('#btn-translate').addEventListener('click', runTranslate);
$('#btn-migrate').addEventListener('click', runMigrate);
$('#btn-refresh').addEventListener('click', refreshImages);
$('#btn-new-project').addEventListener('click', () => {
  const id = prompt('New project id (folder name):');
  if (id) createProject(id.trim());
});
$('#btn-add-fragment').addEventListener('click', () => {
  frags().push({ title: '', subtitle: '', body: '' });
  renderFragments();
  markDirty();
});
$('#btn-add-image').addEventListener('click', () => openUpload('single'));
$('#btn-add-dual').addEventListener('click', () => openUpload('dual'));
$('#btn-add-imgtext').addEventListener('click', () => openUpload('imgtext'));
$('#btn-upload').addEventListener('click', () => openUpload('library'));
$('#file-input').addEventListener('change', (e) => {
  handleUpload(e.target.files, uploadMode);
  e.target.value = '';
});

function openUpload(mode) {
  uploadMode = mode;
  if (mode === 'dual') $('#file-input').setAttribute('multiple', '');
  else $('#file-input').removeAttribute('multiple');
  $('#file-input').click();
}

loadState().catch((e) => status('Could not load state: ' + e.message, true));
