// Gallery Slideshow Functionality
class Gallery {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.slides = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.autoplayInterval = null;
        
        // Default options
        this.options = {
            autoplay: options.autoplay || false,
            autoplayDelay: options.autoplayDelay || 5000,
            transition: options.transition || 'fade', // 'fade', 'slide', 'zoom'
            showArrows: options.showArrows !== false,
            showDots: options.showDots !== false,
            loop: options.loop !== false,
            swipeEnabled: options.swipeEnabled !== false,
            keyboardEnabled: options.keyboardEnabled !== false,
            ...options
        };
        
        if (this.container) {
            this.init();
        }
    }
    
    init() {
        this.setupSlides();
        this.setupControls();
        this.setupEventListeners();
        this.showSlide(0);
        
        if (this.options.autoplay) {
            this.startAutoplay();
        }
    }
    
    setupSlides() {
        this.slides = Array.from(this.container.querySelectorAll('.gallery-slide'));
        
        this.slides.forEach((slide, index) => {
            slide.classList.add('gallery-slide');
            slide.style.display = 'none';
            slide.setAttribute('data-index', index);
            
            // Add transition class based on option
            slide.classList.add(`${this.options.transition}-transition`);
        });
    }
    
    setupControls() {
        if (this.options.showArrows) {
            this.createArrows();
        }
        
        if (this.options.showDots) {
            this.createDots();
        }
    }
    
    createArrows() {
        const arrowsContainer = document.createElement('div');
        arrowsContainer.className = 'gallery-arrows';
        
        const prevArrow = document.createElement('button');
        prevArrow.className = 'gallery-arrow gallery-arrow-prev';
        prevArrow.setAttribute('aria-label', 'Previous slide');
        prevArrow.addEventListener('click', () => this.previousSlide());
        
        const nextArrow = document.createElement('button');
        nextArrow.className = 'gallery-arrow gallery-arrow-next';
        nextArrow.setAttribute('aria-label', 'Next slide');
        nextArrow.addEventListener('click', () => this.nextSlide());
        
        arrowsContainer.appendChild(prevArrow);
        arrowsContainer.appendChild(nextArrow);
        this.container.appendChild(arrowsContainer);
        
        this.prevArrow = prevArrow;
        this.nextArrow = nextArrow;
    }
    
    createDots() {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'gallery-controls';
        
        this.slides.forEach((slide, index) => {
            const dot = document.createElement('button');
            dot.className = 'gallery-dot';
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => this.goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        this.container.appendChild(dotsContainer);
        this.dots = Array.from(dotsContainer.querySelectorAll('.gallery-dot'));
    }
    
    setupEventListeners() {
        if (this.options.keyboardEnabled) {
            document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        }
        
        if (this.options.swipeEnabled) {
            this.setupSwipe();
        }
        
        // Pause autoplay on hover
        this.container.addEventListener('mouseenter', () => {
            if (this.options.autoplay) {
                this.pauseAutoplay();
            }
        });
        
        this.container.addEventListener('mouseleave', () => {
            if (this.options.autoplay) {
                this.startAutoplay();
            }
        });
        
        // Pause autoplay when page is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoplay();
            } else if (this.options.autoplay) {
                this.startAutoplay();
            }
        });
    }
    
    setupSwipe() {
        let startX = 0;
        let startY = 0;
        let isSwipe = false;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwipe = false;
        });
        
        this.container.addEventListener('touchmove', (e) => {
            const deltaX = Math.abs(e.touches[0].clientX - startX);
            const deltaY = Math.abs(e.touches[0].clientY - startY);
            
            if (deltaX > deltaY && deltaX > 50) {
                isSwipe = true;
                e.preventDefault();
            }
        });
        
        this.container.addEventListener('touchend', (e) => {
            if (isSwipe) {
                const deltaX = e.changedTouches[0].clientX - startX;
                
                if (deltaX > 50) {
                    this.previousSlide();
                } else if (deltaX < -50) {
                    this.nextSlide();
                }
            }
        });
    }
    
    handleKeyboard(e) {
        if (!this.container.matches(':hover')) return;
        
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSlide();
                break;
            case ' ':
                e.preventDefault();
                this.toggleAutoplay();
                break;
        }
    }
    
    showSlide(index) {
        if (index < 0 || index >= this.slides.length) return;
        
        // Hide current slide
        if (this.slides[this.currentIndex]) {
            this.slides[this.currentIndex].style.display = 'none';
            this.slides[this.currentIndex].classList.remove('active');
        }
        
        // Show new slide
        this.currentIndex = index;
        this.slides[this.currentIndex].style.display = 'block';
        this.slides[this.currentIndex].classList.add('active');
        
        // Update dots
        if (this.dots) {
            this.dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
        
        // Update arrows
        if (this.prevArrow && this.nextArrow) {
            this.prevArrow.disabled = !this.options.loop && index === 0;
            this.nextArrow.disabled = !this.options.loop && index === this.slides.length - 1;
        }
        
        // Trigger custom event
        this.container.dispatchEvent(new CustomEvent('slideChanged', {
            detail: { index, slide: this.slides[index] }
        }));
    }
    
    nextSlide() {
        let nextIndex = this.currentIndex + 1;
        
        if (nextIndex >= this.slides.length) {
            if (this.options.loop) {
                nextIndex = 0;
            } else {
                return;
            }
        }
        
        this.showSlide(nextIndex);
    }
    
    previousSlide() {
        let prevIndex = this.currentIndex - 1;
        
        if (prevIndex < 0) {
            if (this.options.loop) {
                prevIndex = this.slides.length - 1;
            } else {
                return;
            }
        }
        
        this.showSlide(prevIndex);
    }
    
    goToSlide(index) {
        this.showSlide(index);
    }
    
    startAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
        
        this.isPlaying = true;
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.options.autoplayDelay);
    }
    
    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
        this.isPlaying = false;
    }
    
    toggleAutoplay() {
        if (this.isPlaying) {
            this.pauseAutoplay();
        } else {
            this.startAutoplay();
        }
    }
    
    getCurrentSlide() {
        return {
            index: this.currentIndex,
            slide: this.slides[this.currentIndex]
        };
    }
    
    getTotalSlides() {
        return this.slides.length;
    }
    
    destroy() {
        this.pauseAutoplay();
        
        // Remove event listeners
        if (this.options.keyboardEnabled) {
            document.removeEventListener('keydown', this.handleKeyboard);
        }
        
        // Remove controls
        const arrows = this.container.querySelector('.gallery-arrows');
        const dots = this.container.querySelector('.gallery-controls');
        
        if (arrows) arrows.remove();
        if (dots) dots.remove();
        
        // Reset slides
        this.slides.forEach(slide => {
            slide.style.display = '';
            slide.classList.remove('active', 'fade-transition', 'slide-transition', 'zoom-transition');
        });
    }
}

// Utility function to initialize all galleries on the page
function initializeGalleries() {
    const galleries = document.querySelectorAll('.gallery-container');
    const galleryInstances = [];
    
    galleries.forEach((gallery, index) => {
        const galleryId = gallery.id || `gallery-${index}`;
        gallery.id = galleryId;
        
        // Get options from data attributes
        const options = {
            autoplay: gallery.dataset.autoplay === 'true',
            autoplayDelay: parseInt(gallery.dataset.autoplayDelay) || 5000,
            transition: gallery.dataset.transition || 'fade',
            showArrows: gallery.dataset.showArrows !== 'false',
            showDots: gallery.dataset.showDots !== 'false',
            loop: gallery.dataset.loop !== 'false',
            swipeEnabled: gallery.dataset.swipeEnabled !== 'false',
            keyboardEnabled: gallery.dataset.keyboardEnabled !== 'false'
        };
        
        const galleryInstance = new Gallery(galleryId, options);
        galleryInstances.push(galleryInstance);
    });
    
    return galleryInstances;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Gallery, initializeGalleries };
}
