// Main Application Initialization
import { getLang } from './i18n.js';

/*class VentosaApp {
    constructor() {
        this.components = {};
        this.isInitialized = false;
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }
    
    initializeApp() {
        console.log('Initializing Ventosa San Martino Portfolio...');
        
        try {
            // Initialize components in order
            this.initializeSlitscan();
            this.initializeNavigation();
            this.initializeGalleries();
            this.initializeScrollEffects();
            this.initializeParallax();
            this.initializeUtilities();
            
            this.isInitialized = true;
            
            // Trigger custom event
            document.dispatchEvent(new CustomEvent('appInitialized', {
                detail: { app: this }
            }));
            
            console.log('Application initialized successfully');
            
        } catch (error) {
            console.error('Error initializing application:', error);
        }
    }
    
    initializeSlitscan() {
        // Initialize slitscan backdrop effect
        if (typeof SlitscanBackdrop !== 'undefined') {
            this.components.slitscan = new SlitscanBackdrop('slitscan-canvas');
        }
        
        // Initialize noise effect if canvas exists
        if (document.getElementById('noise-canvas') && typeof NoiseEffect !== 'undefined') {
            this.components.noise = new NoiseEffect('noise-canvas');
        }
    }
    
    initializeNavigation() {
        // Initialize navigation and smooth scrolling
        if (typeof Navigation !== 'undefined') {
            this.components.navigation = new Navigation();
        }
    }
    
    initializeGalleries() {
        // Initialize all gallery instances
        if (typeof initializeGalleries !== 'undefined') {
            this.components.galleries = initializeGalleries();
        }
        
        // Setup gallery event listeners
        this.setupGalleryEvents();
    }
    
    initializeScrollEffects() {
        // Initialize scroll reveal animations
        if (typeof ScrollReveal !== 'undefined') {
            this.components.scrollReveal = new ScrollReveal();
        }
    }
    
    initializeParallax() {
        // Initialize parallax effects
        if (typeof ParallaxEffect !== 'undefined') {
            this.components.parallax = new ParallaxEffect();
        }
    }
    
    initializeUtilities() {
        // Setup global utilities
        this.setupImageLazyLoading();
        this.setupFormHandlers();
        this.setupExternalLinks();
        this.setupAccessibility();
        this.setupPerformanceOptimizations();
    }
    
    setupGalleryEvents() {
        // Listen for gallery events
        document.addEventListener('slideChanged', (e) => {
            const { index, slide } = e.detail;
            
            // Update URL hash if needed
            const galleryId = e.target.id;
            if (galleryId) {
                // You can implement URL hash updates here if needed
                console.log(`Gallery ${galleryId} changed to slide ${index + 1}`);
            }
        });
    }
    
    setupImageLazyLoading() {
        // Implement lazy loading for images
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }
    
    setupFormHandlers() {
        // Setup contact form handling
        const contactForm = document.querySelector('#contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(contactForm);
            });
        }
    }
    
    handleContactForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.name || !data.email || !data.message) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        this.showNotification('Thank you for your message! I will get back to you soon.', 'success');
        form.reset();
        
        // In a real application, you would send the data to a server
        console.log('Form submitted:', data);
    }
    
    setupExternalLinks() {
        // Open external links in new tab
        const externalLinks = document.querySelectorAll('a[href^="http"]');
        externalLinks.forEach(link => {
            if (!link.hostname.includes(window.location.hostname)) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }
    
    setupAccessibility() {
        // Add skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                }
            });
        }
        
        // Keyboard navigation for galleries
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }
    
    setupPerformanceOptimizations() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Setup performance monitoring
        this.setupPerformanceMonitoring();
        
        // Optimize images
        this.optimizeImages();
    }
    
    preloadCriticalResources() {
        // Preload critical fonts
        const fontPreloads = [
            '/fonts/MonumentGrotesk-Variable.woff2',
            '/fonts/MonumentGrotesk-MonoVariable.woff2'
        ];
        
        fontPreloads.forEach(fontUrl => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = fontUrl;
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }
    
    setupPerformanceMonitoring() {
        // Monitor performance metrics
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const navigation = performance.getEntriesByType('navigation')[0];
                const loadTime = navigation.loadEventEnd - navigation.fetchStart;
                
                console.log(`Page load time: ${loadTime}ms`);
                
                // You can send this data to analytics
            });
        }
    }
    
    optimizeImages() {
        // Add loading attributes to images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('notification-show');
        }, 100);
        
        // Remove notification
        setTimeout(() => {
            notification.classList.remove('notification-show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
    
    // Public API methods
    scrollToSection(sectionId) {
        if (this.components.navigation) {
            this.components.navigation.scrollToSection(sectionId);
        }
    }
    
    getCurrentSection() {
        if (this.components.navigation) {
            return this.components.navigation.getCurrentSection();
        }
        return null;
    }
    
    pauseAnimations() {
        if (this.components.slitscan) {
            this.components.slitscan.pause();
        }
        if (this.components.noise) {
            this.components.noise.pause();
        }
    }
    
    resumeAnimations() {
        if (this.components.slitscan) {
            this.components.slitscan.resume();
        }
        if (this.components.noise) {
            this.components.noise.resume();
        }
    }
    
    destroy() {
        // Clean up all components
        Object.values(this.components).forEach(component => {
            if (component && typeof component.destroy === 'function') {
                component.destroy();
            }
        });
        
        this.components = {};
        this.isInitialized = false;
    }
}

// Utility functions
const utils = {
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Check if device is mobile
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    // Get viewport dimensions
    getViewportDimensions() {
        return {
            width: window.innerWidth || document.documentElement.clientWidth,
            height: window.innerHeight || document.documentElement.clientHeight
        };
    },
    
    // Format date
    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }
};

// Initialize the application
const app = new VentosaApp();

// Make app available globally
window.VentosaApp = app;
window.utils = utils;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VentosaApp, utils };
}
*/

////// PERFIL

// Load the profile intro paragraph (external .txt), language-aware.
async function loadProfileIntro() {
  const el = document.getElementById('profile-intro');
  if (!el) return;
  const candidates = getLang() === 'en' ? ['profile.en.txt', 'profile.txt'] : ['profile.txt'];
  for (const url of candidates) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const text = (await res.text()).replace(/\r\n?/g, '\n').trim();
      if (text.startsWith('<') || text.includes('<!DOCTYPE')) continue;
      el.textContent = text;
      alignProfileLeftColumn();
      return;
    } catch (e) {
      // try next candidate
    }
  }
}

loadProfileIntro();
window.addEventListener('languagechange', loadProfileIntro);

// Load the education block (external .txt), language-aware.
async function loadEducation() {
  const el = document.getElementById('profile-education');
  if (!el) return;
  const candidates = getLang() === 'en' ? ['education.en.txt', 'education.txt'] : ['education.txt'];
  for (const url of candidates) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const text = (await res.text()).replace(/\r\n?/g, '\n').trim();
      if (text.startsWith('<') || text.includes('<!DOCTYPE')) continue;
      el.textContent = text;
      return;
    } catch (e) {
      // try next candidate
    }
  }
}

loadEducation();
window.addEventListener('languagechange', loadEducation);

// Trajectoria renderer (clears and repopulates its container).
function renderTrajectoria(trajectoria) {
  const trajectoriaContainer = document.getElementById('trajectoria-list');
  if (!trajectoriaContainer || !trajectoria) return;
  trajectoriaContainer.innerHTML = '';
  const timelineList = document.createElement('div');
  timelineList.className = 'trajectoria-timeline-list';
  trajectoria.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = 'trajectoria-row';
    // Timeline point and line
    const timelineCol = document.createElement('div');
    timelineCol.className = 'trajectoria-timeline-col';
    const point = document.createElement('div');
    point.className = 'trajectoria-point';
    if (idx === 0) point.classList.add('active');
    timelineCol.appendChild(point);
    if (idx < trajectoria.length - 1) {
      const line = document.createElement('div');
      line.className = 'trajectoria-line';
      timelineCol.appendChild(line);
    }
    // Item content
    const content = document.createElement('div');
    content.className = 'trajectoria-item';
    content.innerHTML = `<strong>${item.position}</strong><span>${item.learnings}</span>`;
    // Row layout
    row.appendChild(timelineCol);
    row.appendChild(content);
    timelineList.appendChild(row);
  });
  trajectoriaContainer.appendChild(timelineList);
}

// Registres renderer (clears and repopulates its container).
function renderRegistres(registres) {
  const registresContainer = document.getElementById('registres-list');
  if (!registresContainer || !registres) return;
  registresContainer.innerHTML = '';
  registres.forEach(registre => {
    const regDiv = document.createElement('div');
    regDiv.className = 'registre-item';
    const titleHtml = registre.link
      ? `<a href="${registre.link}" class="registre-title" target="_blank" rel="noopener noreferrer">${registre.title}</a>`
      : `<strong class="registre-title">${registre.title}</strong>`;
    regDiv.innerHTML = `
      ${titleHtml}
      <span class="registre-desc">${registre.description}</span>
      <span class='registre-date'>${registre.date}</span>
    `;
    registresContainer.appendChild(regDiv);
  });
}

// Load structured profile content (trajectoria + registres), language-aware.
async function loadProfileContent() {
  const candidates = getLang() === 'en' ? ['profile.en.json', 'profile.json'] : ['profile.json'];
  let profile = null;
  for (const url of candidates) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        profile = await res.json();
        break;
      }
    } catch (e) {
      // try next candidate
    }
  }
  if (!profile) return;
  renderTrajectoria(profile.trajectoria);
  renderRegistres(profile.registres);
}

loadProfileContent();
window.addEventListener('languagechange', loadProfileContent);

// Align the "Parlem!" title with the "Formació" heading (side by side), and
// place the profile image to the left of Parlem, between it and the name
// button, without overlapping Parlem. Desktop only; the mobile layout uses its
// own static stacking.
function alignProfileLeftColumn() {
  if (!window.matchMedia('(min-width: 769px)').matches) return;
  const section = document.querySelector('.profile-section');
  const content = document.querySelector('.profile-content');
  const parlem = document.querySelector('.profile-content-column:first-child');
  const formation = document.querySelector('h3[data-i18n="profile.formation.title"]');
  const image = section ? section.querySelector('.profile-image') : null;
  if (!section || !content || !parlem || !formation) return;

  const sectionRect = section.getBoundingClientRect();
  const contentRect = content.getBoundingClientRect();
  const formationRect = formation.getBoundingClientRect();

  // Push "Parlem!" down so it lines up with the "Formació" heading.
  parlem.style.paddingTop = Math.max(0, formationRect.top - contentRect.top) + 'px';

  // Image: overflowing ~5% beyond the left viewport edge, with a 5%
  // (viewport) margin before the Parlem column, vertically centered on name.
  if (image) {
    const parlemRect = parlem.getBoundingClientRect();
    const nameLink = document.querySelector('.header-left .site-title .nav-link');
    const nameRect = nameLink ? nameLink.getBoundingClientRect() : null;

    const viewportW = sectionRect.width;
    const leftEdge = -viewportW * 0.05;
    const rightEdge = Math.max(
      leftEdge,
      (parlemRect.left - sectionRect.left) - viewportW * 0.05
    );
    image.style.left = leftEdge + 'px';
    image.style.right = 'auto';
    image.style.maxWidth = (rightEdge - leftEdge) + 'px';

    if (nameRect) {
      const nameCenter = nameRect.top - sectionRect.top + nameRect.height / 2;
      const imageHeight = image.getBoundingClientRect().height;
      const top = imageHeight > 0
        ? nameCenter - imageHeight / 2
        : (formationRect.top - sectionRect.top);
      image.style.top = top + 'px';
    } else {
      image.style.top = (formationRect.top - sectionRect.top) + 'px';
    }
  }
}

function initProfileAlignment() {
  alignProfileLeftColumn();
  window.addEventListener('resize', alignProfileLeftColumn);
  window.addEventListener('languagechange', () => setTimeout(alignProfileLeftColumn, 0));
  window.addEventListener('load', alignProfileLeftColumn);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(alignProfileLeftColumn);
  }
}

initProfileAlignment();

const profileImage = document.querySelector('.profile-image');
if (profileImage) profileImage.addEventListener('load', alignProfileLeftColumn);

  //////////////// Scroll Snap
 document.addEventListener('DOMContentLoaded', () => {
  // Get all project sections
  const sections = document.querySelectorAll('.project-section');
  if (!sections.length) return;

  // Add scroll snap container class to body
  document.body.classList.add('scroll-snap-container');
  
  // Optional: Smooth scroll to nearest section on scroll end
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const viewportMiddle = window.innerHeight / 2;
      let closest = null;
      let closestDistance = Infinity;

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionMiddle = rect.top + rect.height / 2;
        const distance = Math.abs(viewportMiddle - sectionMiddle);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = section;
        }
      });

      if (closest) {
        closest.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 150); // Adjust timeout as needed
  });

});

////////////// Smooth accordion (trajectory / registers) — one open at a time
const collapseDetails = (details) => {
  const body = details.querySelector('.accordion-body');
  if (!body) {
    details.open = false;
    return;
  }
  body.style.maxHeight = body.scrollHeight + 'px';
  requestAnimationFrame(() => {
    body.style.maxHeight = '0px';
  });
  const onEnd = (ev) => {
    if (ev.propertyName !== 'max-height') return;
    body.removeEventListener('transitionend', onEnd);
    details.open = false;
    body.style.maxHeight = '';
  };
  body.addEventListener('transitionend', onEnd);
};

const expandDetails = (details) => {
  const body = details.querySelector('.accordion-body');
  if (!body) {
    details.open = true;
    return;
  }
  details.open = true;
  body.style.maxHeight = '0px';
  requestAnimationFrame(() => {
    body.style.maxHeight = body.scrollHeight + 'px';
  });
  const onEnd = (ev) => {
    if (ev.propertyName !== 'max-height') return;
    body.removeEventListener('transitionend', onEnd);
    body.style.maxHeight = '';
  };
  body.addEventListener('transitionend', onEnd);
};

document.querySelectorAll('.profile-accordion').forEach((details) => {
  const summary = details.querySelector('summary');
  if (!summary) return;

  summary.addEventListener('click', (e) => {
    e.preventDefault();
    if (details.open) {
      collapseDetails(details);
    } else {
      document.querySelectorAll('.profile-accordion').forEach((other) => {
        if (other !== details && other.open) collapseDetails(other);
      });
      expandDetails(details);
    }
  });
});