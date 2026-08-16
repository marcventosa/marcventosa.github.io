import { getManifest, buildSrcset } from './image-helper.js';

const GALLERY_SIZES = '(max-width: 768px) 100vw, 70vw';

function protectGalleryImage(image) {
  if (!(image instanceof HTMLImageElement)) return;

  image.draggable = false;
  image.oncontextmenu = (event) => event.preventDefault();
  image.addEventListener('contextmenu', (event) => event.preventDefault());
  image.addEventListener('dragstart', (event) => event.preventDefault());
}

function buildTextBlock({ title = '', body = '', align = 'center' } = {}) {
  if (!title && !body) return null;

  const textWrap = document.createElement('div');
  textWrap.className = 'gallery-side-copy';
  textWrap.dataset.align = align;

  if (title) {
    const titleEl = document.createElement('div');
    titleEl.className = 'gallery-text-title';
    titleEl.textContent = title;
    textWrap.appendChild(titleEl);
  }

  if (body) {
    const paragraphs = Array.isArray(body) ? body : [body];

    paragraphs.forEach((paragraph) => {
      const p = document.createElement('p');
      p.className = 'gallery-text';
      p.textContent = paragraph;
      textWrap.appendChild(p);
    });
  }

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

// Resolve a text reference (label "text1"/"text2", inline string, or inline object)
// into a { title, body } object. Labels are looked up in the project's texts map.
function resolveText(textFragment, texts) {
  if (!textFragment) return null;

  if (typeof textFragment === 'string') {
    const label = textFragment.trim().toLowerCase();
    if (/^text\d+$/.test(label)) {
      return texts[label] ? { title: '', body: texts[label] } : null;
    }
    return { title: '', body: textFragment };
  }

  if (typeof textFragment === 'object') {
    return {
      title: textFragment.title || textFragment.firstWord || '',
      body: textFragment.body || textFragment.text || ''
    };
  }

  return null;
}

function applyImageLayout(slide, item, projectLayout = {}, imageHeight = null, texts = {}) {
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

    // imageHeight (0-100) maps to viewport height via the --portrait-h variable.
    if (imageHeight != null) {
      slide.style.setProperty('--portrait-h', `${imageHeight}${isMobile ? 'dvh' : 'vh'}`);
    }

    const inner = document.createElement('div');
    inner.className = 'gallery-slide-content';
    inner.style.width = isMobile ? '100%' : 'min(92vw, 1300px)';
    inner.style.gap = isMobile ? '0.8rem' : 'clamp(1.5rem, 2vw, 3rem)';

    const mediaWrap = document.createElement('div');
    mediaWrap.className = 'gallery-slide-media';
    mediaWrap.appendChild(image);

    image.style.width = 'auto';
    image.style.height = 'auto';
    image.style.maxWidth = isMobile ? '95vw' : 'min(70vw, 820px)';
    image.style.objectFit = 'contain';
    image.style.objectPosition = 'center';

    inner.appendChild(mediaWrap);

    if (resolvedText) {
      const textBlock = buildTextBlock({
        title: (mode === 'portrait' || mode === 'large') ? '' : resolvedText.title,
        body: resolvedText.body,
        align: textSide === 'center' ? 'center' : 'left'
      });

      if (textBlock) {
        textBlock.style.width = isMobile ? '100%' : 'min(22vw, 280px)';
        textBlock.style.maxWidth = '100%';
        textBlock.style.flex = isMobile ? 'none' : '0 0 min(22vw, 280px)';
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

// Load a project's text.txt and split into labelled blocks (text1, text2, ...)
// separated by "//" in the file.
async function loadProjectTexts(projectId) {
  const texts = {};
  try {
    const response = await fetch(`images/${projectId}/text.txt`);
    if (response.ok) {
      const content = await response.text();
      if (!(content.trim().startsWith('<') || content.includes('<!DOCTYPE'))) {
        content
          .split('//')
          .map((block) => block.trim())
          .filter((block) => block)
          .forEach((block, i) => {
            texts[`text${i + 1}`] = block;
          });
      }
    }
  } catch (e) {
    // no text file — leave texts empty
  }
  return texts;
}

function attachGalleryNavigation(section, gallery) {
  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  function activateSlideAt(index) {
    const slides = gallery.querySelectorAll('.gallery-slide');
    if (!slides.length) return;
    const slide = slides[index];
    if (slide) activateImage(slide.querySelector('img'));
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

    const img = document.createElement('img');
    img.alt = item.alt || '';
    img.className = 'project-image';
    img.style.width = 'auto';
    img.style.height = 'auto';
    img.style.maxHeight = imageHeight != null
      ? `${imageHeight}${window.innerWidth <= 768 ? 'dvh' : 'vh'}`
      : (window.innerWidth <= 768 ? '80vh' : '60vh');
    img.style.maxWidth = '100%';
    protectGalleryImage(img);
    prepareImage(img, item.src, manifest);
    slide.appendChild(img);

    if (item.layout || item.text || item.textSide || project.layout) {
      applyImageLayout(slide, item, project.layout || {}, imageHeight, texts);
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

  // Activate the first slide (and its image).
  if (gallery.firstChild) {
    gallery.firstChild.classList.add('active');
    activateImage(gallery.firstChild.querySelector('img'));
  }

  return section;
}

async function loadProject(projectId) {
  const mainContent = document.querySelector('.main-content');
  if (!mainContent) return null;

  const existing = document.getElementById(projectId);
  if (existing) return existing;

  const projects = await fetchProjects();
  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;

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
    if (document.getElementById(project.id)) continue;
    const section = await buildProjectSection(project);
    mainContent.appendChild(section);
  }
}

export { loadProject, loadAllProjects };

if (window.innerWidth > 768) {
  loadAllProjects();
}
