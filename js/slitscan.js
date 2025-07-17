// PIXI is loaded globally via CDN
// ScanFilter is loaded globally via <script src="js/pixi-shader.js"></script>

export default class SlitScanEffect {
  constructor({ container, imageUrl, width, height, background = "#000000", mouseInteraction = true, scrollInteraction = true }) {
    this.container = container;
    this.imageUrl = imageUrl;
    this.width = width;
    this.height = height;
    this.background = background;
    this.mouseInteraction = mouseInteraction;
    this.scrollInteraction = scrollInteraction;

    this.init();
  }

  async init() {
    try {
      // Check if PIXI is loaded
      if (typeof PIXI === 'undefined') {
        console.error('PIXI is not loaded. Make sure to include PixiJS script before the module.');
        return;
      }

      // Check if ScanFilter is loaded
      if (typeof ScanFilter === 'undefined') {
        console.error('ScanFilter is not loaded. Make sure to include pixi-shader.js before the module.');
        return;
      }

      console.log('Initializing SlitScan effect...');

      // Renderer
      this.renderer = new PIXI.Renderer({
        width: this.width,
        height: this.height,
        backgroundColor: parseInt(this.background.replace("#", "0x")),
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        antialias: true,
      });

      this.container.appendChild(this.renderer.view);
      console.log('Renderer created and canvas added to container');

      // Stage
      this.stage = new PIXI.Container();

      // Load image
      console.log('Loading image:', this.imageUrl);
      console.log('Image absolute path:', new URL(this.imageUrl, window.location.href).href);
      
      try {
        const texture = await PIXI.Texture.fromURL(this.imageUrl);
        console.log('Texture loaded successfully:', texture);
        
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.width = this.width;
        this.sprite.height = this.height;
        console.log('Image loaded and sprite created with dimensions:', this.sprite.width, 'x', this.sprite.height);
      } catch (imageError) {
        console.error('Failed to load image:', imageError);
        console.error('Image URL:', this.imageUrl);
        // Create a fallback colored rectangle
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0x333333);
        graphics.drawRect(0, 0, this.width, this.height);
        graphics.endFill();
        this.sprite = graphics;
        console.log('Created fallback graphics instead of image');
      }

      // Shader
      this.filter = new ScanFilter();
      this.sprite.filters = [this.filter];
      console.log('Shader filter applied');

      this.stage.addChild(this.sprite);

      // Mouse + scroll
      this.mouse = { x: 0.5, y: 0.5 };
      this.scroll = { x: 0, y: 0 };

      if (this.mouseInteraction) {
        window.addEventListener("mousemove", this.onMouseMove.bind(this));
      }

      if (this.scrollInteraction) {
        window.addEventListener("scroll", this.onScroll.bind(this));
      }

      this.animate();
      console.log('SlitScan effect initialized successfully');
    } catch (error) {
      console.error('Error initializing SlitScan effect:', error);
    }
  }

  onMouseMove(e) {
    this.mouse.x = e.clientX / window.innerWidth;
    this.mouse.y = e.clientY / window.innerHeight;

    this.filter.uniforms.mouse = [this.mouse.x, this.mouse.y];
  }

  onScroll() {
    const y = window.scrollY || window.pageYOffset;
    const x = window.scrollX || window.pageXOffset;
    this.scroll.y = y / window.innerHeight;
    this.scroll.x = x / window.innerWidth;

    this.filter.uniforms.scroll = [this.scroll.x, this.scroll.y];
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.renderer.render(this.stage);
  }
}
