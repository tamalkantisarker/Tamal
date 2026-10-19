/* ==========================================================================
   THREE.JS 3D INTERACTIVE CYBER CORE & PARTICLE SYSTEM
   High-performance WebGL rendering with smooth lerping, mouse tracking,
   and scroll parallax physics.
   ========================================================================== */

(function init3DScene() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') {
    console.warn('Three.js canvas or library not available');
    return;
  }

  // 1. Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 24;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 2. Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(0x00f5d4, 3, 50);
  cyanLight.position.set(10, 10, 10);
  scene.add(cyanLight);

  const violetLight = new THREE.PointLight(0xa855f7, 3, 50);
  violetLight.position.set(-10, -10, 10);
  scene.add(violetLight);

  // 3. Central 3D Cyber Core Group
  const coreGroup = new THREE.Group();
  scene.add(coreGroup);

  // 3a. Inner Glowing Core (Icosahedron)
  const innerGeo = new THREE.IcosahedronGeometry(3.6, 1);
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0x05131e,
    emissive: 0x00f5d4,
    emissiveIntensity: 0.35,
    roughness: 0.2,
    metalness: 0.9,
    wireframe: false
  });
  const innerCore = new THREE.Mesh(innerGeo, innerMat);
  coreGroup.add(innerCore);

  // 3b. Outer Cyber Wireframe Cage
  const cageGeo = new THREE.IcosahedronGeometry(5.2, 1);
  const cageMat = new THREE.MeshBasicMaterial({
    color: 0x00f5d4,
    wireframe: true,
    transparent: true,
    opacity: 0.45
  });
  const outerCage = new THREE.Mesh(cageGeo, cageMat);
  coreGroup.add(outerCage);

  // 3c. Second Rotating Octahedron Ring
  const octGeo = new THREE.OctahedronGeometry(6.6, 0);
  const octMat = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const octCage = new THREE.Mesh(octGeo, octMat);
  coreGroup.add(octCage);

  // 3d. Glowing Orbital Ring
  const ringGeo = new THREE.TorusGeometry(8.0, 0.05, 16, 100);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x00f5d4,
    transparent: true,
    opacity: 0.6
  });
  const orbitalRing = new THREE.Mesh(ringGeo, ringMat);
  orbitalRing.rotation.x = Math.PI / 3;
  coreGroup.add(orbitalRing);

  // 4. Particle Galaxy / Space Dust
  const particleCount = window.innerWidth < 768 ? 600 : 1400;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  const colorCyan = new THREE.Color(0x00f5d4);
  const colorViolet = new THREE.Color(0xa855f7);
  const colorWhite = new THREE.Color(0xffffff);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    particlePositions[i3] = (Math.random() - 0.5) * 60;
    particlePositions[i3 + 1] = (Math.random() - 0.5) * 60;
    particlePositions[i3 + 2] = (Math.random() - 0.5) * 60;

    const mixedColor = Math.random() < 0.4 ? colorCyan : (Math.random() < 0.7 ? colorViolet : colorWhite);
    particleColors[i3] = mixedColor.r;
    particleColors[i3 + 1] = mixedColor.g;
    particleColors[i3 + 2] = mixedColor.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  const particleField = new THREE.Points(particleGeo, particleMat);
  scene.add(particleField);

  // 5. Position & Parallax Interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  let scrollY = 0;

  function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(event.clientY / window.innerHeight - 0.5) * 2;
  }
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  function onScroll() {
    scrollY = window.scrollY || document.documentElement.scrollTop;
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Shift position on mobile vs desktop
    if (window.innerWidth < 992) {
      coreGroup.position.x = 0;
      coreGroup.position.y = 4;
      coreGroup.scale.set(0.65, 0.65, 0.65);
    } else {
      coreGroup.position.x = 6.5;
      coreGroup.position.y = 0;
      coreGroup.scale.set(1, 1, 1);
    }
  }
  window.addEventListener('resize', onResize);
  onResize(); // trigger once

  // 6. Animation Loop
  let isPageVisible = true;
  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    if (!isPageVisible) return;

    const elapsedTime = clock.getElapsedTime();

    // Smooth Lerp Mouse Movement
    targetX += (mouseX * 0.8 - targetX) * 0.05;
    targetY += (mouseY * 0.8 - targetY) * 0.05;

    // Self-rotation of core elements
    innerCore.rotation.x = elapsedTime * 0.3;
    innerCore.rotation.y = elapsedTime * 0.4;

    outerCage.rotation.x = -elapsedTime * 0.2;
    outerCage.rotation.y = elapsedTime * 0.25;

    octCage.rotation.y = -elapsedTime * 0.15;
    octCage.rotation.z = elapsedTime * 0.2;

    orbitalRing.rotation.z = elapsedTime * 0.35;
    orbitalRing.rotation.y = Math.sin(elapsedTime * 0.5) * 0.2;

    // Slow drift of particle stars
    particleField.rotation.y = elapsedTime * 0.02;
    particleField.rotation.x = Math.sin(elapsedTime * 0.015) * 0.1;

    // Interactive Mouse Tilt applied to Core Group
    coreGroup.rotation.y = targetX * 0.8 + elapsedTime * 0.05;
    coreGroup.rotation.x = -targetY * 0.6;

    // Scroll parallax dynamic transformation
    const scrollFactor = scrollY * 0.002;
    camera.position.y = -scrollFactor * 3.5;
    camera.position.x = Math.sin(scrollFactor) * 1.5;

    renderer.render(scene, camera);
  }

  animate();
})();
