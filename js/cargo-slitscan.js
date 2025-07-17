// Cargo-style Slitscan Effect Implementation
// Based on the working Cargo.site slitscan backdrop

class CargoSlitScan {
  constructor(options = {}) {
    this.container = options.container;
    this.imageUrl = options.imageUrl || 'images/peces2-bp3.png';
    this.settings = {
      // Updated default values from index.js analysis
      scan_size: options.scan_size || 20,         // Original: 90 (0-100 range)
      scan_cycles: options.scan_cycles || 0.05,      // Original: 1 (0-20 range)
      wiggle: options.wiggle || 0.05,               // Original: 20 (0-100 range)
      target_speed: options.target_speed || 0.02,   // Original: 17 (-100 to 100 range)
      orientation: options.orientation || 'horizontal',
      mouse_interaction: options.mouse_interaction !== true,
      scroll_interaction: options.scroll_interaction !== false,
      mirror_horizontal: options.mirror_horizontal || true,
      mirror_vertical: options.mirror_vertical || false,
      wave_effect: options.wave_effect !== false
    };
    
    this.width = options.width || window.innerWidth;
    this.height = options.height || window.innerHeight;
    
    // Animation state
    this.mouse = { x: 0.5, y: 0.5 };
    this.scroll = { x: 0, y: 0 };
    this.time = 0;
    this.animationId = null;
    this.isPaused = false;
    this.isVisible = true;
    this.position = 'inside';
    
    this.init();
  }

  init() {
    this.createCanvas();
    this.loadImage();
    this.setupEventListeners();
    this.animate();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.objectFit = 'cover';
    
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);
  }

  loadImage() {
    this.image = new Image();
    this.image.crossOrigin = 'anonymous';
    this.image.onload = () => {
      console.log('Image loaded successfully for slitscan effect');
      this.imageLoaded = true;
      this.createImageData();
    };
    this.image.onerror = () => {
      console.error('Failed to load image for slitscan effect');
      this.createFallbackPattern();
    };
    this.image.src = this.imageUrl;
  }

  createImageData() {
    // Create an offscreen canvas to process the image
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = this.width;
    this.offscreenCanvas.height = this.height;
    this.offscreenCtx = this.offscreenCanvas.getContext('2d');
    
    // Fill with black background first
    this.offscreenCtx.fillStyle = '#000000';
    this.offscreenCtx.fillRect(0, 0, this.width, this.height);
    
    // Apply mirroring transformations
    this.offscreenCtx.save();
    if (this.settings.mirror_horizontal) {
      this.offscreenCtx.scale(-1, 1);
      this.offscreenCtx.translate(-this.width, 0);
    }
    if (this.settings.mirror_vertical) {
      this.offscreenCtx.scale(1, -1);
      this.offscreenCtx.translate(0, -this.height);
    }
    
    // Calculate scaling to cover the entire canvas while maintaining aspect ratio
    const imageAspect = this.image.width / this.image.height;
    const canvasAspect = this.width / this.height;
    
    let drawWidth, drawHeight, drawX, drawY;
    
    if (imageAspect > canvasAspect) {
      // Image is wider than canvas
      drawHeight = this.height;
      drawWidth = this.height * imageAspect;
      drawX = (this.width - drawWidth) / 2;
      drawY = 0;
    } else {
      // Image is taller than canvas
      drawWidth = this.width;
      drawHeight = this.width / imageAspect;
      drawX = 0;
      drawY = (this.height - drawHeight) / 2;
    }
    
    // Draw the image to cover the entire canvas
    this.offscreenCtx.drawImage(this.image, drawX, drawY, drawWidth, drawHeight);
    this.offscreenCtx.restore();
    
    this.imageData = this.offscreenCtx.getImageData(0, 0, this.width, this.height);
    
    console.log('Image processed for slitscan:', {
      originalSize: `${this.image.width}x${this.image.height}`,
      canvasSize: `${this.width}x${this.height}`,
      drawSize: `${drawWidth}x${drawHeight}`,
      position: `${drawX}, ${drawY}`,
      mirroring: `H:${this.settings.mirror_horizontal}, V:${this.settings.mirror_vertical}`
    });
  }

  createFallbackPattern() {
    // Create a fallback pattern if image fails to load
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = this.width;
    this.offscreenCanvas.height = this.height;
    this.offscreenCtx = this.offscreenCanvas.getContext('2d');
    
    // Create a gradient pattern
    const gradient = this.offscreenCtx.createLinearGradient(0, 0, this.width, this.height);
    gradient.addColorStop(0, '#333');
    gradient.addColorStop(0.5, '#666');
    gradient.addColorStop(1, '#333');
    
    this.offscreenCtx.fillStyle = gradient;
    this.offscreenCtx.fillRect(0, 0, this.width, this.height);
    
    this.imageData = this.offscreenCtx.getImageData(0, 0, this.width, this.height);
    this.imageLoaded = true;
  }

  setupEventListeners() {
    if (this.settings.mouse_interaction) {
      window.addEventListener('mousemove', this.onMouseMove.bind(this));
    }
    
    if (this.settings.scroll_interaction) {
      window.addEventListener('scroll', this.onScroll.bind(this));
    }
  }

  onMouseMove(e) {
    this.mouse.x = e.clientX / window.innerWidth;
    this.mouse.y = e.clientY / window.innerHeight;
  }

  onScroll() {
    this.scroll.y = window.scrollY / window.innerHeight;
    this.scroll.x = window.scrollX / window.innerWidth;
  }

  drawSlitScan() {
    if (!this.imageLoaded || !this.imageData) return;

    const { scan_size, scan_cycles, wiggle, target_speed, orientation, wave_effect } = this.settings;
    const data = this.imageData.data;
    const width = this.width;
    const height = this.height;
    
    // Create output image data
    const outputData = this.ctx.createImageData(width, height);
    const output = outputData.data;
    
    // Time-based animation - adjusted for new parameter range (-100 to 100)
    const timeSpeed = target_speed * 0.002; // Reduced multiplier for new range
    const animTime = this.time * timeSpeed;
    
    // Mouse influence - increased scale for more dramatic interaction
    const mouseInfluence = {
      x: (this.mouse.x - 0.5) * 4.0, // Increased scale for higher mouse interaction
      y: (this.mouse.y - 0.5) * 4.0
    };
    
    // Scroll influence - adjusted for new parameter behavior
    const scrollInfluence = {
      x: this.scroll.x * 0.3,
      y: this.scroll.y * 0.3
    };
    
    if (orientation === 'horizontal') {
      // Horizontal slitscan - each row gets offset horizontally
      for (let y = 0; y < height; y++) {
        // Calculate scan offset based on position, time, and interactions
        const normalizedY = y / height;
        
        // Short wave pattern - adjusted for new scan_cycles range (0-20)
        const scanPhase = normalizedY * scan_cycles * 10 * Math.PI + animTime; // Reduced multiplier for new range
        
        // Create wave pattern for wiggle effect - adjusted for new wiggle range (0-100)
        let wiggleOffset = 0;
        if (wave_effect) {
          const primaryWave = Math.sin(scanPhase) * wiggle * width * 0.003; // Reduced for new range
          const secondaryWave = Math.sin(scanPhase * 2.5) * wiggle * width * 0.0015; // Reduced for new range
          wiggleOffset = primaryWave + secondaryWave;
        }
        
        // Mouse influence - increased scale for more dramatic horizontal offset
        const mouseOffset = mouseInfluence.x * scan_size * 0.8; // Increased multiplier for higher interaction
        
        // Scroll influence - adjusted for new scan_size range (0-100)
        const scrollOffset = scrollInfluence.y * scan_size * 0.1; // Reduced for new range
        
        // Additional wave distortion based on mouse position - increased scale
        const mouseWave = wave_effect ? Math.sin(normalizedY * 20 * Math.PI + this.mouse.x * 10) * mouseInfluence.x * 25 : 0; // Increased multiplier
        
        // Combine all offsets
        const totalOffset = wiggleOffset + mouseOffset + scrollOffset + mouseWave;
        
        // Convert to pixel offset and wrap around
        const pixelOffset = Math.floor(totalOffset);
        
        // Copy pixels for this row with horizontal offset
        for (let x = 0; x < width; x++) {
          const sourceX = (x + pixelOffset) % width;
          const normalizedSourceX = sourceX < 0 ? width + sourceX : sourceX;
          
          const sourceIndex = (y * width + normalizedSourceX) * 4;
          const destIndex = (y * width + x) * 4;
          
          if (sourceIndex >= 0 && sourceIndex < data.length) {
            output[destIndex] = data[sourceIndex];         // R
            output[destIndex + 1] = data[sourceIndex + 1]; // G
            output[destIndex + 2] = data[sourceIndex + 2]; // B
            output[destIndex + 3] = data[sourceIndex + 3]; // A
          }
        }
      }
    } else {
      // Vertical slitscan
      for (let x = 0; x < width; x++) {
        const normalizedX = x / width;
        const scanPhase = normalizedX * scan_cycles * 10 * Math.PI + animTime; // Adjusted for new range
        
        let wiggleOffset = 0;
        if (wave_effect) {
          const primaryWave = Math.sin(scanPhase) * wiggle * height * 0.003; // Adjusted for new range
          const secondaryWave = Math.sin(scanPhase * 2.5) * wiggle * height * 0.0015; // Adjusted for new range
          wiggleOffset = primaryWave + secondaryWave;
        }
        
        const mouseOffset = mouseInfluence.y * scan_size * 0.8; // Increased multiplier for higher interaction
        const scrollOffset = scrollInfluence.x * scan_size * 0.1; // Adjusted for new range
        const mouseWave = wave_effect ? Math.sin(normalizedX * 20 * Math.PI + this.mouse.y * 10) * mouseInfluence.y * 25 : 0; // Increased multiplier
        
        const totalOffset = wiggleOffset + mouseOffset + scrollOffset + mouseWave;
        const pixelOffset = Math.floor(totalOffset);
        
        // Copy the scanline
        for (let y = 0; y < height; y++) {
          const sourceY = (y + pixelOffset) % height;
          const normalizedSourceY = sourceY < 0 ? height + sourceY : sourceY;
          
          const sourceIndex = (normalizedSourceY * width + x) * 4;
          const destIndex = (y * width + x) * 4;
          
          if (sourceIndex >= 0 && sourceIndex < data.length) {
            output[destIndex] = data[sourceIndex];         // R
            output[destIndex + 1] = data[sourceIndex + 1]; // G
            output[destIndex + 2] = data[sourceIndex + 2]; // B
            output[destIndex + 3] = data[sourceIndex + 3]; // A
          }
        }
      }
    }
    
    // Draw the processed image
    this.ctx.putImageData(outputData, 0, 0);
  }

  animate() {
    if (this.isPaused) {
      this.animationId = null;
      return;
    }
    
    this.time += 16.67; // ~60fps
    
    if (this.imageLoaded) {
      this.drawSlitScan();
    }
    
    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }

  // Add method to set visibility (for backdrop integration)
  setVisibility(visible, position) {
    this.isVisible = visible;
    this.position = position;
    
    // Adjust effect intensity based on visibility
    if (this.canvas) {
      this.canvas.style.opacity = visible ? '1' : '0.3';
    }
    
    // Pause/resume animation based on visibility
    if (visible && this.position === 'inside') {
      this.resume();
    } else {
      this.pause();
    }
  }
  
  // Add pause/resume methods
  pause() {
    this.isPaused = true;
  }
  
  resume() {
    this.isPaused = false;
    if (!this.animationId) {
      this.animate();
    }
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.settings.mouse_interaction) {
      window.removeEventListener('mousemove', this.onMouseMove);
    }
    
    if (this.settings.scroll_interaction) {
      window.removeEventListener('scroll', this.onScroll);
    }
    
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Export for ES modules
export default CargoSlitScan;

// Also make available globally for non-module usage
window.CargoSlitScan = CargoSlitScan;
