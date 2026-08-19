// Mobile shell: landing nav + show/hide project routing.
// Visibility is gated by CSS (css/mobile.css, <=768px).

import { loadProject, loadAllProjects, prefetchMobileProjectData } from './project-loader.js';
import { loadMiscImages } from './misc-loader.js';

const MOBILE_BP = 768;
const isMobile = () => window.innerWidth <= MOBILE_BP;

function buildLandingNav() {
  const overlay = document.getElementById('slitscan-overlay');
  if (!overlay || document.getElementById('landing-nav')) return;

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

  const showOnly = async (targetId) => {
    navigateGuard = true;
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
    } else if (targetId !== 'profile') {
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
        if (entry.intersectionRatio >= 1.0 && !navigateGuard) {
          const nearTop = window.scrollY <= landingSection.offsetHeight * 0.1;
          if (nearTop) {
            hideAll();
            landingSection.classList.add('landing-active');
          }
        } else if (entry.intersectionRatio <= 0) {
          landingSection.classList.remove('landing-active');
        }
      });
    },
    // Close the project only when fully back on the landing, and fade the
    // auxiliary texts in/out as the landing leaves and returns into view.
    { threshold: [0, 1.0] }
  );

  if (landingSection) homeObserver.observe(landingSection);

  window.addEventListener('resize', () => {
    if (!isMobile()) {
      document
        .querySelectorAll('.mobile-hidden-project, .mobile-active-project')
        .forEach((s) => {
          s.classList.remove('mobile-hidden-project', 'mobile-active-project');
        });
      loadAllProjects();
      loadMiscImages();
    } else {
      hideAll();
    }
  });

  // Rebuild projects when the language changes (mobile).
  window.addEventListener('languagechange', () => {
    if (isMobile()) {
      document.querySelectorAll('.project-section').forEach((s) => s.remove());
      hideAll();
    }
  });
}

buildLandingNav();

// On mobile, warm the lightweight data caches (manifest, projects.json, text
// files) during idle time so opening a project feels instant. Images are left
// lazy so the page isn't overloaded.
if (isMobile()) {
  const schedulePrefetch = () => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => prefetchMobileProjectData(), { timeout: 4000 });
    } else {
      setTimeout(() => prefetchMobileProjectData(), 1500);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedulePrefetch);
  } else {
    schedulePrefetch();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileProjectRouter);
} else {
  initMobileProjectRouter();
}
