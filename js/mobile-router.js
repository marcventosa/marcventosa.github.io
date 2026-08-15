// Mobile shell: landing menu + expandable bottom footer.
// Visibility is gated by CSS (css/mobile.css, <=768px); this module only builds behavior.
// Runs at module evaluation time (before DOMContentLoaded) so navigation.js
// click binding picks up the cloned landing links.

function buildLandingNav() {
  const overlay = document.getElementById('slitscan-overlay');
  if (!overlay || document.getElementById('landing-nav')) return;

  const nav = document.createElement('nav');
  nav.id = 'landing-nav';

  const headerLinks = Array.from(document.querySelectorAll('.main-nav .nav-link')).filter(
    (link) => link.dataset.section && link.dataset.section !== 'home'
  );

  headerLinks.forEach((link) => {
    const item = document.createElement('a');
    item.className = 'nav-link landing-nav-link';
    item.dataset.section = link.dataset.section;
    item.textContent = link.textContent.trim();
    nav.appendChild(item);
  });

  const profileItem = document.createElement('a');
  profileItem.className = 'nav-link landing-nav-link';
  profileItem.dataset.section = 'profile';
  profileItem.textContent = 'PARLEM!';
  nav.appendChild(profileItem);

  overlay.appendChild(nav);
}

function initFooter() {
  const footer = document.getElementById('mobile-footer');
  const toggle = document.getElementById('mobile-footer-toggle');
  if (!footer || !toggle) return;

  const setOpen = (open) => {
    footer.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => {
    setOpen(!footer.classList.contains('open'));
  });

  document.addEventListener('click', (event) => {
    if (footer.classList.contains('open') && !footer.contains(event.target)) {
      setOpen(false);
    }
  });

  fetch('profile.json')
    .then((response) => (response.ok ? response.json() : null))
    .then((profile) => {
      const box = document.getElementById('mobile-footer-trajectoria');
      if (!box || !profile || !Array.isArray(profile.trajectoria)) return;

      profile.trajectoria.slice(0, 3).forEach((item) => {
        const row = document.createElement('div');
        row.className = 'mobile-footer-trajectoria-row';
        const strong = document.createElement('strong');
        strong.textContent = item.position;
        row.appendChild(strong);
        row.appendChild(document.createTextNode(` ${item.learnings}`));
        box.appendChild(row);
      });
    })
    .catch(() => {});
}

buildLandingNav();
initFooter();

// Conditional nav visibility: hide landing nav when viewing project pages on mobile
function initConditionalNavVisibility() {
  const landingNav = document.getElementById('landing-nav');
  const landingSection = document.getElementById('home');
  
  if (!landingNav || !landingSection) return;

  // Only apply on mobile (≤768px)
  const isMobile = () => window.innerWidth <= 768;
  
  // Create Intersection Observer to detect which section is in view
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3 // Trigger when 30% of section is visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!isMobile()) {
        landingNav.style.display = '';
        return;
      }

      // Check if the entry is the landing section
      if (entry.target.id === 'home' && entry.isIntersecting) {
        // Show nav on landing
        landingNav.style.display = 'flex';
      } else if (entry.target.classList.contains('project-section') && entry.isIntersecting) {
        // Hide nav on project sections
        landingNav.style.display = 'none';
      }
    });
  }, observerOptions);

  // Observe landing section
  observer.observe(landingSection);

  // Observe all project sections
  document.querySelectorAll('.project-section').forEach((section) => {
    observer.observe(section);
  });

  // Handle window resize: show nav if resizing to desktop
  window.addEventListener('resize', () => {
    if (!isMobile()) {
      landingNav.style.display = '';
    }
  });
}

// Run after DOM is loaded so project sections exist
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initConditionalNavVisibility);
} else {
  // DOM already loaded
  initConditionalNavVisibility();
}
