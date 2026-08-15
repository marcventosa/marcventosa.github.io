// Mobile shell: landing nav + show/hide project routing.
// Visibility is gated by CSS (css/mobile.css, <=768px).
// Runs at module evaluation time so navigation.js click binding picks up the cloned landing links.

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
  nameLink.innerHTML = 'MARC<br>VENTOSA<br>SAN MARTINO';
  nav.appendChild(nameLink);

  const headerLinks = Array.from(document.querySelectorAll('.main-nav .nav-link')).filter(
    (link) => link.dataset.section && link.dataset.section !== 'home' && link.dataset.section !== 'profile'
  );

  headerLinks.forEach((link) => {
    const item = document.createElement('a');
    item.className = 'nav-link landing-nav-link';
    item.dataset.section = link.dataset.section;
    item.textContent = link.textContent.trim();
    nav.appendChild(item);
  });

  overlay.appendChild(nav);
}

function initMobileProjectRouter() {
  const landingNav = document.getElementById('landing-nav');
  const landingSection = document.getElementById('home');
  if (!landingNav) return;

  const allHideable = () =>
    document.querySelectorAll('.project-section, #misc-section, #profile');

  const hideAll = () => {
    allHideable().forEach((s) => {
      s.classList.add('mobile-hidden-project');
      s.classList.remove('mobile-active-project');
    });
  };

  const showOnly = (targetId) => {
    allHideable().forEach((s) => {
      if (s.id === targetId) {
        s.classList.remove('mobile-hidden-project');
        s.classList.add('mobile-active-project');
      } else {
        s.classList.add('mobile-hidden-project');
        s.classList.remove('mobile-active-project');
      }
    });
    const profile = document.getElementById('profile');
    if (profile && targetId !== 'profile') {
      profile.classList.remove('mobile-hidden-project');
    }
  };

  landingNav.querySelectorAll('.landing-nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (!isMobile()) return;
      const targetId = link.dataset.section;
      showOnly(targetId);
    });
  });

  if (isMobile()) hideAll();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.target.id === 'home' && entry.isIntersecting && isMobile()) {
          hideAll();
        }
      });
    },
    { threshold: 0.5 }
  );

  if (landingSection) observer.observe(landingSection);

  window.addEventListener('resize', () => {
    if (!isMobile()) {
      document
        .querySelectorAll('.mobile-hidden-project, .mobile-active-project')
        .forEach((s) => {
          s.classList.remove('mobile-hidden-project', 'mobile-active-project');
        });
    }
  });
}

buildLandingNav();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileProjectRouter);
} else {
  initMobileProjectRouter();
}
