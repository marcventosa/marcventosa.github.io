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

function applyImageLayout(slide, item, projectLayout = {}) {
  const itemLayout = item.layout || {};
  const layout = { ...projectLayout, ...itemLayout };
  const mode = layout.cover || layout.mode || 'default';
  const align = layout.align || 'center';
  const textSide = layout.textSide || 'center';
  const textFragment = layout.text || item.text || null;

  const image = slide.querySelector('img');
  if (!image) return;

  if (mode === 'portrait' || mode === 'large') {
    slide.innerHTML = '';
    slide.classList.add('gallery-slide--portrait');
    if (align === 'left') slide.classList.add('gallery-slide--left');
    if (textSide === 'right') slide.classList.add('gallery-slide--text-right');
    if (textSide === 'left') slide.classList.add('gallery-slide--text-left');

    const isMobile = window.innerWidth <= 768;

    const inner = document.createElement('div');
    inner.className = 'gallery-slide-content';
    inner.style.width = isMobile ? '100%' : 'min(92vw, 1300px)';
    inner.style.height = isMobile ? 'auto' : '90vh';
    inner.style.maxHeight = isMobile ? 'none' : '90vh';
    inner.style.gap = isMobile ? '0.8rem' : 'clamp(1.5rem, 2vw, 3rem)';

    const mediaWrap = document.createElement('div');
    mediaWrap.className = 'gallery-slide-media';
    mediaWrap.style.height = isMobile ? 'auto' : '90vh';
    mediaWrap.style.maxHeight = isMobile ? 'none' : '90vh';
    mediaWrap.appendChild(image);

    image.style.width = 'auto';
    image.style.height = 'auto';
    image.style.maxWidth = isMobile ? '95vw' : 'min(62vw, 780px)';
    image.style.maxHeight = isMobile ? '85vh' : '90vh';
    image.style.objectFit = 'contain';
    image.style.objectPosition = 'center';

    inner.appendChild(mediaWrap);

    if (textFragment) {
      const textTitle = typeof textFragment === 'string' ? '' : (textFragment.title || '');
      const textBody = typeof textFragment === 'string' ? textFragment : (textFragment.body || textFragment.text || '');
      const textBlock = buildTextBlock({
        title: mode === 'portrait' || mode === 'large' ? '' : textTitle,
        body: textBody,
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

function attachGalleryNavigation(section, gallery) {
  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

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

  project.gallery.forEach((item) => {
    if (!item.src) return;
    const slide = document.createElement('div');
    slide.className = 'gallery-slide';

    if (project.mobileLayout) {
      const textPos = project.mobileLayout.textPosition || 'below';
      slide.classList.add(`mobile-text-${textPos}`);
      if (project.mobileLayout.imageAspect) {
        slide.classList.add(`mobile-aspect-${project.mobileLayout.imageAspect}`);
      }
    }

    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt || '';
    img.className = 'project-image';
    img.style.width = 'auto';
    img.style.height = 'auto';
    img.style.maxHeight = window.innerWidth <= 768 ? '80vh' : '60vh';
    img.style.maxWidth = '100%';
    protectGalleryImage(img);
    slide.appendChild(img);

    if (item.layout || project.layout) {
      applyImageLayout(slide, item, project.layout || {});
    }

    gallery.appendChild(slide);
  });

  try {
    const textResponse = await fetch(`images/${project.id}/text.txt`);
    if (textResponse.ok) {
      const textContent = await textResponse.text();

      if (!(textContent.trim().startsWith('<') || textContent.includes('<!DOCTYPE'))) {
        const blocks = textContent.split(/\n\s*\n/).map((block) => block.trim()).filter((block) => block);

        if (blocks.length > 0) {
          const titleLine = blocks[0];
          const bodyText = blocks.slice(1).join('\n\n');

          const descSlide = document.createElement('div');
          descSlide.className = 'gallery-slide';
          descSlide.style.padding = '2rem';

          const descInner = document.createElement('div');
          descInner.className = 'gallery-description';

          const title = document.createElement('div');
          title.className = 'gallery-text-title';
          title.textContent = titleLine;
          descInner.appendChild(title);

          const p = document.createElement('p');
          p.className = 'gallery-text';
          p.textContent = bodyText;
          descInner.appendChild(p);

          descSlide.appendChild(descInner);
          gallery.appendChild(descSlide);
        }
      }
    }
  } catch (error) {
    console.warn(`Could not load text.txt for project ${project.id}:`, error);
  }

  if (window.innerWidth > 768) {
    section.style.height = '100vh';
    section.style.display = 'flex';
    section.style.flexDirection = 'column';
    section.style.justifyContent = 'center';
    section.style.alignItems = 'center';
  }

  if (gallery.firstChild) {
    gallery.firstChild.classList.add('active');
  }

  section.appendChild(gallery);
  attachGalleryNavigation(section, gallery);

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
