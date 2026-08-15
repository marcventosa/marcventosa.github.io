// Desktop overlay router: single dynamic landing page with a fading slitscan.
// Feature flag: set OVERLAY_MODE = false to revert to the previous scroll-snap behavior.

import { loadProject } from './project-loader.js';
import { loadMiscImages } from './misc-loader.js';

const OVERLAY_MODE = true;
const DESKTOP_BP = 768;
const isDesktop = () => window.innerWidth > DESKTOP_BP;

let activeId = null;

function fadeSlitscan(visible) {
  if (window.slitScan && typeof window.slitScan.setVisibility === 'function') {
    window.slitScan.setVisibility(visible);
  }
}

// Highlight the nav link (project title or personal name) for the active section.
function setActiveNav(targetId) {
  document.querySelectorAll('.main-header .nav-link[data-section]').forEach((link) => {
    link.classList.toggle('active', link.dataset.section === targetId);
  });
}

async function openSection(targetId) {
  // Ensure content is loaded (idempotent).
  if (targetId === 'misc-section') {
    await loadMiscImages();
  } else if (targetId !== 'profile') {
    await loadProject(targetId);
  }

  const target = document.getElementById(targetId);
  if (!target) return;

  if (activeId && activeId !== targetId) {
    const prev = document.getElementById(activeId);
    if (prev) prev.classList.remove('open');
  }

  target.classList.add('open');
  activeId = targetId;
  setActiveNav(targetId);

  if (!document.body.classList.contains('has-overlay')) {
    document.body.classList.add('has-overlay');
    fadeSlitscan(false);
  }
}

function closeSection() {
  if (activeId) {
    const prev = document.getElementById(activeId);
    if (prev) prev.classList.remove('open');
    activeId = null;
  }
  document.body.classList.remove('has-overlay');
  fadeSlitscan(true);
  setActiveNav('home');
}

function applyMode() {
  const on = OVERLAY_MODE && isDesktop();
  document.body.classList.toggle('overlay-mode', on);
  document.documentElement.classList.toggle('overlay-mode', on);
  if (!on) {
    closeSection();
  }
}

function initOverlayRouter() {
  if (!OVERLAY_MODE) return;

  applyMode();
  setActiveNav('home');

  // Capture-phase so we run before navigation.js's bubble handler.
  document.addEventListener(
    'click',
    (e) => {
      if (!isDesktop() || !document.body.classList.contains('overlay-mode')) return;
      const link = e.target.closest('.nav-link[data-section]');
      if (!link) return;
      e.preventDefault();
      e.stopPropagation();
      const id = link.dataset.section;
      if (id === 'home') {
        closeSection();
      } else {
        openSection(id);
      }
    },
    true
  );

  window.addEventListener('resize', applyMode);
}

initOverlayRouter();
