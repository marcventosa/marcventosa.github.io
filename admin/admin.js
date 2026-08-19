// Admin UI: list/reorder/edit gallery entries, manage images, edit text.txt.

const $ = (sel) => document.querySelector(sel);

let state = null; // { projects, manifest, texts, images }
let currentId = null;

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
  if (msg) statusTimer = setTimeout(() => { el.textContent = ''; }, 6000);
}

function setBusy(on) {
  document.querySelectorAll('button').forEach((b) => (b.disabled = on));
}

function btn(label, onClick) {
  const b = document.createElement('button');
  b.textContent = label;
  b.addEventListener('click', onClick);
  return b;
}

function currentProject() {
  return state.projects.find((p) => p.id === currentId);
}

function imgUrl(id, name) {
  return '/images/' + encodeURIComponent(id) + '/' + encodeURIComponent(name);
}

const srcToFilename = (src) => String(src).split('/').pop();

function summarize(entry) {
  if (Array.isArray(entry.src)) return '2 images: ' + entry.src.map(srcToFilename).join(' + ');
  if (entry.src) return srcToFilename(entry.src);
  if (entry.text != null) {
    if (typeof entry.text === 'string') return 'text ref: ' + entry.text;
    if (Array.isArray(entry.text)) return 'text: ' + String(entry.text[0] || '').slice(0, 60) + (entry.text[0] && entry.text[0].length > 60 ? '…' : '');
    return 'text: ' + JSON.stringify(entry.text).slice(0, 60);
  }
  return JSON.stringify(entry).slice(0, 80);
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

// ---- State loading / rendering ----

async function loadState() {
  state = await api('/admin-api/state');
  currentId = currentId || (state.projects[0] && state.projects[0].id);
  renderProjectSelect();
  renderCurrent();
}

function renderProjectSelect() {
  const sel = $('#project-select');
  sel.innerHTML = '';
  for (const p of state.projects) {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.id;
    if (p.id === currentId) opt.selected = true;
    sel.appendChild(opt);
  }
}

function renderCurrent() {
  const p = currentProject();
  if (!p) return;
  renderGallery();
  renderLibrary();
  renderText();
}

function renderGallery() {
  const p = currentProject();
  const list = $('#gallery-list');
  list.innerHTML = '';
  if (!p.gallery.length) {
    list.innerHTML = '<li class="empty">No entries yet.</li>';
    return;
  }
  p.gallery.forEach((entry, idx) => {
    const li = document.createElement('li');
    li.className = 'gallery-item';
    li.draggable = true;
    li.dataset.index = idx;

    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    if (Array.isArray(entry.src)) {
      entry.src.forEach((s) => {
        const im = document.createElement('img');
        im.src = imgUrl(p.id, srcToFilename(s));
        im.loading = 'lazy';
        thumb.appendChild(im);
      });
    } else if (entry.src) {
      const im = document.createElement('img');
      im.src = imgUrl(p.id, srcToFilename(entry.src));
      im.loading = 'lazy';
      thumb.appendChild(im);
    } else {
      thumb.classList.add('thumb-text');
      thumb.textContent = 'TXT';
    }

    const info = document.createElement('div');
    info.className = 'info';
    info.textContent = summarize(entry);

    const actions = document.createElement('div');
    actions.className = 'actions';
    actions.append(
      btn('↑', () => move(idx, -1)),
      btn('↓', () => move(idx, 1)),
      btn('✎', () => toggleJson(li, idx)),
      btn('✕', () => remove(idx))
    );

    li.append(thumb, info, actions);

    const jsonEditor = document.createElement('div');
    jsonEditor.className = 'json-editor';
    li.appendChild(jsonEditor);

    li.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', String(idx));
      li.classList.add('dragging');
    });
    li.addEventListener('dragend', () => li.classList.remove('dragging'));
    li.addEventListener('dragover', (e) => e.preventDefault());
    li.addEventListener('drop', (e) => {
      e.preventDefault();
      const from = parseInt(e.dataTransfer.getData('text/plain'), 10);
      if (!Number.isInteger(from)) return;
      reorderFromTo(from, idx);
    });

    list.appendChild(li);
  });
}

function renderLibrary() {
  const list = $('#library-list');
  list.innerHTML = '';
  const images = state.images[currentId] || [];
  if (!images.length) {
    list.innerHTML = '<li class="empty">No images in this project folder.</li>';
    return;
  }
  for (const name of images) {
    const li = document.createElement('li');
    li.className = 'library-item';
    const im = document.createElement('img');
    im.src = imgUrl(currentId, name);
    im.loading = 'lazy';
    im.width = 90;
    const span = document.createElement('span');
    span.textContent = name;
    const addBtn = btn('＋ add', () => addImageEntry(name));
    const delBtn = btn('🗑', () => deleteImage(name));
    li.append(im, span, addBtn, delBtn);
    list.appendChild(li);
  }
}

function renderText() {
  $('#text-editor').value = state.texts[currentId] || '';
}

// ---- Gallery mutations ----

function move(idx, delta) {
  const p = currentProject();
  const arr = p.gallery;
  const to = idx + delta;
  if (to < 0 || to >= arr.length) return;
  [arr[idx], arr[to]] = [arr[to], arr[idx]];
  renderGallery();
}

function reorderFromTo(from, to) {
  const p = currentProject();
  const arr = p.gallery;
  if (from === to) return;
  const [item] = arr.splice(from, 1);
  const insertAt = from < to ? to - 1 : to;
  arr.splice(insertAt, 0, item);
  renderGallery();
}

function remove(idx) {
  const p = currentProject();
  if (!confirm('Remove this gallery entry?')) return;
  p.gallery.splice(idx, 1);
  renderGallery();
}

function addImageEntry(filename) {
  const p = currentProject();
  p.gallery.push({ src: 'images/' + currentId + '/' + filename, alt: filename });
  renderGallery();
}

function addTextEntry() {
  const p = currentProject();
  p.gallery.push({ text: ['Nou paràgraf'] });
  renderGallery();
}

function toggleJson(li, idx) {
  const editor = li.querySelector('.json-editor');
  if (editor.style.display === 'block') {
    editor.style.display = 'none';
    editor.innerHTML = '';
    return;
  }
  editor.style.display = 'block';
  editor.innerHTML = '';
  const entry = currentProject().gallery[idx];
  const ta = document.createElement('textarea');
  ta.value = JSON.stringify(entry, null, 2);
  ta.rows = 12;
  ta.spellcheck = false;
  const apply = btn('Apply', () => {
    try {
      currentProject().gallery[idx] = JSON.parse(ta.value);
      renderGallery();
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

// ---- Server actions ----

async function saveProjects() {
  setBusy(true);
  try {
    await api('/admin-api/projects', { projects: state.projects });
    status('projects.json saved');
  } catch (e) {
    status('Save failed: ' + e.message, true);
  }
  setBusy(false);
}

async function saveText() {
  const content = $('#text-editor').value;
  setBusy(true);
  try {
    await api('/admin-api/text', { projectId: currentId, content });
    status('Text saved — translation running in background');
  } catch (e) {
    status('Text save failed: ' + e.message, true);
  }
  setBusy(false);
}

async function runOptimize() {
  setBusy(true);
  status('Optimizing images…');
  try {
    const r = await api('/admin-api/optimize');
    status(r.code === 0 ? 'Images optimized' : 'Optimize finished with code ' + r.code);
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
    status(r.code === 0 ? 'Translation done' : 'Translate finished with code ' + r.code);
  } catch (e) {
    status('Translate failed: ' + e.message, true);
  }
  setBusy(false);
}

async function handleUpload(files) {
  if (!files || !files.length) return;
  setBusy(true);
  status('Uploading + optimizing…');
  try {
    const p = currentProject();
    for (const f of files) {
      const dataUrl = await readFileAsDataURL(f);
      const r = await api('/admin-api/upload', { projectId: currentId, filename: f.name, dataUrl });
      p.gallery.push({ src: r.src, alt: f.name });
    }
    await api('/admin-api/projects', { projects: state.projects });
    await loadState();
    status('Uploaded ' + files.length + ' image(s) and added to gallery');
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
  renderCurrent();
});
$('#btn-save').addEventListener('click', saveProjects);
$('#btn-optimize').addEventListener('click', runOptimize);
$('#btn-translate').addEventListener('click', runTranslate);
$('#btn-save-text').addEventListener('click', saveText);
$('#btn-add-text').addEventListener('click', addTextEntry);
$('#btn-add-image').addEventListener('click', () => $('#file-input').click());
$('#btn-upload').addEventListener('click', () => $('#file-input').click());
$('#file-input').addEventListener('change', (e) => {
  handleUpload(e.target.files);
  e.target.value = '';
});

loadState().catch((e) => status('Could not load state: ' + e.message, true));
