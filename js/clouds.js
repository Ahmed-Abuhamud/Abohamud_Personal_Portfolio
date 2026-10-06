// Three.js stylized cloud sky — drifting low-poly clouds, floating wireframe polyhedra,
// and soft particles, with mouse + scroll parallax. The canvas is fixed behind the page;
// the renderer is transparent so the CSS sky gradient shows through.
import * as THREE from '../vendor/three.module.min.js';

const canvas = document.getElementById('sky');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xdfeefc, 70, 210);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 400);
camera.position.set(0, 0, 42);

// Warm sun key light (matches the CSS .sun glow, upper right), cool sky fill
scene.add(new THREE.HemisphereLight(0xcfe6ff, 0x46688c, 1.05));
const sunLight = new THREE.DirectionalLight(0xffe0b0, 1.7);
sunLight.position.set(28, 24, 10);
scene.add(sunLight);
scene.add(new THREE.AmbientLight(0x8fb4dd, 0.35));

function radialTexture(inner, outer) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 4, 64, 64, 64);
  grad.addColorStop(0, inner);
  grad.addColorStop(1, outer);
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

// ---- Clouds ---------------------------------------------------------------
// One stylized cloud = a cluster of squashed low-poly spheres, flat-shaded.
function makeCloud(scale, tint) {
  const group = new THREE.Group();
  const puffs = 6 + Math.floor(Math.random() * 4);
  const material = new THREE.MeshLambertMaterial({
    color: tint,
    emissive: 0x9db8d4,
    emissiveIntensity: 0.24,
    flatShading: true,
  });
  const geo = new THREE.IcosahedronGeometry(1, 1);
  for (let i = 0; i < puffs; i++) {
    const puff = new THREE.Mesh(geo, material);
    const t = i / (puffs - 1) - 0.5;
    puff.position.set(t * 4.8 + (Math.random() - 0.5), (Math.random() - 0.5) * 1.15, (Math.random() - 0.5) * 2.4);
    const s = scale * (0.95 - Math.abs(t) * 0.8) * (0.75 + Math.random() * 0.5);
    puff.scale.set(s * 1.4, s * 0.85, s);
    puff.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    group.add(puff);
  }
  return group;
}

// Three depth bands: far haze, mid, and near hero clouds
const bands = [
  { z: -78, y: 15, count: 9, scale: 2.6, speed: 0.55, drift: 0.010, tint: 0xdfe9f5 },
  { z: -38, y: 6, count: 7, scale: 3.4, speed: 0.9, drift: 0.020, tint: 0xf3f8ff },
  { z: -8, y: -7, count: 5, scale: 4.6, speed: 1.35, drift: 0.038, tint: 0xffffff },
];
const SPAN = 160;

const cloudGroups = [];
for (const band of bands) {
  const bandGroup = new THREE.Group();
  bandGroup.position.z = band.z;
  for (let i = 0; i < band.count; i++) {
    const cloud = makeCloud(band.scale, band.tint);
    cloud.position.set(
      (Math.random() - 0.5) * SPAN,
      band.y + (Math.random() - 0.5) * 16,
      (Math.random() - 0.5) * 8
    );
    cloud.userData.speed = band.speed * (0.75 + Math.random() * 0.5);
    cloud.userData.baseY = cloud.position.y;
    cloud.userData.phase = Math.random() * Math.PI * 2;
    bandGroup.add(cloud);
  }
  scene.add(bandGroup);
  cloudGroups.push({ group: bandGroup, drift: band.drift });
}

// ---- Sun haze + far fog puffs ----------------------------------------------
const haze = new THREE.Sprite(new THREE.SpriteMaterial({
  map: radialTexture('rgba(255,236,190,0.9)', 'rgba(255,236,190,0)'),
  transparent: true, depthWrite: false,
}));
haze.position.set(34, 22, -90);
haze.scale.set(58, 58, 1);
scene.add(haze);

const puffTexture = radialTexture('rgba(255,255,255,0.5)', 'rgba(255,255,255,0)');
const farPuffs = new THREE.Group();
for (let i = 0; i < 20; i++) {
  const puff = new THREE.Sprite(new THREE.SpriteMaterial({
    map: puffTexture, transparent: true, depthWrite: false, opacity: 0.32,
  }));
  puff.position.set((Math.random() - 0.5) * SPAN, (Math.random() - 0.3) * 44, -100 - Math.random() * 20);
  const s = 14 + Math.random() * 26;
  puff.scale.set(s, s * 0.6, 1);
  farPuffs.add(puff);
}
scene.add(farPuffs);

// ---- Drifting particles (soft dots) ----------------------------------------
const PARTICLES = 110;
const positions = new Float32Array(PARTICLES * 3);
for (let i = 0; i < PARTICLES; i++) {
  positions[i * 3] = (Math.random() - 0.5) * SPAN;
  positions[i * 3 + 1] = (Math.random() - 0.4) * 55;
  positions[i * 3 + 2] = -20 - Math.random() * 70;
}
const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particles = new THREE.Points(particleGeo, new THREE.PointsMaterial({
  map: puffTexture,
  size: 1.6,
  transparent: true,
  opacity: 0.55,
  depthWrite: false,
  sizeAttenuation: true,
}));
scene.add(particles);

// ---- Floating wireframe polyhedra (tech accents) ----------------------------
const shapes = new THREE.Group();
const wireMats = [
  new THREE.MeshBasicMaterial({ color: 0xffc24b, wireframe: true, transparent: true, opacity: 0.5 }),
  new THREE.MeshBasicMaterial({ color: 0x8ec5ff, wireframe: true, transparent: true, opacity: 0.45 }),
];
const geos = [
  new THREE.IcosahedronGeometry(1, 0),
  new THREE.OctahedronGeometry(1, 0),
  new THREE.TorusKnotGeometry(0.7, 0.24, 64, 8),
];
for (let i = 0; i < 6; i++) {
  const mesh = new THREE.Mesh(geos[i % geos.length], wireMats[i % wireMats.length]);
  mesh.position.set((Math.random() - 0.5) * 90, (Math.random() - 0.3) * 30, -14 - Math.random() * 40);
  const s = 1 + Math.random() * 1.8;
  mesh.scale.setScalar(s);
  mesh.userData.spin = 0.15 + Math.random() * 0.3;
  mesh.userData.bobAmp = 0.8 + Math.random() * 1.2;
  mesh.userData.phase = Math.random() * Math.PI * 2;
  shapes.add(mesh);
}
scene.add(shapes);

// ---- Motion ------------------------------------------------------------------
const pointer = { x: 0, y: 0 };
const eased = { x: 0, y: 0 };
window.addEventListener('pointermove', (e) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
}, { passive: true });

function layout() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', layout);
layout();

function advance(elapsed, delta) {
  for (const { group, drift } of cloudGroups) {
    for (const cloud of group.children) {
      cloud.position.x += cloud.userData.speed * drift * delta;
      if (cloud.position.x > SPAN / 2 + 10) cloud.position.x = -SPAN / 2 - 10;
      cloud.position.y = cloud.userData.baseY + Math.sin(elapsed * 0.4 + cloud.userData.phase) * 0.6;
    }
    // scroll parallax: nearer bands rise faster as the page scrolls
    group.position.y = scrollY * drift * 0.1 * (group.position.z < -40 ? 0.25 : 1);
  }
  for (const mesh of shapes.children) {
    mesh.rotation.x += mesh.userData.spin * delta;
    mesh.rotation.y += mesh.userData.spin * 0.8 * delta;
    mesh.position.y += Math.sin(elapsed * 0.6 + mesh.userData.phase) * mesh.userData.bobAmp * delta;
  }
  particles.rotation.y += 0.006 * delta;
  eased.x += (pointer.x - eased.x) * 0.04;
  eased.y += (pointer.y - eased.y) * 0.04;
  camera.position.x = eased.x * 3.2;
  camera.position.y = -eased.y * 1.8;
  camera.lookAt(0, 0, -30);
}

if (reducedMotion) {
  advance(0, 0);
  renderer.render(scene, camera);
} else {
  const clock = new THREE.Clock();
  let elapsed = 0;
  let running = true;
  document.addEventListener('visibilitychange', () => {
    running = document.visibilityState === 'visible';
    if (running) clock.getDelta(); // absorb the pause so clouds don't jump
  });
  renderer.setAnimationLoop(() => {
    if (!running) return;
    const delta = Math.min(clock.getDelta(), 0.1);
    elapsed += delta;
    advance(elapsed, delta);
    renderer.render(scene, camera);
  });
}
