// Load misc.json and scatter images as a freely floating, overlapping collage

const rand = (min, max) => Math.random() * (max - min) + min;

const ASPECT = 6 / 5;
const DRIFT_BUFFER = 48;
const MAX_VERTICAL_DRIFT = 40;

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

export async function loadMiscImages() {
  const section = document.getElementById('misc-section');
  if (!section) return;

  section.style.position = 'relative';

  try {
    const response = await fetch('misc.json');
    if (!response.ok) return;
    const groups = await response.json();

    section.innerHTML = '';

    const viewportWidth = window.innerWidth;
    const leftMax = viewportWidth <= 600 ? 38 : viewportWidth <= 900 ? 54 : 72;

    const styles = getComputedStyle(section);
    const padTop = parseFloat(styles.paddingTop) || 0;
    const padBottom = parseFloat(styles.paddingBottom) || 0;
    const sectionWidth = section.offsetWidth;
    const sectionHeight = section.offsetHeight;

    const placedRects = [];

    const findSpot = (w, h, reachX, leftMaxPx, topMin, topMax) => {
      const thresholds = [0.4, 0.65, 0.9];
      for (const threshold of thresholds) {
        let best = null;
        let bestOverlap = Infinity;
        for (let attempt = 0; attempt < 70; attempt++) {
          const left = rand(0, leftMaxPx);
          const top = rand(topMin, topMax);
          const inflated = inflateRect({ left, top, w, h }, reachX, MAX_VERTICAL_DRIFT);
          let maxRatio = 0;
          let totalOverlap = 0;
          for (const placed of placedRects) {
            const overlap = intersectionArea(inflated, placed.inflated);
            if (overlap > 0) {
              totalOverlap += overlap;
              maxRatio = Math.max(maxRatio, overlap / Math.min(w * h, placed.area));
            }
          }
          if (maxRatio <= threshold && totalOverlap < bestOverlap) {
            best = { left, top };
            bestOverlap = totalOverlap;
            if (totalOverlap === 0) break;
          }
        }
        if (best) return best;
      }
      return { left: rand(0, leftMaxPx), top: rand(topMin, topMax) };
    };

    groups.forEach((group) => {
      const galleryDiv = document.createElement('div');
      galleryDiv.className = 'misc-mini-gallery';
      galleryDiv.style.position = 'absolute';

      galleryDiv.style.setProperty('--z', String(1 + Math.floor(Math.random() * 20)));
      galleryDiv.style.setProperty('--card-scale', rand(0.7, 1.5).toFixed(2));

      const boost = Math.random() < 0.3 ? 1.8 : 1;
      const direction = Math.random() < 0.5 ? -1 : 1;
      const ampX = Math.min(viewportWidth * rand(0.05, 0.16) * boost, 440) * direction;
      galleryDiv.style.setProperty('--amp-x', `${ampX.toFixed(1)}px`);

      galleryDiv.style.setProperty('--dy0', `${rand(-40, 40).toFixed(1)}px`);
      galleryDiv.style.setProperty('--dy1', `${rand(-40, 40).toFixed(1)}px`);
      galleryDiv.style.setProperty('--dy2', `${rand(-40, 40).toFixed(1)}px`);
      galleryDiv.style.setProperty('--dy3', `${rand(-40, 40).toFixed(1)}px`);

      const duration = rand(26, 50);
      galleryDiv.style.setProperty('--float-duration', `${duration.toFixed(1)}s`);
      galleryDiv.style.setProperty('--float-delay', `${(-rand(0, duration)).toFixed(1)}s`);

      const img = document.createElement('img');
      img.className = 'misc-gallery-img';
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
      const leftMaxPx = (leftMax / 100) * sectionWidth;

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
        };

        newImg.src = imgData.src;
      };

      renderImage();

      if (group.images.length > 1) {
        const rescaleToFit = () => {
          const topPx = (parseFloat(galleryDiv.style.top) / 100) * sectionHeight;
          const availableWidth = (sectionHeight - padBottom - topPx - DRIFT_BUFFER) / ASPECT;
          const { base, minWidth } = baseCardWidth(viewportWidth);
          if (minWidth > availableWidth) return;
          const newScale = Math.min(rand(0.7, 1.5), availableWidth / base);
          galleryDiv.style.setProperty('--card-scale', Math.max(newScale, minWidth / base).toFixed(2));
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
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', loadMiscImages);
}
