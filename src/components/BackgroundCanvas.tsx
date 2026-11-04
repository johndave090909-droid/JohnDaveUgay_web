import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FluidSimulation } from '../lib/fluid';
import { ImageParticles } from '../lib/imageParticles';

// Image (served from /public) that the particle cloud forms; transparent pixels are left empty
const PORTRAIT_URL = '/portrait.jpg';

// Phones: the camera pulls back until this much width fits on screen (the photo is ~4.3 wide at the figure's
// height), and the figure sits this fraction of the visible height above centre, clear of the content panel.
const MOBILE_FIT_WIDTH = 4.6;
const MOBILE_CENTER_LIFT = 0.16;

export const BackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Detect software WebGL to pace frames cleanly
    const isSoftwareGl = (() => {
      try {
        const testCanvas = document.createElement('canvas');
        const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setClearColor(0x000000, 1.0);
    const pixelRatio = isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const isMobile = window.innerWidth <= 760;

    // Camera setup: FOV 30, near 0.1, far 1000. Desktop: base pos (-1.17, 0, 6) looking at the origin.
    // Phones: straight on, further back so the whole photo fits, looking a little below the figure so it
    // appears in the upper part of the screen.
    const halfFov = Math.tan(THREE.MathUtils.degToRad(15));
    const aspect = window.innerWidth / window.innerHeight;
    const mobileZ = THREE.MathUtils.clamp(MOBILE_FIT_WIDTH / (2 * halfFov * aspect), 6, 26);
    const mobileLift = isMobile ? 2 * mobileZ * halfFov * MOBILE_CENTER_LIFT : 0;
    const lookTarget = new THREE.Vector3(0, -mobileLift, 0);
    const baseCameraPos = isMobile ? new THREE.Vector3(0, -mobileLift, mobileZ) : new THREE.Vector3(-1.17, 0, 6);
    const camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.copy(baseCameraPos);
    camera.lookAt(lookTarget);

    const scene = new THREE.Scene();

    const fluid = new FluidSimulation(renderer);
    const particles = new ImageParticles(renderer, isMobile, PORTRAIT_URL, {
      // Centred on phones (the desktop nudge makes room for the side columns), with dots scaled up to
      // compensate for the farther camera
      offsetX: isMobile ? 0 : undefined,
      pointScale: isMobile ? mobileZ / 6 : 1,
    });
    scene.add(particles.group);

    // Mouse tracking
    let mouseX = window.innerWidth * 0.5;
    let mouseY = window.innerHeight * 0.5;
    let prevMouseX = mouseX;
    let prevMouseY = mouseY;
    let hasMoved = false;

    const onPointerMove = (clientX: number, clientY: number) => {
      mouseX = clientX;
      mouseY = clientY;

      if (!hasMoved) {
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        hasMoved = true;
      }

      fluid.handlePointerMove(
        mouseX,
        mouseY,
        prevMouseX,
        prevMouseY,
        window.innerWidth,
        window.innerHeight,
        isMobile
      );

      prevMouseX = mouseX;
      prevMouseY = mouseY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      onPointerMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        onPointerMove(touch.clientX, touch.clientY);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        prevMouseX = touch.clientX;
        prevMouseY = touch.clientY;
        onPointerMove(touch.clientX, touch.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    // Window resize handler
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    let animationFrameId: number;
    let lastTime = performance.now();
    const startTime = performance.now();

    const targetPos = new THREE.Vector3();

    const tick = () => {
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const elapsedTime = (now - startTime) / 1000;

      // Gaze camera:
      // target = base + (mouse.x mapped 0..w -> -1..1) * (-1) on x and (mouse.y mapped 0..h -> -1..1) * 2 on y
      const normX = (mouseX / window.innerWidth) * 2 - 1;
      const normY = (mouseY / window.innerHeight) * 2 - 1;

      targetPos.set(
        baseCameraPos.x + normX * -1.0,
        baseCameraPos.y + normY * 2.0,
        baseCameraPos.z
      );

      // Camera lerps to it at 0.05 and looks at the origin
      camera.position.lerp(targetPos, 0.05);
      camera.lookAt(lookTarget);

      // Step fluid simulation
      fluid.step();

      // Step particle simulation
      particles.step(
        elapsedTime,
        delta,
        camera,
        fluid.velocityTexture,
        fluid.densityTexture
      );

      // Render main scene to screen
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('resize', handleResize);
      particles.dispose();
      fluid.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      id="bg"
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 block bg-black"
    />
  );
};
