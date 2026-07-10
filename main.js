/* =====================================================
   CINEMATIC SPATIAL PORTFOLIO — main.js
   Minimalist Interactions, Ink Cursor, Magnetic Elements
   ===================================================== */

// ===== THEME =====

let isDark = true;
const themeBtn = document.getElementById('themeBtn');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    isDark = !isDark;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    if (window._threeTheme) window._threeTheme(isDark);
  });
}

// ===== SECTIONS CONFIG & STATE =====
const SECS = [
  { id: 's0', num: '01', col: '#c084fc', vcol: 'var(--home)' },
  { id: 's1', num: '02', col: '#06b6d4', vcol: 'var(--design)' },
  { id: 's2', num: '03', col: '#f87171', vcol: 'var(--video)' },
  { id: 's3', num: '04', col: '#34d399', vcol: 'var(--web)' },
  { id: 's4', num: '05', col: '#f59e0b', vcol: 'var(--edu)' },
  { id: 's5', num: '06', col: '#ec4899', vcol: 'var(--work)' },
  { id: 's6', num: '07', col: '#60a5fa', vcol: 'var(--contact)' }
];
let cur = 0;
let locked = false;

// ===== INK TRAIL CURSOR =====
const trailCv = document.getElementById('trailCv');
const ctx = trailCv.getContext('2d', { alpha: true });
let w = window.innerWidth;
let h = window.innerHeight;
trailCv.width = w; trailCv.height = h;

window.addEventListener('resize', () => {
  w = window.innerWidth; h = window.innerHeight;
  trailCv.width = w; trailCv.height = h;
});

let mouse = { x: w/2, y: h/2 };
let lastMouse = { x: w/2, y: h/2 };
let points = [];

document.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function drawTrail() {
  requestAnimationFrame(drawTrail);
  ctx.clearRect(0, 0, w, h);
  
  const dx = mouse.x - lastMouse.x;
  const dy = mouse.y - lastMouse.y;
  const dist = Math.sqrt(dx*dx + dy*dy);
  
  if (dist > 2) {
    points.push({ x: mouse.x, y: mouse.y, age: 0 });
    lastMouse.x = mouse.x;
    lastMouse.y = mouse.y;
  }
  
  ctx.beginPath();
  // Accent color RGB: dynamically fetched
  let r, g, b;
  if(cur===0) { r=192; g=132; b=252; } // Home
  else if(cur===1) { r=6; g=182; b=212; } // Design
  else if(cur===2) { r=248; g=113; b=113; } // Film
  else if(cur===3) { r=52; g=211; b=153; } // Code
  else if(cur===4) { r=245; g=158; b=11; } // Education (Amber)
  else if(cur===5) { r=236; g=72; b=153; } // Work (Pink)
  else if(cur===6) { r=96; g=165; b=250; } // Contact (Blue)
  else { r=192; g=132; b=252; }

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    p.age += 1;
    
    if (p.age > 40) {
      points.splice(i, 1);
      i--;
      continue;
    }
    
    const life = 1 - p.age / 40;
    const rad = 8 * life;
    
    ctx.moveTo(p.x, p.y);
    ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
  }
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.5)`;
  ctx.fill();
  
  // Custom cursor dot (drawn on same canvas)
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
  ctx.fillStyle = isDark ? '#ffffff' : '#050505';
  ctx.fill();
}
drawTrail();

// ===== MAGNETIC ELEMENTS =====
const magBtns = document.querySelectorAll('.mag-btn, .d, .nav-link, .soc-link, .proj-row');
magBtns.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Strength depends on size
    const str = btn.classList.contains('proj-row') ? 0.05 : 0.3;
    btn.style.transform = `translate(${x * str}px, ${y * str}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ===== TICKER MORPH =====
const track = document.getElementById('tickerTrack');
if(track) {
  let tickIndex = 0;
  const items = track.querySelectorAll('.tick-item');
  setInterval(() => {
    items[tickIndex].classList.remove('active');
    tickIndex = (tickIndex + 1) % items.length;
    items[tickIndex].classList.add('active');
    track.style.transform = `translateY(-${tickIndex * 50}px)`;
  }, 3000);
}

// ===== STATS COUNTER =====
let statsDone = false;
function runStats() {
  if (statsDone) return;
  statsDone = true;
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.getAttribute('data-count');
    let count = 0;
    const dur = 2000;
    const stepTime = Math.abs(Math.floor(dur / target));
    const timer = setInterval(() => {
      count += 1;
      el.textContent = count;
      if (count >= target) clearInterval(timer);
    }, stepTime);
  });
}

// ===== CODE SECTION DECORATION =====
const codeBg = document.getElementById('codeBgChars');
if(codeBg) {
  const chars = '01<>/{}[]();:+-*=&|!@#$%^';
  for(let i=0; i<30; i++) {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = chars[Math.floor(Math.random() * chars.length)];
    span.style.left = Math.random() * 100 + '%';
    span.style.animationDelay = Math.random() * 10 + 's';
    span.style.fontSize = (Math.random() * 20 + 10) + 'px';
    codeBg.appendChild(span);
  }
}

// ===== NAVIGATION =====
function goTo(idx) {
  if (idx < 0 || idx >= SECS.length || locked || isWorkspaceOpen) return;
  locked = true;
  setTimeout(() => { locked = false; }, 1000); // Wait for transition

  // Remove active from old
  document.getElementById(SECS[cur].id)?.classList.remove('active');
  document.querySelectorAll('.d')[cur]?.classList.remove('active');
  document.querySelectorAll('.nav-center .nav-link')[cur]?.classList.remove('active');

  cur = idx;
  
  // Update accent color
  document.documentElement.style.setProperty('--accent', SECS[cur].vcol);
  
  // Add active to new
  document.getElementById(SECS[cur].id).classList.add('active');
  document.querySelectorAll('.d')[cur].classList.add('active');
  document.querySelectorAll('.nav-center .nav-link')[cur]?.classList.add('active');
  
  // Update texts & progress
  document.getElementById('sn').textContent = SECS[cur].num;
  document.getElementById('prog-fill').style.width = ((cur / (SECS.length - 1)) * 100) + '%';

  // Run stats if we land on home
  if (cur === 0) runStats();

  // Cinematic FOV Kick
  if (window._kick) window._kick();
}

// Listeners
document.querySelectorAll('[data-go]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    goTo(+el.getAttribute('data-go'));
  });
});

let lw = 0;
window.addEventListener('wheel', e => {
  const n = Date.now();
  if (n - lw < 1000) return;
  lw = n;
  goTo(cur + (e.deltaY > 0 ? 1 : -1));
}, { passive: true });

let ty0 = 0;
window.addEventListener('touchstart', e => { ty0 = e.touches[0].clientY; });
window.addEventListener('touchend', e => {
  if (isWorkspaceOpen) return;
  
  // On mobile, if the active slide overflows, allow native scrolling and only
  // navigate to next/prev slides when user reaches the vertical boundaries.
  const activeSlide = document.querySelector('.slide.active');
  const dy = ty0 - e.changedTouches[0].clientY;
  
  if (activeSlide && window.innerWidth < 768) {
    const scrollHeight = activeSlide.scrollHeight;
    const clientHeight = activeSlide.clientHeight;
    const scrollTop = activeSlide.scrollTop;
    
    if (scrollHeight > clientHeight) {
      if (dy > 40 && (scrollTop + clientHeight < scrollHeight - 10)) {
        // Scrolling down content, not yet at bottom boundary -> let it scroll
        return;
      }
      if (dy < -40 && scrollTop > 10) {
        // Scrolling up content, not yet at top boundary -> let it scroll
        return;
      }
    }
  }

  if (Math.abs(dy) > 40) goTo(cur + (dy > 0 ? 1 : -1));
});

window.addEventListener('keydown', e => {
  if (['ArrowDown', 'ArrowRight'].includes(e.key)) goTo(cur + 1);
  if (['ArrowUp', 'ArrowLeft'].includes(e.key)) goTo(cur - 1);
});

// ===== INTERACTIVE HTML ELEMENTS =====
// Video Editing Timeline Dragging
const clips = document.querySelectorAll('.ve-clip');
let draggingClip = null;
let clipStartX = 0;
let clipStartLeft = 0;
let clipTrackWidth = 0;

clips.forEach(clip => {
  clip.addEventListener('mousedown', (e) => {
    draggingClip = clip;
    clipStartX = e.clientX;
    clipStartLeft = parseFloat(clip.style.left || 0);
    clipTrackWidth = clip.parentElement.getBoundingClientRect().width;
    clip.style.transition = 'none'; // Disable transition for smooth dragging
  });
});

// Graphic Design Shape Resizing
const shapes = document.querySelectorAll('.gd-shape');
let resizingShape = null;
let shapeStartY = 0;
let shapeStartScale = 1;

shapes.forEach(shape => {
  // Store original transform string
  shape.dataset.origTransform = shape.style.transform;
  shape.addEventListener('mousedown', (e) => {
    resizingShape = shape;
    shapeStartY = e.clientY;
    shapeStartScale = parseFloat(shape.dataset.scale || 1);
    shape.classList.add('interacting'); // pause animation
  });
});

window.addEventListener('mousemove', (e) => {
  // Timeline Drag
  if (draggingClip) {
    const dx = e.clientX - clipStartX;
    const dxPercent = (dx / clipTrackWidth) * 100;
    let newLeft = clipStartLeft + dxPercent;
    
    // Bounds check
    const clipWidth = parseFloat(draggingClip.style.width || 0);
    if (newLeft < 0) newLeft = 0;
    if (newLeft + clipWidth > 100) newLeft = 100 - clipWidth;
    
    draggingClip.style.left = `${newLeft}%`;
  }
  
  // Shape Resize
  if (resizingShape) {
    const dy = shapeStartY - e.clientY; // drag up to enlarge
    const scaleFactor = 0.01;
    let newScale = shapeStartScale + (dy * scaleFactor);
    if (newScale < 0.2) newScale = 0.2;
    if (newScale > 3) newScale = 3;
    
    resizingShape.dataset.scale = newScale;
    resizingShape.style.setProperty('--s', newScale);
  }
});

window.addEventListener('mouseup', () => {
  if (draggingClip) {
    draggingClip.style.transition = ''; // restore transition
    draggingClip = null;
  }
  if (resizingShape) {
    resizingShape.classList.remove('interacting'); // resume animation
    resizingShape = null;
  }
});

// Code Snippet Output Logic
const runCodeBtn = document.getElementById('runCodeBtn');
const codeOutput = document.getElementById('codeOutput');
if (runCodeBtn && codeOutput) {
  runCodeBtn.addEventListener('click', () => {
    if (codeOutput.style.display === 'none') {
      codeOutput.style.display = 'block';
      runCodeBtn.textContent = 'Hide Output';
    } else {
      codeOutput.style.display = 'none';
      runCodeBtn.textContent = 'Run Output';
    }
  });
}

// ===== CONTACT FORM =====
document.getElementById('cForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const txt = document.getElementById('sendTxt');
  const fName = document.getElementById('fName').value;
  const fEmail = document.getElementById('fEmail').value;
  const fMsg = document.getElementById('fMsg').value;
  
  txt.textContent = 'Transmitting...';
  
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: '3282e8fb-b4db-4b13-9123-d76bbc1298ff',
        name: fName,
        email: fEmail,
        message: fMsg
      })
    });
    
    const result = await response.json();
    
    if (response.status === 200) {
      txt.textContent = 'Message Sent ✦';
      this.reset();
    } else {
      txt.textContent = 'Error Sending';
      console.error(result);
    }
  } catch (error) {
    txt.textContent = 'Error Sending';
    console.error(error);
  }
  
  setTimeout(() => { txt.textContent = 'Send Message ✦'; }, 3000);
});

// ===== LOADER & THREE.JS INIT =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const ldTxt = document.getElementById('ldTxt');
    if(ldTxt) ldTxt.textContent = "System Ready";
    
    setTimeout(() => {
      document.getElementById('loader').classList.add('out');
      runStats();
      initThree();
    }, 800);
  }, 2000);
});

// ===== THREE.JS ENGINE =====
function initThree() {
  const canvas = document.getElementById('cv');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(65, w / h, 0.1, 400);

  // Volumetric Star Field — covers full camera flight path z:+25 → -295
  const galaxyGeo = new THREE.BufferGeometry();
  const galaxyCount = 10000;
  const positions = new Float32Array(galaxyCount * 3);
  const colors    = new Float32Array(galaxyCount * 3);

  const colorInside  = new THREE.Color(0xc084fc);
  const colorOutside = new THREE.Color(0x34d399);

  for(let i = 0; i < galaxyCount; i++) {
    const i3 = i * 3;
    const z = 25 + Math.random() * (-295 - 25); // +25 to -295
    let x, y, dist;

    if (i < galaxyCount * 0.55) {
      // Dense inner tube around camera flight path
      const theta = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.6) * 30;
      x = Math.cos(theta) * r;
      y = Math.sin(theta) * r;
      dist = r;
    } else if (i < galaxyCount * 0.85) {
      // Wide sparse cloud
      x = (Math.random() - 0.5) * 150;
      y = (Math.random() - 0.5) * 100;
      dist = Math.sqrt(x*x + y*y);
    } else {
      // Bright micro-core glow near origin
      x = (Math.random() - 0.5) * 10;
      y = (Math.random() - 0.5) * 10;
      dist = Math.sqrt(x*x + y*y);
    }

    positions[i3]   = x;
    positions[i3+1] = y;
    positions[i3+2] = z;

    const mixColor = colorInside.clone();
    mixColor.lerp(colorOutside, Math.min(dist / 80, 1));
    colors[i3]   = mixColor.r;
    colors[i3+1] = mixColor.g;
    colors[i3+2] = mixColor.b;
  }

  galaxyGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  galaxyGeo.setAttribute('color',    new THREE.BufferAttribute(colors,    3));

  const galaxyMat = new THREE.PointsMaterial({
    size: 0.13,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const galaxy = new THREE.Points(galaxyGeo, galaxyMat);
  scene.add(galaxy);

  // ---- THEME APPLICATOR (called after all meshes are created) ----
  let allPlanetMats = []; // populated after planets are built
  function applyTheme(dark) {
    if (dark) {
      renderer.setClearColor(0x050505, 0); 
      galaxyMat.blending = THREE.AdditiveBlending;
      galaxyMat.size = 0.08;
      galaxyMat.opacity = 0.60;
      colorInside.setHex(0xc084fc);
      colorOutside.setHex(0x34d399);
    } else {
      renderer.setClearColor(0xfaf8f5, 0); 
      galaxyMat.blending = THREE.NormalBlending;
      galaxyMat.size = 0.12;
      galaxyMat.opacity = 0.45;
      colorInside.setHex(0x7c3aed); 
      colorOutside.setHex(0x10b981);
    }

    // Update galaxy colors
    const posAttr = galaxyGeo.attributes.position.array;
    const colAttr = galaxyGeo.attributes.color.array;
    for(let i=0; i<galaxyCount; i++) {
      const dx = posAttr[i*3];
      const dy = posAttr[i*3+1];
      const radius = Math.sqrt(dx*dx + dy*dy);
      const mixColor = colorInside.clone();
      mixColor.lerp(colorOutside, Math.min(radius / 80, 1));
      colAttr[i*3] = mixColor.r;
      colAttr[i*3+1] = mixColor.g;
      colAttr[i*3+2] = mixColor.b;
    }
    galaxyGeo.attributes.color.needsUpdate = true;
    galaxyMat.needsUpdate = true;

    // Update planet material colors
    // [mat, darkColor, lightColor, darkOpacity, lightOpacity]
    allPlanetMats.forEach(([mat, darkHex, lightHex, darkOp, lightOp]) => {
      mat.color.setHex(dark ? darkHex : lightHex);
      mat.opacity = dark ? darkOp : lightOp;
      mat.needsUpdate = true;
    });
  }
  window._threeTheme = (dark) => { isDark = dark; applyTheme(dark); };


  const groups = [];
  function makeGroup() { const g = new THREE.Group(); scene.add(g); groups.push(g); return g; }

  // Planet placement logic: Camera tracks along Z axis from 10 to -240.
  // Planets are placed at X + 8 relative to the camera to stay on the right side.

  // G0: Home (Massive Torus Knot Wireframe)
  const g0 = makeGroup(); g0.position.set(8, 0, -20);
  const knotMesh = new THREE.Mesh(
    new THREE.TorusKnotGeometry(3.5, 0.8, 120, 16),
    new THREE.MeshBasicMaterial({ color: 0xc084fc, wireframe: true, transparent: true, opacity: 0.15 })
  );
  g0.add(knotMesh);

  // G1: Design (Octahedron with Inner Cube)
  const g1 = makeGroup(); g1.position.set(38, 10, -60);
  const octGeo = new THREE.OctahedronGeometry(3.5, 0);
  const dMesh = new THREE.Mesh(octGeo, new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true, transparent: true, opacity: 0.2 }));
  g1.add(dMesh);
  const innerCube = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 2.5, 2.5), 
    new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.15 })
  );
  g1.add(innerCube);

  // G2: Film (Cinematic Camera Lens Aperture)
  const g2 = makeGroup(); g2.position.set(-20, -20, -100);
  // Lens barrel — central cylinder
  const lensCyl = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 1.2, 1.5, 32, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xf87171, wireframe: true, transparent: true, opacity: 0.5 })
  );
  g2.add(lensCyl);
  // Aperture blades — thin boxes arranged radially
  const bladeCount = 8;
  const filmBlades = [];
  for(let i=0; i<bladeCount; i++) {
    const angle = (i / bladeCount) * Math.PI * 2;
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(3.5, 0.08, 0.3),
      new THREE.MeshBasicMaterial({ color: 0xf87171, transparent: true, opacity: 0.7 })
    );
    blade.rotation.z = angle;
    blade.userData.baseAngle = angle;
    g2.add(blade);
    filmBlades.push(blade);
  }
  // Focus ring — outer torus
  const focusRing = new THREE.Mesh(
    new THREE.TorusGeometry(4.2, 0.06, 16, 80),
    new THREE.MeshBasicMaterial({ color: 0xf87171, transparent: true, opacity: 0.4 })
  );
  g2.add(focusRing);
  // Inner aperture circle glow
  const apertureRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.2, 0.05, 16, 80),
    new THREE.MeshBasicMaterial({ color: 0xfca5a5, transparent: true, opacity: 0.9 })
  );
  g2.add(apertureRing);
  // Second outer ring
  const outerRing2 = new THREE.Mesh(
    new THREE.TorusGeometry(5.8, 0.04, 16, 80),
    new THREE.MeshBasicMaterial({ color: 0xf87171, transparent: true, opacity: 0.2 })
  );
  g2.add(outerRing2);

  // G3: Web (Node Cluster — Central Sphere + Orbiting Cubes + Rings)
  const g3 = makeGroup(); g3.position.set(15, 5, -130);
  // Central sphere (main node)
  const webCore = new THREE.Mesh(
    new THREE.IcosahedronGeometry(3, 1),
    new THREE.MeshBasicMaterial({ color: 0x34d399, wireframe: true, transparent: true, opacity: 0.4 })
  );
  g3.add(webCore);
  // Outer ring (like a browser viewport / orbit)
  const webRing = new THREE.Mesh(
    new THREE.TorusGeometry(5.5, 0.04, 16, 80),
    new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.5 })
  );
  g3.add(webRing);
  const webRing2 = new THREE.Mesh(
    new THREE.TorusGeometry(7, 0.03, 16, 80),
    new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.3 })
  );
  webRing2.rotation.x = Math.PI / 3;
  g3.add(webRing2);
  // Small orbiting node cubes
  const webNodes = [];
  for(let i=0; i<6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const node = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.8 })
    );
    node.userData.angle = angle;
    node.userData.radius = 5.5;
    g3.add(node);
    webNodes.push(node);
  }

  // G4: Education (Knowledge Stack — Detailed Books + Core)
  const g4 = makeGroup(); g4.position.set(-5, -5, -165);
  const eduBlocks = [];
  for(let i=0; i<8; i++) {
    const block = new THREE.Mesh(
      new THREE.BoxGeometry(4, 0.4, 3),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.5 })
    );
    block.position.y = (i * 0.5) - 2;
    block.rotation.y = i * 0.4;
    g4.add(block);
    eduBlocks.push(block);
    allPlanetMats.push([block.material, 0xf59e0b, 0xf59e0b, 0.50, 0.70]);

    // Add a 'spine' to the book
    const spine = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.4, 3),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.8 })
    );
    spine.position.x = -2;
    block.add(spine);
  }
  // Central glowing core of knowledge
  const eduCore = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.2, 1),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true, transparent: true, opacity: 0.4 })
  );
  eduCore.position.y = 2.5;
  g4.add(eduCore);
  allPlanetMats.push([eduCore.material, 0xf59e0b, 0xf59e0b, 0.40, 0.65]);

  // G5: Work / Projects (Detailed File Rack — Portfolio Storage)
  const g5 = makeGroup(); g5.position.set(20, 15, -200);
  const projFiles = [];
  for(let i=0; i<10; i++) {
    const fileGroup = new THREE.Group();
    const fileBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 4, 3),
      new THREE.MeshBasicMaterial({ color: 0xec4899, transparent: true, opacity: 0.4 })
    );
    fileGroup.add(fileBody);
    
    // Add a file tab
    const tab = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.6, 1),
      new THREE.MeshBasicMaterial({ color: 0xec4899, transparent: true, opacity: 0.8 })
    );
    tab.position.set(0, 2.3, (i % 2 === 0 ? 0.8 : -0.8));
    fileGroup.add(tab);

    fileGroup.position.x = (i * 0.6) - 3;
    fileGroup.rotation.z = 0.05;
    g5.add(fileGroup);
    projFiles.push(fileGroup);
    allPlanetMats.push([fileBody.material, 0xec4899, 0xec4899, 0.40, 0.65]);
    allPlanetMats.push([tab.material, 0xec4899, 0xec4899, 0.80, 1.00]);
  }
  const rackFrame = new THREE.Mesh(
    new THREE.BoxGeometry(6.5, 0.1, 3.5),
    new THREE.MeshBasicMaterial({ color: 0xec4899, transparent: true, opacity: 0.2 })
  );
  rackFrame.position.y = -2.1;
  g5.add(rackFrame);
  allPlanetMats.push([rackFrame.material, 0xec4899, 0xec4899, 0.20, 0.45]);

  // G6: Contact (Atomic Structure)
  const g6 = makeGroup(); g6.position.set(18, -10, -250);
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0x60a5fa, wireframe: true, transparent: true, opacity: 0.3 })
  );
  g6.add(core);
  for(let i=0; i<3; i++) {
    const orbit = new THREE.Mesh(
      new THREE.TorusGeometry(3.5, 0.05, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.4 })
    );
    orbit.rotation.x = Math.random() * Math.PI;
    orbit.rotation.y = Math.random() * Math.PI;
    g6.add(orbit);
  }

  // Register all planet materials for theme switching
  // Format: [material, darkHex, lightHex, darkOpacity, lightOpacity]
  allPlanetMats = [
    // G0 Home — purple torus knot
    [knotMesh.material,     0xc084fc, 0xc084fc, 0.15, 0.35],
    // G1 Design — cyan octahedron + inner cube
    [dMesh.material,        0x06b6d4, 0x06b6d4, 0.20, 0.45],
    [innerCube.material,    0x06b6d4, 0x06b6d4, 0.15, 0.35],
    // G2 Film — red lens parts
    [lensCyl.material,      0xf87171, 0xf87171, 0.50, 0.70],
    [focusRing.material,    0xf87171, 0xf87171, 0.40, 0.65],
    [apertureRing.material, 0xfca5a5, 0xfca5a5, 0.90, 1.00],
    [outerRing2.material,   0xf87171, 0xf87171, 0.20, 0.45],
    // G3 Web — green node cluster
    [webCore.material,      0x34d399, 0x34d399, 0.40, 0.70],
    [webRing.material,      0x34d399, 0x34d399, 0.50, 0.75],
    [webRing2.material,     0x34d399, 0x34d399, 0.30, 0.60],
    // G6 Contact — blue atomic core
    [core.material,         0x60a5fa, 0x60a5fa, 0.30, 0.60],
  ];
  
  // Also register film blades
  filmBlades.forEach(b => allPlanetMats.push([b.material, 0xf87171, 0xf87171, 0.70, 0.90]));
  // Register web node cubes
  webNodes.forEach(n => allPlanetMats.push([n.material, 0x34d399, 0x34d399, 0.80, 1.00]));

  // Register contact orbit rings
  g6.children.slice(1).forEach(o => allPlanetMats.push([o.material, 0x60a5fa, 0x60a5fa, 0.40, 0.70]));

  // Apply initial theme
  applyTheme(isDark);

  const CAM = [
    { pos: new THREE.Vector3(0, 0, 10), look: new THREE.Vector3(0, 0, -20) },        // Home
    { pos: new THREE.Vector3(30, 10, -50), look: new THREE.Vector3(38, 10, -60) },    // Design
    { pos: new THREE.Vector3(-30, -20, -82), look: new THREE.Vector3(-20, -20, -100) }, // Film
    { pos: new THREE.Vector3(5, 5, -110), look: new THREE.Vector3(15, 5, -130) },     // Web
    { pos: new THREE.Vector3(-15, -5, -150), look: new THREE.Vector3(-5, -5, -165) }, // Education
    { pos: new THREE.Vector3(10, 15, -190), look: new THREE.Vector3(20, 15, -200) }, // Work
    { pos: new THREE.Vector3(10, -10, -240), look: new THREE.Vector3(18, -10, -250) }  // Contact
  ];
  let cPos = new THREE.Vector3(0, 0, 10), cLook = new THREE.Vector3(0, 0, -20);
  let targetFov = 65;
  window._kick = () => { targetFov = 85; setTimeout(() => { targetFov = 65; }, 100); };
  const navLogo = document.getElementById('navLogo');
  
  let mxN = 0, myN = 0;
  const bgGlow = document.getElementById('bg-glow');
  document.addEventListener('mousemove', e => {
    mxN = (e.clientX / innerWidth - 0.5) * 2;
    myN = (e.clientY / innerHeight - 0.5) * 2;
    
    // Parallax the ambient glow
    if (bgGlow) {
      bgGlow.style.transform = `translate(calc(-50% + ${mxN * 10}vw), calc(-50% + ${myN * 10}vh))`;
    }
  });

  window.addEventListener('resize', () => {
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  });

  const clock = new THREE.Clock();
  
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const isMobile = window.innerWidth < 768;

    // Gentle star drift — gives motion without spinning a flat disc
    galaxy.position.x = Math.sin(t * 0.03) * 2;
    galaxy.position.y = Math.cos(t * 0.02) * 1;

    // Adjust galaxy opacity and size for mobile to reduce clutter but stay visible
    galaxyMat.opacity = isMobile ? 0.45 : (isDark ? 0.6 : 0.45);
    galaxyMat.size = isMobile ? 0.08 : (isDark ? 0.08 : 0.12);

    // Mouse-reactive tilt for all groups
    const tiltX = myN * 0.3;
    const tiltY = mxN * 0.3;
    [g0, g1, g2, g3, g4, g5, g6].forEach(g => {
      g.rotation.x += (tiltX - g.rotation.x) * 0.05;
      g.rotation.y += (tiltY - g.rotation.y) * 0.05;
    });

    // Always animate all objects since they are all visible in space
    knotMesh.rotation.y = t * 0.05;
    knotMesh.rotation.x = t * 0.03;

    dMesh.rotation.y = t * 0.12;
    dMesh.rotation.x = t * 0.08;
    innerCube.rotation.y = -t * 0.15;
    innerCube.rotation.z = -t * 0.1;

    // Film aperture animation
    const aperture = 0.8 + Math.sin(t * 0.8) * 0.5;
    filmBlades.forEach((blade, i) => {
      const baseAngle = blade.userData.baseAngle;
      blade.rotation.z = baseAngle + t * 0.2;
      const r = 1.5 + aperture;
      blade.position.set(Math.cos(baseAngle + t * 0.2) * r * 0.5, Math.sin(baseAngle + t * 0.2) * r * 0.5, 0);
    });
    lensCyl.rotation.y = t * 0.3;
    focusRing.rotation.z = -t * 0.1;
    apertureRing.rotation.z = t * 0.5;
    outerRing2.rotation.y = t * 0.05;

    webCore.rotation.y = t * 0.15;
    webCore.rotation.x = t * 0.08;
    webRing.rotation.z = t * 0.1;
    webRing2.rotation.y = t * 0.07;
    webNodes.forEach((node, i) => {
      const angle = node.userData.angle + t * 0.4;
      const r = node.userData.radius;
      node.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
      node.rotation.y = t + i;
    });

    eduBlocks.forEach((b, i) => {
      b.rotation.y = t * 0.2 + (i * 0.1);
    });
    eduCore.rotation.y = -t * 0.5;
    eduCore.rotation.x = t * 0.3;

    projFiles.forEach((f, i) => {
      f.position.y = Math.sin(t * 0.4 + i) * 0.15;
      f.rotation.z = Math.sin(t * 0.8 + i) * 0.05;
    });

    g6.children[0].rotation.y = t * 0.2;
    g6.children[0].rotation.x = t * 0.1;
    for(let i=1; i<g6.children.length; i++) {
      g6.children[i].rotation.x += 0.01;
      g6.children[i].rotation.y += 0.015;
    }

    // Smooth camera interpolation
    const tc = CAM[cur];

    // Correctly scale all planet groups for mobile
    [g0, g1, g2, g3, g4, g5, g6].forEach(g => {
      const s = isMobile ? 0.6 : 1.0;
      g.scale.set(s, s, s);
    });

    let targetPos = tc.pos.clone();
    let targetLook = tc.look.clone();
    
    if (isMobile) {
      // On mobile, we move the camera slightly back and up
      // to place the 3D objects in the lower half of the viewport
      // preventing overlap with the text in the upper half.
      targetPos.z += 8;
      targetPos.y += 12;
      targetLook.y -= 4;
    }

    cPos.lerp(targetPos, 0.04);
    cLook.lerp(targetLook, 0.04);

    // Smooth FOV interpolation
    camera.fov += (targetFov - camera.fov) * 0.08;
    camera.updateProjectionMatrix();
    
    camera.position.set(cPos.x + mxN * 1.5, cPos.y - myN * 1.5, cPos.z);
    camera.lookAt(cLook);

    // Reactive Logo Glow/Offset
    if (navLogo) {
      navLogo.style.transform = `translate(${mxN * 5}px, ${myN * 5}px)`;
      navLogo.style.textShadow = `${-mxN * 10}px ${-myN * 10}px 20px var(--accent-glow)`;
    }

    renderer.render(scene, camera);


  }
  animate();
}

// ===== PROJECT SHOWCASE UPLOAD WORKSPACE =====
let isWorkspaceOpen = false;
let currentTopicId = null;
let isAdminMode = localStorage.getItem('SM_admin_mode') === 'true';
let currentFilter = 'all';

const topics = [
  { id: 'brand', title: 'Graphic Design', category: 'Graphic Design', num: '01', desc: 'Sleek brand identities, custom typography, and layout designs.' },
  { id: 'film', title: 'Cinematic Editing', category: 'Cinematic Editing', num: '02', desc: 'Sleek visual cuts, precision grading, and high-fidelity sound design for cinematic storytelling.' },
  { id: 'web', title: 'Web Develop', category: 'Web Develop', num: '03', desc: 'Custom web platforms, interactive 3D systems, database tools, and AI computer vision applications.' }
];
/*
let uploadedProjects = JSON.parse(localStorage.getItem('SM_portfolio_projects'));
if (uploadedProjects) {
  // Safe migration: delete the deprecated category key without wiping the entire user database
  if (uploadedProjects.ai) {
    delete uploadedProjects.ai;
  }
  // Check if we need to update default projects (if they contain any old defaults)
  const hasOldBrand = !uploadedProjects.brand || uploadedProjects.brand.length === 0 || 
    uploadedProjects.brand.some(p => p.title === 'Zephyr Rebrand' || p.title === 'Aurora Cosmetics');
    
  const hasOldFilm = !uploadedProjects.film || uploadedProjects.film.length === 0 || 
    uploadedProjects.film.some(p => p.title === 'Chroma Horizon' || p.title === 'Neon Pulse Music Video');
    
  const hasOldWeb = !uploadedProjects.web || uploadedProjects.web.length === 0 || 
    uploadedProjects.web.some(p => p.title === 'Spatial Starfield Portfolio' || p.title === 'Metaverse Gallery');
  
  if (hasOldBrand) {
    uploadedProjects.brand = JSON.parse(JSON.stringify(defaultProjects.brand));
  }
  if (hasOldFilm) {
    uploadedProjects.film = JSON.parse(JSON.stringify(defaultProjects.film));
  }
  if (hasOldWeb) {
    uploadedProjects.web = JSON.parse(JSON.stringify(defaultProjects.web));
  }
  localStorage.setItem('SM_portfolio_projects', JSON.stringify(uploadedProjects));
} else {
  uploadedProjects = JSON.parse(JSON.stringify(defaultProjects));
}*/

// Helper: Scrape YouTube thumbnail automatically from watch link
function getYoutubeThumbnail(url) {
  if (!url) return '';
  let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  let match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`;
  }
  return '';
}

// Helper: Fetch Vimeo thumbnail using oEmbed API
async function getVimeoThumbnail(url) {
  if (!url) return '';
  let vimeoReg = /(?:vimeo\.com|player\.vimeo\.com)\/(?:[^\/]+\/)*(\d+)/;
  let match = url.match(vimeoReg);
  if (match) {
    try {
      const oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`;
      const res = await fetch(oembedUrl);
      if (res.ok) {
        const data = await res.json();
        return data.thumbnail_url || '';
      }
    } catch (e) {
      console.warn('Vimeo oEmbed fetch failed, falling back to API v2:', e);
      try {
        const res = await fetch(`https://vimeo.com/api/v2/video/${match[1]}.json`);
        if (res.ok) {
          const data = await res.json();
          return data[0].thumbnail_large || data[0].thumbnail_medium || '';
        }
      } catch (e2) {
        console.error('Vimeo API v2 fetch failed:', e2);
      }
    }
  }
  return '';
}

// Helper: Convert YouTube/Vimeo links to embeddable player links
function getVideoEmbedUrl(url) {
  if (!url) return '';
  let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  let match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=1`;
  }
  let vimeoReg = /(?:vimeo\.com|player\.vimeo\.com)\/(?:[^\/]+\/)*(\d+)(?:\/([a-zA-Z0-9]+))?/;
  let vimeoMatch = url.match(vimeoReg);
  if (vimeoMatch) {
    let embed = `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    if (vimeoMatch[2]) {
      embed += `&h=${vimeoMatch[2]}`;
    }
    return embed;
  }
  return url;
}

// Procedural image generator fallback
function generateProceduralThumbnail(title) {
  const canvas = document.createElement('canvas');
  canvas.width = 500;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');

  const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#ec4899';
  
  const grad = ctx.createLinearGradient(0, 0, 500, 300);
  grad.addColorStop(0, '#0a0a0a');
  grad.addColorStop(0.5, accentColor);
  grad.addColorStop(1, '#020202');
  
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 500, 300);
  
  // Cyberpunk grid overlay
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for(let i = 0; i < 500; i += 30) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 300);
    ctx.stroke();
  }
  for(let j = 0; j < 300; j += 30) {
    ctx.beginPath();
    ctx.moveTo(0, j);
    ctx.lineTo(500, j);
    ctx.stroke();
  }

  // Draw geometric overlay
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.beginPath();
  ctx.arc(250, 150, 60, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.arc(250, 150, 80, 0, Math.PI * 2);
  ctx.stroke();
  
  // Title Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title.toUpperCase(), 250, 150);

  return canvas.toDataURL('image/jpeg', 0.85);
}

function updateMainShowcaseDescriptions() {
  const projRows = document.querySelectorAll('.proj-row');
  const topicsList = ['brand', 'film', 'web'];
  
  projRows.forEach((row, index) => {
    const topicId = topicsList[index];
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;
    
    const descEl = row.querySelector('.proj-desc');
    const titleEl = row.querySelector('.proj-title');
    const catEl = row.querySelector('.pj-cat');
    
    if (titleEl) titleEl.textContent = topic.title;
    if (descEl) descEl.textContent = topic.desc;
    if (catEl) catEl.textContent = topic.category;
  });
}

function registerNewMagneticElements() {
  const newMagBtns = document.querySelectorAll('#workspace-overlay .mag-btn, #workspace-overlay .ws-card, #workspace-overlay .ws-card-link, #workspace-overlay .ws-card-delete-btn, #workspace-overlay .ws-visitor-contact-btn');
  newMagBtns.forEach(btn => {
    if (btn.dataset.magneticBound) return;
    btn.dataset.magneticBound = 'true';
    
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const str = btn.classList.contains('ws-card') ? 0.04 : 0.3;
      btn.style.transform = `translate(${x * str}px, ${y * str}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

function renderWorkspaceProjects() {
  const grid = document.getElementById('wsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  let projects = uploadedProjects[currentTopicId] || [];
  
  if (currentTopicId === 'brand' && currentFilter !== 'all') {
    projects = projects.filter(p => p.subCategory === currentFilter);
  } else if (currentTopicId === 'film' && currentFilter !== 'all') {
    projects = projects.filter(p => p.subCategory === currentFilter);
  }
  
  if (projects.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; padding: 40px; text-align: center; color: var(--muted); border: 1px dashed var(--border); border-radius: 8px; font-weight:300; font-size:14px;">No projects uploaded yet in this category.</div>`;
    return;
  }

  projects.forEach((proj, idx) => {
    const card = document.createElement('div');
    card.className = 'ws-card';
    
    let mediaHtml = '';
    const mediaType = proj.mediaType || 'image';
    const cleanTitle = proj.title || '';
    const aspectClass = (currentTopicId === 'brand') ? 'aspect-portrait' : 'aspect-landscape';
    
    if (mediaType === 'video') {
      mediaHtml = `
        <div class="ws-card-img-wrap ${aspectClass}">
          <video class="ws-card-video" src="${proj.mediaUrl}" autoplay loop muted playsinline></video>
        </div>
      `;
    } else if (mediaType === 'link') {
      let thumbUrl = proj.image || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80';
      if (thumbUrl.includes("vimeocdn.com")) {
        thumbUrl = thumbUrl.replace(/d_[0-9]+x[0-9]+/, "d_640");
      }
      mediaHtml = `
        <div class="ws-card-img-wrap ${aspectClass}">
          <img class="ws-card-img" src="${thumbUrl}" alt="${cleanTitle}" loading="lazy" />
          <div class="ws-card-play-overlay">
            <div class="ws-card-play-icon">▶</div>
          </div>
        </div>
      `;
    } else {
      const imgUrl = proj.image || generateProceduralThumbnail(cleanTitle || 'Design');
      if (proj.image2) {
        mediaHtml = `
          <div class="ws-card-img-wrap has-second-image ${aspectClass}">
            <img class="ws-card-img default-img" src="${imgUrl}" alt="${cleanTitle}" loading="lazy" />
            <img class="ws-card-img hover-img" src="${proj.image2}" alt="${cleanTitle}" loading="lazy" />
          </div>
        `;
      } else {
        mediaHtml = `
          <div class="ws-card-img-wrap ${aspectClass}">
            <img class="ws-card-img" src="${imgUrl}" alt="${cleanTitle}" loading="lazy" />
          </div>
        `;
      }
    }
    
    let displayCat = currentTopicId.toUpperCase();
    if (currentTopicId === 'brand' && proj.subCategory) {
      if (proj.subCategory === 'posters') displayCat = 'Poster';
      else if (proj.subCategory === 'brochure') displayCat = 'Brochure';
      else if (proj.subCategory === 'logo') displayCat = 'Logo';
      else if (proj.subCategory === 'invitation') displayCat = 'Invitation';
    } else if (currentTopicId === 'film' && proj.subCategory) {
      displayCat = proj.subCategory === 'productivity' ? 'Productivity Reels' : 'Trending Audio Reels';
    }
    
    const titleHtml = proj.title ? `<h4 class="ws-card-title">${proj.title}</h4>` : '';
    const descHtml = proj.desc ? `<p class="ws-card-desc">${proj.desc}</p>` : '';
    
    card.innerHTML = `
      ${mediaHtml}
      <div class="ws-card-body">
        <div class="ws-card-meta">
          <span class="ws-card-cat">${displayCat}</span>
        </div>
        ${titleHtml}
        ${descHtml}
        <div class="ws-card-footer">
          ${isAdminMode ? `<button class="ws-card-delete-btn" data-idx="${idx}">Delete</button>` : '<span></span>'}
          ${mediaType === 'link' ? `<span class="ws-card-link">Play Video →</span>` : (proj.link && proj.link !== '#' ? `<a href="${proj.link}" target="_blank" class="ws-card-link">View Site →</a>` : '')}
        </div>
      </div>
    `;
    
    // Lightbox triggers on card click
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('ws-card-delete-btn')) return;
      if (mediaType === 'link') {
        openLightbox(proj.mediaUrl, 'link');
      } else if (mediaType === 'video') {
        openLightbox(proj.mediaUrl, 'video');
      } else if (mediaType === 'image') {
        openLightbox(proj.image, 'image', proj.image2);
      }
    });
    
    grid.appendChild(card);
  });

  // Re-bind delete buttons
  grid.querySelectorAll('.ws-card-delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-idx'));
      const projectToDelete = projects[idx];
      const originalList = uploadedProjects[currentTopicId] || [];
      const origIdx = originalList.indexOf(projectToDelete);
      if (origIdx !== -1) {
        uploadedProjects[currentTopicId].splice(origIdx, 1);
        localStorage.setItem('SM_portfolio_projects', JSON.stringify(uploadedProjects));
        renderWorkspaceProjects();
        updateMainShowcaseDescriptions();
      }
    });
  });

  registerNewMagneticElements();
}

let lightboxImages = [];
let currentLightboxIndex = 0;

function renderLightboxContent(type, url) {
  const wrap = document.getElementById('wsLightboxPlayerWrap');
  if (!wrap) return;
  wrap.innerHTML = '';
  
  if (type === 'video') {
    wrap.innerHTML = `<video src="${url}" autoplay controls style="width:100%; height:100%; object-fit:contain; background:#000;"></video>`;
  } else if (type === 'image') {
    wrap.innerHTML = `<img src="${url}" style="width:100%; height:100%; object-fit:contain; background:#000;" />`;
  } else {
    const embedUrl = getVideoEmbedUrl(url);
    wrap.innerHTML = `<iframe src="${embedUrl}" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
  }
}

// Lightbox controller
function openLightbox(mediaUrl, type = 'link', mediaUrl2 = '') {
  const lightbox = document.getElementById('wsLightbox');
  const wrap = document.getElementById('wsLightboxPlayerWrap');
  const prevBtn = document.getElementById('wsLightboxPrev');
  const nextBtn = document.getElementById('wsLightboxNext');
  const content = lightbox ? lightbox.querySelector('.ws-lightbox-content') : null;
  if (!lightbox || !wrap) return;

  wrap.innerHTML = '';
  lightboxImages = [];
  currentLightboxIndex = 0;

  if (content) {
    if (type === 'image') {
      content.classList.remove('is-video');
      content.classList.add('is-image');
    } else {
      content.classList.remove('is-image');
      content.classList.add('is-video');
    }
  }

  if (type === 'image') {
    lightboxImages.push(mediaUrl);
    if (mediaUrl2) {
      lightboxImages.push(mediaUrl2);
    }
  }

  // Update navigation buttons display
  if (type === 'image' && lightboxImages.length > 1) {
    if (prevBtn) prevBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'flex';
  } else {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
  }

  renderLightboxContent(type, mediaUrl);
  lightbox.classList.add('active');
}

function closeLightbox() {
  const lightbox = document.getElementById('wsLightbox');
  const wrap = document.getElementById('wsLightboxPlayerWrap');
  const prevBtn = document.getElementById('wsLightboxPrev');
  const nextBtn = document.getElementById('wsLightboxNext');
  const content = lightbox ? lightbox.querySelector('.ws-lightbox-content') : null;
  
  if (lightbox) lightbox.classList.remove('active');
  if (prevBtn) prevBtn.style.display = 'none';
  if (nextBtn) nextBtn.style.display = 'none';
  if (content) {
    content.classList.remove('is-image');
    content.classList.remove('is-video');
  }
  if (wrap) setTimeout(() => { wrap.innerHTML = ''; }, 500);
}

function initLightbox() {
  const closeBtn = document.getElementById('wsLightboxClose');
  const lightbox = document.getElementById('wsLightbox');
  const prevBtn = document.getElementById('wsLightboxPrev');
  const nextBtn = document.getElementById('wsLightboxNext');
  
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (lightboxImages.length > 1) {
        currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
        renderLightboxContent('image', lightboxImages[currentLightboxIndex]);
      }
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (lightboxImages.length > 1) {
        currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
        renderLightboxContent('image', lightboxImages[currentLightboxIndex]);
      }
    });
  }
  
  window.addEventListener('keydown', (e) => {
    const lightboxEl = document.getElementById('wsLightbox');
    if (!lightboxEl || !lightboxEl.classList.contains('active')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      if (prevBtn && prevBtn.style.display !== 'none') prevBtn.click();
    } else if (e.key === 'ArrowRight') {
      if (nextBtn && nextBtn.style.display !== 'none') nextBtn.click();
    }
  });
}

// Admin Mode Manager
let logoClicks = 0;
let logoClickTimeout = null;

function setAdminMode(active) {
  isAdminMode = active;
  localStorage.setItem('SM_admin_mode', active ? 'true' : 'false');
  
  const visitorView = document.getElementById('wsVisitorView');
  const uploadForm = document.getElementById('wsUploadForm');
  const resetBtn = document.getElementById('wsResetBtn');
  const exitBtn = document.getElementById('wsExitAdminBtn');
  const unlockBtn = document.getElementById('wsAdminUnlockBtn');
  const resumeAdmin = document.getElementById('wsResumeAdminSection');
  
  if (visitorView) visitorView.style.display = active ? 'none' : 'block';
  if (uploadForm) uploadForm.style.display = active ? 'block' : 'none';
  if (resetBtn) resetBtn.style.display = active ? 'block' : 'none';
  if (resumeAdmin) resumeAdmin.style.display = active ? 'block' : 'none';
  
  if (exitBtn) exitBtn.style.display = active ? 'block' : 'none';
  if (unlockBtn) unlockBtn.style.display = active ? 'none' : 'block';
  
  renderWorkspaceProjects();
}

function triggerAdminLogin() {
  if (isAdminMode) {
    alert('Admin Mode is already unlocked.');
    return;
  }
  const pass = prompt('Enter Creator Passcode to enable Project Management:');
  if (pass === 'magic_smile') {
    setAdminMode(true);
    alert('Creator Mode Unlocked. Form and delete buttons are now visible!');
  } else if (pass !== null) {
    alert('Incorrect Passcode.');
  }
}

function initAdminHooks() {
  // Logo clicks (changed from 5 to 3 to make it much easier!)
  const navLogo = document.getElementById('navLogo');
  if (navLogo) {
    navLogo.addEventListener('click', (e) => {
      logoClicks++;
      clearTimeout(logoClickTimeout);
      logoClickTimeout = setTimeout(() => {
        if (logoClicks >= 3) {
          triggerAdminLogin();
        }
        logoClicks = 0;
      }, 1000);
    });
  }
  
  // Shortcut combo Ctrl + Shift + A
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      triggerAdminLogin();
    }
  });

  // Unlock Creator Mode Button click
  const unlockBtn = document.getElementById('wsAdminUnlockBtn');
  if (unlockBtn) {
    unlockBtn.addEventListener('click', () => {
      triggerAdminLogin();
    });
  }

  // Exit Admin Button click
  const exitBtn = document.getElementById('wsExitAdminBtn');
  if (exitBtn) {
    exitBtn.addEventListener('click', () => {
      setAdminMode(false);
      alert('Creator Mode locked. Returned to Visitor Mode.');
    });
  }
}

function openWorkspace(topicId) {
  currentTopicId = topicId;
  isWorkspaceOpen = true;
  currentFilter = 'all';
  
  const topic = topics.find(t => t.id === topicId);
  if (!topic) return;

  document.getElementById('wsTopicNum').textContent = topic.num;
  document.getElementById('wsTopicCategory').textContent = topic.category + ' WORKSPACE';
  document.getElementById('wsTopicTitle').textContent = topic.title;
  
  let wsColorVar = 'var(--work)';
  if (topicId === 'brand') wsColorVar = 'var(--design)';
  else if (topicId === 'film') wsColorVar = 'var(--video)';
  else if (topicId === 'web') wsColorVar = 'var(--web)';
  
  document.documentElement.style.setProperty('--accent', wsColorVar);
  
  // Show / Hide subcategory elements
  const brandFilter = document.getElementById('wsBrandFilterTabs');
  const brandGroup = document.getElementById('wsBrandSubCategoryGroup');
  const filmFilter = document.getElementById('wsFilmFilterTabs');
  const filmGroup = document.getElementById('wsFilmSubCategoryGroup');
  
  if (topicId === 'brand') {
    if (brandFilter) brandFilter.style.display = 'flex';
    if (brandGroup) brandGroup.style.display = 'block';
    if (filmFilter) filmFilter.style.display = 'none';
    if (filmGroup) filmGroup.style.display = 'none';
    // Make 'All' tab active in brand filter
    document.querySelectorAll('#wsBrandFilterTabs .ws-filter-tab').forEach(tab => {
      if (tab.getAttribute('data-filter') === 'all') tab.classList.add('active');
      else tab.classList.remove('active');
    });
  } else if (topicId === 'film') {
    if (brandFilter) brandFilter.style.display = 'none';
    if (brandGroup) brandGroup.style.display = 'none';
    if (filmFilter) filmFilter.style.display = 'flex';
    if (filmGroup) filmGroup.style.display = 'block';
    // Make 'All' tab active in film filter
    document.querySelectorAll('#wsFilmFilterTabs .ws-filter-tab').forEach(tab => {
      if (tab.getAttribute('data-filter') === 'all') tab.classList.add('active');
      else tab.classList.remove('active');
    });
  } else {
    if (brandFilter) brandFilter.style.display = 'none';
    if (brandGroup) brandGroup.style.display = 'none';
    if (filmFilter) filmFilter.style.display = 'none';
    if (filmGroup) filmGroup.style.display = 'none';
  }

  // Set correct Admin state displays on opening
  setAdminMode(isAdminMode);
  
  const overlay = document.getElementById('workspace-overlay');
  overlay.classList.add('active');
}

function closeWorkspace() {
  isWorkspaceOpen = false;
  const overlay = document.getElementById('workspace-overlay');
  overlay.classList.remove('active');
  document.documentElement.style.setProperty('--accent', 'var(--work)');
}

// Form Field switching display
function initFormFieldsSwitch() {
  const typeSelect = document.getElementById('wsMediaType');
  const fileElem = document.getElementById('wsFileElem');
  const linkGroup = document.getElementById('wsLinkGroup');
  const dropZone = document.getElementById('wsDropZone');
  
  if (!typeSelect || !fileElem || !linkGroup || !dropZone) return;
  
  typeSelect.addEventListener('change', () => {
    const val = typeSelect.value;
    resetImageUpload();
    
    if (val === 'image') {
      fileElem.setAttribute('accept', 'image/*');
      dropZone.style.display = 'flex';
      linkGroup.style.display = 'none';
      document.getElementById('wsProjLink').removeAttribute('required');
    } else if (val === 'video') {
      fileElem.setAttribute('accept', 'video/mp4');
      dropZone.style.display = 'flex';
      linkGroup.style.display = 'none';
      document.getElementById('wsProjLink').removeAttribute('required');
    } else if (val === 'link') {
      dropZone.style.display = 'none';
      linkGroup.style.display = 'block';
      document.getElementById('wsProjLink').setAttribute('required', 'true');
    }
  });
}

// Image drag-and-drop & browse handlers
// Image drag-and-drop & browse handlers
let uploadedBase64Images = [];

function handleImageFiles(files) {
  const typeSelect = document.getElementById('wsMediaType');
  const val = typeSelect ? typeSelect.value : 'image';
  
  if (val !== 'image') {
    // Video: only process the first video file
    const videoFiles = Array.from(files).filter(f => f.type.startsWith('video/'));
    if (videoFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadedBase64Images = [e.target.result];
        showPreviews();
      };
      reader.readAsDataURL(videoFiles[0]);
    }
    return;
  }
  
  // Image: process up to 2 image files
  const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
  if (imageFiles.length === 0) return;
  
  const remainingSlots = 2 - uploadedBase64Images.length;
  if (remainingSlots <= 0) {
    alert("You have already uploaded 2 images. Click 'x' to reset and start over.");
    return;
  }
  
  const filesToAdd = imageFiles.slice(0, remainingSlots);
  const limit = filesToAdd.length;
  let loaded = 0;
  
  filesToAdd.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedBase64Images.push(e.target.result);
      loaded++;
      if (loaded === limit) {
        showPreviews();
      }
    };
    reader.readAsDataURL(file);
  });
}

function showPreviews() {
  const imgPreview = document.getElementById('wsImagePreview');
  const imgPreview2 = document.getElementById('wsImagePreview2');
  const videoPreview = document.getElementById('wsVideoPreview');
  const uploadPrompt = document.getElementById('wsUploadPrompt');
  const previewWrap = document.getElementById('wsPreviewWrap');
  const typeSelect = document.getElementById('wsMediaType');
  const val = typeSelect ? typeSelect.value : 'image';

  if (val === 'image') {
    if (videoPreview) videoPreview.style.display = 'none';
    
    if (uploadedBase64Images.length > 0) {
      if (imgPreview) {
        imgPreview.src = uploadedBase64Images[0];
        imgPreview.style.display = 'block';
      }
    } else {
      if (imgPreview) imgPreview.style.display = 'none';
    }
    
    if (uploadedBase64Images.length > 1) {
      if (imgPreview2) {
        imgPreview2.src = uploadedBase64Images[1];
        imgPreview2.style.display = 'block';
      }
    } else {
      if (imgPreview2) imgPreview2.style.display = 'none';
    }
  } else {
    if (imgPreview) imgPreview.style.display = 'none';
    if (imgPreview2) imgPreview2.style.display = 'none';
    if (videoPreview && uploadedBase64Images.length > 0) {
      videoPreview.src = uploadedBase64Images[0];
      videoPreview.style.display = 'block';
    }
  }
  
  if (uploadedBase64Images.length > 0) {
    if (uploadPrompt) uploadPrompt.style.display = 'none';
    if (previewWrap) previewWrap.style.display = 'block';
  } else {
    if (uploadPrompt) uploadPrompt.style.display = 'block';
    if (previewWrap) previewWrap.style.display = 'none';
  }
}

function resetImageUpload() {
  uploadedBase64Images = [];
  const fileElem = document.getElementById('wsFileElem');
  const imgPreview = document.getElementById('wsImagePreview');
  const imgPreview2 = document.getElementById('wsImagePreview2');
  const videoPreview = document.getElementById('wsVideoPreview');
  const previewWrap = document.getElementById('wsPreviewWrap');
  const uploadPrompt = document.getElementById('wsUploadPrompt');

  if (fileElem) fileElem.value = '';
  if (imgPreview) {
    imgPreview.src = '';
    imgPreview.style.display = 'none';
  }
  if (imgPreview2) {
    imgPreview2.src = '';
    imgPreview2.style.display = 'none';
  }
  if (videoPreview) {
    videoPreview.src = '';
    videoPreview.style.display = 'none';
  }
  if (previewWrap) previewWrap.style.display = 'none';
  if (uploadPrompt) uploadPrompt.style.display = 'block';
}

function initWorkspaceUploadZone() {
  const dropZone = document.getElementById('wsDropZone');
  const fileElem = document.getElementById('wsFileElem');
  const removeBtn = document.getElementById('wsRemovePreviewBtn');

  if (!dropZone || !fileElem) return;

  dropZone.addEventListener('click', (e) => {
    if (e.target === removeBtn || removeBtn.contains(e.target)) return;
    fileElem.click();
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
    }, false);
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      handleImageFiles(files);
    }
  }, false);

  fileElem.addEventListener('change', (e) => {
    if (fileElem.files.length > 0) {
      handleImageFiles(fileElem.files);
    }
  });

  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      resetImageUpload();
    });
  }
}

function initWorkspaceForm() {
  const form = document.getElementById('wsUploadForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const mediaType = document.getElementById('wsMediaType').value;
    const rawLink = document.getElementById('wsProjLink').value.trim();
    
    let subCategory = '';
    if (currentTopicId === 'brand') {
      subCategory = document.getElementById('wsBrandSubCategory') ? document.getElementById('wsBrandSubCategory').value : '';
    } else if (currentTopicId === 'film') {
      subCategory = document.getElementById('wsFilmSubCategory') ? document.getElementById('wsFilmSubCategory').value : '';
    }

    if (mediaType === 'link' && !rawLink) return;
    if (mediaType !== 'link' && uploadedBase64Images.length === 0) {
      alert('Please upload a file first.');
      return;
    }

    let finalImage = '';
    let finalImage2 = '';
    let finalMediaUrl = '';

    if (mediaType === 'image') {
      finalImage = uploadedBase64Images[0] || generateProceduralThumbnail('Upload');
      finalImage2 = uploadedBase64Images[1] || '';
    } else if (mediaType === 'video') {
      finalMediaUrl = uploadedBase64Images[0] || '';
      finalImage = generateProceduralThumbnail('Upload');
    } else if (mediaType === 'link') {
      finalMediaUrl = rawLink;
      const ytThumb = getYoutubeThumbnail(rawLink);
      if (ytThumb) {
        finalImage = ytThumb;
      } else {
        const vimeoThumb = await getVimeoThumbnail(rawLink);
        finalImage = vimeoThumb || generateProceduralThumbnail('Upload');
      }
    }

    const newProject = {
      mediaType,
      title: '',
      year: '',
      desc: '',
      image: finalImage,
      image2: finalImage2,
      mediaUrl: finalMediaUrl,
      link: '#',
      subCategory: subCategory
    };

    if (!uploadedProjects[currentTopicId]) {
      uploadedProjects[currentTopicId] = [];
    }

    uploadedProjects[currentTopicId].push(newProject);
    localStorage.setItem('SM_portfolio_projects', JSON.stringify(uploadedProjects));

    renderWorkspaceProjects();
    updateMainShowcaseDescriptions();

    form.reset();
    resetImageUpload();
  });
}

function initWorkspaceFilters() {
  const tabs = document.querySelectorAll('.ws-filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const parent = tab.parentElement;
      parent.querySelectorAll('.ws-filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.getAttribute('data-filter');
      renderWorkspaceProjects();
    });
  });
}

function updateResumeButtons() {
  const resumeData = localStorage.getItem('SM_portfolio_resume') || './Srini.pdf';
  const downloadBtns = document.querySelectorAll('.resume-download-btn');
  const statusEl = document.getElementById('wsResumeStatus');
  
  downloadBtns.forEach(btn => {
    btn.setAttribute('href', resumeData);
    if (resumeData.startsWith('data:application/pdf') || resumeData.endsWith('.pdf')) {
      btn.setAttribute('download', 'Srini.pdf');
    } else {
      btn.setAttribute('download', 'Srini.txt');
    }
  });

  if (statusEl) {
    if (localStorage.getItem('SM_portfolio_resume')) {
      statusEl.textContent = 'Custom PDF resume is active (Browser Storage) ✦';
      statusEl.style.color = 'var(--accent)';
    } else {
      statusEl.textContent = 'File-based fallback active (Srini.pdf in root)';
      statusEl.style.color = 'var(--muted)';
    }
  }
}

function initResumeManagement() {
  const resumeInput = document.getElementById('wsResumeFile');
  if (resumeInput) {
    resumeInput.addEventListener('change', (e) => {
      const file = resumeInput.files[0];
      if (!file) return;
      
      if (file.type !== 'application/pdf') {
        alert('Please upload a valid PDF file for your resume.');
        resumeInput.value = '';
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          localStorage.setItem('SM_portfolio_resume', event.target.result);
          updateResumeButtons();
          alert('Resume uploaded and updated successfully!');
        } catch (error) {
          console.error(error);
          alert('Failed to save resume. The file size might be too large for browser storage.');
        }
      };
      reader.readAsDataURL(file);
    });
  }
  updateResumeButtons();
}

function initWorkspace() {
  const projRows = document.querySelectorAll('.proj-row');
  const topicsList = ['brand', 'film', 'web'];
  
  projRows.forEach((row, index) => {
    row.addEventListener('click', () => {
      const topicId = topicsList[index];
      if (topicId) openWorkspace(topicId);
    });
  });

  const backBtn = document.getElementById('wsBackBtn');
  if (backBtn) {
    backBtn.addEventListener('click', closeWorkspace);
  }

  const resetBtn = document.getElementById('wsResetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset the showcase? This will revert back to the original projects and delete all custom uploads.')) {
       /* uploadedProjects = JSON.parse(JSON.stringify(defaultProjects));*/
        localStorage.setItem('SM_portfolio_projects', JSON.stringify(uploadedProjects));
        renderWorkspaceProjects();
        updateMainShowcaseDescriptions();
      }
    });
  }

  initWorkspaceUploadZone();
  initWorkspaceForm();
  initWorkspaceFilters();
  initFormFieldsSwitch();
  initLightbox();
  initAdminHooks();
  initResumeManagement();
  updateMainShowcaseDescriptions();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWorkspace);
} else {
  initWorkspace();
}

