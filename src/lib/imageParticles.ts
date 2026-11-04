import * as THREE from 'three';

// Look controls
const PORTRAIT_BRIGHTNESS = 1.15; // overall dot brightness
const PORTRAIT_MONO = 0.0; // 0 = the photo's own colours, 1 = glowing white/lavender dots
const POINT_SIZE = 1.6; // dot size in CSS pixels at the default camera distance
const PUSH_STRENGTH = 0.00004; // how far the cursor's wake scatters the dots

// Layout of the figure in world units (the visible height at the origin is ~3.2)
const SAMPLE_WIDTH = 640; // the image is resampled to this width before turning pixels into dots
const FIGURE_HEIGHT = 3.2;
const FIGURE_OFFSET_X = -0.2; // nudged left so it sits between the card list and the about column
const FIGURE_OFFSET_Y = 0.0;
const RELIEF_DEPTH = 0.35; // how much the figure bulges toward the camera
const EDGE_FADE = 0.15; // fraction of the image over which dots fade out where it meets its border
const DENSITY_FLOOR = 0.15; // dot density in black areas relative to white (brighter = more dots)

const simVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const simFragmentShader = `
  precision highp float;
  uniform sampler2D uCurrentPosition;
  uniform sampler2D uOrigin;
  uniform sampler2D uFluidVelocity;
  uniform sampler2D uFluidDensity;
  uniform float uTime;
  uniform float uHZ;
  uniform float uPush;
  uniform vec2 uRippleCenter;
  uniform mat4 uModelMatrix;
  uniform mat4 uViewProjectionMatrix;
  uniform mat4 uCameraWorldMatrix;
  varying vec2 vUv;

  // Analytic curl of three sine-sum potentials (Bridson-style)
  vec3 curlNoise(vec3 p) {
    float dpsi3_dy = 1.1 * cos(1.6 * p.x + 1.1 * p.y) + 0.8 * cos(3.2 * p.x + 1.6 * p.y);
    float dpsi2_dz = 1.5 * cos(1.5 * p.z + 0.9 * p.x) + 1.5 * cos(3.0 * p.z + 1.4 * p.x);
    float curlX = dpsi3_dy - dpsi2_dz;

    float dpsi1_dz = 0.8 * cos(1.4 * p.y + 0.8 * p.z) + 0.6 * cos(2.8 * p.y + 1.2 * p.z);
    float dpsi3_dx = 1.6 * cos(1.6 * p.x + 1.1 * p.y) + 1.6 * cos(3.2 * p.x + 1.6 * p.y);
    float curlY = dpsi1_dz - dpsi3_dx;

    float dpsi2_dx = 0.9 * cos(1.5 * p.z + 0.9 * p.x) + 0.7 * cos(3.0 * p.z + 1.4 * p.x);
    float dpsi1_dy = 1.4 * cos(1.4 * p.y + 0.8 * p.z) + 1.4 * cos(2.8 * p.y + 1.2 * p.z);
    float curlZ = dpsi2_dx - dpsi1_dy;

    return normalize(vec3(curlX, curlY, curlZ) + 1e-6);
  }

  // Idle motion: rings spreading out from the chest plus a slow swell climbing the body
  vec3 ripple(vec3 o, float t) {
    vec2 d = o.xy - uRippleCenter;
    float r = length(d);
    float rings = sin(r * 10.0 - t * 2.4) * (0.6 + 0.4 * sin(t * 0.5));
    float swell = sin(o.y * 3.0 - t * 1.2 + sin(o.x * 2.5 + t * 0.6) * 0.8);
    vec2 dir = d / max(r, 1e-4);
    return vec3(dir * rings * 0.01, rings * 0.05 + swell * 0.04);
  }

  void main() {
    vec3 pos = texture2D(uCurrentPosition, vUv).xyz;
    vec3 origin = texture2D(uOrigin, vUv).xyz;
    vec3 target = origin + ripple(origin, uTime);

    // Fine shimmer so the dots never sit perfectly still
    pos += curlNoise(pos * 4.0 + uTime * 0.3) * 0.0008 * uHZ;

    // Spring back toward the rippling image position
    pos += (target - pos) * (1.0 - pow(0.94, uHZ));

    // Mouse fluid interaction: the cursor's wake scatters the dots
    vec4 clipPos = uViewProjectionMatrix * uModelMatrix * vec4(pos, 1.0);
    vec2 screenUV = (clipPos.xy / clipPos.w) * 0.5 + 0.5;

    if (screenUV.x >= 0.0 && screenUV.x <= 1.0 && screenUV.y >= 0.0 && screenUV.y <= 1.0) {
      vec2 fluidVel = texture2D(uFluidVelocity, screenUV).xy;
      float fluidDens = texture2D(uFluidDensity, screenUV).r;

      vec3 flow = mat3(uCameraWorldMatrix) * vec3(fluidVel, 0.0);
      pos += flow * uPush * uHZ * fluidDens;
    }

    gl_FragColor = vec4(pos, 1.0);
  }
`;

const renderVertexShader = `
  uniform sampler2D uPositionTexture;
  uniform sampler2D uOrigin;
  uniform float uDPR;
  uniform float uPointSize;
  attribute vec3 aColor;
  attribute vec4 aRandom;

  varying vec3 vColor;
  varying vec4 vRandom;
  varying float vCrest;
  varying float vScatter;

  void main() {
    vec3 pos = texture2D(uPositionTexture, position.xy).xyz;
    vec3 offset = pos - texture2D(uOrigin, position.xy).xyz;

    vColor = aColor;
    vRandom = aRandom;
    vCrest = clamp(offset.z / 0.09, -1.0, 1.0);
    vScatter = smoothstep(0.04, 0.35, length(offset.xy));

    vec4 viewPosition = modelViewMatrix * vec4(pos, 1.0);
    float distToCamera = max(-viewPosition.z, 0.1);
    gl_PointSize = uPointSize * uDPR * mix(0.7, 1.3, aRandom.z) * (6.0 / distToCamera);
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const renderFragmentShader = `
  precision highp float;
  uniform float uTime;
  uniform float uBrightness;
  uniform float uMono;

  varying vec3 vColor;
  varying vec4 vRandom;
  varying float vCrest;
  varying float vScatter;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    if (length(coord) > 0.5) discard;

    vec3 lavender = vec3(0.6, 0.45, 1.0);
    float lum = dot(vColor, vec3(0.299, 0.587, 0.114));
    vec3 mono = mix(vec3(1.0), lavender, 0.3) * lum * 1.4;
    vec3 color = mix(vColor, mono, uMono) * uBrightness;

    // Ripple crests catch the light
    color *= 1.0 + 0.35 * vCrest;

    // A few dots twinkle, like the original particle cloud
    float twinkle = pow(vRandom.y, 40.0) * (0.5 + 0.5 * sin(uTime * 4.0 + vRandom.x * 20.0));
    color *= 1.0 + twinkle * 1.5;

    // Dots knocked loose by the cursor flare up in their own colour
    color = mix(color, min(color * 2.2 + 0.08, vec3(1.0)), vScatter * 0.8);

    gl_FragColor = vec4(color, 1.0);
  }
`;

interface PortraitSample {
  origins: Float32Array;
  starts: Float32Array;
  colors: Float32Array;
  rippleCenter: THREE.Vector2;
}

// Separable running-sum box blur with clamped edges
function boxBlur(src: Float32Array, w: number, h: number, radius: number): Float32Array {
  const tmp = new Float32Array(w * h);
  const out = new Float32Array(w * h);
  const norm = 1 / (radius * 2 + 1);

  for (let y = 0; y < h; y++) {
    const row = y * w;
    let sum = 0;
    for (let x = -radius; x <= radius; x++) sum += src[row + Math.min(Math.max(x, 0), w - 1)];
    for (let x = 0; x < w; x++) {
      tmp[row + x] = sum * norm;
      sum += src[row + Math.min(x + radius + 1, w - 1)] - src[row + Math.max(x - radius, 0)];
    }
  }

  for (let x = 0; x < w; x++) {
    let sum = 0;
    for (let y = -radius; y <= radius; y++) sum += tmp[Math.min(Math.max(y, 0), h - 1) * w + x];
    for (let y = 0; y < h; y++) {
      out[y * w + x] = sum * norm;
      sum += tmp[Math.min(y + radius + 1, h - 1) * w + x] - tmp[Math.max(y - radius, 0) * w + x];
    }
  }

  return out;
}

// Turns the image's opaque pixels into dot positions and colours
function samplePortrait(image: HTMLImageElement, count: number, offsetX: number): PortraitSample | null {
  const w = SAMPLE_WIDTH;
  const h = Math.max(1, Math.round((SAMPLE_WIDTH * image.naturalHeight) / image.naturalWidth));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(image, 0, 0, w, h);
  const pixels = ctx.getImageData(0, 0, w, h).data;

  // Opaque pixels make up the figure; transparent ones are skipped
  const mask = new Float32Array(w * h);
  const opaque: number[] = [];
  let minX = w;
  let maxX = 0;
  let minY = h;
  let maxY = 0;
  for (let i = 0; i < w * h; i++) {
    if (pixels[i * 4 + 3] < 128) continue;
    mask[i] = 1;
    opaque.push(i);
    const x = i % w;
    const y = (i / w) | 0;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  if (opaque.length === 0) return null;

  // A blurred silhouette doubles as a cheap depth map: the middle of the body bulges forward
  const blurRadius = Math.max(1, Math.round(w / 20));
  const relief = boxBlur(boxBlur(mask, w, h, blurRadius), w, h, blurRadius);
  let maxRelief = 1e-6;
  for (const p of opaque) maxRelief = Math.max(maxRelief, relief[p]);

  const figureHeightPx = maxY - minY + 1;
  const scale = FIGURE_HEIGHT / figureHeightPx;
  const centerX = (minX + maxX + 1) / 2;
  const centerY = (minY + maxY + 1) / 2;
  const toWorldX = (px: number) => (px - centerX) * scale + offsetX;
  const toWorldY = (py: number) => -(py - centerY) * scale + FIGURE_OFFSET_Y;

  // Where the figure runs into the image border (every side, for a photo without transparency),
  // the dots fade out instead of ending in a hard line
  const edgeFade = (x: number, y: number) => {
    let fade = 1;
    if (minX <= 1) fade *= THREE.MathUtils.smoothstep(x / w, 0, EDGE_FADE);
    if (maxX >= w - 2) fade *= THREE.MathUtils.smoothstep((w - x) / w, 0, EDGE_FADE);
    if (minY <= 1) fade *= THREE.MathUtils.smoothstep(y / h, 0, EDGE_FADE);
    if (maxY >= h - 2) fade *= THREE.MathUtils.smoothstep((h - y) / h, 0, EDGE_FADE);
    return fade;
  };
  const luminance = (p: number) =>
    (0.299 * pixels[p * 4] + 0.587 * pixels[p * 4 + 1] + 0.114 * pixels[p * 4 + 2]) / 255;

  // Brighter pixels get more dots, so the photo reads as a stipple of light
  const cdf = new Float64Array(opaque.length);
  let totalWeight = 0;
  for (let k = 0; k < opaque.length; k++) {
    const p = opaque[k];
    const density = DENSITY_FLOOR + (1 - DENSITY_FLOOR) * luminance(p);
    totalWeight += density * edgeFade((p % w) + 0.5, ((p / w) | 0) + 0.5);
    cdf[k] = totalWeight;
  }
  const pickPixel = () => {
    const target = Math.random() * totalWeight;
    let lo = 0;
    let hi = cdf.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cdf[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    return opaque[lo];
  };

  const origins = new Float32Array(count * 4);
  const starts = new Float32Array(count * 4);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const p = pickPixel();
    const px = (p % w) + Math.random();
    const py = ((p / w) | 0) + Math.random();

    const r = pixels[p * 4] / 255;
    const g = pixels[p * 4 + 1] / 255;
    const b = pixels[p * 4 + 2] / 255;
    const lum = luminance(p);
    const fade = edgeFade(px, py);

    const x = toWorldX(px);
    const y = toWorldY(py);
    const z = Math.sqrt(relief[p] / maxRelief) * RELIEF_DEPTH + lum * 0.05 + (Math.random() - 0.5) * 0.03;

    origins[i * 4] = x;
    origins[i * 4 + 1] = y;
    origins[i * 4 + 2] = z;
    origins[i * 4 + 3] = 1.0;

    // Start scattered so the portrait assembles itself on load
    starts[i * 4] = x + (Math.random() - 0.5) * 3.0;
    starts[i * 4 + 1] = y + (Math.random() - 0.5) * 3.0;
    starts[i * 4 + 2] = z + (Math.random() - 0.5) * 2.0;
    starts[i * 4 + 3] = 1.0;

    colors[i * 3] = r * fade;
    colors[i * 3 + 1] = g * fade;
    colors[i * 3 + 2] = b * fade;
  }

  return {
    origins,
    starts,
    colors,
    rippleCenter: new THREE.Vector2(offsetX, toWorldY(minY + figureHeightPx * 0.35)),
  };
}

export class ImageParticles {
  public group: THREE.Group;
  public simDim: number;
  public totalPoints: number;

  private renderer: THREE.WebGLRenderer;
  private simTargetA: THREE.WebGLRenderTarget;
  private simTargetB: THREE.WebGLRenderTarget;
  private currentReadTarget: THREE.WebGLRenderTarget;
  private currentWriteTarget: THREE.WebGLRenderTarget;

  private originTexture: THREE.DataTexture | null = null;
  private simScene: THREE.Scene;
  private simCamera: THREE.Camera;
  private simQuad: THREE.Mesh;
  private simMaterial: THREE.ShaderMaterial;

  private pointsMesh: THREE.Points | null = null;
  private renderMaterial: THREE.ShaderMaterial;

  private viewProjMatrix = new THREE.Matrix4();
  private ready = false;
  private disposed = false;
  private offsetX: number;

  constructor(
    renderer: THREE.WebGLRenderer,
    isMobile: boolean,
    imageUrl: string,
    options: { offsetX?: number; pointScale?: number } = {}
  ) {
    this.renderer = renderer;
    this.offsetX = options.offsetX ?? FIGURE_OFFSET_X;
    // ~262k dots on desktop (512x512), ~65k on mobile (256x256)
    this.simDim = isMobile ? 256 : 512;
    this.totalPoints = this.simDim * this.simDim;

    // Full float keeps the small per-frame ripple steps smooth; half float is the fallback
    const targetType = renderer.extensions.has('EXT_color_buffer_float')
      ? THREE.FloatType
      : THREE.HalfFloatType;
    const rtOptions: THREE.RenderTargetOptions = {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: targetType,
      depthBuffer: false,
      stencilBuffer: false,
    };

    this.simTargetA = new THREE.WebGLRenderTarget(this.simDim, this.simDim, rtOptions);
    this.simTargetB = new THREE.WebGLRenderTarget(this.simDim, this.simDim, rtOptions);
    this.currentReadTarget = this.simTargetA;
    this.currentWriteTarget = this.simTargetB;

    this.simScene = new THREE.Scene();
    this.simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.simMaterial = new THREE.ShaderMaterial({
      vertexShader: simVertexShader,
      fragmentShader: simFragmentShader,
      uniforms: {
        uCurrentPosition: { value: null },
        uOrigin: { value: null },
        uFluidVelocity: { value: null },
        uFluidDensity: { value: null },
        uTime: { value: 0 },
        uHZ: { value: 1.0 },
        uPush: { value: PUSH_STRENGTH },
        uRippleCenter: { value: new THREE.Vector2() },
        uModelMatrix: { value: new THREE.Matrix4() },
        uViewProjectionMatrix: { value: new THREE.Matrix4() },
        uCameraWorldMatrix: { value: new THREE.Matrix4() },
      },
      depthTest: false,
      depthWrite: false,
    });
    this.simQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.simMaterial);
    this.simScene.add(this.simQuad);

    this.renderMaterial = new THREE.ShaderMaterial({
      vertexShader: renderVertexShader,
      fragmentShader: renderFragmentShader,
      uniforms: {
        uPositionTexture: { value: null },
        uOrigin: { value: null },
        uDPR: { value: renderer.getPixelRatio() },
        uPointSize: { value: POINT_SIZE * (options.pointScale ?? 1) },
        uTime: { value: 0 },
        uBrightness: { value: PORTRAIT_BRIGHTNESS },
        uMono: { value: PORTRAIT_MONO },
      },
    });

    this.group = new THREE.Group();

    const image = new Image();
    image.onload = () => {
      if (!this.disposed) this.build(image);
    };
    image.onerror = () => console.warn(`[ImageParticles] Could not load ${imageUrl}`);
    image.src = imageUrl;
  }

  private build(image: HTMLImageElement) {
    const sample = samplePortrait(image, this.totalPoints, this.offsetX);
    if (!sample) {
      console.warn('[ImageParticles] Image has no opaque pixels to turn into dots');
      return;
    }

    this.originTexture = new THREE.DataTexture(
      sample.origins,
      this.simDim,
      this.simDim,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    this.originTexture.needsUpdate = true;

    // Seed both ping-pong targets with the scattered start positions
    const startTexture = new THREE.DataTexture(
      sample.starts,
      this.simDim,
      this.simDim,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    startTexture.needsUpdate = true;
    const initMaterial = new THREE.ShaderMaterial({
      vertexShader: simVertexShader,
      fragmentShader: `
        uniform sampler2D uTex;
        varying vec2 vUv;
        void main() {
          gl_FragColor = texture2D(uTex, vUv);
        }
      `,
      uniforms: {
        uTex: { value: startTexture },
      },
      depthTest: false,
      depthWrite: false,
    });
    this.simQuad.material = initMaterial;
    this.renderer.setRenderTarget(this.simTargetA);
    this.renderer.render(this.simScene, this.simCamera);
    this.renderer.setRenderTarget(this.simTargetB);
    this.renderer.render(this.simScene, this.simCamera);
    this.renderer.setRenderTarget(null);
    this.simQuad.material = this.simMaterial;
    initMaterial.dispose();
    startTexture.dispose();

    this.simMaterial.uniforms.uOrigin.value = this.originTexture;
    this.simMaterial.uniforms.uRippleCenter.value.copy(sample.rippleCenter);
    this.renderMaterial.uniforms.uOrigin.value = this.originTexture;
    this.renderMaterial.uniforms.uPositionTexture.value = this.currentReadTarget.texture;

    // Build points geometry: position.xy is the dot's texel in the simulation texture
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.totalPoints * 3);
    const randoms = new Float32Array(this.totalPoints * 4);

    let pIdx = 0;
    let rIdx = 0;
    for (let y = 0; y < this.simDim; y++) {
      for (let x = 0; x < this.simDim; x++) {
        positions[pIdx] = (x + 0.5) / this.simDim;
        positions[pIdx + 1] = (y + 0.5) / this.simDim;
        positions[pIdx + 2] = 0.0;
        pIdx += 3;

        randoms[rIdx] = Math.random();
        randoms[rIdx + 1] = Math.random();
        randoms[rIdx + 2] = Math.random();
        randoms[rIdx + 3] = Math.random();
        rIdx += 4;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(sample.colors, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 4));

    this.pointsMesh = new THREE.Points(geometry, this.renderMaterial);
    this.pointsMesh.frustumCulled = false;
    this.group.add(this.pointsMesh);
    this.ready = true;
  }

  public step(
    time: number,
    delta: number,
    camera: THREE.Camera,
    fluidVel: THREE.Texture,
    fluidDens: THREE.Texture
  ) {
    if (!this.ready) return;

    const hz = Math.max(0.1, Math.min(3.0, delta * 60.0));

    this.group.updateMatrixWorld(true);
    this.viewProjMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);

    // Set uniforms for simulation pass
    this.simMaterial.uniforms.uCurrentPosition.value = this.currentReadTarget.texture;
    this.simMaterial.uniforms.uFluidVelocity.value = fluidVel;
    this.simMaterial.uniforms.uFluidDensity.value = fluidDens;
    this.simMaterial.uniforms.uTime.value = time;
    this.simMaterial.uniforms.uHZ.value = hz;
    this.simMaterial.uniforms.uModelMatrix.value.copy(this.group.matrixWorld);
    this.simMaterial.uniforms.uViewProjectionMatrix.value.copy(this.viewProjMatrix);
    this.simMaterial.uniforms.uCameraWorldMatrix.value.copy(camera.matrixWorld);

    // Run simulation pass
    this.renderer.setRenderTarget(this.currentWriteTarget);
    this.renderer.render(this.simScene, this.simCamera);
    this.renderer.setRenderTarget(null);

    // Swap ping-pong targets
    const temp = this.currentReadTarget;
    this.currentReadTarget = this.currentWriteTarget;
    this.currentWriteTarget = temp;

    // Feed updated position texture to particle render material
    this.renderMaterial.uniforms.uPositionTexture.value = this.currentReadTarget.texture;
    this.renderMaterial.uniforms.uTime.value = time;
    this.renderMaterial.uniforms.uDPR.value = this.renderer.getPixelRatio();
  }

  public dispose() {
    this.disposed = true;
    this.simTargetA.dispose();
    this.simTargetB.dispose();
    this.originTexture?.dispose();
    this.simMaterial.dispose();
    this.renderMaterial.dispose();
    this.pointsMesh?.geometry.dispose();
    this.simQuad.geometry.dispose();
  }
}
