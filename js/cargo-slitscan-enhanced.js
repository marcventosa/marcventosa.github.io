// Authentic Cargo.site Slitscan Implementation
// Based on comprehensive analysis of reference implementation from slitscan-root-info

class CargoSlitScan {
  constructor(options) {
    // Configuration with authentic Cargo.site defaults from reference implementation
    this.config = {
      container: options.container,
      imageUrl: options.imageUrl,
      width: options.width || window.innerWidth,
      height: options.height || window.innerHeight,
      scan_size: options.scan_size || 1,           // Much smaller for smooth, continuous strips
      scan_cycles: options.scan_cycles || 20,
      wiggle: options.wiggle || 47.5,
      target_speed: options.target_speed || -73,
      orientation: options.orientation || 'horizontal',
      mouse_interaction: options.mouse_interaction !== false,
      scroll_interaction: options.scroll_interaction !== false,
      mirror_horizontal: options.mirror_horizontal || false,
      mirror_vertical: options.mirror_vertical || false,
      wave_effect: options.wave_effect || true,
    };

    // Add a scale factor for the image (default 0.85 for 85% size)
    this.imageScaleFactor = (typeof options.imageScaleFactor === 'number') ? options.imageScaleFactor : 0.85;

    // Initialize state
    this.isVisible = true;
    this.isPaused = false;
    
    // Animation variables
    this.animationId = null;
    this.time = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.mouseInfluence = 0;
    this.mouseLerp = 0; // For smooth lerped mouse offset
    this.scrollProgress = 1;
    
    // Performance optimizations
    this.lastFrameTime = 0;
    this.frameRate = 1000 / 15; // Reduced to 30 FPS for optimization
    
    // Initialize canvas and context
    this.initCanvas();
    
    // Load image and start effect
    this.loadImage().then(() => {
      this.setupEventListeners();
      this.startAnimation();
    }).catch(error => {
      console.error('Failed to load image:', error);
    });
  }

  initCanvas() {
    // Create canvas element
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.config.width;
    this.canvas.height = this.config.height;
    
    // Apply authentic Cargo.site canvas styling
    this.canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 1;
      pointer-events: none;
    `;
    
    this.config.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    // Optimize canvas for performance and quality
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.msImageSmoothingEnabled = false;


    // Optional: limit render resolution for performance
    this.maxRenderWidth = 1280; // Reduced resolution for performance
    this.maxRenderHeight = 720; // Reduced resolution for performance
  }

  async loadImage() {
    return new Promise((resolve, reject) => {
      this.image = new Image();
      this.image.crossOrigin = 'anonymous';
      this.image.onload = () => {
        // Calculate scaling to cover the entire canvas, but apply scale factor
        const imageAspect = this.image.width / this.image.height;
        const canvasAspect = this.config.width / this.config.height;
        if (this.config.orientation === 'horizontal') {
          // Always fill full width, scale height only
          this.imageScale = (this.config.width / this.image.width);
          this.scaledWidth = this.config.width;
          this.scaledHeight = this.image.height * this.imageScale * this.imageScaleFactor;
          this.imageOffsetX = 0;
          this.imageOffsetY = (this.config.height - this.scaledHeight) / 2;
        } else if (imageAspect > canvasAspect) {
          this.imageScale = (this.config.height / this.image.height) * this.imageScaleFactor;
          this.scaledWidth = this.image.width * this.imageScale;
          this.scaledHeight = this.config.height * this.imageScaleFactor;
          this.imageOffsetX = (this.config.width - this.scaledWidth) / 2;
          this.imageOffsetY = (this.config.height - this.scaledHeight) / 2;
        } else {
          this.imageScale = (this.config.width / this.image.width) * this.imageScaleFactor;
          this.scaledWidth = this.config.width * this.imageScaleFactor;
          this.scaledHeight = this.image.height * this.imageScale;
          this.imageOffsetX = (this.config.width - this.scaledWidth) / 2;
          this.imageOffsetY = (this.config.height - this.scaledHeight) / 2;
        }
        
        resolve();
      };
      
      this.image.onerror = () => {
        reject(new Error(`Failed to load image: ${this.config.imageUrl}`));
      };
      
      this.image.src = this.config.imageUrl;
    });
  }

  setupEventListeners() {
    // Mouse interaction following Cargo.site patterns
    if (this.config.mouse_interaction) {
      const handleMouseMove = (e) => {
        if (this.mouseThrottleTimeout) return; // Throttle mouse events
        this.mouseThrottleTimeout = setTimeout(() => {
          const rect = this.canvas.getBoundingClientRect();
          this.mouseX = (e.clientX - rect.left) / rect.width;
          this.mouseY = (e.clientY - rect.top) / rect.height;
          this.mouseThrottleTimeout = null;
        }, 50); // 50ms throttle
      };
      document.addEventListener('mousemove', handleMouseMove);
      this.removeMouseListener = () => document.removeEventListener('mousemove', handleMouseMove);
    }
    
    // Scroll interaction following Cargo.site patterns
    if (this.config.scroll_interaction) {
      const handleScroll = () => {
        if (this.scrollThrottleTimeout) return; // Throttle scroll events
        this.scrollThrottleTimeout = setTimeout(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          this.scrollProgress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
          this.scrollThrottleTimeout = null;
        }, 50); // 50ms throttle
      };
      
      document.addEventListener('scroll', handleScroll);
      this.removeScrollListener = () => document.removeEventListener('scroll', handleScroll);
    }
    
    // Window resize handler
    const handleResize = () => {
      this.config.width = window.innerWidth;
      this.config.height = window.innerHeight;
      this.canvas.width = this.config.width;
      this.canvas.height = this.config.height;
      // Recalculate image scaling
      if (this.image && this.image.complete) {
        const imageAspect = this.image.width / this.image.height;
        const canvasAspect = this.config.width / this.config.height;
        if (this.config.orientation === 'horizontal') {
          // Always fill full width, scale height only
          this.imageScale = (this.config.width / this.image.width);
          this.scaledWidth = this.config.width;
          this.scaledHeight = this.image.height * this.imageScale * this.imageScaleFactor;
          this.imageOffsetX = 0;
          this.imageOffsetY = (this.config.height - this.scaledHeight) / 2;
        } else if (imageAspect > canvasAspect) {
          this.imageScale = (this.config.height / this.image.height) * this.imageScaleFactor;
          this.scaledWidth = this.image.width * this.imageScale;
          this.scaledHeight = this.config.height * this.imageScaleFactor;
          this.imageOffsetX = (this.config.width - this.scaledWidth) / 2;
          this.imageOffsetY = (this.config.height - this.scaledHeight) / 2;
        } else {
          this.imageScale = (this.config.width / this.image.width) * this.imageScaleFactor;
          this.scaledWidth = this.config.width * this.imageScaleFactor;
          this.scaledHeight = this.image.height * this.imageScale;
          this.imageOffsetX = (this.config.width - this.scaledWidth) / 2;
          this.imageOffsetY = (this.config.height - this.scaledHeight) / 2;
        }
        // Only trigger a single render, do not restart animation loop
        this.render(performance.now());
      }
    };
    window.addEventListener('resize', handleResize);
    this.removeResizeListener = () => window.removeEventListener('resize', handleResize);
  }

  startAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    // Pause animation when tab is not visible
    const onVisibilityChange = () => {
      if (document.hidden) {
        this.isPaused = true;
      } else {
        this.isPaused = false;
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    this.removeVisibilityListener = () => document.removeEventListener('visibilitychange', onVisibilityChange);
    const animate = (currentTime) => {
      // Frame rate limiting for performance
      if (currentTime - this.lastFrameTime >= this.frameRate) {
        if (this.isVisible && !this.isPaused) {
          this.render(currentTime);
        }
        this.lastFrameTime = currentTime;
      }
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    this.animationId = requestAnimationFrame(animate);
  }

  render(currentTime) {
    if (!this.image || !this.image.complete) return;
    // Downscale for performance if needed
    let renderWidth = this.config.width;
    let renderHeight = this.config.height;
    if (renderWidth > this.maxRenderWidth) {
      renderHeight = Math.round(renderHeight * (this.maxRenderWidth / renderWidth));
      renderWidth = this.maxRenderWidth;
    }
    if (renderHeight > this.maxRenderHeight) {
      renderWidth = Math.round(renderWidth * (this.maxRenderHeight / renderHeight));
      renderHeight = this.maxRenderHeight;
    }
    if (renderWidth !== this.config.width || renderHeight !== this.config.height) {
      this.canvas.width = renderWidth;
      this.canvas.height = renderHeight;
    }
    // Clear canvas
    this.ctx.clearRect(0, 0, renderWidth, renderHeight);
    
    // Update time for animations
    this.time = currentTime * 0.001; // Convert to seconds
    
    // Calculate scan parameters with authentic Cargo.site formulas
    const scanSpeed = this.config.target_speed * 0.01;
    const scanOffset = this.time * scanSpeed;
    
    // Mouse and scroll influences (improved for more violent and smooth effect)
    // Lerp mouseX for smoothness
    this.mouseLerp += (this.mouseX - this.mouseLerp) * 0.15; // 0.15 = smoothing factor
    // MouseWiggle is now much more pronounced
    const mouseWiggle = this.config.mouse_interaction ? (this.mouseLerp - 0.5) * this.config.width * 0.45 : 0; // 0.45 = violence factor
    const scrollWiggle = this.config.scroll_interaction ? this.scrollProgress * this.config.wiggle * 0.5 : 0;
    // Enhanced wave effect calculation
    const totalWiggle = this.config.wiggle + mouseWiggle + scrollWiggle;
    // Render slitscan effect with authentic Cargo.site algorithm
    if (this.config.orientation === 'horizontal') {
      this.renderHorizontalSlitscan(scanOffset, totalWiggle);
    } else {
      this.renderVerticalSlitscan(scanOffset, totalWiggle);
    }
    // Apply mirroring effects if enabled
    if (this.config.mirror_horizontal || this.config.mirror_vertical) {
      this.applyMirroringEffects();
    }
  }

  renderHorizontalSlitscan(scanOffset, wiggle) {
    // Draw each row as a 1-pixel high slice directly to the main canvas for a seamless effect
    const cycleLength = this.config.height / this.config.scan_cycles;
    const half = Math.floor(this.config.height / 2);
    for (let y = 0; y < this.config.height; y++) {
      const cyclePosition = (y % cycleLength) / cycleLength;
      const wave = Math.sin(cyclePosition * Math.PI * 2 + scanOffset) * wiggle;
      let waveY = y + wave;
      let mirror = false;
      if (y >= half) {
        waveY = this.config.height - y + wave;
        mirror = true;
      }
      const sourceY = Math.max(0, Math.min(this.scaledHeight - 1, waveY - this.imageOffsetY));
      this.ctx.save();
      if (mirror) {
        this.ctx.translate(0, y + 1);
        this.ctx.scale(1, -1);
        this.ctx.drawImage(
          this.image,
          0, sourceY / this.imageScale,
          this.image.width, 1 / this.imageScale,
          this.imageOffsetX, 0,
          this.scaledWidth, 1
        );
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      } else {
        this.ctx.drawImage(
          this.image,
          0, sourceY / this.imageScale,
          this.image.width, 1 / this.imageScale,
          this.imageOffsetX, y,
          this.scaledWidth, 1
        );
      }
      this.ctx.restore();
    }
  }

  renderVerticalSlitscan(scanOffset, wiggle) {
    // Draw each column as a subpixel-wide slice for a smoother effect
    const cycleLength = this.config.width / this.config.scan_cycles;
    const stripWidth = 0.5; // Subpixel width for ultra-smoothness
    for (let x = 0; x < this.config.width; x += stripWidth) {
      const cyclePosition = (x % cycleLength) / cycleLength;
      const wave = Math.sin(cyclePosition * Math.PI * 2 + scanOffset) * wiggle;
      const waveX = x + wave;
      const sourceX = Math.max(0, Math.min(this.scaledWidth - stripWidth, waveX - this.imageOffsetX));
      this.ctx.save();
      this.ctx.setTransform(stripWidth, 0, 0, 1, x, this.imageOffsetY);
      this.ctx.drawImage(
        this.image,
        sourceX / this.imageScale, 0,
        stripWidth / this.imageScale, this.image.height,
        0, 0,
        1, this.scaledHeight
      );
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.restore();
    }
  }

  applyMirroringEffects() {
    if (!this.config.mirror_horizontal && !this.config.mirror_vertical) return;
    
    // Get current canvas content
    const imageData = this.ctx.getImageData(0, 0, this.config.width, this.config.height);
    
    // Apply mirroring transformations
    this.ctx.save();
    
    if (this.config.mirror_horizontal) {
      this.ctx.scale(-1, 1);
      this.ctx.translate(-this.config.width, 0);
    }
    
    if (this.config.mirror_vertical) {
      this.ctx.scale(1, -1);
      this.ctx.translate(0, -this.config.height);
    }
    
    // Redraw with mirroring
    this.ctx.putImageData(imageData, 0, 0);
    this.ctx.restore();
  }

  // Backdrop integration methods (authentic Cargo.site patterns)
  setVisibility(visible) {
    this.isVisible = visible;
    if (this.canvas) {
      this.canvas.style.opacity = visible ? '1' : '0';
    }
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  isPausedState() {
    return this.isPaused;
  }

  // Cleanup method
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    // Remove event listeners
    if (this.removeMouseListener) this.removeMouseListener();
    if (this.removeScrollListener) this.removeScrollListener();
    if (this.removeResizeListener) this.removeResizeListener();
    if (this.removeVisibilityListener) this.removeVisibilityListener();
    
    // Remove canvas
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    
    // Clear references
    this.canvas = null;
    this.ctx = null;
    this.image = null;
  }
}

export default CargoSlitScan;
