import * as THREE from 'three';

export interface FluidSimulationConfig {
  simRes?: number;       // default 256
  dyeRes?: number;       // default 512
  velDissipation?: number; // default 0.98
  densityDissipation?: number; // default 0.97
  pressureDissipation?: number; // default 0.95
  pressureIterations?: number; // default 5
  curl?: number;         // default 30
  dt?: number;           // default 1/60
}

interface DoubleRenderTarget {
  read: THREE.WebGLRenderTarget;
  write: THREE.WebGLRenderTarget;
  swap: () => void;
}

function createDoubleRenderTarget(
  width: number,
  height: number,
  type: THREE.TextureDataType
): DoubleRenderTarget {
  const options: THREE.RenderTargetOptions = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
    format: THREE.RGBAFormat,
    type,
    depthBuffer: false,
    stencilBuffer: false,
  };

  let read = new THREE.WebGLRenderTarget(width, height, options);
  let write = new THREE.WebGLRenderTarget(width, height, options);

  return {
    get read() {
      return read;
    },
    get write() {
      return write;
    },
    swap() {
      const tmp = read;
      read = write;
      write = tmp;
    },
  };
}

const baseVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const splatShader = `
  precision highp float;
  uniform sampler2D uTarget;
  uniform float uAspectRatio;
  uniform vec4 uColor;
  uniform vec2 uPoint;
  uniform vec2 uPrevPoint;
  uniform float uRadius;
  varying vec2 vUv;

  float distToSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
    return length(pa - ba * h);
  }

  void main() {
    vec2 p = vUv;
    p.x *= uAspectRatio;
    vec2 a = uPrevPoint;
    a.x *= uAspectRatio;
    vec2 b = uPoint;
    b.x *= uAspectRatio;

    float d = distToSegment(p, a, b);
    float splat = exp(- (d * d) / max(uRadius * uRadius, 1e-6));
    vec4 base = texture2D(uTarget, vUv);
    gl_FragColor = base + uColor * splat;
  }
`;

const curlShader = `
  precision highp float;
  uniform sampler2D uVelocity;
  uniform vec2 uTexelSize;
  varying vec2 vUv;

  void main() {
    float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).y;
    float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).y;
    float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).x;
    float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).x;
    float vorticity = 0.5 * ((R - L) - (T - B));
    gl_FragColor = vec4(vorticity, 0.0, 0.0, 1.0);
  }
`;

const vorticityShader = `
  precision highp float;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float uCurlValue;
  uniform float uDt;
  uniform vec2 uTexelSize;
  varying vec2 vUv;

  void main() {
    float L = texture2D(uCurl, vUv - vec2(uTexelSize.x, 0.0)).x;
    float R = texture2D(uCurl, vUv + vec2(uTexelSize.x, 0.0)).x;
    float B = texture2D(uCurl, vUv - vec2(0.0, uTexelSize.y)).x;
    float T = texture2D(uCurl, vUv + vec2(0.0, uTexelSize.y)).x;
    float C = texture2D(uCurl, vUv).x;

    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= (length(force) + 1e-5);
    force *= uCurlValue * C * vec2(1.0, -1.0);

    vec2 vel = texture2D(uVelocity, vUv).xy;
    vel += force * uDt;
    gl_FragColor = vec4(vel, 0.0, 1.0);
  }
`;

const divergenceShader = `
  precision highp float;
  uniform sampler2D uVelocity;
  uniform vec2 uTexelSize;
  varying vec2 vUv;

  void main() {
    float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).x;
    float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).x;
    float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).y;
    float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).y;
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

const pressureShader = `
  precision highp float;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  uniform vec2 uTexelSize;
  varying vec2 vUv;

  void main() {
    float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
    float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
    float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
    float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
    float div = texture2D(uDivergence, vUv).x;
    float p = (L + R + B + T - div) * 0.25;
    gl_FragColor = vec4(p, 0.0, 0.0, 1.0);
  }
`;

const gradientSubtractShader = `
  precision highp float;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  uniform vec2 uTexelSize;
  varying vec2 vUv;

  void main() {
    float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
    float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
    float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
    float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
    vec2 vel = texture2D(uVelocity, vUv).xy;
    vel -= 0.5 * vec2(R - L, T - B);
    gl_FragColor = vec4(vel, 0.0, 1.0);
  }
`;

const advectionShader = `
  precision highp float;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 uTexelSize;
  uniform float uDt;
  uniform float uDissipation;
  varying vec2 vUv;

  void main() {
    vec2 coord = vUv - uDt * texture2D(uVelocity, vUv).xy * uTexelSize;
    gl_FragColor = uDissipation * texture2D(uSource, coord);
  }
`;

export class FluidSimulation {
  public renderer: THREE.WebGLRenderer;
  public simRes: number;
  public dyeRes: number;
  public velDissipation: number;
  public densityDissipation: number;
  public pressureDissipation: number;
  public pressureIterations: number;
  public curl: number;
  public dt: number;

  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private quad: THREE.Mesh;

  private velocityTarget: DoubleRenderTarget;
  private densityTarget: DoubleRenderTarget;
  private pressureTarget: DoubleRenderTarget;
  private curlTarget: THREE.WebGLRenderTarget;
  private divergenceTarget: THREE.WebGLRenderTarget;

  // Materials
  private splatMaterial: THREE.ShaderMaterial;
  private curlMaterial: THREE.ShaderMaterial;
  private vorticityMaterial: THREE.ShaderMaterial;
  private divergenceMaterial: THREE.ShaderMaterial;
  private pressureMaterial: THREE.ShaderMaterial;
  private gradSubMaterial: THREE.ShaderMaterial;
  private advectionMaterial: THREE.ShaderMaterial;

  private lastSplatTime = 0;
  private prevCursor = new THREE.Vector2(-1, -1);

  constructor(renderer: THREE.WebGLRenderer, config: FluidSimulationConfig = {}) {
    this.renderer = renderer;
    this.simRes = config.simRes ?? 256;
    this.dyeRes = config.dyeRes ?? 512;
    this.velDissipation = config.velDissipation ?? 0.98;
    this.densityDissipation = config.densityDissipation ?? 0.97;
    this.pressureDissipation = config.pressureDissipation ?? 0.95;
    this.pressureIterations = config.pressureIterations ?? 5;
    this.curl = config.curl ?? 30.0;
    this.dt = config.dt ?? (1.0 / 60.0);

    const targetType = THREE.HalfFloatType;

    this.velocityTarget = createDoubleRenderTarget(this.simRes, this.simRes, targetType);
    this.densityTarget = createDoubleRenderTarget(this.dyeRes, this.dyeRes, targetType);
    this.pressureTarget = createDoubleRenderTarget(this.simRes, this.simRes, targetType);

    this.curlTarget = new THREE.WebGLRenderTarget(this.simRes, this.simRes, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: targetType,
      depthBuffer: false,
    });

    this.divergenceTarget = new THREE.WebGLRenderTarget(this.simRes, this.simRes, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: targetType,
      depthBuffer: false,
    });

    // Helper scene & camera for render passes
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geom = new THREE.PlaneGeometry(2, 2);

    this.splatMaterial = new THREE.ShaderMaterial({
      vertexShader: baseVertex,
      fragmentShader: splatShader,
      uniforms: {
        uTarget: { value: null },
        uAspectRatio: { value: 1.0 },
        uColor: { value: new THREE.Vector4() },
        uPoint: { value: new THREE.Vector2() },
        uPrevPoint: { value: new THREE.Vector2() },
        uRadius: { value: 0.05 },
      },
      depthTest: false,
      depthWrite: false,
    });

    this.curlMaterial = new THREE.ShaderMaterial({
      vertexShader: baseVertex,
      fragmentShader: curlShader,
      uniforms: {
        uVelocity: { value: null },
        uTexelSize: { value: new THREE.Vector2(1.0 / this.simRes, 1.0 / this.simRes) },
      },
      depthTest: false,
      depthWrite: false,
    });

    this.vorticityMaterial = new THREE.ShaderMaterial({
      vertexShader: baseVertex,
      fragmentShader: vorticityShader,
      uniforms: {
        uVelocity: { value: null },
        uCurl: { value: null },
        uCurlValue: { value: this.curl },
        uDt: { value: this.dt },
        uTexelSize: { value: new THREE.Vector2(1.0 / this.simRes, 1.0 / this.simRes) },
      },
      depthTest: false,
      depthWrite: false,
    });

    this.divergenceMaterial = new THREE.ShaderMaterial({
      vertexShader: baseVertex,
      fragmentShader: divergenceShader,
      uniforms: {
        uVelocity: { value: null },
        uTexelSize: { value: new THREE.Vector2(1.0 / this.simRes, 1.0 / this.simRes) },
      },
      depthTest: false,
      depthWrite: false,
    });

    this.pressureMaterial = new THREE.ShaderMaterial({
      vertexShader: baseVertex,
      fragmentShader: pressureShader,
      uniforms: {
        uPressure: { value: null },
        uDivergence: { value: null },
        uTexelSize: { value: new THREE.Vector2(1.0 / this.simRes, 1.0 / this.simRes) },
      },
      depthTest: false,
      depthWrite: false,
    });

    this.gradSubMaterial = new THREE.ShaderMaterial({
      vertexShader: baseVertex,
      fragmentShader: gradientSubtractShader,
      uniforms: {
        uPressure: { value: null },
        uVelocity: { value: null },
        uTexelSize: { value: new THREE.Vector2(1.0 / this.simRes, 1.0 / this.simRes) },
      },
      depthTest: false,
      depthWrite: false,
    });

    this.advectionMaterial = new THREE.ShaderMaterial({
      vertexShader: baseVertex,
      fragmentShader: advectionShader,
      uniforms: {
        uVelocity: { value: null },
        uSource: { value: null },
        uTexelSize: { value: new THREE.Vector2() },
        uDt: { value: this.dt },
        uDissipation: { value: 1.0 },
      },
      depthTest: false,
      depthWrite: false,
    });

    this.quad = new THREE.Mesh(geom, this.splatMaterial);
    this.scene.add(this.quad);
  }

  public get velocityTexture(): THREE.Texture {
    return this.velocityTarget.read.texture;
  }

  public get densityTexture(): THREE.Texture {
    return this.densityTarget.read.texture;
  }

  private renderPass(target: THREE.WebGLRenderTarget, material: THREE.ShaderMaterial) {
    this.quad.material = material;
    this.renderer.setRenderTarget(target);
    this.renderer.render(this.scene, this.camera);
  }

  public splat(
    point: THREE.Vector2,
    prevPoint: THREE.Vector2,
    color: THREE.Vector4,
    radius: number,
    aspect: number,
    target: DoubleRenderTarget
  ) {
    this.splatMaterial.uniforms.uTarget.value = target.read.texture;
    this.splatMaterial.uniforms.uAspectRatio.value = aspect;
    this.splatMaterial.uniforms.uColor.value.copy(color);
    this.splatMaterial.uniforms.uPoint.value.copy(point);
    this.splatMaterial.uniforms.uPrevPoint.value.copy(prevPoint);
    this.splatMaterial.uniforms.uRadius.value = radius;

    this.renderPass(target.write, this.splatMaterial);
    target.swap();
  }

  public handlePointerMove(
    cursorX: number,
    cursorY: number,
    prevX: number,
    prevY: number,
    viewWidth: number,
    viewHeight: number,
    isMobile: boolean
  ) {
    const dx = cursorX - prevX;
    const dy = cursorY - prevY;
    const len = Math.hypot(dx, dy);

    if (len <= 0.01) return;

    const now = performance.now();
    const timeSinceLast = now - this.lastSplatTime;
    this.lastSplatTime = now;

    // UV coordinates (0..1, Y inverted for WebGL)
    const currUV = new THREE.Vector2(cursorX / viewWidth, 1.0 - cursorY / viewHeight);
    let prevUV: THREE.Vector2;

    if (timeSinceLast > 50 || this.prevCursor.x < 0) {
      prevUV = currUV.clone();
    } else {
      prevUV = new THREE.Vector2(prevX / viewWidth, 1.0 - prevY / viewHeight);
    }
    this.prevCursor.set(cursorX, cursorY);

    // clamp-map(len, 0..5 -> 0..60) * 0.6 (* 0.8 on mobile)
    const normalizedLen5 = Math.min(Math.max(len / 5.0, 0.0), 1.0);
    const baseRadius = normalizedLen5 * 60.0;
    const splatRadiusPx = baseRadius * 0.6 * (isMobile ? 0.8 : 1.0);
    // radius / 200 in UV units
    const splatRadiusUV = Math.max(0.005, splatRadiusPx / 200.0);

    // force multiplier = clamp-map(len, 0..15 -> 0..10)
    const mult = Math.min(Math.max(len / 15.0, 0.0), 1.0) * 10.0;

    const aspect = viewWidth / viewHeight;

    // Splat velocity: (dx * mult, -dy * mult, 1)
    const velColor = new THREE.Vector4(dx * mult, -dy * mult, 1.0, 0.0);
    this.splat(currUV, prevUV, velColor, splatRadiusUV, aspect, this.velocityTarget);

    // Splat density: white (1, 1, 1, 1)
    const densityColor = new THREE.Vector4(1.0, 1.0, 1.0, 1.0);
    this.splat(currUV, prevUV, densityColor, splatRadiusUV, aspect, this.densityTarget);
  }

  public step() {
    const currentRenderTarget = this.renderer.getRenderTarget();

    // 1. Curl pass
    this.curlMaterial.uniforms.uVelocity.value = this.velocityTarget.read.texture;
    this.renderPass(this.curlTarget, this.curlMaterial);

    // 2. Vorticity confinement pass
    this.vorticityMaterial.uniforms.uVelocity.value = this.velocityTarget.read.texture;
    this.vorticityMaterial.uniforms.uCurl.value = this.curlTarget.texture;
    this.renderPass(this.velocityTarget.write, this.vorticityMaterial);
    this.velocityTarget.swap();

    // 3. Divergence pass
    this.divergenceMaterial.uniforms.uVelocity.value = this.velocityTarget.read.texture;
    this.renderPass(this.divergenceTarget, this.divergenceMaterial);

    // 4. Pressure Jacobi solve (5 iterations)
    // Clear pressure or decay with dissipation
    for (let i = 0; i < this.pressureIterations; i++) {
      this.pressureMaterial.uniforms.uPressure.value = this.pressureTarget.read.texture;
      this.pressureMaterial.uniforms.uDivergence.value = this.divergenceTarget.texture;
      this.renderPass(this.pressureTarget.write, this.pressureMaterial);
      this.pressureTarget.swap();
    }

    // 5. Gradient subtract pass
    this.gradSubMaterial.uniforms.uPressure.value = this.pressureTarget.read.texture;
    this.gradSubMaterial.uniforms.uVelocity.value = this.velocityTarget.read.texture;
    this.renderPass(this.velocityTarget.write, this.gradSubMaterial);
    this.velocityTarget.swap();

    // 6. Advect velocity
    this.advectionMaterial.uniforms.uVelocity.value = this.velocityTarget.read.texture;
    this.advectionMaterial.uniforms.uSource.value = this.velocityTarget.read.texture;
    this.advectionMaterial.uniforms.uTexelSize.value.set(1.0 / this.simRes, 1.0 / this.simRes);
    this.advectionMaterial.uniforms.uDissipation.value = this.velDissipation;
    this.renderPass(this.velocityTarget.write, this.advectionMaterial);
    this.velocityTarget.swap();

    // 7. Advect density
    this.advectionMaterial.uniforms.uVelocity.value = this.velocityTarget.read.texture;
    this.advectionMaterial.uniforms.uSource.value = this.densityTarget.read.texture;
    this.advectionMaterial.uniforms.uTexelSize.value.set(1.0 / this.dyeRes, 1.0 / this.dyeRes);
    this.advectionMaterial.uniforms.uDissipation.value = this.densityDissipation;
    this.renderPass(this.densityTarget.write, this.advectionMaterial);
    this.densityTarget.swap();

    // Restore render target
    this.renderer.setRenderTarget(currentRenderTarget);
  }

  public dispose() {
    this.velocityTarget.read.dispose();
    this.velocityTarget.write.dispose();
    this.densityTarget.read.dispose();
    this.densityTarget.write.dispose();
    this.pressureTarget.read.dispose();
    this.pressureTarget.write.dispose();
    this.curlTarget.dispose();
    this.divergenceTarget.dispose();
    this.splatMaterial.dispose();
    this.curlMaterial.dispose();
    this.vorticityMaterial.dispose();
    this.divergenceMaterial.dispose();
    this.pressureMaterial.dispose();
    this.gradSubMaterial.dispose();
    this.advectionMaterial.dispose();
    this.quad.geometry.dispose();
  }
}
