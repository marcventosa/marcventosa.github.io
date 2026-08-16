// Load misc.json and scatter images as a freely floating, overlapping collage

import { getManifest, buildSrcset } from './image-helper.js';

const rand = (min, max) => Math.random() * (max - min) + min;

const DRIFT_BUFFER = 48;
const MAX_VERTICAL_DRIFT = 20;
const MISC_SIZES = '(max-width: 600px) 50vw, 300px';

// Avoid overly vertical cards: max height/width ratio before cropping.
const MAX_VERTICAL_RATIO = 1.6;
// Chance to randomly square-crop a landscape image when it changes.
const SQUARE_CROP_PROBABILITY = 0.4;

function baseCardWidth(viewportWidth) {
  if (viewportWidth <= 600) return { base: viewportWidth * 0.42, minWidth: 120 };
  if (viewportWidth <= 900) return { base: Math.min(viewportWidth * 0.36, 240), minWidth: 150 };
  return { base: Math.min(viewportWidth * 0.24, 280), minWidth: 180 };
}

function inflateRect(rect, dx, dy) {
  return { left: rect.left - dx, top: rect.top - dy, w: rect.w + dx * 2, h: rect.h + dy * 2 };
}

function intersectionArea(a, b) {
  const w = Math.min(a.left + a.w, b.left + b.w) - Math.max(a.left, b.left);
  const h = Math.min(a.top + a.h, b.top + b.h) - Math.max(a.top, b.top);
  return w > 0 && h > 0 ? w * h : 0;
}

// Compute the display box for an image: returns the box aspect ratio and
// whether the image should be cropped (object-fit: cover) to fit it.
function displayBoxFor(w, h, allowSquareRandom) {
  let aspect = `${w} / ${h}`;
  let crop = false;

  if (h / w > MAX_VERTICAL_RATIO) {
    // Cap overly vertical images by cropping their height.
    aspect = `${w} / ${w * MAX_VERTICAL_RATIO}`;
    crop = true;
  } else if (allowSquareRandom && w > h && Math.random() < SQUARE_CROP_PROBABILITY) {
    // Randomly crop some landscape images to a 1:1 square for variety.
    aspect = '1 / 1';
    crop = true;
  }

  return { aspect, crop };
}

function applyImageDisplay(img, entry, allowSquareRandom) {
  if (entry && entry.w && entry.h) {
    const { aspect, crop } = displayBoxFor(entry.w, entry.h, allowSquareRandom);
    img.style.aspectRatio = aspect;
    img.style.objectFit = crop ? 'cover' : 'fill';
  } else {
    img.style.aspectRatio = '5 / 6';
    img.style.objectFit = 'fill';
  }
}

let miscPromise = null;

async function loadMiscImages() {
  if (miscPromise) return miscPromise;

  miscPromise = (async () => {
    const section = document.getElementById('misc-section');
    if (!section) return;

    section.style.position = 'relative';

    try {
      const response = await fetch('misc.json');
      if (!response.ok) return;
      const groups = await response.json();

      const manifest = await getManifest();

      section.innerHTML = '';

      const viewportWidth = window.innerWidth;
      const isSmallMobile = viewportWidth <= 600;

      // Cards behave like magnets: overlap is capped at ~35% max so each card
      // stays at least ~65% visible, even while floating.
      const minScale = isSmallMobile ? 0.55 : 0.7;
      const maxScale = isSmallMobile ? 1.0 : 1.2;

      const styles = getComputedStyle(section);
      const padTop = parseFloat(styles.paddingTop) || 0;
      const padBottom = parseFloat(styles.paddingBottom) || 0;
      const sectionWidth = section.offsetWidth;
      const sectionHeight = section.offsetHeight;

      const placedRects = [];

      const findSpot = (w, h, reachX, leftMaxPx, topMin, topMax) => {
        const MAX_OVERLAP = 0.35;
        let best = null;
        let bestRatio = Infinity;
        for (let attempt = 0; attempt < 600; attempt++) {
          const left = rand(0, leftMaxPx);
          const top = rand(topMin, topMax);
          const inflated = inflateRect({ left, top, w, h }, reachX, MAX_VERTICAL_DRIFT);
          let maxRatio = 0;
          for (const placed of placedRects) {
            const overlap = intersectionArea(inflated, placed.inflated);
            if (overlap > 0) {
              maxRatio = Math.max(maxRatio, overlap / Math.min(w * h, placed.area));
            }
          }
          if (maxRatio < bestRatio) {
            bestRatio = maxRatio;
            best = { left, top };
          }
          if (maxRatio <= MAX_OVERLAP) {
            return best;
          }
        }
        return best;
      };

      groups.forEach((group) => {
        const galleryDiv = document.createElement('div');
        galleryDiv.className = 'misc-mini-gallery';
        galleryDiv.style.position = 'absolute';

        galleryDiv.style.setProperty('--z', String(1 + Math.floor(Math.random() * 20)));
        galleryDiv.style.setProperty('--card-scale', rand(minScale, maxScale).toFixed(2));
        const initialScale = parseFloat(galleryDiv.style.getPropertyValue('--card-scale')) || 1;

        const direction = Math.random() < 0.5 ? -1 : 1;
        const ampX = Math.min(viewportWidth * rand(0.02, 0.05), 120) * direction;
        galleryDiv.style.setProperty('--amp-x', `${ampX.toFixed(1)}px`);

        galleryDiv.style.setProperty('--dy0', `${rand(-20, 20).toFixed(1)}px`);
        galleryDiv.style.setProperty('--dy1', `${rand(-20, 20).toFixed(1)}px`);
        galleryDiv.style.setProperty('--dy2', `${rand(-20, 20).toFixed(1)}px`);
        galleryDiv.style.setProperty('--dy3', `${rand(-20, 20).toFixed(1)}px`);

        const duration = rand(26, 50);
        galleryDiv.style.setProperty('--float-duration', `${duration.toFixed(1)}s`);
        galleryDiv.style.setProperty('--float-delay', `${(-rand(0, duration)).toFixed(1)}s`);

        const img = document.createElement('img');
        img.className = 'misc-gallery-img';
        img.decoding = 'async';
        img.loading = 'lazy';

        // Respect natural proportions, capping overly vertical images.
        const firstImg = group.images && group.images[0];
        const entry = firstImg && firstImg.src ? manifest[firstImg.src] : null;
        applyImageDisplay(img, entry, false);

        galleryDiv.appendChild(img);

        if (group.caption) {
          const caption = document.createElement('div');
          caption.className = 'misc-image-caption';
          caption.textContent = group.caption;
          galleryDiv.appendChild(caption);
        }

        section.appendChild(galleryDiv);

        const cardWidth = galleryDiv.offsetWidth;
        const cardHeight = galleryDiv.offsetHeight;
        const topMin = padTop;
        const topMax = Math.max(topMin, sectionHeight - padBottom - cardHeight - DRIFT_BUFFER);
        const leftMaxPx = Math.max(0, sectionWidth - cardWidth - Math.abs(ampX));

        const spot = findSpot(cardWidth, cardHeight, Math.abs(ampX) / 2, leftMaxPx, topMin, topMax);
        galleryDiv.style.left = `${((spot.left / sectionWidth) * 100).toFixed(2)}%`;
        galleryDiv.style.top = `${((spot.top / sectionHeight) * 100).toFixed(2)}%`;

        placedRects.push({
          inflated: inflateRect(
            { left: spot.left, top: spot.top, w: cardWidth, h: cardHeight },
            Math.abs(ampX) / 2,
            MAX_VERTICAL_DRIFT
          ),
          area: cardWidth * cardHeight
        });

        let currentIndex = 0;

        const renderImage = () => {
          const imgData = group.images[currentIndex];
          if (!imgData || !imgData.src) return;

          const newImg = new Image();
          newImg.className = 'misc-gallery-img';

          if (imgData.bw) {
            newImg.classList.add('bw');
          }

          newImg.onload = () => {
            img.src = newImg.src;
            img.className = newImg.className;
            img.alt = group.project || group.caption || '';
            img.style.filter = imgData.bw ? 'grayscale(1) contrast(1.08)' : 'none';
            const entry = manifest[imgData.src];
            applyImageDisplay(img, entry, true);
            const srcset = buildSrcset(manifest, imgData.src);
            if (srcset) {
              img.srcset = srcset;
              img.sizes = MISC_SIZES;
            }
          };

          newImg.src = imgData.src;
        };

        renderImage();

        if (group.images.length > 1) {
          const rescaleToFit = () => {
            // Only shrink the card so it stays within the section (never grow).
            const topPx = (parseFloat(galleryDiv.style.top) / 100) * sectionHeight;
            const availableHeight = sectionHeight - padBottom - topPx - DRIFT_BUFFER;
            const aspect = cardHeight / cardWidth;
            const availableWidth = availableHeight / aspect;
            const { base, minWidth } = baseCardWidth(viewportWidth);
            const targetWidth = base * initialScale;
            if (availableWidth >= targetWidth) return;
            const newScale = Math.max(minWidth / base, availableWidth / base);
            galleryDiv.style.setProperty('--card-scale', Math.min(newScale, initialScale).toFixed(2));
          };

          const scheduleNext = () => {
            setTimeout(() => {
              currentIndex = (currentIndex + 1) % group.images.length;
              if (Math.random() < 0.5) rescaleToFit();
              renderImage();
              scheduleNext();
            }, rand(2000, 4000));
          };

          scheduleNext();
        }
      });
    } catch (e) {
      console.error('Could not load misc images:', e);
    }
  })();

  return miscPromise;
}

export { loadMiscImages };

if (window.innerWidth > 768) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadMiscImages);
  } else {
    loadMiscImages();
  }
}
