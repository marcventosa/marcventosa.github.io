

// PIXI is global, so we use it directly
class ScanFilter extends PIXI.Filter {
  constructor() {
    super(
      undefined,
      `
      precision mediump float;
      varying vec2 vTextureCoord;
      uniform sampler2D uSampler;
      uniform vec2 resolution;
      uniform vec2 mouse;
      uniform vec2 scroll;
      uniform float time;
      uniform float scale;
      uniform vec2 offset;
      void main(void) {
          vec2 uv = vTextureCoord;
          float yOffset = sin((uv.x + time * 0.2) * 10.0) * 0.01 * scroll.y;
          float xWave = cos((uv.y + time * 0.1) * 5.0 + mouse.x * 5.0) * 0.01;
          uv.y += yOffset;
          uv.x += xWave;
          vec2 center = vec2(0.5, 0.5);
          uv = (uv - center) / scale + center + offset;
          gl_FragColor = texture2D(uSampler, uv);
      }
      `,
      {
        resolution: { type: 'v2', value: [1.0, 1.0] },
        mouse: { type: 'v2', value: [0.5, 0.5] },
        scroll: { type: 'v2', value: [0.0, 0.0] },
        time: 0,
        scale: 1.0,
        offset: { type: 'v2', value: [0.0, 0.0] },
      }
    );
  }
  apply(filterManager, input, output, clear) {
    this.uniforms.time += 0.016;
    filterManager.applyFilter(this, input, output, clear);
  }
}
window.ScanFilter = ScanFilter;
