import { getManifest, buildSrcset } from './image-helper.js';
import { getLang, initLangToggle } from './i18n.js';

const GALLERY_SIZES = '(max-width: 768px) 100vw, 70vw';
const COPY_WIDTH = 'min(24vw, 300px)';
const COPY_COL_GAP = '1rem';

function protectGalleryImage(image) {
  if (!(image instanceof HTMLImageElement)) return;

  image.draggable = false;
  image.oncontextmenu = (event) => event.preventDefault();
  image.addEventListener('contextmenu', (event) => event.preventDefault());
  image.addEventListener('dragstart', (event) => event.preventDefault());
}

// Append text to a node, turning any "$...$" spans into <em> (italic).
function appendFormattedText(parent, text) {
  const parts = String(text).split(/\$([^$]+)\$/);
  parts.forEach((part, i) => {
    if (part === '') return;
    if (i % 2 === 1) {
      const em = document.createElement('em');
      em.textContent = part;
      parent.appendChild(em);
    } else {
      parent.appendChild(document.createTextNode(part));
    }
  });
}

function buildTextBlock({ title = '', subtitle = '', body = '', align = 'center' } = {}) {
  if (!title && !subtitle && !body) return null;

  const textWrap = document.createElement('div');
  textWrap.className = 'gallery-side-copy';
  textWrap.dataset.align = align;

  const cols = document.createElement('div');
  cols.className = 'gallery-text-columns';

  if (title) {
    const titleEl = document.createElement('div');
    titleEl.className = 'gallery-text-title';
    titleEl.textContent = title;
    cols.appendChild(titleEl);
  }

  if (subtitle) {
    const subEl = document.createElement('div');
    subEl.className = 'gallery-text-subtitle';
    appendFormattedText(subEl, subtitle);
    cols.appendChild(subEl);
  }

  let paragraphs = [];
  let totalChars = 0;

  if (body) {
    const rawParagraphs = Array.isArray(body) ? body : String(body).split(/\n+/);
    paragraphs = rawParagraphs.map((p) => p.trim()).filter(Boolean);
    totalChars = paragraphs.reduce((sum, p) => sum + p.length, 0);
  }

  const useColumns = paragraphs.length >= 4 || totalChars > 2000;
  if (useColumns) cols.classList.add('gallery-text-columns--two');

  paragraphs.forEach((paragraph) => {
    const p = document.createElement('p');
    p.className = 'gallery-text';
    appendFormattedText(p, paragraph);
    cols.appendChild(p);
  });

  textWrap.appendChild(cols);
  return textWrap;
}

// Prepare an image for deferred loading: store src/srcset in data-* attrs.
function prepareImage(img, src, manifest) {
  img.decoding = 'async';
  img.dataset.src = src;
  const srcset = buildSrcset(manifest, src);
  if (srcset) {
    img.dataset.srcset = srcset;
    img.dataset.sizes = GALLERY_SIZES;
  }
}

// Activate an image (set real src/srcset) when its slide becomes visible.
function activateImage(img) {
  if (!img || img.dataset.activated) return;
  img.dataset.activated = '1';
  if (img.dataset.src) img.src = img.dataset.src;
  if (img.dataset.srcset) img.srcset = img.dataset.srcset;
  if (img.dataset.sizes) img.sizes = img.dataset.sizes;
}

// Parse a text block: a single "/" separates the header (title + subtitle)
// from the actual text body. Header format: "*title*" + optional subtitle
// text, where the subtitle's first line is the workshop name (untranslated)
// and its remaining lines are the project purpose (translated).
function parseTextBlock(block) {
  let header = block;
  let body = '';
  const sep = block.indexOf('/');
  if (sep !== -1) {
    header = block.slice(0, sep);
    body = block.slice(sep + 1);
  }

  let title = '';
  let subtitle = '';
  const match = header.match(/\*([^*]+)\*/);
  if (match) {
    title = match[1].trim();
    subtitle = header.replace(/\*[^*]+\*/, '').trim();
  } else {
    subtitle = header.trim();
  }

  return { title, subtitle, body: body.trim() };
}

// Resolve a text reference (label "text1"/"text2", inline string, or inline object)
// into a { title, subtitle, body } object. Labels are looked up in the texts map.
function resolveText(textFragment, texts) {
  if (!textFragment) return null;

  if (typeof textFragment === 'string') {
    const label = textFragment.trim().toLowerCase();
    if (/^text\d+$/.test(label)) {
      const block = texts[label];
      if (!block) return null;
      const { title, subtitle, body } = typeof block === 'object' ? block : parseTextBlock(block);
      return { title: title || '', subtitle: subtitle || '', body: body || '' };
    }
    return { title: '', subtitle: '', body: textFragment };
  }

  if (typeof textFragment === 'object') {
    return {
      title: textFragment.title || textFragment.firstWord || '',
      subtitle: textFragment.subtitle || '',
      body: textFragment.body || textFragment.text || ''
    };
  }

  return null;
}

function applyImageLayout(slide, item, projectLayout = {}, imageHeight = null, texts = {}, manifest = null) {
  const itemLayout = item.layout || {};
  const layout = { ...projectLayout, ...itemLayout };
  const mode = layout.cover || layout.mode || 'default';
  const align = layout.align || item.align || 'center';
  const textFragment = layout.text || item.text || null;

  const image = slide.querySelector('img');
  if (!image) return;

  const resolvedText = resolveText(textFragment, texts);
  const textSide = layout.textSide || item.textSide || (resolvedText ? 'right' : 'center');
  const isSideBySide = mode === 'portrait' || mode === 'large' || !!resolvedText;

  if (isSideBySide) {
    slide.innerHTML = '';
    slide.classList.add('gallery-slide--portrait');
    if (align === 'left') slide.classList.add('gallery-slide--left');
    if (textSide === 'right') slide.classList.add('gallery-slide--text-right');
    if (textSide === 'left') slide.classList.add('gallery-slide--text-left');

    const isMobile = window.innerWidth <= 768;

    // Tall (portrait) images should be bound by height, not by the narrow
    // column width, so they fill --portrait-h instead of leaving margins.
    const entry = (manifest && item.src && !Array.isArray(item.src)) ? manifest[item.src] : null;
    const isTallImg = entry && entry.h > entry.w;

    // imageHeight (0-100) maps to viewport height via the --portrait-h variable.
    if (imageHeight != null) {
      slide.style.setProperty('--portrait-h', `${imageHeight}${isMobile ? 'dvh' : 'vh'}`);
    }

    const inner = document.createElement('div');
    inner.className = 'gallery-slide-content';
    if (isMobile) inner.style.width = '100%';
    inner.style.gap = isMobile ? '0.8rem' : 'clamp(1.5rem, 2vw, 3rem)';

    const mediaWrap = document.createElement('div');
    mediaWrap.className = 'gallery-slide-media';
    mediaWrap.appendChild(image);

    image.style.width = isMobile ? '100%' : 'auto';
    image.style.height = 'auto';
    image.style.maxWidth = isMobile ? '100vw' : (isTallImg ? 'none' : 'min(70vw, 820px)');
    image.style.objectFit = 'contain';
    image.style.objectPosition = 'center';
    if (!isMobile && isTallImg) slide.classList.add('gallery-slide--img-tall');

    inner.appendChild(mediaWrap);

    if (resolvedText) {
      const textBlock = buildTextBlock({
        title: resolvedText.title,
        subtitle: resolvedText.subtitle,
        body: resolvedText.body,
        align: textSide === 'center' ? 'center' : 'left'
      });

      if (textBlock) {
        const hasColumns = textBlock.querySelector('.gallery-text-columns--two');
        const blockWidth = hasColumns && !isMobile
          ? `calc(${COPY_WIDTH} * 2 + ${COPY_COL_GAP})`
          : COPY_WIDTH;
        textBlock.style.width = isMobile ? '100%' : blockWidth;
        textBlock.style.maxWidth = '100%';
        textBlock.style.minWidth = '0';
        textBlock.style.gap = '0.2rem';
        textBlock.style.margin = '0';
        inner.appendChild(textBlock);
      }
    }

    slide.appendChild(inner);
    slide.classList.add('gallery-slide--custom');
    return;
  }

  if (!slide.contains(image)) {
    slide.appendChild(image);
  }
}

let projectsCache = null;
let slideStyleInjected = false;

function injectSlideStyle() {
  if (slideStyleInjected) return;
  slideStyleInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    .gallery-slide {
      transition: none !important;
      animation: none !important;
    }
  `;
  document.head.appendChild(style);
}

async function fetchProjects() {
  if (!projectsCache) {
    const response = await fetch('projects.json');
    projectsCache = await response.json();
  }
  return projectsCache;
}

// Generate the desktop nav project links from projects.json, skipping hidden
// projects. This avoids a "flicker" (links appearing then hiding) and never
// leaves a blank line for hidden projects.
let navReady = null;
function ensureProjectNav() {
  if (!navReady) {
    navReady = (async () => {
      const projects = await fetchProjects();
      const miscLink = document.getElementById('misc-nav-link');
      if (!miscLink) return;
      const frag = document.createDocumentFragment();
      for (const p of projects) {
        if (p.hidden) continue;
        const a = document.createElement('a');
        a.className = 'nav-link';
        a.dataset.section = p.id;
        a.textContent = p.label || p.id.toUpperCase();
        frag.appendChild(a);
        frag.appendChild(document.createElement('br'));
      }
      miscLink.before(frag);
    })();
  }
  return navReady;
}

// Load a project's text and split into labelled blocks (text1, text2, ...)
// separated by "//" in the file. Language-aware: uses text.txt (Catalan) or
// text.en.txt (English), falling back to Catalan if the English file is missing.
const textsCache = new Map();

async function loadProjectTexts(projectId, lang = getLang()) {
  const cacheKey = `${projectId}_${lang}`;
  if (textsCache.has(cacheKey)) return textsCache.get(cacheKey);

  const candidates =
    lang === 'en'
      ? [`images/${projectId}/text.en.txt`, `images/${projectId}/text.txt`]
      : [`images/${projectId}/text.txt`];

  for (const url of candidates) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      const content = (await response.text()).replace(/\r\n?/g, '\n');
      if (content.trim().startsWith('<') || content.includes('<!DOCTYPE')) continue;

      const texts = {};
      content
        .split('//')
        .map((block) => block.trim())
        .filter((block) => block)
        .forEach((block, i) => {
          texts[`text${i + 1}`] = parseTextBlock(block);
        });
      textsCache.set(cacheKey, texts);
      return texts;
    } catch (e) {
      // try next candidate
    }
  }

  textsCache.set(cacheKey, {});
  return {};
}

// Warm the lightweight data caches (projects.json, manifest, text files) so
// tapping a project on mobile renders immediately. No images are prefetched.
let prefetchPromise = null;

function prefetchMobileProjectData(lang = getLang()) {
  if (prefetchPromise) return prefetchPromise;

  prefetchPromise = (async () => {
    try {
      const projects = await fetchProjects();
      await getManifest();
      const languages = new Set([lang]);
      if (lang === 'en') languages.add('en');
      const loaders = [];
      for (const project of projects) {
        for (const l of languages) {
          if (textsCache.has(`${project.id}_${l}`)) continue;
          loaders.push(loadProjectTexts(project.id, l));
        }
      }
      await Promise.all(loaders);
    } catch (e) {
      console.error('Could not prefetch project data:', e);
    }
  })();

  return prefetchPromise;
}

function attachGalleryNavigation(section, gallery) {
  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  function activateSlideAt(index) {
    const slides = gallery.querySelectorAll('.gallery-slide');
    if (!slides.length) return;
    const slide = slides[index];
    if (slide) slide.querySelectorAll('img').forEach(activateImage);
  }

  function navigateSlides(direction) {
    const slides = gallery.querySelectorAll('.gallery-slide');
    if (!slides.length) return;
    slides.forEach((slide) => slide.classList.remove('active'));

    if (direction === 'next') {
      currentIndex = (currentIndex + 1) % slides.length;
    } else if (direction === 'prev') {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    }

    slides[currentIndex].classList.add('active');
    activateSlideAt(currentIndex);

    // Preload adjacent slides for smooth transitions.
    activateSlideAt((currentIndex + 1) % slides.length);
    activateSlideAt((currentIndex - 1 + slides.length) % slides.length);
  }

  function resetGallery() {
    const slides = gallery.querySelectorAll('.gallery-slide');
    if (!slides.length) return;
    slides.forEach((slide) => slide.classList.remove('active'));
    currentIndex = 0;
    slides[0].classList.add('active');
    activateSlideAt(0);
  }

  gallery._resetGallery = resetGallery;

  section.addEventListener('click', (event) => {
    const sectionRect = section.getBoundingClientRect();
    const clickX = event.clientX;
    const midpoint = sectionRect.left + sectionRect.width / 2;

    if (clickX < midpoint) {
      navigateSlides('prev');
    } else {
      navigateSlides('next');
    }
  });

  section.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });

  section.addEventListener('touchend', (event) => {
    touchEndX = event.changedTouches[0].screenX;
    const swipeThreshold = 50;

    if (Math.abs(touchEndX - touchStartX) > swipeThreshold) {
      if (touchEndX < touchStartX) {
        navigateSlides('next');
      } else {
        navigateSlides('prev');
      }
    }
  }, { passive: true });
}

async function buildProjectSection(project) {
  const section = document.createElement('section');
  section.id = project.id;
  section.className = 'project-section';
  section.dataset.section = project.id;

  if (project.mobileLayout) {
    section.dataset.textPosition = project.mobileLayout.textPosition || 'below';
    section.dataset.imageAspect = project.mobileLayout.imageAspect || 'landscape';
    section.dataset.columnCount = project.mobileLayout.columnCount || 1;
  }

  const gallery = document.createElement('div');
  gallery.className = 'project-gallery';

  const manifest = await getManifest();
  const texts = await loadProjectTexts(project.id);

  project.gallery.forEach((item) => {
    if (!item.src) return;
    const slide = document.createElement('div');
    slide.className = 'gallery-slide';
    const imageHeight = (typeof item.imageHeight === 'number') ? item.imageHeight : null;

    if (project.mobileLayout) {
      const textPos = project.mobileLayout.textPosition || 'below';
      slide.classList.add(`mobile-text-${textPos}`);
      if (project.mobileLayout.imageAspect) {
        slide.classList.add(`mobile-aspect-${project.mobileLayout.imageAspect}`);
      }
    }

    const isDual = Array.isArray(item.src) && item.src.length === 2;

    if (isDual) {
      const dualWrap = document.createElement('div');
      dualWrap.className = 'gallery-dual-wrap';
      const heights = Array.isArray(item.imageHeight) ? item.imageHeight : [imageHeight, imageHeight];
      item.src.forEach((src, idx) => {
        const img = document.createElement('img');
        img.alt = (Array.isArray(item.alt) ? item.alt[idx] : item.alt) || '';
        img.className = 'project-image';
        if (item.bw) img.style.filter = 'grayscale(100%)';
        const isMobileImg = window.innerWidth <= 768;
        const h = (typeof heights[idx] === 'number') ? heights[idx] : null;
        img.style.width = isMobileImg ? '100%' : '50%';
        img.style.height = 'auto';
        if (!isMobileImg) {
          img.style.maxHeight = h != null ? `${h}vh` : '60vh';
        }
        img.style.maxWidth = '100%';
        protectGalleryImage(img);
        prepareImage(img, src, manifest);
        dualWrap.appendChild(img);
      });
      slide.appendChild(dualWrap);
    } else {
      const img = document.createElement('img');
      img.alt = item.alt || '';
      img.className = 'project-image';
      if (item.bw) img.style.filter = 'grayscale(100%)';
      const isMobileImg = window.innerWidth <= 768;
      img.style.width = isMobileImg ? '100%' : 'auto';
      img.style.height = 'auto';
      if (!isMobileImg) {
        img.style.maxHeight = imageHeight != null
          ? `${imageHeight}vh`
          : '60vh';
      }
      img.style.maxWidth = '100%';
      protectGalleryImage(img);
      prepareImage(img, item.src, manifest);
      slide.appendChild(img);

      if (item.layout || item.text || item.textSide || project.layout) {
        applyImageLayout(slide, item, project.layout || {}, imageHeight, texts, manifest);
      }
    }

    gallery.appendChild(slide);
  });

  if (window.innerWidth > 768) {
    section.style.height = '100vh';
    section.style.display = 'flex';
    section.style.flexDirection = 'column';
    section.style.justifyContent = 'center';
    section.style.alignItems = 'center';
  }

  section.appendChild(gallery);
  attachGalleryNavigation(section, gallery);

  // Activate the first slide (and its images), and preload the second one so
  // the next swipe doesn't wait for a fetch.
  if (gallery.firstChild) {
    gallery.firstChild.classList.add('active');
    gallery.firstChild.querySelectorAll('img').forEach(activateImage);
    const second = gallery.children[1];
    if (second) second.querySelectorAll('img').forEach(activateImage);
  }

  return section;
}

async function loadProject(projectId) {
  const mainContent = document.querySelector('.main-content');
  if (!mainContent) return null;

  const existing = document.getElementById(projectId);
  if (existing) {
    const gallery = existing.querySelector('.project-gallery');
    if (gallery && gallery._resetGallery) gallery._resetGallery();
    return existing;
  }

  const projects = await fetchProjects();
  const project = projects.find((p) => p.id === projectId);
  if (!project || project.hidden) return null;

  injectSlideStyle();
  const section = await buildProjectSection(project);
  mainContent.appendChild(section);
  return section;
}

async function loadAllProjects() {
  const mainContent = document.querySelector('.main-content');
  if (!mainContent) return;

  const projects = await fetchProjects();
  injectSlideStyle();

  for (const project of projects) {
    if (project.hidden) continue;
    if (document.getElementById(project.id)) continue;
    const section = await buildProjectSection(project);
    mainContent.appendChild(section);
  }
}

// Clear and rebuild project sections (e.g. on language change).
async function reloadAllProjects() {
  const mainContent = document.querySelector('.main-content');
  if (!mainContent) return;
  mainContent.querySelectorAll('.project-section').forEach((s) => s.remove());
  if (window.innerWidth > 768) {
    await loadAllProjects();
  }
}

export { loadProject, loadAllProjects, reloadAllProjects, prefetchMobileProjectData, ensureProjectNav };

initLangToggle();
ensureProjectNav();

if (window.innerWidth > 768) {
  loadAllProjects();
}
