/* ==========================================================================
   TULIPA — FRONTEND LOGIC & ANIMATIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Register ScrollTrigger plugin with GSAP
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // Initialize all components
  initCustomCursor();
  initHeroParallax();
  generateFieldTulips();
  initColorWalk();
  initBloomGallery();
  initMonsoonMoment();
  initTulipStudio();
  initNavigation();
  initMagneticButtons();
});

/* ==========================================================================
   1. CUSTOM CURSOR
   ========================================================================== */

const cursorState = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  trail: [],
  color: '#E8A0BF',
  activeSize: 1, // multiplier for cursor size on hover
  targetActiveSize: 1
};

const sectionColors = {
  hero: '#E8A0BF',
  'color-walk': '#9B5DE5',
  gallery: '#2A5C45', // dark green when in white gallery
  monsoon: 'rgba(240, 234, 248, 0.9)',
  studio: '#9B5DE5', // will dynamic update
  footer: '#F4C842' // golden hour in footer
};

function initCustomCursor() {
  const canvas = document.getElementById('cursor-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  window.addEventListener('mousemove', (e) => {
    cursorState.x = e.clientX;
    cursorState.y = e.clientY;
    cursorState.trail.push({ x: e.clientX, y: e.clientY, age: 0 });
    if (cursorState.trail.length > 20) cursorState.trail.shift();
  });

  // Track hoverable elements to resize cursor
  const addHoverListeners = () => {
    document.querySelectorAll('a, button, .interactive, input, select, [role="button"], .progress-dot, .preset-btn, .second-preset-btn, .shape-card, .stage-btn, .petal-count-btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorState.targetActiveSize = 2.2;
      });
      el.addEventListener('mouseleave', () => {
        cursorState.targetActiveSize = 1.0;
      });
    });
  };
  addHoverListeners();

  // Re-run on dynamic updates
  const observer = new MutationObserver(addHoverListeners);
  observer.observe(document.body, { childList: true, subtree: true });

  // Section Observer for Dynamic Colors
  const sections = document.querySelectorAll('section, footer');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.dataset.section || entry.target.id;
        if (sectionColors[sectionId]) {
          cursorState.color = sectionColors[sectionId];
        }
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sectionObserver.observe(s));

  // Loop
  function drawCursor() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Smooth size transitions
    cursorState.activeSize += (cursorState.targetActiveSize - cursorState.activeSize) * 0.15;

    // Draw trail (fading petals)
    for (let i = 0; i < cursorState.trail.length; i++) {
      const point = cursorState.trail[i];
      const progress = i / cursorState.trail.length;
      const alpha = progress * 0.35;
      const size = progress * 10 * cursorState.activeSize + 2;
      
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = cursorState.color;
      ctx.beginPath();
      // Ellipse rotation creates organic petal feel
      const angle = progress * Math.PI * 0.3;
      ctx.translate(point.x, point.y);
      ctx.rotate(angle);
      ctx.ellipse(0, 0, size * 0.35, size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      point.age++;
    }
    
    // Draw main cursor petal
    const { x, y, color, activeSize } = cursorState;
    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(x, y - 5, 4.5 * activeSize, 11 * activeSize, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Petal center highlight
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.ellipse(x - 1, y - 7, 1.5 * activeSize, 4.5 * activeSize, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    requestAnimationFrame(drawCursor);
  }
  
  drawCursor();
}

/* ==========================================================================
   2. HERO PARALLAX & LOAD ANIMATION
   ========================================================================== */

function initHeroParallax() {
  // GSAP Parallax scrolling bindings
  gsap.to(".hero-layer-far", {
    yPercent: -15,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  gsap.to(".hero-layer-mid", {
    yPercent: -35,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  gsap.to(".hero-layer-near", {
    yPercent: -50,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  gsap.to(".hero-mist", {
    yPercent: -12,
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  gsap.to(".hero-ui", {
    yPercent: -20,
    opacity: 0.1,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  // Hero Loading Timeline (GSAP)
  const tl = gsap.timeline();
  
  // Set initial states
  gsap.set(".hero-eyebrow, .hero-subtitle, .hero-scroll-cue", { opacity: 0 });
  
  // Stagger reveal of title letters
  const titleEl = document.querySelector(".hero-title");
  if (titleEl) {
    const text = titleEl.textContent.trim();
    titleEl.innerHTML = text.split("").map(char => {
      if (char === " ") return "&nbsp;";
      return `<span class="letter" style="display:inline-block; opacity:0; transform:translateY(25px);">${char}</span>`;
    }).join("");
  }

  // Load animation execution
  tl.to(".hero-section", {
    backgroundColor: "transparent", // Fade from void dark back to dawn gradient
    duration: 1.2,
    ease: "power2.out"
  })
  .to(".letter", {
    opacity: 1,
    y: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: "power4.out"
  }, "-=0.6")
  .to(".hero-eyebrow", {
    opacity: 0.7,
    duration: 0.6,
    ease: "power2.out"
  }, "-=0.4")
  .to(".hero-subtitle", {
    opacity: 0.75,
    duration: 0.6,
    ease: "power2.out"
  }, "-=0.4")
  .to(".hero-scroll-cue", {
    opacity: 0.6,
    duration: 0.6,
    ease: "power2.out"
  }, "-=0.2");
}

/* ==========================================================================
   3. TULIP GENERATION
   ========================================================================== */

function generateFieldTulips() {
  const farLayer = document.querySelector('.hero-layer-far');
  const midLayer = document.querySelector('.hero-layer-mid');
  const nearLayer = document.querySelector('.hero-layer-near');

  // Helper to generate a single CSS Tulip element
  const createTulipElement = (height, bloomSize, colorPalette, swayFactor) => {
    const tulip = document.createElement('div');
    tulip.className = 'tulip';
    
    // Choose random color from palette
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    const heightPx = height + Math.floor(Math.random() * (height * 0.4));
    const widthPx = bloomSize + Math.floor(Math.random() * (bloomSize * 0.3));
    const delay = Math.random() * 3;
    const duration = 3.5 + Math.random() * 3;
    const sway = 0.5 + Math.random() * swayFactor;

    tulip.style.setProperty('--petal-color', color);
    tulip.style.setProperty('--stem-height', `${heightPx}px`);
    tulip.style.setProperty('--bloom-width', `${widthPx}px`);
    tulip.style.setProperty('--bloom-height', `${widthPx * 1.2}px`);
    tulip.style.setProperty('--sway-delay', `${delay}s`);
    tulip.style.setProperty('--sway-duration', `${duration}s`);
    tulip.style.setProperty('--sway-intensity', `${sway}`);

    const bloom = document.createElement('div');
    bloom.className = 'tulip-bloom';
    
    const stem = document.createElement('div');
    stem.className = 'tulip-stem';

    // Leaves
    if (Math.random() > 0.35) {
      const leftLeaf = document.createElement('div');
      leftLeaf.className = 'tulip-leaf left';
      stem.appendChild(leftLeaf);
    }
    if (Math.random() > 0.35) {
      const rightLeaf = document.createElement('div');
      rightLeaf.className = 'tulip-leaf right';
      stem.appendChild(rightLeaf);
    }

    tulip.appendChild(bloom);
    tulip.appendChild(stem);
    return tulip;
  };

  // Hero layer color palettes (misty pinks, soft purples, glowing golds)
  const heroColors = ['#E8A0BF', '#FFB3C6', '#9B5DE5', '#C77DFF', '#F4C842', '#FF85A1'];

  // Fill Far Layer
  if (farLayer) {
    for (let i = 0; i < 20; i++) {
      const tulip = createTulipElement(45, 12, ['#1A0A2E'], 0.5); // silhouettes
      tulip.style.left = `${(i / 19) * 100}%`;
      farLayer.appendChild(tulip);
    }
  }

  // Fill Mid Layer
  if (midLayer) {
    for (let i = 0; i < 30; i++) {
      const tulip = createTulipElement(85, 24, heroColors, 1.2);
      tulip.style.left = `${(i / 29) * 100}%`;
      midLayer.appendChild(tulip);
    }
  }

  // Fill Near Layer
  if (nearLayer) {
    for (let i = 0; i < 15; i++) {
      const tulip = createTulipElement(145, 38, heroColors, 2.0);
      tulip.style.left = `${(i / 14) * 100}%`;
      nearLayer.appendChild(tulip);
    }
  }
}

/* ==========================================================================
   4. SECTION 2 — COLOR WALK (Horizontal Pinned Scroll)
   ========================================================================== */

function initColorWalk() {
  const track = document.querySelector('.color-walk-track');
  const panels = document.querySelectorAll('.color-walk-panel');
  if (!track || panels.length === 0) return;

  // Initialize field tulips for each zone panel
  const zonePalettes = [
    ['#E63946', '#C1121F', '#8B0000', '#FF6B6B'], // Red
    ['#FFB3C6', '#FF85A1', '#E8A0BF', '#FFF0F3'], // Pink
    ['#9B5DE5', '#C77DFF', '#7B2D8B', '#E0AAFF'], // Purple
    ['#F4C842', '#F77F00', '#FCBF49', '#EAE2B7'], // Gold
    ['#F8F9FA', '#E9ECEF', '#CED4DA', '#F0EAF8']  // White
  ];

  panels.forEach((panel, panelIndex) => {
    const container = panel.querySelector('.field-container');
    if (!container) return;

    const count = panelIndex === 4 ? 18 : (panelIndex === 2 ? 20 : (panelIndex === 1 ? 25 : 22));
    const palette = zonePalettes[panelIndex];

    for (let i = 0; i < count; i++) {
      const isForeground = i % 3 === 0;
      const height = isForeground ? 160 : (i % 2 === 0 ? 110 : 70);
      const size = isForeground ? 38 : (i % 2 === 0 ? 26 : 18);
      const opacity = isForeground ? 1.0 : (i % 2 === 0 ? 0.75 : 0.45);
      
      const tulip = document.createElement('div');
      tulip.className = 'tulip';
      
      const color = palette[Math.floor(Math.random() * palette.length)];
      const heightPx = height + Math.floor(Math.random() * (height * 0.35));
      const widthPx = size + Math.floor(Math.random() * (size * 0.3));
      const duration = 3.5 + Math.random() * 3;
      const sway = 0.5 + Math.random() * (isForeground ? 1.8 : 0.8);
      
      tulip.style.setProperty('--petal-color', color);
      tulip.style.setProperty('--stem-height', `${heightPx}px`);
      tulip.style.setProperty('--bloom-width', `${widthPx}px`);
      tulip.style.setProperty('--bloom-height', `${widthPx * 1.2}px`);
      tulip.style.setProperty('--sway-delay', `${Math.random() * 3}s`);
      tulip.style.setProperty('--sway-duration', `${duration}s`);
      tulip.style.setProperty('--sway-intensity', `${sway}`);
      tulip.style.opacity = opacity;
      tulip.style.left = `${(i / (count - 1)) * 94 + 3}%`;
      tulip.style.zIndex = isForeground ? 15 : (i % 2 === 0 ? 8 : 4);

      const bloom = document.createElement('div');
      bloom.className = 'tulip-bloom';
      
      const stem = document.createElement('div');
      stem.className = 'tulip-stem';

      if (Math.random() > 0.3) {
        const leftLeaf = document.createElement('div');
        leftLeaf.className = 'tulip-leaf left';
        stem.appendChild(leftLeaf);
      }
      if (Math.random() > 0.3) {
        const rightLeaf = document.createElement('div');
        rightLeaf.className = 'tulip-leaf right';
        stem.appendChild(rightLeaf);
      }

      tulip.appendChild(bloom);
      tulip.appendChild(stem);
      container.appendChild(tulip);
    }
  });

  // Setup GSAP scroll trigger for horizontal scrolling
  const scrollTween = gsap.to(track, {
    x: () => -(track.scrollWidth - window.innerWidth),
    ease: "none",
    scrollTrigger: {
      trigger: ".color-walk-section",
      pin: true,
      scrub: 1,
      start: "top top",
      end: () => "+=" + (track.scrollWidth - window.innerWidth),
      invalidateOnRefresh: true
    }
  });

  // Monitor horizontal progress to update progress dots
  const progressDots = document.querySelectorAll('.progress-dot');
  
  ScrollTrigger.create({
    trigger: ".color-walk-section",
    start: "top top",
    end: () => "+=" + (track.scrollWidth - window.innerWidth),
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;
      const activeIdx = Math.min(Math.floor(progress * panels.length), panels.length - 1);
      
      progressDots.forEach((dot, idx) => {
        if (idx === activeIdx) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
  });
}

/* ==========================================================================
   5. SECTION 3 — BLOOM GALLERY
   ========================================================================== */

function initBloomGallery() {
  const cards = document.querySelectorAll('.bloom-card');
  if (cards.length === 0) return;

  // Stagger entry animation
  gsap.from(".bloom-card", {
    opacity: 0,
    y: 70,
    clipPath: "inset(0 0 100% 0)",
    duration: 0.9,
    stagger: 0.12,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".gallery-section",
      start: "top 70%",
      toggleActions: "play none none none"
    }
  });

  // Interactive custom SVG drawing inside each card container
  const svgs = [
    // 1. Darwin Hybrid Red
    { color: '#E63946', count: 5, shape: 'rounded', stage: 'blooming', colors: ['#E63946', '#C1121F', '#8B0000'] },
    // 2. Parrot Purple
    { color: '#9B5DE5', count: 6, shape: 'ruffled', stage: 'open', colors: ['#9B5DE5', '#7B2D8B', '#C77DFF'] },
    // 3. Fringed Blush
    { color: '#FFB3C6', count: 8, shape: 'ruffled', stage: 'blooming', colors: ['#FFB3C6', '#E8A0BF', '#FF85A1'] },
    // 4. Triumph White
    { color: '#F8F9FA', count: 5, shape: 'pointed', stage: 'waking', colors: ['#F8F9FA', '#E0D7F0', '#D4D4D4'] },
    // 5. Viridiflora
    { color: '#52B788', count: 5, shape: 'pointed', stage: 'bud', colors: ['#52B788', '#2A5C45', '#F0EAF8'] },
    // 6. Double Late Peony
    { color: '#FF85A1', count: 8, shape: 'rounded', stage: 'open', colors: ['#FF85A1', '#C9184A', '#E8A0BF'] }
  ];

  cards.forEach((card, idx) => {
    const container = card.querySelector('.card-svg-container');
    if (!container) return;

    const data = svgs[idx];
    
    // Draw initial static/closed version
    container.innerHTML = generateTulipSVG({
      petalColor: data.color,
      petalCount: data.count,
      stemHeight: 80,
      shape: data.shape,
      stage: 'bud' // start closed
    });

    // Animate to full size on hover
    card.addEventListener('mouseenter', () => {
      gsap.to(container, {
        scale: 1.08,
        duration: 0.4,
        ease: 'power2.out',
        onStart: () => {
          container.innerHTML = generateTulipSVG({
            petalColor: data.color,
            petalCount: data.count,
            stemHeight: 85,
            shape: data.shape,
            stage: data.stage // open up!
          });
        }
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(container, {
        scale: 1.0,
        duration: 0.5,
        ease: 'power2.out',
        onStart: () => {
          container.innerHTML = generateTulipSVG({
            petalColor: data.color,
            petalCount: data.count,
            stemHeight: 80,
            shape: data.shape,
            stage: 'bud' // close back
          });
        }
      });
    });

    // Swatches render
    const swatchContainer = card.querySelector('.card-swatches');
    if (swatchContainer) {
      swatchContainer.innerHTML = '';
      data.colors.forEach(col => {
        const swatch = document.createElement('div');
        swatch.className = 'swatch';
        swatch.style.backgroundColor = col;
        swatchContainer.appendChild(swatch);
      });
    }
  });
}

/* ==========================================================================
   6. SECTION 4 — MONSOON MOMENT (Rain simulation & synthesized audio)
   ========================================================================== */

let activeRainSimulation = null;
let rainAudioNode = null;

function initMonsoonMoment() {
  const canvas = document.getElementById('monsoon-canvas');
  if (!canvas) return;

  activeRainSimulation = new RainCanvas(canvas);
  
  // Set up resize handler
  const resizeCanvas = () => {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Play animation only when monsoon section is in viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeRainSimulation.start();
      } else {
        activeRainSimulation.stop();
        if (rainAudioNode) {
          // Pause rain sound if out of viewport
          muteRainSynth();
        }
      }
    });
  }, { threshold: 0.1 });
  
  observer.observe(canvas.parentElement);

  // Rain sound synth toggle binding
  const toggleBtn = document.getElementById('rain-audio-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      toggleRainSynth(toggleBtn);
    });
  }
}

// Canvas animation classes
class RainCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.drops = [];
    this.petals = [];
    this.animationFrameId = null;
    this.isRunning = false;
    this.init();
  }

  init() {
    this.drops = [];
    this.petals = [];

    // 200 rain streaks
    for (let i = 0; i < 200; i++) {
      this.drops.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        length: 8 + Math.random() * 12,
        speed: 5 + Math.random() * 6,
        opacity: 0.15 + Math.random() * 0.35,
        angle: 12 + Math.random() * 8
      });
    }

    // 40 falling petals
    const petalColors = ['#E8A0BF', '#9B5DE5', '#F4C842', '#FFB3C6', '#C77DFF', '#FF85A1'];
    for (let i = 0; i < 40; i++) {
      this.petals.push({
        x: Math.random() * this.canvas.width,
        y: -Math.random() * this.canvas.height,
        size: 7 + Math.random() * 11,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        speedY: 0.6 + Math.random() * 1.2,
        drift: (Math.random() - 0.5) * 0.6,
        opacity: 0.55 + Math.random() * 0.4
      });
    }
  }

  drawDrop(drop) {
    const ctx = this.ctx;
    const rad = (drop.angle * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(
      drop.x + Math.sin(rad) * drop.length,
      drop.y + Math.cos(rad) * drop.length
    );
    ctx.strokeStyle = `rgba(240, 234, 248, ${drop.opacity})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  drawPetal(petal) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(petal.x, petal.y);
    ctx.rotate((petal.rotation * Math.PI) / 180);
    ctx.globalAlpha = petal.opacity * (1.1 - petal.y / this.canvas.height);
    ctx.beginPath();
    ctx.ellipse(0, 0, petal.size * 0.4, petal.size, 0, 0, Math.PI * 2);
    ctx.fillStyle = petal.color;
    ctx.fill();
    ctx.restore();
  }

  animate() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Animate drops
    for (const drop of this.drops) {
      this.drawDrop(drop);
      const rad = (drop.angle * Math.PI) / 180;
      drop.x += Math.sin(rad) * drop.speed * 0.5;
      drop.y += Math.cos(rad) * drop.speed;
      if (drop.y > this.canvas.height) {
        drop.y = -drop.length;
        drop.x = Math.random() * this.canvas.width;
      }
    }

    // Animate petals
    for (const petal of this.petals) {
      this.drawPetal(petal);
      petal.y += petal.speedY;
      petal.x += petal.drift;
      petal.rotation += petal.rotationSpeed;
      if (petal.y > this.canvas.height + 20) {
        petal.y = -20;
        petal.x = Math.random() * this.canvas.width;
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

// Synthesizer Web Audio API for ambient rain
let audioCtx = null;
let noiseNode = null;
let rainGainNode = null;
let dripTimer = null;

function toggleRainSynth(button) {
  if (!audioCtx) {
    // Lazy initialize AudioContext on user interaction
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  const label = button.querySelector('.rain-label');

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (noiseNode) {
    // It's playing, so mute it
    muteRainSynth();
    label.textContent = 'RAIN · OFF';
  } else {
    // Start synthesizing
    startRainSynth();
    label.textContent = 'RAIN · ON';
  }
}

function startRainSynth() {
  if (!audioCtx) return;

  // Create gain node for overall volume control
  rainGainNode = audioCtx.createGain();
  rainGainNode.gain.setValueAtTime(0.0, audioCtx.currentTime);
  rainGainNode.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 1.5); // soft fade in

  // Generate White Noise Buffer
  const bufferSize = 2 * audioCtx.sampleRate;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  noiseNode = audioCtx.createBufferSource();
  noiseNode.buffer = noiseBuffer;
  noiseNode.loop = true;

  // Create high-pass and low-pass filter to model soft rain
  const lowpassFilter = audioCtx.createBiquadFilter();
  lowpassFilter.type = 'lowpass';
  lowpassFilter.frequency.value = 800; // soft mist hum

  const highpassFilter = audioCtx.createBiquadFilter();
  highpassFilter.type = 'highpass';
  highpassFilter.frequency.value = 150; // remove heavy low-end rumble

  // Connect
  noiseNode.connect(highpassFilter);
  highpassFilter.connect(lowpassFilter);
  lowpassFilter.connect(rainGainNode);
  rainGainNode.connect(audioCtx.destination);

  noiseNode.start(0);

  // Periodic Synthesized Drips
  const scheduleNextDrip = () => {
    if (!noiseNode) return; // stopped
    
    // Random interval
    const delay = 250 + Math.random() * 800;
    dripTimer = setTimeout(() => {
      playDripSound();
      scheduleNextDrip();
    }, delay);
  };
  scheduleNextDrip();
}

function playDripSound() {
  if (!audioCtx || audioCtx.state === 'suspended' || !noiseNode) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  // Drip sound starts high and pitch drops instantly
  const startFreq = 600 + Math.random() * 400;
  osc.frequency.setValueAtTime(startFreq, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(150 + Math.random() * 100, audioCtx.currentTime + 0.06);

  gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.04 + Math.random() * 0.05, audioCtx.currentTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.06);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.08);
}

function muteRainSynth() {
  const toggleBtn = document.getElementById('rain-audio-toggle');
  if (toggleBtn) {
    const label = toggleBtn.querySelector('.rain-label');
    if (label) label.textContent = 'RAIN · OFF';
  }

  if (rainGainNode && audioCtx) {
    const currentGain = rainGainNode.gain;
    currentGain.cancelScheduledValues(audioCtx.currentTime);
    currentGain.setValueAtTime(currentGain.value, audioCtx.currentTime);
    currentGain.linearRampToValueAtTime(0.0, audioCtx.currentTime + 0.5); // fast fade out
  }

  setTimeout(() => {
    if (noiseNode) {
      try {
        noiseNode.stop();
      } catch (e) {}
      noiseNode.disconnect();
      noiseNode = null;
    }
    if (dripTimer) {
      clearTimeout(dripTimer);
      dripTimer = null;
    }
  }, 550);
}

/* ==========================================================================
   7. SECTION 5 — INTERACTIVE TULIP STUDIO
   ========================================================================== */

const studioState = {
  petalColor: '#E8A0BF',
  petalColor2: null,
  petalCount: 5,
  stemHeight: 130,
  shape: 'rounded',
  stage: 'blooming'
};

const presets = ['#E63946', '#FFB3C6', '#E8A0BF', '#9B5DE5', '#C77DFF', '#F4C842', '#FF6B6B', '#F8F9FA'];
const secondPresets = ['#C1121F', '#FF85A1', '#9B5DE5', '#FCBF49', '#52B788', '#F8F9FA'];

let plantedFlowersCount = 0;

function initTulipStudio() {
  const previewFrame = document.querySelector('.tulip-preview-frame');
  const previewDiv = document.querySelector('.tulip-preview');
  if (!previewDiv) return;

  // 1. Draw Custom Canvas Hue Wheel
  const hueCanvas = document.getElementById('hue-wheel-canvas');
  if (hueCanvas) {
    const ctx = hueCanvas.getContext('2d');
    const width = 140;
    const height = 140;
    hueCanvas.width = width;
    hueCanvas.height = height;

    const radius = width / 2;
    // Draw full color wheel gradient
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const rx = x - radius;
        const ry = y - radius;
        const d = Math.sqrt(rx * rx + ry * ry);
        if (d <= radius) {
          const angle = Math.atan2(ry, rx) + Math.PI; // 0 to 2*PI
          const hue = (angle / (Math.PI * 2)) * 360;
          const sat = (d / radius) * 100;
          const light = 60; // bright and premium pastel range
          ctx.fillStyle = `hsl(${hue}, ${sat}%, ${light}%)`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }

    // Set initial marker location
    const marker = document.querySelector('.hue-marker');
    
    const selectColorFromCoord = (e) => {
      const rect = hueCanvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const rx = clickX - radius;
      const ry = clickY - radius;
      const d = Math.sqrt(rx * rx + ry * ry);

      if (d <= radius) {
        const angle = Math.atan2(ry, rx) + Math.PI;
        const hue = (angle / (Math.PI * 2)) * 360;
        const sat = (d / radius) * 100;
        const hexColor = hslToHex(hue, sat, 60);

        // Update color
        studioState.petalColor = hexColor;
        cursorState.color = hexColor; // change cursor color in studio
        
        // Position marker
        marker.style.left = `${clickX}px`;
        marker.style.top = `${clickY}px`;

        // Clear presets active styling
        document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));

        updateStudioPreview();
      }
    };

    hueCanvas.addEventListener('mousedown', (e) => {
      selectColorFromCoord(e);
      const onMouseMove = (moveEvent) => selectColorFromCoord(moveEvent);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', () => {
        window.removeEventListener('mousemove', onMouseMove);
      }, { once: true });
    });
  }

  // 2. Setup Primary Preset Buttons
  const presetGrid = document.querySelector('.presets-grid');
  if (presetGrid) {
    presetGrid.innerHTML = '';
    presets.forEach(color => {
      const btn = document.createElement('button');
      btn.className = 'preset-btn';
      btn.style.backgroundColor = color;
      btn.setAttribute('aria-label', `Color preset ${color}`);
      
      if (color === studioState.petalColor) {
        btn.classList.add('active');
      }

      btn.addEventListener('click', () => {
        document.querySelectorAll('.preset-btn').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        studioState.petalColor = color;
        cursorState.color = color;
        updateStudioPreview();
      });
      presetGrid.appendChild(btn);
    });
  }

  // 3. Petal Count Row
  const petalButtons = document.querySelectorAll('.petal-count-btn');
  petalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      petalButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      studioState.petalCount = parseInt(btn.getAttribute('data-count'), 10);
      updateStudioPreview();
    });
  });

  // 4. Stem Height Slider
  const stemSlider = document.getElementById('stem-height-slider');
  const stemValueLabel = document.getElementById('stem-height-value');
  if (stemSlider) {
    stemSlider.addEventListener('input', (e) => {
      studioState.stemHeight = parseInt(e.target.value, 10);
      if (stemValueLabel) stemValueLabel.textContent = `${studioState.stemHeight}px`;
      updateStudioPreview();
    });
  }

  // 5. Petal Shape Cards
  const shapeCards = document.querySelectorAll('.shape-card');
  shapeCards.forEach(card => {
    card.addEventListener('click', () => {
      shapeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      studioState.shape = card.getAttribute('data-shape');
      updateStudioPreview();
    });
  });

  // 6. Variegated/Second Color Toggle
  const secondColorToggle = document.getElementById('second-color-toggle');
  const secondColorWrapper = document.getElementById('second-color-picker-wrapper');
  if (secondColorToggle && secondColorWrapper) {
    secondColorToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        secondColorWrapper.classList.add('visible');
        studioState.petalColor2 = secondPresets[0];
      } else {
        secondColorWrapper.classList.remove('visible');
        studioState.petalColor2 = null;
      }
      updateStudioPreview();
    });
  }

  // Second preset button list builder
  const secondPresetContainer = document.querySelector('.second-color-picker-container');
  if (secondPresetContainer) {
    secondPresetContainer.innerHTML = '';
    secondPresets.forEach((color, idx) => {
      const btn = document.createElement('button');
      btn.className = 'second-preset-btn';
      btn.style.backgroundColor = color;
      btn.setAttribute('aria-label', `Secondary color preset ${color}`);
      if (idx === 0) btn.classList.add('active');

      btn.addEventListener('click', () => {
        document.querySelectorAll('.second-preset-btn').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        studioState.petalColor2 = color;
        updateStudioPreview();
      });
      secondPresetContainer.appendChild(btn);
    });
  }

  // 7. Bloom Stage Slider
  const stageBtns = document.querySelectorAll('.stage-btn');
  stageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      stageBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      studioState.stage = btn.getAttribute('data-stage');
      updateStudioPreview();
    });
  });

  // 8. Load query string properties if any
  parseQueryString();

  // Render initial studio tulip
  previewDiv.innerHTML = generateTulipSVG(studioState);

  // 9. Plant In Field CTA Button
  const plantBtn = document.getElementById('plant-btn');
  const plantedContainer = document.getElementById('planted-flowers-container');
  if (plantBtn && plantedContainer) {
    plantBtn.addEventListener('click', () => {
      if (plantedFlowersCount >= 12) {
        // Remove oldest flower
        const oldest = plantedContainer.querySelector('.planted-flower');
        if (oldest) {
          gsap.to(oldest, {
            opacity: 0,
            y: 30,
            duration: 0.5,
            onComplete: () => {
              oldest.remove();
              plantedFlowersCount--;
            }
          });
        }
      }

      // Play sound pop if possible
      playPopSound();

      // Get current preview coordinates to animate from
      const previewRect = previewDiv.getBoundingClientRect();
      const containerRect = plantedContainer.getBoundingClientRect();

      // Create landing tulip in the bottom tray
      const plantedTulip = document.createElement('div');
      plantedTulip.className = 'planted-flower';
      
      const widthScale = 0.45; // smaller version for the planted panel
      
      plantedTulip.innerHTML = generateTulipSVG({
        petalColor: studioState.petalColor,
        petalColor2: studioState.petalColor2,
        petalCount: studioState.petalCount,
        stemHeight: studioState.stemHeight * 0.5, // shorter
        shape: studioState.shape,
        stage: studioState.stage
      });

      // Style details
      plantedTulip.style.width = '120px';
      plantedTulip.style.height = '160px';
      plantedTulip.style.zIndex = Math.floor(Math.random() * 10) + 1;
      
      const randomLeft = 5 + Math.random() * 90; // distribute randomly 5%-95%
      plantedTulip.style.left = `${randomLeft}%`;

      // Set starting transition coordinates relative to the bottom container
      const startX = previewRect.left - containerRect.left + (previewRect.width/2 - 60);
      const startY = previewRect.top - containerRect.top;

      plantedContainer.appendChild(plantedTulip);
      plantedFlowersCount++;

      // Plant Animation Timeline
      gsap.fromTo(plantedTulip, 
        {
          x: startX,
          y: startY,
          scale: 1.6,
          opacity: 0.4
        },
        {
          x: 0,
          y: 0,
          scale: 1.0,
          opacity: 1.0,
          duration: 0.9,
          ease: "power2.inOut",
          onComplete: () => {
            // Apply wind sway loop
            const rotationSway = 1 + Math.random() * 1.5;
            const delay = Math.random() * -3;
            gsap.to(plantedTulip, {
              rotation: rotationSway,
              duration: 3 + Math.random() * 2,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: delay
            });
          }
        }
      );
    });
  }

  // 10. Share Bouquet CTA Button
  const shareBtn = document.getElementById('share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const url = new URL(window.location.href);
      url.searchParams.set('color1', studioState.petalColor.replace('#', ''));
      if (studioState.petalColor2) {
        url.searchParams.set('color2', studioState.petalColor2.replace('#', ''));
      } else {
        url.searchParams.delete('color2');
      }
      url.searchParams.set('count', studioState.petalCount);
      url.searchParams.set('stem', studioState.stemHeight);
      url.searchParams.set('shape', studioState.shape);
      url.searchParams.set('stage', studioState.stage);

      // Copy to Clipboard
      navigator.clipboard.writeText(url.toString()).then(() => {
        showToast("Your bouquet link is ready — send it, they'll love it ✿");
      }).catch(err => {
        showToast("Error copying link, please share manually.");
      });
    });
  }
}

function updateStudioPreview() {
  const previewDiv = document.querySelector('.tulip-preview');
  if (!previewDiv) return;

  gsap.to(previewDiv, {
    opacity: 0,
    scale: 0.94,
    duration: 0.12,
    onComplete: () => {
      previewDiv.innerHTML = generateTulipSVG(studioState);
      gsap.to(previewDiv, {
        opacity: 1,
        scale: 1.0,
        duration: 0.28,
        ease: 'back.out(1.25)'
      });
    }
  });
}

function parseQueryString() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('color1')) {
    studioState.petalColor = '#' + params.get('color1');
    // Also try to find and active in UI presets
    const index = presets.indexOf(studioState.petalColor);
    if (index !== -1) {
      document.querySelectorAll('.preset-btn').forEach((btn, idx) => {
        if (idx === index) btn.classList.add('active');
        else btn.classList.remove('active');
      });
    }
  }
  if (params.has('color2')) {
    studioState.petalColor2 = '#' + params.get('color2');
    const toggle = document.getElementById('second-color-toggle');
    const wrapper = document.getElementById('second-color-picker-wrapper');
    if (toggle && wrapper) {
      toggle.checked = true;
      wrapper.classList.add('visible');
      // Highlight preset button
      const index = secondPresets.indexOf(studioState.petalColor2);
      if (index !== -1) {
        document.querySelectorAll('.second-preset-btn').forEach((btn, idx) => {
          if (idx === index) btn.classList.add('active');
          else btn.classList.remove('active');
        });
      }
    }
  }
  if (params.has('count')) {
    studioState.petalCount = parseInt(params.get('count'), 10);
    document.querySelectorAll('.petal-count-btn').forEach(btn => {
      if (parseInt(btn.getAttribute('data-count'), 10) === studioState.petalCount) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  if (params.has('stem')) {
    studioState.stemHeight = parseInt(params.get('stem'), 10);
    const slider = document.getElementById('stem-height-slider');
    const valLabel = document.getElementById('stem-height-value');
    if (slider) slider.value = studioState.stemHeight;
    if (valLabel) valLabel.textContent = `${studioState.stemHeight}px`;
  }
  if (params.has('shape')) {
    studioState.shape = params.get('shape');
    document.querySelectorAll('.shape-card').forEach(card => {
      if (card.getAttribute('data-shape') === studioState.shape) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }
  if (params.has('stage')) {
    studioState.stage = params.get('stage');
    document.querySelectorAll('.stage-btn').forEach(btn => {
      if (btn.getAttribute('data-stage') === studioState.stage) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

// Reusable SVG drawing pipeline
function generateTulipSVG({ 
  petalColor = '#E8A0BF', 
  petalColor2 = null,
  petalCount = 5, 
  stemHeight = 130, 
  shape = 'rounded',
  stage = 'blooming'
}) {
  const cx = 150;
  const baseY = 360;
  const stemTop = baseY - stemHeight;

  // Bloom stage → petal dimensions
  const stageConfig = {
    bud:      { rx: 7,  ry: 38, openAngle: 8  },
    waking:   { rx: 13, ry: 33, openAngle: 22 },
    blooming: { rx: 19, ry: 26, openAngle: 36 },
    open:     { rx: 25, ry: 21, openAngle: 50 },
  };
  const shapeMultiplier = { rounded: 1, pointed: 0.55, ruffled: 1.1 };
  const { rx: baseRx, ry: baseRy, openAngle } = stageConfig[stage];
  const finalRx = baseRx * shapeMultiplier[shape];
  const finalRy = baseRy;

  // STEM (quadratic bezier curve)
  const stemCurveX = cx + 6;
  const stemMidY = baseY - stemHeight * 0.5;
  const stem = `<path d="M${cx},${baseY} Q${stemCurveX},${stemMidY} ${cx},${stemTop}"
    stroke="var(--botanical-green, #2A5C45)"
    stroke-width="5.5"
    fill="none"
    stroke-linecap="round"
    id="tulip-stem"/>`;

  // LEAVES (2, opposing sides)
  const leafY = baseY - stemHeight * 0.35;
  const leaves = `
    <path d="M${cx},${leafY} Q${cx-35},${leafY-25} ${cx-26},${leafY-52}"
      stroke="#204A36" stroke-width="3" fill="#2A5C45" opacity="0.88"/>
    <path d="M${cx},${leafY} Q${cx+35},${leafY-20} ${cx+28},${leafY-48}"
      stroke="#204A36" stroke-width="3" fill="#2A5C45" opacity="0.88"/>`;

  // PETALS
  const petals = [];
  for (let i = 0; i < petalCount; i++) {
    // Generate radial offsets
    const rotateAngle = (i / petalCount) * 360 + openAngle * 0.3;
    const color = (petalColor2 && i % 2 === 1) ? petalColor2 : petalColor;
    const opacity = 0.72 + (i / petalCount) * 0.28;
    const offsetY = -(finalRy * 0.45);

    if (shape === 'ruffled') {
      // Scalloped path edges
      petals.push(`
        <path
          d="M${cx},${stemTop} 
             C${cx - finalRx * 0.35},${stemTop - finalRy * 0.2} 
               ${cx - finalRx},${stemTop - finalRy * 0.55} 
               ${cx},${stemTop - finalRy}
             C${cx + finalRx},${stemTop - finalRy * 0.55}
               ${cx + finalRx * 0.35},${stemTop - finalRy * 0.2}
               ${cx},${stemTop}Z"
          fill="${color}"
          opacity="${opacity}"
          transform="rotate(${rotateAngle}, ${cx}, ${stemTop}) translate(0, ${offsetY})"/>`);
    } else {
      petals.push(`
        <ellipse
          cx="${cx}" cy="${stemTop + offsetY}"
          rx="${finalRx}" ry="${finalRy}"
          fill="${color}"
          opacity="${opacity}"
          transform="rotate(${rotateAngle}, ${cx}, ${stemTop})"/>`);
    }
  }

  // Center depth petal
  const center = `<ellipse cx="${cx}" cy="${stemTop - (finalRy * 0.2)}" rx="${finalRx * 0.65}" ry="${finalRy * 0.3}"
    fill="${petalColor}" opacity="0.45"/>`;

  // Stamen dot
  const stamen = stage !== 'bud' 
    ? `<circle cx="${cx}" cy="${stemTop - (finalRy * 0.15)}" r="4.5" fill="var(--golden-hour, #F4C842)" opacity="0.95"/>`
    : '';

  return `
    <svg viewBox="0 0 300 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      ${stem}
      ${leaves}
      ${petals.join('')}
      ${center}
      ${stamen}
    </svg>`;
}

// Synthesized Pop sound for planting feedback
function playPopSound() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);

  gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.15);
}

// Hex converter for Custom Hue Wheel HSL selection
function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Custom simple toast alert
function showToast(message) {
  let toast = document.getElementById('studio-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'studio-toast';
    toast.className = 'toast-container';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span class="font-mono" style="color:var(--velvet-rose);">✿</span> ${message}`;
  toast.classList.add('visible');

  setTimeout(() => {
    toast.classList.remove('visible');
  }, 3500);
}

/* ==========================================================================
   8. NAVIGATION & MAGNETIC INTERACTIONS
   ========================================================================== */

function initNavigation() {
  const pill = document.querySelector('.nav-pill');
  const links = document.querySelectorAll('.nav-link');
  if (!pill || links.length === 0) return;

  // Click scrolling
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      
      // Calculate ScrollTrigger adjustments for horizontal walk
      if (targetId === '#color-walk') {
        gsap.to(window, {
          scrollTo: {
            y: ".color-walk-section",
            autoKill: false
          },
          duration: 1.2,
          ease: "power3.inOut"
        });
      } else {
        gsap.to(window, {
          scrollTo: {
            y: targetId,
            autoKill: false
          },
          duration: 1.0,
          ease: "power2.inOut"
        });
      }
    });
  });

  // Track active state using ScrollTrigger
  const sections = ['#hero', '#color-walk', '#gallery', '#monsoon', '#studio'];
  sections.forEach((id, idx) => {
    const el = document.querySelector(id);
    if (!el) return;

    ScrollTrigger.create({
      trigger: el,
      start: id === '#color-walk' ? "top center" : "top 40%",
      end: id === '#color-walk' ? "bottom center" : "bottom 40%",
      onToggle: (self) => {
        if (self.isActive) {
          links.forEach(l => l.classList.remove('active'));
          links[idx].classList.add('active');

          // Dynamically adjust navigation pill colors based on background brightness
          if (id === '#gallery' || id === '#studio') {
            // Light background
            pill.style.background = 'rgba(255, 255, 255, 0.45)';
            pill.style.borderColor = 'rgba(11, 7, 21, 0.1)';
            links.forEach(l => {
              if (!l.classList.contains('active')) {
                l.style.color = 'rgba(11, 7, 21, 0.5)';
              }
            });
          } else {
            // Dark backgrounds
            pill.style.background = 'rgba(11, 7, 21, 0.4)';
            pill.style.borderColor = 'rgba(240, 234, 248, 0.15)';
            links.forEach(l => {
              if (!l.classList.contains('active')) {
                l.style.color = 'rgba(240, 234, 248, 0.6)';
              }
            });
          }
        }
      }
    });
  });
}

function initMagneticButtons() {
  // Select buttons and specific links to apply physics hover
  document.querySelectorAll('.magnetic-btn, .nav-link, .shape-card, .preset-btn, .stage-btn, .petal-count-btn').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Pull strength depends on class
      const factor = el.classList.contains('magnetic-btn') ? 0.3 : 0.22;
      
      gsap.to(el, {
        x: x * factor,
        y: y * factor,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.55,
        ease: 'elastic.out(1.2, 0.45)'
      });
    });
  });
}
