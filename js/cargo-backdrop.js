/**
 * Cargo Backdrop System
 * Implements Cargo.site-style backdrop positioning and viewport management
 */

class CargoBackdrop {
    constructor(container, slitscanInstance) {
        this.container = container;
        this.slitscan = slitscanInstance;
        this.backdropWrapper = null;
        this.backdropContents = null;
        this.resizeObserver = null;
        this.intersectionObserver = null;
        this.viewportObserver = null;
        
        this.state = {
            loaded: false,
            visibility: {
                visible: false,
                position: 'below'
            },
            dimensions: {
                width: 0,
                height: 0
            },
            wrapperDimensions: {
                width: 0,
                height: 0
            },
            clipScroll: true
        };
        
        this.init();
    }
    
    init() {
        this.createBackdropStructure();
        this.bindObservers();
        this.updateVisibility();
        this.state.loaded = true;
    }
    
    createBackdropStructure() {
        // Create backdrop wrapper with Cargo.site-style structure
        this.backdropWrapper = document.createElement('div');
        this.backdropWrapper.className = `backdrop ${this.state.clipScroll ? 'clip' : ''}`;
        this.backdropWrapper.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: -1;
            overflow: hidden;
            --backdrop-width: 100vw;
            --backdrop-height: 100vh;
        `;
        
        // Create backdrop contents
        this.backdropContents = document.createElement('div');
        this.backdropContents.className = 'backdrop-contents visible inside loaded';
        this.backdropContents.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            transition: opacity 0.3s ease;
        `;
        
        // Move existing canvas to backdrop contents
        const canvas = this.container.querySelector('canvas');
        if (canvas) {
            this.backdropContents.appendChild(canvas);
        }
        
        this.backdropWrapper.appendChild(this.backdropContents);
        
        // Replace container with backdrop wrapper
        this.container.parentNode.replaceChild(this.backdropWrapper, this.container);
        this.container = this.backdropWrapper;
    }
    
    bindObservers() {
        // Resize observer for backdrop dimensions
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach(entry => {
                if (entry.target === this.backdropWrapper) {
                    this.state.wrapperDimensions = {
                        width: entry.contentRect.width,
                        height: entry.contentRect.height
                    };
                    this.updateCSS();
                } else if (entry.target === this.backdropContents) {
                    this.state.dimensions = {
                        width: entry.contentRect.width,
                        height: entry.contentRect.height
                    };
                    this.updateCSS();
                }
            });
        });
        
        // Intersection observer for backdrop visibility
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                let position = 'inside';
                if (entry.boundingClientRect.top - entry.boundingClientRect.height < 0 && !entry.isIntersecting) {
                    position = 'above';
                } else if (entry.boundingClientRect.top > 0 && !entry.isIntersecting) {
                    position = 'below';
                }
                
                this.state.visibility = {
                    visible: entry.isIntersecting,
                    position: position
                };
                
                this.updateVisibility();
            });
        }, {
            root: document,
            rootMargin: '0px',
            threshold: [0, 1]
        });
        
        // Viewport observer for clip scrolling
        this.viewportObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (this.state.clipScroll) {
                    this.handleClipScroll(entry);
                }
            });
        }, {
            root: document,
            rootMargin: `${window.screen.height}px 0px`,
            threshold: [0, 1]
        });
        
        // Observe elements
        this.resizeObserver.observe(this.backdropWrapper);
        this.resizeObserver.observe(this.backdropContents);
        this.intersectionObserver.observe(this.backdropContents);
        this.viewportObserver.observe(this.backdropWrapper);
    }
    
    handleClipScroll(entry) {
        // Implement clip scrolling behavior similar to Cargo.site
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Only apply clip scrolling if enabled
        if (!this.state.clipScroll) return;
        
        // Calculate scroll progress and offset
        const scrollProgress = Math.min(Math.max(scrollTop / (documentHeight - viewportHeight), 0), 1);
        
        // Determine which section is currently visible
        const landingSection = document.querySelector('.landing-section');
        const projectSections = document.querySelectorAll('.project-section, .profile-section, .contact-section');
        
        let shouldShowBackdrop = false;
        
        // Check if landing section is visible
        if (landingSection) {
            const landingRect = landingSection.getBoundingClientRect();
            const landingVisible = landingRect.top < viewportHeight && landingRect.bottom > 0;
            
            if (landingVisible) {
                shouldShowBackdrop = true;
                // Calculate parallax effect for landing section
                const landingProgress = Math.max(0, Math.min(1, -landingRect.top / viewportHeight));
                const parallaxOffset = landingProgress * 50; // Subtle parallax
                
                if (this.backdropContents) {
                    this.backdropContents.style.transform = `translateY(${parallaxOffset}px)`;
                    this.backdropContents.style.opacity = '1';
                }
            }
        }
        
        // Check if any project section is visible
        if (!shouldShowBackdrop && projectSections.length > 0) {
            for (let section of projectSections) {
                const sectionRect = section.getBoundingClientRect();
                const sectionVisible = sectionRect.top < viewportHeight && sectionRect.bottom > 0;
                
                if (sectionVisible) {
                    // Hide backdrop when over project sections
                    if (this.backdropContents) {
                        this.backdropContents.style.opacity = '0';
                    }
                    break;
                }
            }
        }
        
        // Update slitscan effect with scroll information
        if (this.slitscan && this.slitscan.updateScrollPosition) {
            this.slitscan.updateScrollPosition(scrollProgress, scrollTop);
        }
    }
    
    updateVisibility() {
        if (!this.backdropContents) return;
        
        const { visible, position } = this.state.visibility;
        
        // Update backdrop contents classes
        this.backdropContents.className = `backdrop-contents ${visible ? 'visible' : ''} ${position} ${this.state.loaded ? 'loaded' : ''}`;
        
        // Update opacity based on visibility
        if (visible) {
            this.backdropContents.style.opacity = '1';
        } else {
            this.backdropContents.style.opacity = '0';
        }
        
        // Update slitscan effect if available
        if (this.slitscan && this.slitscan.setVisibility) {
            this.slitscan.setVisibility(visible, position);
        }
    }
    
    updateCSS() {
        if (!this.backdropWrapper) return;
        
        this.backdropWrapper.style.setProperty('--backdrop-width', `${this.state.wrapperDimensions.width}px`);
        this.backdropWrapper.style.setProperty('--backdrop-height', `${this.state.wrapperDimensions.height}px`);
    }
    
    // Method to update clip scroll behavior
    setClipScroll(enabled) {
        this.state.clipScroll = enabled;
        this.backdropWrapper.className = `backdrop ${enabled ? 'clip' : ''}`;
        
        if (enabled) {
            this.bindClipScrolling();
        } else {
            this.unbindClipScrolling();
        }
    }
    
    bindClipScrolling() {
        if (this.scrollHandler) return;
        
        this.scrollHandler = () => {
            if (this.state.clipScroll) {
                this.handleClipScroll({ isIntersecting: true });
            }
        };
        
        window.addEventListener('scroll', this.scrollHandler, { passive: true });
    }
    
    unbindClipScrolling() {
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
            this.scrollHandler = null;
        }
        
        // Reset transform
        if (this.backdropContents) {
            this.backdropContents.style.transform = '';
        }
    }
    
    // Method to handle backdrop load complete
    fireBackdropLoadComplete() {
        if (this.backdropLoadCompleteFired) return;
        
        this.backdropLoadCompleteFired = true;
        window.dispatchEvent(new CustomEvent('backdrop-load-complete', {
            bubbles: true,
            composed: true,
            detail: {}
        }));
    }
    
    // Method to get backdrop visibility state
    getVisibility() {
        return this.state.visibility;
    }
    
    // Method to get backdrop dimensions
    getDimensions() {
        return {
            ...this.state.dimensions,
            wrapper: this.state.wrapperDimensions
        };
    }
    
    // Destroy method for cleanup
    destroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        
        if (this.viewportObserver) {
            this.viewportObserver.disconnect();
        }
        
        this.unbindClipScrolling();
        
        if (this.backdropWrapper && this.backdropWrapper.parentNode) {
            this.backdropWrapper.parentNode.removeChild(this.backdropWrapper);
        }
    }
}

export default CargoBackdrop;
