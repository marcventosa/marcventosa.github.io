// Shared responsive-image helpers: WebP srcset from images-manifest.json.

let manifestPromise = null;

function getManifest() {
  if (!manifestPromise) {
    manifestPromise = fetch('images-manifest.json')
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({}));
  }
  return manifestPromise;
}

function buildSrcset(manifest, src) {
  const entry = manifest[src];
  if (!entry || !entry.variants || !entry.variants.length) return null;
  return entry.variants.map((v) => `${v.src} ${v.w}w`).join(', ');
}

// Set src + (optionally) srcset/sizes on an image element.
// `manifest` is the resolved manifest object (pass in to avoid repeated awaits).
function applyResponsive(img, src, manifest, sizes) {
  img.loading = 'lazy';
  img.decoding = 'async';
  img.src = src;
  const srcset = buildSrcset(manifest, src);
  if (srcset) {
    img.srcset = srcset;
    if (sizes) img.sizes = sizes;
  }
}

export { getManifest, buildSrcset, applyResponsive };
