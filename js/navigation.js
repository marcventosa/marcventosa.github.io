// Navigation and Smooth Scrolling
class Navigation {
    constructor() {
        this.header = document.querySelector('.main-header');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.mobileMenuBtn = document.querySelector('.mobile-menu');
        this.navMenu = document.querySelector('.nav-links');
        this.sections = document.querySelectorAll('section[id]');
        this.currentSection = '';
        
        this.init();
    }
    
    init() {
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.setupScrollSpy();
        this.setupHeaderBehavior();
    }
    
    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = this.header ? this.header.offsetHeight : 0;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (this.navMenu) {
                        this.navMenu.classList.remove('active');
                    }
                    
                    if (this.mobileMenuBtn) {
                        this.mobileMenuBtn.classList.remove('active');
                    }
                }
            });
        });
    }
    
    setupMobileMenu() {
        if (this.mobileMenuBtn && this.navMenu) {
            this.mobileMenuBtn.addEventListener('click', () => {
                this.navMenu.classList.toggle('active');
                this.mobileMenuBtn.classList.toggle('active');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.header.contains(e.target) && this.navMenu.classList.contains('active')) {
                    this.navMenu.classList.remove('active');
                    this.mobileMenuBtn.classList.remove('active');
                }
            });
            
            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
                    this.navMenu.classList.remove('active');
                    this.mobileMenuBtn.classList.remove('active');
                }
            });
        }
    }
    
    setupScrollSpy() {
        const updateActiveLink = () => {
            const scrollPosition = window.scrollY;
            const headerHeight = this.header ? this.header.offsetHeight : 0;
            
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 100;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    if (this.currentSection !== sectionId) {
                        this.currentSection = sectionId;
                        this.updateActiveNavLink(sectionId);
                    }
                }
            });
        };
        
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateActiveLink();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Initial call
        updateActiveLink();
    }
    
    updateActiveNavLink(sectionId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    setupHeaderBehavior() {
        // Navigation is now fixed in the middle of the screen
        // No scroll behavior needed since it overlays content
        // The header remains static and visible at all times
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = this.header ? this.header.offsetHeight : 0;
            const targetPosition = section.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    getCurrentSection() {
        return this.currentSection;
    }
}

// Scroll reveal animation
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.scroll-reveal');
        this.observer = null;
        this.init();
    }
    
    init() {
        if (this.elements.length === 0) return;
        
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Add stagger effect for multiple elements
                    const delay = Array.from(this.elements).indexOf(entry.target) * 100;
                    setTimeout(() => {
                        entry.target.style.transitionDelay = '0s';
                    }, delay);
                }
            });
        }, options);
        
        this.elements.forEach(element => {
            this.observer.observe(element);
        });
    }
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// Parallax effect for background elements
class ParallaxEffect {
    constructor() {
        this.elements = {
            slow: document.querySelectorAll('.parallax-slow'),
            medium: document.querySelectorAll('.parallax-medium'),
            fast: document.querySelectorAll('.parallax-fast')
        };
        
        this.init();
    }
    
    init() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        let ticking = false;
        
        const updateParallax = () => {
            const scrollY = window.pageYOffset;
            
            this.elements.slow.forEach(element => {
                const speed = 0.5;
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            this.elements.medium.forEach(element => {
                const speed = 0.3;
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            this.elements.fast.forEach(element => {
                const speed = 0.1;
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
}

// Utility functions for navigation
const navigationUtils = {
    // Smooth scroll to top
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },
    
    // Get current scroll position
    getScrollPosition() {
        return {
            x: window.pageXOffset,
            y: window.pageYOffset
        };
    },
    
    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Get element's offset from top
    getElementOffset(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Navigation, ScrollReveal, ParallaxEffect, navigationUtils };
}

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop - sectionHeight / 3) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
        }
    });
});

window.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        // Landing nav links are handled by mobile-router.js (mobile show/hide routing)
        if (link.classList.contains('landing-nav-link')) return;

        link.addEventListener('click', (event) => {
            event.preventDefault();
            const sectionId = link.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});
