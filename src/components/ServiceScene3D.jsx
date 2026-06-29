import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function hexColor(value, fallback = '#9b5de5') {
  return value || fallback;
}

function makeMat(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.28,
    metalness: options.metalness ?? 0.55,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1,
    emissive: options.emissive ?? color,
    emissiveIntensity: options.emissiveIntensity ?? 0.05,
    side: options.side ?? THREE.FrontSide,
  });
}

function addMesh(root, disposables, geometry, material, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.scale.set(...scale);
  root.add(mesh);
  disposables.push(geometry, material);
  return mesh;
}

function addLine(root, disposables, points, color, opacity = 0.55) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
  });
  const line = new THREE.Line(geometry, material);
  root.add(line);
  disposables.push(geometry, material);
  return line;
}

function addParticles(root, disposables, count, radius, color, size = 0.025) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const r = radius * (0.45 + Math.random() * 0.55);

    positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
    positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
    positions[i * 3 + 2] = Math.cos(phi) * r;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color,
    size,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  root.add(points);
  disposables.push(geometry, material);
  return points;
}

function buildVideoScene(root, disposables, accent, secondary) {
  const objects = {};
  const railMat = makeMat('#171717', { roughness: 0.45, metalness: 0.2 });
  const clipMat = makeMat(accent, { emissiveIntensity: 0.22 });
  const coolMat = makeMat(secondary, { emissiveIntensity: 0.18 });

  for (let row = 0; row < 4; row += 1) {
    const y = -0.9 + row * 0.55;
    addMesh(root, disposables, new THREE.BoxGeometry(3.8, 0.035, 0.035), railMat.clone(), [0, y, -0.25]);

    for (let i = 0; i < 3; i += 1) {
      const width = 0.42 + Math.random() * 0.42;
      const x = -1.45 + i * 1.18 + (row % 2) * 0.2;
      const material = (i + row) % 2 ? clipMat.clone() : coolMat.clone();
      const clip = addMesh(root, disposables, new THREE.BoxGeometry(width, 0.24, 0.14), material, [x, y, 0.04]);
      objects[`clip-${row}-${i}`] = clip;
    }
  }

  objects.playhead = addMesh(
    root,
    disposables,
    new THREE.BoxGeometry(0.035, 2.35, 0.06),
    makeMat('#ffffff', { emissive: accent, emissiveIntensity: 0.35 }),
    [-1.7, -0.05, 0.24],
  );

  objects.reel = new THREE.Group();
  const ringMat = makeMat('#22222a', { metalness: 0.75, roughness: 0.18 });
  const holeMat = makeMat(accent, { transparent: true, opacity: 0.7, emissiveIntensity: 0.35 });
  addMesh(objects.reel, disposables, new THREE.TorusGeometry(0.72, 0.05, 16, 96), ringMat.clone());
  addMesh(objects.reel, disposables, new THREE.TorusGeometry(0.32, 0.035, 12, 72), ringMat.clone());

  for (let i = 0; i < 6; i += 1) {
    const angle = (i / 6) * Math.PI * 2;
    addMesh(
      objects.reel,
      disposables,
      new THREE.CylinderGeometry(0.07, 0.07, 0.04, 24),
      holeMat.clone(),
      [Math.cos(angle) * 0.48, Math.sin(angle) * 0.48, 0],
      [Math.PI / 2, 0, 0],
    );
  }

  objects.reel.position.set(1.25, 0.85, -0.42);
  root.add(objects.reel);
  return objects;
}

function buildFilmScene(root, disposables, accent, secondary) {
  const objects = {};
  const bodyMat = makeMat('#171717', { metalness: 0.35, roughness: 0.34 });
  const accentMat = makeMat(accent, { emissiveIntensity: 0.18 });
  const glassMat = makeMat(secondary, { transparent: true, opacity: 0.48, emissiveIntensity: 0.2 });

  objects.camera = new THREE.Group();
  addMesh(objects.camera, disposables, new THREE.BoxGeometry(1.35, 0.72, 0.62), bodyMat.clone());
  addMesh(objects.camera, disposables, new THREE.CylinderGeometry(0.38, 0.5, 0.72, 48), glassMat.clone(), [0.78, 0, 0], [0, 0, Math.PI / 2]);
  addMesh(objects.camera, disposables, new THREE.CylinderGeometry(0.2, 0.2, 0.12, 36), accentMat.clone(), [1.18, 0, 0], [0, 0, Math.PI / 2]);
  addMesh(objects.camera, disposables, new THREE.BoxGeometry(0.68, 0.14, 0.5), accentMat.clone(), [-0.15, 0.48, 0]);
  addMesh(objects.camera, disposables, new THREE.BoxGeometry(0.14, 0.42, 0.56), bodyMat.clone(), [-0.9, -0.05, 0]);
  objects.camera.rotation.y = -0.3;
  root.add(objects.camera);

  const slate = new THREE.Group();
  addMesh(slate, disposables, new THREE.BoxGeometry(1.35, 0.74, 0.06), makeMat('#111111', { roughness: 0.5 }), [-1.25, 0.5, -0.35], [0.16, 0.2, -0.14]);
  for (let i = 0; i < 4; i += 1) {
    addMesh(slate, disposables, new THREE.BoxGeometry(0.22, 0.08, 0.07), i % 2 ? accentMat.clone() : makeMat('#ffffff'), [-1.75 + i * 0.32, 0.9, -0.31], [0.16, 0.2, -0.14]);
  }
  root.add(slate);
  objects.slate = slate;

  addLine(root, disposables, [new THREE.Vector3(-0.25, -0.45, -0.1), new THREE.Vector3(-1.1, -1.55, 0.12)], accent, 0.5);
  addLine(root, disposables, [new THREE.Vector3(-0.1, -0.45, -0.1), new THREE.Vector3(0.05, -1.72, 0.24)], accent, 0.5);
  addLine(root, disposables, [new THREE.Vector3(0.08, -0.45, -0.1), new THREE.Vector3(1.0, -1.48, 0.08)], accent, 0.5);

  return objects;
}

function buildVfxScene(root, disposables, accent, secondary) {
  const objects = {};
  objects.core = addMesh(
    root,
    disposables,
    new THREE.IcosahedronGeometry(0.82, 1),
    makeMat(accent, { transparent: true, opacity: 0.68, roughness: 0.18, metalness: 0.75, emissiveIntensity: 0.2 }),
  );
  objects.wire = addMesh(
    root,
    disposables,
    new THREE.IcosahedronGeometry(0.9, 2),
    new THREE.MeshBasicMaterial({ color: secondary, wireframe: true, transparent: true, opacity: 0.35 }),
  );

  for (let i = 0; i < 4; i += 1) {
    const torus = addMesh(
      root,
      disposables,
      new THREE.TorusGeometry(1.08 + i * 0.22, 0.008, 8, 128),
      makeMat(i % 2 ? secondary : accent, { transparent: true, opacity: 0.58, emissiveIntensity: 0.4 }),
      [0, 0, 0],
      [Math.PI / 2.6, 0.18 * i, i * 0.52],
    );
    objects[`ring-${i}`] = torus;
  }

  objects.particles = addParticles(root, disposables, 260, 1.85, accent, 0.018);
  return objects;
}

function buildSoundScene(root, disposables, accent, secondary) {
  const objects = {};
  const barGroup = new THREE.Group();
  const barMat = makeMat(accent, { emissiveIntensity: 0.22 });
  const altMat = makeMat(secondary, { emissiveIntensity: 0.18 });

  for (let i = 0; i < 42; i += 1) {
    const angle = (i / 42) * Math.PI * 2;
    const height = 0.28 + ((i % 7) * 0.06);
    const bar = addMesh(
      barGroup,
      disposables,
      new THREE.BoxGeometry(0.035, height, 0.08),
      i % 3 ? barMat.clone() : altMat.clone(),
      [Math.cos(angle) * 1.08, Math.sin(angle) * 1.08, 0],
      [0, 0, angle],
    );
    bar.userData.baseHeight = height;
  }

  root.add(barGroup);
  objects.bars = barGroup;

  for (let i = 0; i < 4; i += 1) {
    objects[`ring-${i}`] = addMesh(
      root,
      disposables,
      new THREE.TorusGeometry(0.45 + i * 0.28, 0.01, 8, 120),
      makeMat(i % 2 ? secondary : accent, { transparent: true, opacity: 0.38, emissiveIntensity: 0.25 }),
      [0, 0, -0.08],
    );
  }

  const wavePoints = [];
  for (let i = 0; i < 80; i += 1) {
    const x = -1.55 + (i / 79) * 3.1;
    wavePoints.push(new THREE.Vector3(x, Math.sin(i * 0.32) * 0.14, 0.5));
  }
  objects.wave = addLine(root, disposables, wavePoints, '#ffffff', 0.62);
  return objects;
}

function build3DScene(root, disposables, accent, secondary) {
  const objects = {};
  objects.cube = addMesh(
    root,
    disposables,
    new THREE.BoxGeometry(1.1, 1.1, 1.1, 4, 4, 4),
    new THREE.MeshBasicMaterial({ color: accent, wireframe: true, transparent: true, opacity: 0.72 }),
  );
  objects.inner = addMesh(
    root,
    disposables,
    new THREE.DodecahedronGeometry(0.58, 0),
    makeMat(secondary, { transparent: true, opacity: 0.54, roughness: 0.2, metalness: 0.75, emissiveIntensity: 0.16 }),
  );

  objects.orbits = new THREE.Group();
  for (let i = 0; i < 3; i += 1) {
    const ring = addMesh(
      objects.orbits,
      disposables,
      new THREE.TorusGeometry(1.05 + i * 0.24, 0.008, 8, 120),
      makeMat(i % 2 ? secondary : accent, { transparent: true, opacity: 0.55, emissiveIntensity: 0.35 }),
      [0, 0, 0],
      [Math.PI / 2, i * 0.72, i * 0.3],
    );
    objects[`orbit-${i}`] = ring;
  }

  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2;
    addMesh(
      objects.orbits,
      disposables,
      new THREE.SphereGeometry(0.055, 18, 18),
      makeMat(i % 2 ? secondary : accent, { emissiveIntensity: 0.25 }),
      [Math.cos(angle) * 1.55, Math.sin(angle * 1.7) * 0.45, Math.sin(angle) * 1.1],
    );
  }
  root.add(objects.orbits);
  return objects;
}

function buildMotionScene(root, disposables, accent, secondary) {
  const objects = {};
  objects.planes = new THREE.Group();
  const mats = [
    makeMat(accent, { emissiveIntensity: 0.18 }),
    makeMat(secondary, { emissiveIntensity: 0.16 }),
    makeMat('#ffffff', { transparent: true, opacity: 0.82, roughness: 0.2 }),
  ];

  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2;
    const geom = i % 2 ? new THREE.BoxGeometry(0.42, 0.42, 0.045) : new THREE.CylinderGeometry(0.22, 0.22, 0.045, 48);
    const mesh = addMesh(
      objects.planes,
      disposables,
      geom,
      mats[i % mats.length].clone(),
      [Math.cos(angle) * 1.15, Math.sin(angle) * 0.82, (i % 3) * 0.18],
      [0.35, angle * 0.24, angle],
    );
    mesh.userData.phase = angle;
  }

  root.add(objects.planes);
  objects.path = addLine(
    root,
    disposables,
    [
      new THREE.Vector3(-1.55, -0.85, -0.2),
      new THREE.Vector3(-0.95, 0.45, 0.15),
      new THREE.Vector3(-0.1, -0.2, 0.38),
      new THREE.Vector3(0.8, 0.78, 0.05),
      new THREE.Vector3(1.55, -0.55, -0.1),
    ],
    accent,
    0.5,
  );
  return objects;
}

function buildAiScene(root, disposables, accent, secondary) {
  const objects = {};
  objects.prism = addMesh(
    root,
    disposables,
    new THREE.OctahedronGeometry(0.72, 0),
    makeMat(accent, { transparent: true, opacity: 0.5, metalness: 0.85, roughness: 0.12, emissiveIntensity: 0.16 }),
  );
  objects.prismWire = addMesh(
    root,
    disposables,
    new THREE.OctahedronGeometry(0.86, 0),
    new THREE.MeshBasicMaterial({ color: '#ffffff', wireframe: true, transparent: true, opacity: 0.22 }),
  );

  const nodes = [
    [-1.45, 0.85, -0.15],
    [-1.2, -0.65, 0.2],
    [-0.3, 1.05, 0.25],
    [1.2, 0.65, -0.05],
    [1.45, -0.62, 0.22],
    [0.25, -1.05, -0.2],
  ];

  objects.nodes = [];
  nodes.forEach((position, index) => {
    const node = addMesh(
      root,
      disposables,
      new THREE.SphereGeometry(0.08, 22, 22),
      makeMat(index % 2 ? secondary : accent, { emissiveIntensity: 0.4 }),
      position,
    );
    objects.nodes.push(node);
    addLine(root, disposables, [new THREE.Vector3(...position), new THREE.Vector3(0, 0, 0)], index % 2 ? secondary : accent, 0.34);
  });

  for (let i = 0; i < 3; i += 1) {
    addMesh(
      root,
      disposables,
      new THREE.BoxGeometry(0.72, 0.42, 0.035),
      makeMat(i % 2 ? secondary : accent, { transparent: true, opacity: 0.22, emissiveIntensity: 0.25 }),
      [-1.35 + i * 1.35, -1.35, -0.38],
      [0.2, -0.12 + i * 0.18, 0],
    );
  }
  return objects;
}

function buildWeddingScene(root, disposables, accent, secondary) {
  const objects = {};
  const gold = makeMat(accent, { roughness: 0.14, metalness: 0.9, emissiveIntensity: 0.08 });
  const rose = makeMat(secondary, { transparent: true, opacity: 0.58, emissiveIntensity: 0.24 });

  objects.leftRing = addMesh(root, disposables, new THREE.TorusGeometry(0.55, 0.065, 24, 128), gold.clone(), [-0.35, 0.02, 0], [0.08, 0.4, 0.1]);
  objects.rightRing = addMesh(root, disposables, new THREE.TorusGeometry(0.55, 0.065, 24, 128), gold.clone(), [0.35, -0.02, 0.02], [0.08, -0.4, -0.1]);

  const ribbonCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.65, -0.55, -0.2),
    new THREE.Vector3(-0.85, 0.55, 0.3),
    new THREE.Vector3(0.05, -0.18, 0.55),
    new THREE.Vector3(0.75, 0.5, 0.2),
    new THREE.Vector3(1.65, -0.42, -0.12),
  ]);
  addMesh(root, disposables, new THREE.TubeGeometry(ribbonCurve, 96, 0.025, 10, false), rose.clone());

  objects.sparkles = addParticles(root, disposables, 120, 1.85, accent, 0.02);
  for (let i = 0; i < 7; i += 1) {
    const angle = (i / 7) * Math.PI * 2;
    addMesh(
      root,
      disposables,
      new THREE.OctahedronGeometry(0.055, 0),
      makeMat(i % 2 ? secondary : accent, { emissiveIntensity: 0.42 }),
      [Math.cos(angle) * 1.22, Math.sin(angle * 1.3) * 0.82, Math.sin(angle) * 0.55],
    );
  }
  return objects;
}

function buildSceneByVariant(root, disposables, variant, accent, secondary) {
  switch (variant) {
    case 'video':
      return buildVideoScene(root, disposables, accent, secondary);
    case 'film':
      return buildFilmScene(root, disposables, accent, secondary);
    case 'vfx':
      return buildVfxScene(root, disposables, accent, secondary);
    case 'sound':
      return buildSoundScene(root, disposables, accent, secondary);
    case 'three-d':
      return build3DScene(root, disposables, accent, secondary);
    case 'motion':
      return buildMotionScene(root, disposables, accent, secondary);
    case 'ai':
      return buildAiScene(root, disposables, accent, secondary);
    case 'wedding':
      return buildWeddingScene(root, disposables, accent, secondary);
    default:
      return buildVfxScene(root, disposables, accent, secondary);
  }
}

function animateVariant(objects, variant, time) {
  if (variant === 'video') {
    if (objects.playhead) objects.playhead.position.x = Math.sin(time * 0.85) * 1.55;
    if (objects.reel) objects.reel.rotation.z = time * 0.9;
    Object.entries(objects).forEach(([key, object]) => {
      if (key.startsWith('clip-')) object.position.z = 0.04 + Math.sin(time * 1.8 + object.position.x) * 0.035;
    });
  }

  if (variant === 'film') {
    if (objects.camera) objects.camera.rotation.y = -0.28 + Math.sin(time * 0.55) * 0.12;
    if (objects.slate) objects.slate.rotation.z = -0.08 + Math.sin(time * 0.85) * 0.05;
  }

  if (variant === 'vfx') {
    if (objects.core) objects.core.rotation.set(time * 0.22, time * 0.36, time * 0.18);
    if (objects.wire) objects.wire.rotation.set(-time * 0.18, time * 0.2, -time * 0.26);
    if (objects.particles) objects.particles.rotation.y = time * 0.16;
    Object.entries(objects).forEach(([key, object]) => {
      if (key.startsWith('ring-')) object.rotation.z += 0.003 + Number(key.split('-')[1]) * 0.001;
    });
  }

  if (variant === 'sound') {
    if (objects.bars) {
      objects.bars.rotation.z = time * 0.18;
      objects.bars.children.forEach((bar, index) => {
        const scale = 0.7 + Math.abs(Math.sin(time * 2.2 + index * 0.36)) * 0.95;
        bar.scale.y = scale;
      });
    }
    if (objects.wave) objects.wave.position.y = Math.sin(time * 1.5) * 0.08;
  }

  if (variant === 'three-d') {
    if (objects.cube) objects.cube.rotation.set(time * 0.21, time * 0.28, time * 0.12);
    if (objects.inner) objects.inner.rotation.set(-time * 0.18, time * 0.22, time * 0.3);
    if (objects.orbits) objects.orbits.rotation.y = time * 0.32;
  }

  if (variant === 'motion') {
    if (objects.planes) {
      objects.planes.rotation.z = Math.sin(time * 0.35) * 0.18;
      objects.planes.children.forEach((plane) => {
        plane.rotation.z += 0.01;
        plane.position.z = Math.sin(time * 1.5 + plane.userData.phase) * 0.28;
      });
    }
  }

  if (variant === 'ai') {
    if (objects.prism) objects.prism.rotation.set(time * 0.24, time * 0.32, time * 0.16);
    if (objects.prismWire) objects.prismWire.rotation.set(-time * 0.18, -time * 0.26, time * 0.14);
    if (objects.nodes) {
      objects.nodes.forEach((node, index) => {
        node.scale.setScalar(1 + Math.sin(time * 1.8 + index) * 0.18);
      });
    }
  }

  if (variant === 'wedding') {
    if (objects.leftRing) objects.leftRing.rotation.y = 0.4 + Math.sin(time * 0.5) * 0.08;
    if (objects.rightRing) objects.rightRing.rotation.y = -0.4 - Math.sin(time * 0.5) * 0.08;
    if (objects.sparkles) objects.sparkles.rotation.y = time * 0.08;
  }
}

export default function ServiceScene3D({ variant = 'vfx', accent = '#9b5de5', secondary = '#ffffff' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    const root = new THREE.Group();
    const disposables = [];
    const clock = new THREE.Clock();
    const mouse = { x: 0, y: 0 };
    const samplePixel = new Uint8Array(4);
    let diagnosticFrames = 0;
    let rafId;

    camera.position.set(0, 0, 5);
    scene.add(root);

    const ambient = new THREE.AmbientLight(0xffffff, 0.38);
    scene.add(ambient);

    const accentLight = new THREE.PointLight(hexColor(accent), 80, 18);
    accentLight.position.set(-3.5, 2.5, 3);
    scene.add(accentLight);

    const secondaryLight = new THREE.PointLight(hexColor(secondary, '#ffffff'), 54, 16);
    secondaryLight.position.set(3, -2.2, 2.5);
    scene.add(secondaryLight);

    root.scale.setScalar(1.2);
    const objects = buildSceneByVariant(root, disposables, variant, hexColor(accent), hexColor(secondary, '#ffffff'));

    function setSize() {
      const width = Math.max(1, canvas.clientWidth);
      const height = Math.max(1, canvas.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
    }

    function onMouseMove(event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
    }

    function updateCanvasDiagnostics() {
      if (diagnosticFrames > 12) return;
      diagnosticFrames += 1;

      const gl = renderer.getContext();
      const width = gl.drawingBufferWidth;
      const height = gl.drawingBufferHeight;
      let energy = 0;
      let hits = 0;

      for (let y = 0.28; y <= 0.72; y += 0.11) {
        for (let x = 0.28; x <= 0.72; x += 0.11) {
          gl.readPixels(
            Math.floor(width * x),
            Math.floor(height * y),
            1,
            1,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            samplePixel,
          );

          const sum = samplePixel[0] + samplePixel[1] + samplePixel[2] + samplePixel[3];
          energy += sum;
          if (sum > 18) hits += 1;
        }
      }

      canvas.dataset.sceneEnergy = String(energy);
      canvas.dataset.sceneSamples = String(hits);
      canvas.dataset.sceneVariant = variant;
    }

    function render() {
      const time = clock.getElapsedTime();
      root.rotation.x += ((mouse.y * 0.12) - root.rotation.x) * 0.035;
      root.rotation.y += ((mouse.x * 0.18) - root.rotation.y) * 0.035;

      if (!prefersReduced) {
        root.rotation.z = Math.sin(time * 0.18) * 0.04;
        animateVariant(objects, variant, time);
      }

      renderer.render(scene, camera);
      updateCanvasDiagnostics();
      if (!prefersReduced) rafId = requestAnimationFrame(render);
    }

    setSize();
    render();

    window.addEventListener('resize', setSize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', setSize);
      window.removeEventListener('mousemove', onMouseMove);
      disposables.forEach((item) => item.dispose?.());
      renderer.dispose();
    };
  }, [accent, secondary, variant]);

  return <canvas ref={canvasRef} className="service-scene-3d" aria-hidden="true" />;
}
