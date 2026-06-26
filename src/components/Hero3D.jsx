import { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * Hero3D
 * Vanilla Three.js torus knot rendered on a plain <canvas>.
 * Avoids R3F (which has React 19 compatibility issues in v9).
 *
 * Props:
 *  - mouseRef — shared ref { x: number, y: number } in [-1, 1] range
 *  - isMobile — boolean, reduces scale on small screens
 */
export default function Hero3D({ mouseRef, isMobile = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.setClearColor(0x000000, 0); // transparent background

    // ── Scene & Camera ──────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 5;

    // ── Lights ──────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Purple accent light — left
    const purpleLight = new THREE.PointLight(0x9b5de5, 80, 20);
    purpleLight.position.set(-4, 2, 3);
    scene.add(purpleLight);

    // Warm white light — right
    const whiteLight = new THREE.PointLight(0xffffff, 50, 20);
    whiteLight.position.set(4, -2, 2);
    scene.add(whiteLight);

    // ── Torus Knot ──────────────────────────────────────
    const geometry = new THREE.TorusKnotGeometry(1, 0.35, 200, 32, 2, 3);
    const material = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      roughness: 0.2,
      metalness: 0.8,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.setScalar(isMobile ? 0.65 : 1);
    scene.add(mesh);

    // ── Animation loop ──────────────────────────────────
    let rafId;
    const targetRot = { x: 0, y: 0 };

    function animate() {
      rafId = requestAnimationFrame(animate);

      const { x: mx, y: my } = mouseRef.current;
      targetRot.x = my * 0.5;
      targetRot.y = mx * 0.5;

      mesh.rotation.x += (targetRot.x - mesh.rotation.x) * 0.05;
      mesh.rotation.y += (targetRot.y - mesh.rotation.y) * 0.05;

      // Gentle auto-rotation when mouse is near center
      if (Math.abs(mx) < 0.05 && Math.abs(my) < 0.05) {
        mesh.rotation.y += 0.003;
      }

      renderer.render(scene, camera);
    }
    animate();

    // ── Resize handler ──────────────────────────────────
    function onResize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
    window.addEventListener('resize', onResize);

    // ── Cleanup ─────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [mouseRef, isMobile]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}
