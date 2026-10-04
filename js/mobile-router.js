// Mobile shell: landing nav + show/hide project routing.
// Visibility is gated by CSS (css/mobile.css, <=768px).

import { loadProject, loadAllProjects, prefetchMobileProjectData, ensureProjectNav } from './project-loader.js';
import { loadMiscImages } from './misc-loader.js';

const MOBILE_BP = 768;
const isMobile = () => window.innerWidth <= MOBILE_BP;

async function buildLandingNav() {
  const overlay = document.getElementById('slitscan-overlay');
  if (!overlay || document.getElementById('landing-nav')) return;

  await ensureProjectNav();

  const nav = document.createElement('nav');
  nav.id = 'landing-nav';

  const nameLink = document.createElement('a');
  nameLink.className = 'nav-link landing-nav-link landing-name-link';
  nameLink.dataset.section = 'profile';
  nameLink.href = '#';
  nameLink.innerHTML = 'MARC<br>VENTOSA<br>SAN MARTINO';
  nav.appendChild(nameLink);

  const headerLinks = Array.from(document.querySelectorAll('.main-nav .nav-link')).filter(
    (link) => link.dataset.section && link.dataset.section !== 'home' && link.dataset.section !== 'profile'
  );

  const linksWrap = document.createElement('div');
  linksWrap.className = 'landing-nav-links';

  headerLinks.forEach((link) => {
    const item = document.createElement('a');
    item.className = 'nav-link landing-nav-link';
    item.dataset.section = link.dataset.section;
    item.href = '#';
    item.textContent = link.textContent.trim();
    linksWrap.appendChild(item);
  });

  nav.appendChild(linksWrap);

  overlay.appendChild(nav);
}

function initMobileProjectRouter() {
  const landingNav = document.getElementById('landing-nav');
  const landingSection = document.getElementById('home');
  if (!landingNav) return;

  let navigateGuard = false;
  let landingSettleTimer = null;

  const allHideable = () =>
    document.querySelectorAll('.project-section, #misc-section, #profile');

  const projectLinks = () =>
    landingNav.querySelectorAll('.landing-nav-links .landing-nav-link');

  const setActiveLink = (targetId) => {
    projectLinks().forEach((link) => {
      link.classList.toggle('active', link.dataset.section === targetId);
    });
  };

  const hideAll = () => {
    allHideable().forEach((s) => {
      s.classList.add('mobile-hidden-project');
      s.classList.remove('mobile-active-project');
    });
    setActiveLink(null);
  };

  const isProfileOpen = () => document.body.classList.contains('mobile-profile-open');

  const fadeSlitscan = (visible) => {
    if (window.slitScan && typeof window.slitScan.setVisibility === 'function') {
      window.slitScan.setVisibility(visible);
    }
  };

  // Profile opens as a fade-in overlay over the landing (mobile), with the name
  // link pinned on top and no scroll. Tapping the name again closes it.
  const openProfile = () => {
    navigateGuard = true;
    if (landingSettleTimer) {
      clearTimeout(landingSettleTimer);
      landingSettleTimer = null;
    }
    setActiveLink('profile');
    landingSection.classList.remove('landing-active');
    document.body.classList.add('mobile-profile-open');

    allHideable().forEach((s) => {
      if (s.id === 'profile') {
        s.classList.remove('mobile-hidden-project');
        s.classList.add('mobile-active-project');
      } else {
        s.classList.add('mobile-hidden-project');
        s.classList.remove('mobile-active-project');
      }
    });

    fadeSlitscan(false);

    const target = document.getElementById('profile');
    if (target) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => target.classList.add('profile-fade-in'));
      });
    }

    setTimeout(() => { navigateGuard = false; }, 1200);
  };

  const closeProfile = () => {
    const target = document.getElementById('profile');
    if (target) target.classList.remove('profile-fade-in');

    setTimeout(() => {
      if (!document.body.classList.contains('mobile-profile-open')) return;
      document.body.classList.remove('mobile-profile-open');
      if (target) {
        target.classList.remove('mobile-active-project');
        target.classList.add('mobile-hidden-project');
      }
      landingSection.classList.add('landing-active');
      fadeSlitscan(true);
      setActiveLink(null);
    }, 600);
  };

  const showOnly = async (targetId) => {
    if (targetId === 'profile') {
      openProfile();
      return;
    }

    navigateGuard = true;
    if (landingSettleTimer) {
      clearTimeout(landingSettleTimer);
      landingSettleTimer = null;
    }
    setActiveLink(targetId);
    landingSection.classList.remove('landing-active');

    allHideable().forEach((s) => {
      if (s.id === targetId) {
        s.classList.remove('mobile-hidden-project');
        s.classList.add('mobile-active-project');
      } else {
        s.classList.add('mobile-hidden-project');
        s.classList.remove('mobile-active-project');
      }
    });

    if (targetId === 'misc-section') {
      await loadMiscImages();
    } else {
      await loadProject(targetId);
    }

    const target = document.getElementById(targetId);
    if (target) {
      window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
    }

    setTimeout(() => { navigateGuard = false; }, 1200);
  };

  landingNav.querySelectorAll('.landing-nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isMobile()) return;
      const targetId = link.dataset.section;
      if (targetId === 'profile' && isProfileOpen()) {
        closeProfile();
        return;
      }
      showOnly(targetId);
    });
  });

  if (isMobile()) {
    hideAll();
    landingSection.classList.add('landing-active');
  }

  const homeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.target.id !== 'home' || !isMobile()) return;
        if (isProfileOpen()) return;
        if (entry.intersectionRatio >= 1.0 && !navigateGuard) {
          if (!landingSettleTimer) {
            landingSettleTimer = setTimeout(() => {
              landingSettleTimer = null;
              if (navigateGuard) return;
              if (window.scrollY > landingSection.offsetHeight * 0.15) return;
              hideAll();
              landingSection.classList.add('landing-active');
            }, 600);
          }
        } else {
          if (landingSettleTimer) {
            clearTimeout(landingSettleTimer);
            landingSettleTimer = null;
          }
          if (entry.intersectionRatio <= 0) {
            landingSection.classList.remove('landing-active');
          }
        }
      });
    },
    { threshold: [0, 0.5, 1.0] }
  );

  if (landingSection) homeObserver.observe(landingSection);

  let lastMobile = isMobile();
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const nowMobile = isMobile();
      if (nowMobile === lastMobile) return;
      lastMobile = nowMobile;
      if (!nowMobile) {
        document.body.classList.remove('mobile-profile-open');
        document
          .querySelectorAll('.profile-fade-in')
          .forEach((s) => s.classList.remove('profile-fade-in'));
        document
          .querySelectorAll('.mobile-hidden-project, .mobile-active-project')
          .forEach((s) => {
            s.classList.remove('mobile-hidden-project', 'mobile-active-project');
          });
        loadAllProjects();
        loadMiscImages();
      } else {
        hideAll();
        landingSection.classList.add('landing-active');
      }
    }, 200);
  });

  // Rebuild projects when the language changes (mobile).
  window.addEventListener('languagechange', () => {
    if (isMobile()) {
      document.querySelectorAll('.project-section').forEach((s) => s.remove());
      // Keep an open profile overlay visible; only projects need rebuilding.
      if (isProfileOpen()) return;
      hideAll();
    }
  });
}

async function bootstrap() {
  await buildLandingNav();
  initMobileProjectRouter();

  // On mobile, warm the lightweight data caches (manifest, projects.json, text
  // files) during idle time so opening a project feels instant. Images are left
  // lazy so the page isn't overloaded.
  if (isMobile()) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => prefetchMobileProjectData(), { timeout: 4000 });
    } else {
      setTimeout(() => prefetchMobileProjectData(), 1500);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
