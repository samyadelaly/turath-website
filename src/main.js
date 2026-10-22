/**
 * MONOLITH — Exact 14-Scene Cinematic Scroll Choreography Engine
 * System-Wide Alternating Stepped Notch Layered Scrolling & Visual Motion Calibration.
 * Strictly native browser scrolling, CSS position: sticky, svh units, and sub-pixel RAF progress.
 * Zero scroll hijacking, zero artificial lag, zero wheel manipulation.
 */

import {
  heroDayImage,
  heroNightImage,
  aboutImage1,
  aboutImage2,
  aboutImage3,
  aboutImage4,
  aboutImage5,
  aboutImage6,
  aboutImage7,
  aboutImage8,
  aboutImage9,
  aboutMainImage,
  aboutDetail1,
  aboutDetail2,
  collectionsBgImage,
  infoStageImage1,
  infoStageImage2,
  infoStageImage3,
  infoDepthImage,
  locationMapImage,
  transitDepthImage,
  founderDarkImage,
  founderLitImage,
  envBackgroundImage,
  tallElevationImage,
  lobbySpaces,
  officeTiers,
  quoteDepthImage,
  amenityPlates,
  teamDepthImage
} from './artwork.js';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
if (typeof window !== 'undefined') {
  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;
}

// ============================================================================
// VIEWPORT & CONTAINER SCROLL CONTROLLER
// ============================================================================
export function getScrollContainer() {
  const el = document.getElementById('app') || document.getElementById('main-viewport');
  if (el) {
    const cs = window.getComputedStyle(el);
    if ((cs.overflowY === 'auto' || cs.overflowY === 'scroll') && el.scrollHeight > el.clientHeight && cs.position === 'absolute') {
      return el;
    }
  }
  return null;
}

export function getScrollY() {
  const scroller = getScrollContainer();
  if (scroller) {
    return scroller.scrollTop || 0;
  }
  return window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
}

export function scrollToPosition(top, smooth = true) {
  const scroller = getScrollContainer();
  if (scroller) {
    scroller.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });
  } else {
    window.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });
  }
}

// ============================================================================
// 1. INJECT ARTWORK & ARCHITECTURAL DEPTH PLATES
// ============================================================================
function injectArtwork() {
  const heroDay = document.getElementById('hero-day-container');
  const heroNight = document.getElementById('hero-night-container');
  const aboutFrame1 = document.getElementById('about-frame-1');
  const aboutFrame2 = document.getElementById('about-frame-2');
  const aboutFrame3 = document.getElementById('about-frame-3');
  const aboutFrame4 = document.getElementById('about-frame-4');
  const aboutFrame5 = document.getElementById('about-frame-5');
  const aboutFrame6 = document.getElementById('about-frame-6');
  const aboutFrame7 = document.getElementById('about-frame-7');
  const aboutFrame8 = document.getElementById('about-frame-8');
  const aboutFrame9 = document.getElementById('about-frame-9');
  const stageImg1 = document.getElementById('info-stage-img-1');
  const stageImg2 = document.getElementById('info-stage-img-2');
  const stageImg3 = document.getElementById('info-stage-img-3');
  const locationMap = document.getElementById('location-map-wrap');
  const envBg = document.getElementById('env-bg-media');
  const elevation = document.getElementById('elevation-pan-image');

  // Background Depth Plates (Seen through the stepped notch cutouts)
  const aboutDepth = document.getElementById('about-depth-plate');
  const infoDepth = document.getElementById('info-depth-plate');
  const locDepth = document.getElementById('loc-depth-plate');
  const transitDepth = document.getElementById('transit-depth-plate');
  const lobbyDepth = document.getElementById('lobby-depth-plate');
  const officeDepth = document.getElementById('office-depth-plate');
  const quoteDepth = document.getElementById('quote-depth-plate');
  const engDepth = document.getElementById('eng-depth-plate');
  const teamDepth = document.getElementById('team-depth-plate');

  // 01 Hero Day & Night Photographic Plates (Full-Bleed, Zero Bottom Scrim)
  if (heroDay) {
    heroDay.innerHTML = `
      <img src="${heroDayImage}" alt="Turath Architectural Art Piece - Base" class="scene-photo-cover" />
    `;
  }
  if (heroNight) {
    heroNight.innerHTML = `
      <img src="${heroNightImage}" alt="Turath Architectural Art Piece - Reveal" class="scene-photo-cover" />
    `;
  }

  // 02 About / Collections Depth Plate & 6-Frame Architectural Composition
  if (aboutDepth) {
    aboutDepth.innerHTML = `
      <img src="${collectionsBgImage}" alt="Turath Handcrafted Brass and Copper Relief Art" class="scene-photo-cover" />
      <div class="photo-scrim-dark"></div>
    `;
  }
  if (aboutFrame1) {
    aboutFrame1.innerHTML = `
      <img src="${aboutImage1}" alt="01 / Brass Mirrors" class="scene-photo-cover" />
    `;
  }
  if (aboutFrame2) {
    aboutFrame2.innerHTML = `
      <img src="${aboutImage2}" alt="02 / Lighting" class="scene-photo-cover" />
    `;
  }
  if (aboutFrame3) {
    aboutFrame3.innerHTML = `
      <img src="${aboutImage3}" alt="03 / Handles" class="scene-photo-cover" />
    `;
  }
  if (aboutFrame4) {
    aboutFrame4.innerHTML = `
      <img src="${aboutImage4}" alt="04 / Tables & Consoles" class="scene-photo-cover" />
    `;
  }
  if (aboutFrame5) {
    aboutFrame5.innerHTML = `
      <img src="${aboutImage5}" alt="05 / Handrails" class="scene-photo-cover" />
    `;
  }
  if (aboutFrame6) {
    aboutFrame6.innerHTML = `
      <img src="${aboutImage6}" alt="06 / Decorative Objects" class="scene-photo-cover" />
    `;
  }
  if (aboutFrame7) {
    aboutFrame7.innerHTML = `
      <img src="${aboutImage7}" alt="07 / Wall Art" class="scene-photo-cover" />
    `;
  }
  if (aboutFrame8) {
    aboutFrame8.innerHTML = `
      <img src="${aboutImage8}" alt="08 / Partitions & Bookcases" class="scene-photo-cover" />
    `;
  }
  if (aboutFrame9) {
    aboutFrame9.innerHTML = `
      <img src="${aboutImage9}" alt="09 / Tableware" class="scene-photo-cover" />
    `;
  }

  // 03 Information 3-Stage Architectural Plates & Depth Plate
  if (infoDepth) {
    infoDepth.innerHTML = `
      <img src="${infoDepthImage}" alt="Artisan Metal Workshop Background" class="scene-photo-cover" />
      <div class="photo-scrim-dark"></div>
    `;
  }
  if (stageImg1) {
    stageImg1.innerHTML = `
      <img src="${infoStageImage1}" alt="Architectural Metal Shaping and Custom Fabrication" class="scene-photo-cover" />
    `;
  }
  if (stageImg2) {
    stageImg2.innerHTML = `
      <img src="${infoStageImage2}" alt="Handcrafted Metal Annealing and Flame Forming" class="scene-photo-cover" />
    `;
  }
  if (stageImg3) {
    stageImg3.innerHTML = `
      <img src="${infoStageImage3}" alt="Egyptian Brass Crafting - Artisan Metal Polishing" class="scene-photo-cover" />
    `;
  }

  // 04 Location / Scene 04 Video Autoplay Initialization
  const scene04Video = document.getElementById('scene04-video');
  if (scene04Video) {
    scene04Video.muted = true;
    scene04Video.playsInline = true;
    const playPromise = scene04Video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const playOnInteraction = () => {
          scene04Video.play();
          const scroller = getScrollContainer();
          if (scroller) scroller.removeEventListener('scroll', playOnInteraction);
          window.removeEventListener('scroll', playOnInteraction);
          window.removeEventListener('touchstart', playOnInteraction);
          window.removeEventListener('click', playOnInteraction);
        };
        const scroller = getScrollContainer();
        if (scroller) scroller.addEventListener('scroll', playOnInteraction, { passive: true, once: true });
        window.addEventListener('scroll', playOnInteraction, { passive: true, once: true });
        window.addEventListener('touchstart', playOnInteraction, { passive: true, once: true });
        window.addEventListener('click', playOnInteraction, { passive: true, once: true });
      });
    }
  }

  // 05 Turath Projects (Single Immersive Visual Plate)
  const scene05PinnedImg = document.getElementById('scene05-pinned-img');
  if (scene05PinnedImg) {
    scene05PinnedImg.src = transitDepthImage;
  }

  // 06 Founder (Dark Unlit Ambient Lamp & Lit Illuminated Brass Fixture Dual Plates)
  const plateDarkImg = document.querySelector('#scene06-plate-dark img');
  const plateLitImg = document.querySelector('#scene06-plate-lit img');
  if (plateDarkImg) {
    plateDarkImg.src = `${founderDarkImage}?v=4`;
  }
  if (plateLitImg) {
    plateLitImg.src = `${founderLitImage}?v=5`;
  }
  if (envBg && (!plateDarkImg || !plateLitImg)) {
    envBg.innerHTML = `
      <div class="scene06-plate scene06-plate-dark" id="scene06-plate-dark">
        <img src="${founderDarkImage}?v=4" alt="Samy Adel Abdallah - Founder of Turath (Ambient Unlit)" class="scene-photo-cover" />
      </div>
      <div class="scene06-plate scene06-plate-lit" id="scene06-plate-lit">
        <img src="${founderLitImage}?v=5" alt="Samy Adel Abdallah - Founder of Turath (Illuminated Brass Fixture)" class="scene-photo-cover" />
      </div>
      <div class="photo-scrim-dark"></div>
    `;
  }

  // 08 Architecture (Ultra-Tall Continuous Vertical Façade for Panning & Full-Bleed Plate)
  if (elevation) {
    elevation.innerHTML = `
      <img src="${tallElevationImage}" alt="Continuous Architectural Elevation" class="scene-photo-cover" style="height: 100%; object-fit: cover;" />
      <div class="photo-scrim-dark"></div>
    `;
  }

  // 10 Offices Depth Plate
  if (officeDepth) {
    officeDepth.innerHTML = `
      <img src="${officeTiers[1].image}" alt="Offices Glazing Panorama" class="scene-photo-cover" />
      <div class="photo-scrim-dark"></div>
    `;
  }

  // 11 Quote Depth Plate (Travertine Light & Shadow)
  if (quoteDepth) {
    quoteDepth.innerHTML = `
      <img src="${quoteDepthImage}" alt="Travertine Light and Shadow" class="scene-photo-cover" />
      <div class="photo-scrim-light"></div>
    `;
  }

  // 14 Team Depth Plate (Design Studio Drafting Table)
  if (teamDepth) {
    teamDepth.innerHTML = `
      <img src="${teamDepthImage}" alt="Design Studio Drafting Table" class="scene-photo-cover" />
      <div class="photo-scrim-light"></div>
    `;
  }
}


// ============================================================================
// 3. SETUP LOBBY SPATIAL TABS (SCENE 09)
// ============================================================================
function setupLobbyTabs() {
  const tabsContainer = document.getElementById('lobby-tabs');
  const stageBox = document.getElementById('lobby-stage-box');
  const metaSpec = document.getElementById('lobby-meta-spec');
  const metaDesc = document.getElementById('lobby-meta-desc');

  if (!tabsContainer || !stageBox) return;

  lobbySpaces.forEach((space, idx) => {
    const btn = document.createElement('button');
    btn.className = `lobby-tab-btn ${idx === 0 ? 'active' : ''}`;
    btn.dataset.index = idx;
    btn.innerHTML = `
      <span class="mono-tag">${space.index}</span>
      <span class="tab-name">${space.name}</span>
    `;
    tabsContainer.appendChild(btn);

    const plate = document.createElement('div');
    plate.className = `lobby-plate ${idx === 0 ? 'active' : ''}`;
    plate.id = `lobby-plate-${idx}`;
    plate.innerHTML = `
      <img src="${space.image}" alt="${space.name}" class="scene-photo-cover" />
      <div class="photo-scrim-dark"></div>
    `;
    stageBox.appendChild(plate);
  });

  function selectSpace(idx) {
    const space = lobbySpaces[idx];
    if (!space) return;

    tabsContainer.querySelectorAll('.lobby-tab-btn').forEach((b, i) => b.classList.toggle('active', i === idx));
    stageBox.querySelectorAll('.lobby-plate').forEach((p, i) => p.classList.toggle('active', i === idx));

    if (metaSpec) metaSpec.textContent = space.specs;
    if (metaDesc) metaDesc.textContent = space.desc;
  }

  selectSpace(0);

  tabsContainer.addEventListener('mouseover', (e) => {
    const btn = e.target.closest('.lobby-tab-btn');
    if (btn) selectSpace(parseInt(btn.dataset.index, 10));
  });

  tabsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.lobby-tab-btn');
    if (btn) selectSpace(parseInt(btn.dataset.index, 10));
  });
}

// ============================================================================
// 4. SETUP OFFICES BLUEPRINT SELECTOR (SCENE 10)
// ============================================================================
function setupOfficeSelector() {
  const btnContainer = document.getElementById('office-tier-buttons');
  const stage = document.getElementById('office-blueprint-stage');
  const metaArea = document.getElementById('office-meta-area');
  const metaHeight = document.getElementById('office-meta-height');

  if (!btnContainer || !stage) return;

  officeTiers.forEach((tier, idx) => {
    const btn = document.createElement('button');
    btn.className = `header-action ${idx === 0 ? 'active' : ''}`;
    btn.style.textAlign = 'left';
    btn.style.display = 'flex';
    btn.style.justifyContent = 'space-between';
    btn.style.width = '100%';
    btn.dataset.index = idx;
    btn.innerHTML = `
      <span>${tier.tier}</span>
      <span style="color: var(--color-accent-gold);">${tier.name}</span>
    `;
    btnContainer.appendChild(btn);

    const plate = document.createElement('div');
    plate.className = `lobby-plate ${idx === 0 ? 'active' : ''}`;
    plate.id = `office-plate-${idx}`;
    plate.innerHTML = `
      <img src="${tier.image}" alt="${tier.name}" class="scene-photo-cover" />
      <div class="photo-scrim-dark"></div>
    `;
    stage.appendChild(plate);
  });

  function selectTier(idx) {
    const tier = officeTiers[idx];
    if (!tier) return;

    btnContainer.querySelectorAll('button').forEach((b, i) => {
      b.style.backgroundColor = (i === idx) ? 'var(--color-accent-gold)' : 'transparent';
      b.style.color = (i === idx) ? 'var(--color-noir)' : 'inherit';
    });

    stage.querySelectorAll('.lobby-plate').forEach((p, i) => p.classList.toggle('active', i === idx));

    if (metaArea) metaArea.textContent = `USEFUL AREA: ${tier.area}`;
    if (metaHeight) metaHeight.textContent = `CLEAR CEILING HEIGHT: ${tier.height}`;
  }

  selectTier(0);

  btnContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (btn) selectTier(parseInt(btn.dataset.index, 10));
  });
}

// ============================================================================
// 5. SETUP INFRASTRUCTURE AMENITY STACK (SCENE 13)
// ============================================================================
function setupInfrastructureStack() {
  const stackBox = document.getElementById('infra-stack-box');
  if (!stackBox) return;

  amenityPlates.forEach((plate, idx) => {
    const layer = document.createElement('div');
    layer.className = 'infra-layer';
    layer.id = `infra-layer-${idx}`;
    layer.innerHTML = `
      <img src="${plate.image}" alt="${plate.title}" class="scene-photo-cover" />
      <div class="photo-scrim-dark"></div>
      <div style="position: absolute; bottom: 1.25rem; left: 1.25rem; z-index: 2;">
        <span class="mono-tag" style="background: rgba(0,0,0,0.65); padding: 0.25rem 0.5rem; border: 1px solid rgba(255,255,255,0.2);">${plate.index} // ${plate.title}</span>
      </div>
    `;
    layer.style.zIndex = idx + 1;
    stackBox.appendChild(layer);
  });
}

// ============================================================================
// 6. CALIBRATION HUD & DYNAMIC THEME ENGINE
// ============================================================================
let calibrationHudActive = true;

function setupCalibrationHud() {
  const hud = document.getElementById('calibration-hud');
  const toggle = document.getElementById('hud-toggle');
  if (!hud || !toggle) return;

  toggle.addEventListener('click', () => {
    hud.classList.toggle('minimized');
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'c' || e.key === 'C') {
      hud.classList.toggle('minimized');
    }
  });
}

function updateCalibrationHud(activeSceneData, totalScrollPercent) {
  const hud = document.getElementById('calibration-hud');
  if (!hud || hud.classList.contains('minimized')) return;

  const elScene = document.getElementById('hud-scene');
  const elLayer = document.getElementById('hud-layer');
  const elNotch = document.getElementById('hud-notch');
  const elScroll = document.getElementById('hud-scroll');
  const elTheme = document.getElementById('hud-theme');

  if (elScene) elScene.textContent = activeSceneData.title;
  if (elLayer) elLayer.textContent = `z-index: ${activeSceneData.zIndex}`;
  if (elNotch) elNotch.textContent = activeSceneData.notch;
  if (elScroll) elScroll.textContent = `${totalScrollPercent.toFixed(1)}%`;
  if (elTheme) elTheme.textContent = activeSceneData.theme.toUpperCase();
}

function updateActiveHeaderTheme(activeTheme) {
  const header = document.getElementById('site-header');
  if (!header) return;

  if (activeTheme === 'light') {
    header.classList.remove('theme-dark');
    header.classList.add('theme-light');
  } else {
    header.classList.remove('theme-light');
    header.classList.add('theme-dark');
  }
}

// ============================================================================
// 7. PRECISE RAF SCROLL PROGRESS ENGINE & TEXT STAGGERING
// ============================================================================
function setupScrollEngine() {
  const root = document.documentElement;
  const header = document.getElementById('site-header');

  // Track References (Exact 9 Turath Scenes)
  const tracks = [
    { el: document.getElementById('hero'), title: '01 / HERO', zIndex: 10, notch: 'BASE STAGE', theme: 'dark' },
    { el: document.getElementById('about'), title: '02 / OUR COLLECTIONS', zIndex: 20, notch: 'LEFT-STEP (20%)', theme: 'dark' },
    { el: document.getElementById('information'), title: '03 / ABOUT TURATH', zIndex: 30, notch: 'LEFT-STEP (20%)', theme: 'dark' },
    { el: document.getElementById('location'), title: '04 / FEATURED PRODUCTS', zIndex: 40, notch: 'PINNED-BASE (24%)', theme: 'dark' },
    { el: document.getElementById('scene05') || document.getElementById('accessibility'), title: '05 / TURATH PROJECTS', zIndex: 50, notch: 'DUAL-MORPH (T:74% B:26%)', theme: 'dark' },
    { el: document.getElementById('scene06') || document.getElementById('surroundings') || document.getElementById('environment'), title: '06 / FOUNDER', zIndex: 60, notch: 'BI-SLATS (50%)', theme: 'dark' },
    { el: document.getElementById('materials-finishes') || document.getElementById('scene07'), title: '07 / MATERIALS & FINISHES', zIndex: 70, notch: 'INVERT-MORPH', theme: 'dark' },
    { el: document.getElementById('bespoke-manufacturing') || document.getElementById('scene08') || document.getElementById('section-08'), title: '08 / BESPOKE MANUFACTURING', zIndex: 80, notch: 'DUAL-SPLIT', theme: 'dark' },
    { el: document.getElementById('project-inquiry') || document.getElementById('scene09'), title: '09 / PROJECT INQUIRY', zIndex: 90, notch: '4-SLATS-LEFT', theme: 'dark' },
  ];

  // Ensure Section 05 is reset to full visibility on initialization
  const s05SheetInit = document.querySelector("#scene05-sheet");
  if (s05SheetInit) {
    s05SheetInit.style.visibility = "visible";
    s05SheetInit.style.opacity = "1";
  }

  const s05Init = document.querySelector("#scene05");
  if (s05Init) {
    s05Init.style.visibility = "visible";
    s05Init.style.opacity = "1";
  }

  // Ensure Section 06 is reset to full visibility on initialization
  const s06SheetInit = document.querySelector("#scene06-sheet");
  if (s06SheetInit) {
    s06SheetInit.style.visibility = "visible";
    s06SheetInit.style.opacity = "1";
    s06SheetInit.style.display = "block";
  }

  const s06Init = document.querySelector("#scene06");
  if (s06Init) {
    s06Init.style.visibility = "visible";
    s06Init.style.opacity = "1";
    s06Init.style.display = "block";
  }

  // Ensure Section 07 is reset to full visibility on initialization
  const s07SheetInit = document.querySelector("#scene07-sheet");
  if (s07SheetInit) {
    s07SheetInit.style.visibility = "visible";
    s07SheetInit.style.opacity = "1";
    s07SheetInit.style.display = "block";
  }

  const s07Init = document.querySelector("#materials-finishes") || document.querySelector(".materials-finishes-track");
  if (s07Init) {
    s07Init.style.visibility = "visible";
    s07Init.style.opacity = "1";
    s07Init.style.display = "block";
  }

  // Ensure Section 08 is reset to full visibility on initialization
  const s08SheetInit = document.querySelector("#scene08-sheet");
  if (s08SheetInit) {
    s08SheetInit.style.visibility = "visible";
    s08SheetInit.style.opacity = "1";
    s08SheetInit.style.display = "block";
  }

  const s08Init = document.querySelector("#bespoke-manufacturing") || document.querySelector(".scene08-track");
  if (s08Init) {
    s08Init.style.visibility = "visible";
    s08Init.style.opacity = "1";
    s08Init.style.display = "block";
  }

  // Ensure Section 09 is reset to full visibility on initialization
  const s09SheetInit = document.querySelector("#scene09-sheet");
  if (s09SheetInit) {
    s09SheetInit.style.visibility = "visible";
    s09SheetInit.style.opacity = "1";
    s09SheetInit.style.display = "block";
  }

  const s09Init = document.querySelector("#project-inquiry") || document.querySelector(".scene09-track");
  if (s09Init) {
    s09Init.style.visibility = "visible";
    s09Init.style.opacity = "1";
    s09Init.style.display = "block";
  }

  // Scene 03 Volumetric Sequencer
  const stageImages = [
    document.getElementById('info-stage-img-1'),
    document.getElementById('info-stage-img-2'),
    document.getElementById('info-stage-img-3')
  ];
  const stagePanes = [
    document.getElementById('stage-pane-1'),
    document.getElementById('stage-pane-2'),
    document.getElementById('stage-pane-3')
  ];
  const stageTitles = [
    document.getElementById('stage-title-1'),
    document.getElementById('stage-title-2'),
    document.getElementById('stage-title-3')
  ];
  const badgeText = document.getElementById('volumetric-badge-text');
  const counterCurrent = document.getElementById('volumetric-counter-current');
  const counterFill = document.getElementById('volumetric-counter-fill');
  const stepLabels = document.querySelectorAll('.counter-label-step');

  const badgeTitles = [
    'VOLUMETRIC MASSING // 01',
    'TERRACED SETBACKS // 02',
    'SKY TERRACES // 03'
  ];

  // SCENE 03 DYNAMIC STEPPED NOTCH SEAM MORPHING
  const scene03SeamPath = document.getElementById('scene03-seam-path');
  const scene03SeamDot = document.getElementById('scene03-seam-dot');
  const scene03BottomModule = document.querySelector('.scene03-bottom-module');
  const scene03PinnedViewport = document.querySelector('.scene03-pinned-viewport');

  function calculateScene03NotchX(progress) {
    const p = Math.max(0, Math.min(1, progress));
    let val;
    if (p <= 0.20) {
      val = 28.0;
    } else if (p < 0.44) {
      const t = (p - 0.20) / (0.44 - 0.20);
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      val = 28.0 + ease * (50.0 - 28.0);
    } else if (p <= 0.56) {
      val = 50.0;
    } else if (p < 0.80) {
      const t = (p - 0.56) / (0.80 - 0.56);
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      val = 50.0 + ease * (72.0 - 50.0);
    } else {
      val = 72.0;
    }
    return Math.round(val * 100) / 100;
  }

  function updateVolumetricSequencer(stage, progress) {
    // 1. Dynamic Stepped Notch Seam Geometry Morphing (Internal Bottom Module)
    const notchXPct = calculateScene03NotchX(progress);
    const notchXStr = `${notchXPct.toFixed(2)}%`;

    if (scene03PinnedViewport) {
      scene03PinnedViewport.style.setProperty('--scene03-notch-x', notchXStr);
    }
    if (scene03BottomModule) {
      scene03BottomModule.style.setProperty('--scene03-notch-x', notchXStr);
      scene03BottomModule.style.clipPath = `polygon(0 36px, ${notchXStr} 36px, ${notchXStr} 0px, 100% 0px, 100% 100%, 0 100%)`;
      scene03BottomModule.style.webkitClipPath = `polygon(0 36px, ${notchXStr} 36px, ${notchXStr} 0px, 100% 0px, 100% 100%, 0 100%)`;
    }

    if (scene03SeamPath) {
      const stepXVal = (notchXPct * 10).toFixed(2);
      scene03SeamPath.setAttribute('d', `M 0,35.5 L ${stepXVal},35.5 L ${stepXVal},0.5 L 1000,0.5`);
    }
    if (scene03SeamDot) {
      const stepXVal = (notchXPct * 10).toFixed(2);
      scene03SeamDot.setAttribute('cx', stepXVal);
      scene03SeamDot.setAttribute('cy', '35.5');
    }

    // 2. Stage visual slide cross-fades
    stageImages.forEach((img, idx) => {
      if (img) img.classList.toggle('is-active', idx === stage - 1);
    });

    stagePanes.forEach((pane, idx) => {
      if (pane) pane.classList.toggle('is-active', idx === stage - 1);
    });

    stageTitles.forEach((title, idx) => {
      if (title) title.classList.toggle('is-active', idx === stage - 1);
    });

    if (badgeText && badgeTitles[stage - 1]) {
      badgeText.textContent = badgeTitles[stage - 1];
    }

    if (counterCurrent) {
      counterCurrent.textContent = stage.toString();
    }

    if (counterFill) {
      const percent = Math.max(6, Math.min(100, progress * 100));
      counterFill.style.width = `${percent.toFixed(1)}%`;
    }

    stepLabels.forEach(lbl => {
      const stepNum = parseInt(lbl.dataset.step, 10);
      lbl.classList.toggle('is-active', stepNum === stage);
    });
  }

  // ==========================================================================
  // TURATH LOGO FLIP INTERPOLATION & DUAL-SPEED PER-LETTER FONT SCRAMBLE ENGINE
  // ==========================================================================
  const turathLogo = document.getElementById('turath-logo');
  const heroAnchor = document.getElementById('hero-turath-anchor');
  const headerSlot = document.getElementById('header-logo-slot');
  const scrambleChars = document.querySelectorAll('.scramble-char');

  const FONT_PALETTE = [
    "'Cinzel', serif",
    "'Syne', sans-serif",
    "'Space Grotesk', sans-serif",
    "'Playfair Display', serif",
    "'Space Mono', monospace",
    "'Inter', sans-serif"
  ];

  const BASE_FONT = "'Syne', sans-serif";
  const DOCKED_FONT = "'Cinzel', serif";
  const CHAR_CADENCES = [3, 4, 2, 5, 3, 4];

  let turathDeltaX = 0;
  let turathDeltaY = 0;
  let turathDockScale = 0.22;
  let lastScrambleY = 0;
  let scrambleTick = 0;
  let metricsMeasured = false;

  function alignHeroDevoted() {
    const lineDevoted = document.getElementById('hero-line-devoted');
    const targetEl = document.getElementById('hero-creativity-text') || document.getElementById('hero-line-creativity');
    if (!lineDevoted || !targetEl) return;

    lineDevoted.style.letterSpacing = 'normal';
    const targetRight = targetEl.getBoundingClientRect().right;
    const dRect = lineDevoted.getBoundingClientRect();
    const diffPx = targetRight - dRect.right;
    const fontSizePx = parseFloat(window.getComputedStyle(lineDevoted).fontSize) || 32;
    const emAdjust = (diffPx / 7) / fontSizePx;
    lineDevoted.style.letterSpacing = `${emAdjust.toFixed(4)}em`;
  }

  let lastMeasuredWidth = window.innerWidth || 0;

  function measureTurathMetrics(force = false) {
    if (!heroAnchor || !headerSlot || !turathLogo) return;

    // Never remeasure when scrolled down
    if (metricsMeasured && getScrollY() > 5) return;

    alignHeroDevoted();

    const prevTransform = turathLogo.style.transform;
    const prevPosition = turathLogo.style.position;
    turathLogo.style.transform = 'none';
    turathLogo.style.position = 'absolute';

    const lRect = turathLogo.getBoundingClientRect();
    const aRect = heroAnchor.getBoundingClientRect();

    const targetHeight = window.innerWidth <= 768 ? 16 : 18;
    const unscaledHeight = lRect.height || 52;
    turathDockScale = Math.min(0.45, Math.max(0.14, targetHeight / unscaledHeight));

    const sheet = document.getElementById('hero-sheet');
    const sheetRect = sheet ? sheet.getBoundingClientRect() : { top: 0, left: 0 };

    // aRect.top - sheetRect.top gives the internal Y position of heroAnchor within hero-sheet
    // At scroll = 0, sheetRect.top = 0, so anchorYAtRest is (aRect.top - sheetRect.top)
    const anchorYAtRest = aRect.top - sheetRect.top;
    const anchorXAtRest = aRect.left;

    turathDeltaX = anchorXAtRest - lRect.left;
    turathDeltaY = Math.max(30, anchorYAtRest - lRect.top);

    turathLogo.style.transform = prevTransform;
    turathLogo.style.position = prevPosition;
    metricsMeasured = true;
    lastMeasuredWidth = window.innerWidth || 0;
  }

  function updateTurathInterpolation(scrollY) {
    if (!turathLogo || !heroAnchor || !headerSlot) return;

    if (!metricsMeasured || turathDeltaY <= 0) {
      measureTurathMetrics(true);
    }

    const windowH = window.innerHeight || 844;
    const aRect = heroAnchor.getBoundingClientRect();
    const lRect = headerSlot.getBoundingClientRect();

    // Live vertical delta from header slot to the hero anchor:
    // When scrollY = 0, liveDeltaY = turathDeltaY.
    // As the hero sheet ascends, liveDeltaY decreases at the exact physical speed of the sheet.
    const liveDeltaY = aRect.top - lRect.top;

    // Transition progress: 0 when resting in hero, 1.0 when anchor reaches header slot
    const rawProgress = turathDeltaY > 0
      ? Math.max(0, Math.min(1, (turathDeltaY - liveDeltaY) / turathDeltaY))
      : 1;

    // Permanently lock docked logo in navbar when transition is complete (SETTLED STATE)
    if (rawProgress >= 0.94 || liveDeltaY <= 4 || scrollY >= windowH * 0.35) {
      if (header) header.classList.add('is-settled');
      turathLogo.style.position = 'static';
      turathLogo.style.transform = 'none';
      turathLogo.style.width = 'auto';
      turathLogo.style.overflow = 'visible';
      turathLogo.style.display = 'inline-block';
      turathLogo.style.fontSize = window.innerWidth <= 768 ? '1.05rem' : '1.15rem';
      turathLogo.style.fontWeight = '800';
      turathLogo.style.letterSpacing = '0.08em';
      turathLogo.style.lineHeight = '1';
      turathLogo.style.setProperty('--turath-color', '#D7C797');
      turathLogo.style.color = '#D7C797';
      updateTurathScramble(1.0, scrollY);
      return;
    }

    if (header) header.classList.remove('is-settled');
    turathLogo.style.color = '';

    // Transit state: absolute positioning and smooth transform interpolation
    turathLogo.style.position = 'absolute';
    turathLogo.style.fontSize = '';
    turathLogo.style.fontWeight = '';
    turathLogo.style.letterSpacing = '';
    turathLogo.style.lineHeight = '';
    turathLogo.style.display = 'inline-flex';

    // The logo Y ascends at the EXACT rate and velocity as the surrounding hero typography.
    // Clamp to >= 0 so the logo never translates upward into negative Y bounds under browser chrome.
    let curY = Math.max(0, liveDeltaY);
    if (rawProgress > 0.70) {
      const blend = (rawProgress - 0.70) / 0.30;
      const easeBlend = blend * blend * (3 - 2 * blend); // smoothstep
      curY = Math.max(0, liveDeltaY * (1 - easeBlend));
    }

    // Smooth horizontal translation from hero anchor to left-docked header slot beside burger menu
    const pX = rawProgress < 0.5
      ? 2 * rawProgress * rawProgress
      : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;
    const curX = turathDeltaX * (1 - pX);

    // Scale down smoothly from 1.0 to docked scale
    const curScale = turathDockScale + (1.0 - turathDockScale) * (1 - rawProgress);

    turathLogo.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0) scale(${curScale.toFixed(4)})`;

    turathLogo.style.setProperty('--turath-color', 'var(--color-noir)');

    updateTurathScramble(rawProgress, scrollY);
  }

  function updateTurathScramble(progress, scrollY) {
    if (!scrambleChars || !scrambleChars.length) return;

    // 1. At rest in Hero (progress < 0.05): restore base font & pristine characters
    if (progress < 0.05) {
      scrambleChars.forEach(ch => {
        if (ch.style.fontFamily !== BASE_FONT) {
          ch.style.fontFamily = BASE_FONT;
        }
        ch.style.fontSize = '';
        ch.style.width = '';
        ch.style.display = 'inline-block';
        if (ch.dataset.char && ch.textContent !== ch.dataset.char) {
          ch.textContent = ch.dataset.char;
        }
      });
      return;
    }

    // 2. Final dock in Navbar (progress >= 0.90): lock docked font & pristine characters
    if (progress >= 0.90) {
      scrambleChars.forEach(ch => {
        if (ch.style.fontFamily !== DOCKED_FONT) {
          ch.style.fontFamily = DOCKED_FONT;
        }
        ch.style.fontSize = 'inherit';
        ch.style.width = 'auto';
        ch.style.overflow = 'visible';
        ch.style.display = 'inline-block';
        if (ch.dataset.char && ch.textContent !== ch.dataset.char) {
          ch.textContent = ch.dataset.char;
        }
      });
      return;
    }

    // 3. During transit (0.05 <= progress < 0.90): dual-speed / per-letter scramble
    const delta = Math.abs(scrollY - lastScrambleY);
    if (delta >= 4) {
      scrambleTick++;
      lastScrambleY = scrollY;

      scrambleChars.forEach((ch, idx) => {
        const cadence = CHAR_CADENCES[idx] || 3;
        if ((scrambleTick + idx * 2) % cadence === 0) {
          const randIdx = Math.floor(Math.random() * FONT_PALETTE.length);
          ch.style.fontFamily = FONT_PALETTE[randIdx];
        }
      });
    }
  }

  // Dual window frames in Scene 02
  const frames = document.querySelectorAll('[data-parallax-frame]');

  // Scene 13 Infrastructure layers
  const infraLayers = [
    document.getElementById('infra-layer-0'),
    document.getElementById('infra-layer-1'),
    document.getElementById('infra-layer-2')
  ];

  // Scene 04 Dynamic Dual-Edge Hairlines (Top Entry & Bottom Exit)
  const scene04TopHairline = document.getElementById('scene04-top-hairline');
  const scene04TopPath = document.getElementById('scene04-top-hairline-path');
  const scene04TopDot = document.getElementById('scene04-top-hairline-dot');

  const scene04BottomHairline = document.getElementById('scene04-bottom-hairline');
  const scene04BottomPath = document.getElementById('scene04-bottom-hairline-path');
  const scene04BottomDot = document.getElementById('scene04-bottom-hairline-dot');
  const sheet04 = document.getElementById('scene04-sheet') || document.querySelector('.scene04-video-container');

  if (scene04TopHairline) {
    scene04TopHairline.style.opacity = '0';
    scene04TopHairline.style.visibility = 'hidden';
    scene04TopHairline.style.display = 'none';
  }
  if (scene04BottomHairline) {
    scene04BottomHairline.style.opacity = '0';
    scene04BottomHairline.style.visibility = 'hidden';
    scene04BottomHairline.style.display = 'none';
  }

  let _lastS4 = {};
  let _lastS4Visibility = '';
  if (sheet04) sheet04.style.transform = '';
  function updateScene04DualEdge(topNotchX, bottomNotchX, topDepth, bottomDepth, bottomOpacity = 0) {
    const topVal = Math.round(Math.max(0, Math.min(100, topNotchX)) * 100) / 100;
    const botVal = Math.round(Math.max(0, Math.min(100, bottomNotchX)) * 100) / 100;
    const topStr = `${topVal.toFixed(2)}%`;
    const botStr = `${botVal.toFixed(2)}%`;
    const topDStr = `${topDepth}px`;
    const botDStr = `${bottomDepth.toFixed(2)}px`;
    const opStr = `${Math.max(0, Math.min(1, bottomOpacity)).toFixed(2)}`;

    if (_lastS4.topStr !== topStr || _lastS4.botStr !== botStr || _lastS4.topDStr !== topDStr || _lastS4.botDStr !== botDStr || _lastS4.opStr !== opStr) {
      _lastS4 = { topStr, botStr, topDStr, botDStr, opStr };

      root.style.setProperty('--scene04-top-notch-x', topStr);
      root.style.setProperty('--scene04-bottom-notch-x', botStr);
      root.style.setProperty('--scene04-top-notch-y', topDStr);
      root.style.setProperty('--scene04-bottom-notch-y', botDStr);
      root.style.setProperty('--scene04-bottom-hairline-opacity', '0');

      if (sheet04) {
        if (topDepth <= 0) {
          sheet04.style.clipPath = 'none';
          sheet04.style.webkitClipPath = 'none';
        } else {
          sheet04.style.clipPath = `polygon(0px ${topDStr}, ${topStr} ${topDStr}, ${topStr} 0px, 100% 0px, 100% calc(100% - ${botDStr}), ${botStr} calc(100% - ${botDStr}), ${botStr} 100%, 0px 100%)`;
          sheet04.style.webkitClipPath = sheet04.style.clipPath;
        }
      }

      if (scene04TopHairline) {
        scene04TopHairline.style.opacity = '0';
        scene04TopHairline.style.visibility = 'hidden';
        scene04TopHairline.style.display = 'none';
      }
      if (scene04BottomHairline) {
        scene04BottomHairline.style.opacity = '0';
        scene04BottomHairline.style.visibility = 'hidden';
        scene04BottomHairline.style.display = 'none';
      }
    }
  }

// ============================================================================
// SCENE 05 CLONED EXACT STEPPED-NOTCH SCROLL ANIMATION FROM SECTION 04
// ============================================================================
  const scene05TopHairline = document.getElementById('scene05-top-hairline');
  const scene05TopPath = document.getElementById('scene05-top-hairline-path');
  const scene05TopDot = document.getElementById('scene05-top-hairline-dot');

  const scene05BottomHairline = document.getElementById('scene05-bottom-hairline');
  const scene05BottomPath = document.getElementById('scene05-bottom-hairline-path');
  const scene05BottomDot = document.getElementById('scene05-bottom-hairline-dot');
  const sheet05 = document.getElementById('scene05-sheet') || document.querySelector('.scene05-sheet');

  if (scene05TopHairline) {
    scene05TopHairline.style.opacity = '0';
    scene05TopHairline.style.visibility = 'hidden';
    scene05TopHairline.style.display = 'none';
  }
  if (scene05BottomHairline) {
    scene05BottomHairline.style.opacity = '0';
    scene05BottomHairline.style.visibility = 'hidden';
    scene05BottomHairline.style.display = 'none';
  }

  let _lastS5 = {};
  let _lastS5Visibility = '';
  if (sheet05) sheet05.style.transform = '';
  function updateScene05DualEdge(splitPercent, yLeft, yRight) {
    const winW = window.innerWidth;
    const splitPixel = Math.round((Math.max(0, Math.min(100, splitPercent)) / 100) * winW);
    const yL = Math.max(0, Math.round(yLeft));
    const yR = Math.max(0, Math.round(yRight));

    if (_lastS5.splitPixel !== splitPixel || _lastS5.yL !== yL || _lastS5.yR !== yR) {
      _lastS5 = { splitPixel, yL, yR };

      root.style.setProperty('--scene05-top-notch-x', `${splitPixel}px`);
      root.style.setProperty('--scene05-top-notch-y', `${Math.max(yL, yR)}px`);

      if (yL <= 0 && yR <= 0) {
        if (sheet05) {
          sheet05.style.clipPath = 'none';
          sheet05.style.webkitClipPath = 'none';
        }
      } else {
        if (sheet05) {
          sheet05.style.clipPath = `polygon(0px ${yL}px, ${splitPixel}px ${yL}px, ${splitPixel}px ${yR}px, 100% ${yR}px, 100% 100%, 0px 100%)`;
          sheet05.style.webkitClipPath = sheet05.style.clipPath;
        }
      }

      if (scene05TopHairline) {
        scene05TopHairline.style.opacity = '0';
        scene05TopHairline.style.visibility = 'hidden';
        scene05TopHairline.style.display = 'none';
      }
      if (scene05BottomHairline) {
        scene05BottomHairline.style.opacity = '0';
        scene05BottomHairline.style.visibility = 'hidden';
        scene05BottomHairline.style.display = 'none';
      }
    }
  }

  function runScene05Animation() {
    const sec05El = document.getElementById('scene05');
    if (!sec05El || !sheet05) return;

    const rect5 = sec05El.getBoundingClientRect();
    const windowH = window.innerHeight;
    const headerH = 58;
    const travelDist5 = Math.max(1, windowH - headerH);
    const isMobile5 = window.innerWidth <= 768;

    // 50/50 Split Architectural Rise (likova.space signature: two rising halves)
    const splitStepH = isMobile5 ? Math.round(windowH * 0.22) : Math.round(windowH * 0.26);
    const splitX = 50.0; // Clean 50% split in the center of the screen
    let yLeft = 0;
    let yRight = 0;

    if (rect5.top > headerH) {
      // Entry phase climbing into view over Section 04
      const pEntry = Math.max(0, Math.min(1, (windowH - rect5.top) / travelDist5));

      // Right half leads the ascent; left half follows stepped down
      yRight = 0;
      if (pEntry <= 0.60) {
        const p1 = pEntry / 0.60;
        yLeft = Math.round(splitStepH * (1 - p1 * 0.20));
      } else {
        const p2 = (pEntry - 0.60) / 0.40;
        const ease2 = p2 < 0.5 ? 2 * p2 * p2 : 1 - Math.pow(-2 * p2 + 2, 2) / 2;
        yLeft = Math.round(splitStepH * 0.80 * (1 - ease2));
      }

      // Outgoing Section 04 under-next drift & dimming
      const underOffset4 = Math.round(-pEntry * (isMobile5 ? 40 : 65));
      const underOpacity4 = (1 - pEntry * 0.25).toFixed(2);
      root.style.setProperty('--scene04-under-parallax', `${underOffset4}px`);
      root.style.setProperty('--scene04-under-opacity', underOpacity4);

      // Incoming Section 05 interior background travel
      const bgParallax5 = Math.round((1 - pEntry) * (isMobile5 ? 20 : 35));
      root.style.setProperty('--scene05-bg-parallax', `${bgParallax5}px`);

      // Content cards glide up softly as the two halves level off
      const cardP = Math.max(0, Math.min(1, (pEntry - 0.45) / 0.55));
      const cardEase = cardP < 0.5 ? 2 * cardP * cardP : 1 - Math.pow(-2 * cardP + 2, 2) / 2;
      const cardY = Math.round((1 - cardEase) * 20);
      const cardOpacity = cardEase.toFixed(2);
      root.style.setProperty('--scene05-card-y', `${cardY}px`);
      root.style.setProperty('--scene05-card-opacity', cardOpacity);

      root.style.setProperty('--scene05-exit-offset', '0px');
      root.style.setProperty('--scene05-content-parallax', '0px');

      if (sheet05) {
        if (_lastS5Visibility !== 'visible') {
          sheet05.classList.remove('turath-sheet-hidden');
          sheet05.style.removeProperty('display');
          sheet05.style.removeProperty('visibility');
          sheet05.style.removeProperty('opacity');
          sheet05.style.pointerEvents = 'auto';
          _lastS5Visibility = 'visible';
        }
      }
    } else {
      // Active docked reading phase (pinned flush under header bar - 100% sealed, zero gap)
      yLeft = 0;
      yRight = 0;

      root.style.setProperty('--scene04-under-parallax', '0px');
      root.style.setProperty('--scene04-under-opacity', '1');
      root.style.setProperty('--scene05-bg-parallax', '0px');
      root.style.setProperty('--scene05-card-y', '0px');
      root.style.setProperty('--scene05-card-opacity', '1');
      root.style.setProperty('--scene05-exit-offset', '0px');
      root.style.setProperty('--scene05-content-parallax', '0px');

      if (sheet05) {
        if (_lastS5Visibility !== 'visible') {
          sheet05.classList.remove('turath-sheet-hidden');
          sheet05.style.removeProperty('display');
          sheet05.style.removeProperty('visibility');
          sheet05.style.removeProperty('opacity');
          sheet05.style.pointerEvents = 'auto';
          _lastS5Visibility = 'visible';
        }
      }
    }

    updateScene05DualEdge(splitX, yLeft, yRight);
  }

  // Scene 05 initial check
  runScene05Animation();

  // Scene 06 Dynamic Dual-Edge Hairlines (Top Stepped Notch Entry & Bottom Exit - Cloned from 04)
  const scene06TopHairline = document.getElementById('scene06-top-hairline');
  const scene06TopPath = document.getElementById('scene06-top-hairline-path');
  const scene06TopDot = document.getElementById('scene06-top-hairline-dot');

  const scene06BottomHairline = document.getElementById('scene06-bottom-hairline');
  const scene06BottomPath = document.getElementById('scene06-bottom-hairline-path');
  const scene06BottomDot = document.getElementById('scene06-bottom-hairline-dot');
  const sheet06 = document.getElementById('scene06-sheet');

  if (scene06TopHairline) {
    scene06TopHairline.style.opacity = '0';
    scene06TopHairline.style.visibility = 'hidden';
    scene06TopHairline.style.display = 'none';
  }
  if (scene06BottomHairline) {
    scene06BottomHairline.style.opacity = '0';
    scene06BottomHairline.style.visibility = 'hidden';
    scene06BottomHairline.style.display = 'none';
  }

  let _lastS6 = {};
  let _lastS6Visibility = '';
  if (sheet06) sheet06.style.transform = '';

  function updateScene06BiSlats(w1, w2, w3, w4) {
    if (w1 >= 49.5 && w2 >= 49.5 && w3 >= 49.5 && w4 >= 49.5) {
      if (_lastS6.docked !== true) {
        _lastS6 = { docked: true };
        if (sheet06) {
          sheet06.style.removeProperty('clip-path');
          sheet06.style.removeProperty('-webkit-clip-path');
          sheet06.style.clipPath = 'none';
          sheet06.style.webkitClipPath = 'none';
          sheet06.style.willChange = 'auto';
        }
      }
      return;
    }

    if (w1 <= 0.5 && w2 <= 0.5 && w3 <= 0.5 && w4 <= 0.5) {
      if (_lastS6.closed !== true) {
        _lastS6 = { closed: true };
        if (sheet06) {
          const closed = 'polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)';
          sheet06.style.setProperty('clip-path', closed, 'important');
          sheet06.style.setProperty('-webkit-clip-path', closed, 'important');
          sheet06.style.willChange = 'clip-path';
        }
      }
      return;
    }

    const rw1 = Math.max(0.1, Math.min(49.9, w1)).toFixed(1);
    const rw2 = Math.max(0.1, Math.min(49.9, w2)).toFixed(1);
    const rw3 = Math.max(0.1, Math.min(49.9, w3)).toFixed(1);
    const rw4 = Math.max(0.1, Math.min(49.9, w4)).toFixed(1);

    const r1 = (100 - rw1).toFixed(1);
    const r2 = (100 - rw2).toFixed(1);
    const r3 = (100 - rw3).toFixed(1);
    const r4 = (100 - rw4).toFixed(1);

    if (_lastS6.rw1 !== rw1 || _lastS6.rw2 !== rw2 || _lastS6.rw3 !== rw3 || _lastS6.rw4 !== rw4) {
      _lastS6 = { docked: false, closed: false, rw1, rw2, rw3, rw4 };

      // 4 Horizontal Slats closing symmetrically from Left & Right toward Center (50%)
      const poly = `polygon(evenodd, -1% -1%, 101% -1%, 101% 101%, -1% 101%, -1% -1%, ${rw1}% 0%, ${r1}% 0%, ${r1}% 25%, ${r2}% 25%, ${r2}% 50%, ${r3}% 50%, ${r3}% 75%, ${r4}% 75%, ${r4}% 100%, ${rw4}% 100%, ${rw4}% 75%, ${rw3}% 75%, ${rw3}% 50%, ${rw2}% 50%, ${rw2}% 25%, ${rw1}% 25%, ${rw1}% 0%, -1% -1%)`;
      if (sheet06) {
        sheet06.style.setProperty('clip-path', poly, 'important');
        sheet06.style.setProperty('-webkit-clip-path', poly, 'important');
        sheet06.style.willChange = 'clip-path';
      }
    }
  }

  // Scene 07 Dynamic Dual-Edge Hairlines (Inverted Entry & Bottom Exit)
  const scene07TopHairline = document.getElementById('scene07-top-hairline');
  const scene07TopPath = document.getElementById('scene07-top-hairline-path');
  const scene07TopDot = document.getElementById('scene07-top-hairline-dot');

  const scene07BottomHairline = document.getElementById('scene07-bottom-hairline');
  const scene07BottomPath = document.getElementById('scene07-bottom-hairline-path');
  const scene07BottomDot = document.getElementById('scene07-bottom-hairline-dot');
  const sheet07 = document.getElementById('scene07-sheet');
  const scene07PlateReveal = document.getElementById('scene07-plate-reveal');
  const scene07Track = document.getElementById('materials-finishes') || document.getElementById('section-08');

  if (scene07TopHairline) {
    scene07TopHairline.style.opacity = '0';
    scene07TopHairline.style.visibility = 'hidden';
    scene07TopHairline.style.display = 'none';
  }
  if (scene07BottomHairline) {
    scene07BottomHairline.style.opacity = '0';
    scene07BottomHairline.style.visibility = 'hidden';
    scene07BottomHairline.style.display = 'none';
  }

  let _lastS7 = {};
  let _lastS7Visibility = '';
  if (sheet07) sheet07.style.transform = '';

  function updateScene07DualEdge(topNotchX, bottomNotchX, topDepth, bottomDepth, bottomOpacity = 0) {
    const winW = window.innerWidth;
    const topNotchPixel = Math.round((Math.max(0, Math.min(100, topNotchX)) / 100) * winW);
    const topDepthPixel = Math.max(0, Math.round(topDepth));
    const topPercentRounded = Math.round(Math.max(0, Math.min(100, topNotchX)));

    if (_lastS7.topNotchPixel !== topNotchPixel || _lastS7.topDepthPixel !== topDepthPixel) {
      _lastS7 = { topNotchPixel, topDepthPixel };

      root.style.setProperty('--scene07-top-notch-x', `${topNotchPixel}px`);
      root.style.setProperty('--scene07-top-notch-y', `${topDepthPixel}px`);
      root.style.setProperty('--scene07-bottom-notch-y', '0px');
      root.style.setProperty('--scene07-bottom-hairline-opacity', '0');

      if (topDepthPixel <= 1) {
        if (sheet07) {
          sheet07.style.clipPath = 'none';
          sheet07.style.webkitClipPath = 'none';
          sheet07.style.willChange = 'auto';
        }
      } else {
        if (sheet07) {
          sheet07.style.clipPath = `polygon(0px ${topDepthPixel}px, ${topNotchPixel}px ${topDepthPixel}px, ${topNotchPixel}px 0px, 100% 0px, 100% 100%, 0px 100%)`;
          sheet07.style.webkitClipPath = sheet07.style.clipPath;
          sheet07.style.willChange = 'clip-path';
        }
      }

      if (scene07TopHairline) {
        scene07TopHairline.style.opacity = '0';
        scene07TopHairline.style.visibility = 'hidden';
        scene07TopHairline.style.display = 'none';
      }
      if (scene07BottomHairline) {
        scene07BottomHairline.style.opacity = '0';
        scene07BottomHairline.style.visibility = 'hidden';
        scene07BottomHairline.style.display = 'none';
      }
    }
  }

  // Scene 08 Dynamic Dual-Split Rise (Bespoke Manufacturing)
  const sheet08 = document.getElementById('scene08-sheet');
  const scene08Track = document.getElementById('bespoke-manufacturing') || document.getElementById('scene08') || document.getElementById('section-08');

  let _lastS8 = {};
  let _lastS8Visibility = '';
  if (sheet08) sheet08.style.transform = '';

  function updateScene08DualEdge(splitPercent, yLeft, yRight) {
    const winW = window.innerWidth;
    const splitPixel = Math.round((Math.max(0, Math.min(100, splitPercent)) / 100) * winW);
    const yL = Math.max(0, Math.round(yLeft));
    const yR = Math.max(0, Math.round(yRight));

    if (_lastS8.splitPixel !== splitPixel || _lastS8.yL !== yL || _lastS8.yR !== yR) {
      _lastS8 = { splitPixel, yL, yR };

      if (yL <= 1 && yR <= 1) {
        if (sheet08) {
          sheet08.style.clipPath = 'none';
          sheet08.style.webkitClipPath = 'none';
          sheet08.style.willChange = 'auto';
        }
      } else {
        if (sheet08) {
          sheet08.style.clipPath = `polygon(0px ${yL}px, ${splitPixel}px ${yL}px, ${splitPixel}px ${yR}px, 100% ${yR}px, 100% 100%, 0px 100%)`;
          sheet08.style.webkitClipPath = sheet08.style.clipPath;
          sheet08.style.willChange = 'clip-path';
        }
      }
    }
  }

  // Scene 09 Dynamic Reversed Dual-Split Rise (Project Inquiry)
  const sheet09 = document.getElementById('scene09-sheet');
  const scene09Track = document.getElementById('project-inquiry') || document.getElementById('scene09');

  let _lastS9 = {};
  let _lastS9Visibility = '';
  if (sheet09) sheet09.style.transform = '';

  function updateScene09Slats(w1, w2, w3, w4) {
    if (w1 >= 99.5 && w2 >= 99.5 && w3 >= 99.5 && w4 >= 99.5) {
      if (_lastS9.docked !== true) {
        _lastS9 = { docked: true };
        if (sheet09) {
          sheet09.style.clipPath = 'none';
          sheet09.style.webkitClipPath = 'none';
          sheet09.style.willChange = 'auto';
        }
      }
      return;
    }

    const rw1 = Math.max(0, Math.min(100, w1)).toFixed(1);
    const rw2 = Math.max(0, Math.min(100, w2)).toFixed(1);
    const rw3 = Math.max(0, Math.min(100, w3)).toFixed(1);
    const rw4 = Math.max(0, Math.min(100, w4)).toFixed(1);

    if (_lastS9.rw1 !== rw1 || _lastS9.rw2 !== rw2 || _lastS9.rw3 !== rw3 || _lastS9.rw4 !== rw4) {
      _lastS9 = { docked: false, rw1, rw2, rw3, rw4 };

      // 4 Horizontal Architectural Slats entering from LEFT edge (0% -> 100%)
      const poly = `polygon(0% 0%, ${rw1}% 0%, ${rw1}% 25%, ${rw2}% 25%, ${rw2}% 50%, ${rw3}% 50%, ${rw3}% 75%, ${rw4}% 75%, ${rw4}% 100%, 0% 100%)`;
      if (sheet09) {
        sheet09.style.clipPath = poly;
        sheet09.style.webkitClipPath = poly;
        sheet09.style.willChange = 'clip-path';
      }
    }
  }



  let ticking = false;

  function calculateProgress(element) {
    if (!element) return 0;
    const rect = element.getBoundingClientRect();
    const windowH = window.innerHeight;
    const totalDist = rect.height - windowH;
    if (totalDist <= 0) return 0;
    const scrolled = -rect.top;
    return Math.max(0, Math.min(1, scrolled / totalDist));
  }

  function onScroll() {
    const scroller = getScrollContainer();
    const scrollY = Math.max(0, getScrollY());
    const windowH = window.innerHeight || (scroller ? scroller.clientHeight : 844);
    const maxScroll = scroller ? ((scroller.scrollHeight - scroller.clientHeight) || 1) : ((document.documentElement.scrollHeight - windowH) || 1);
    const totalPercent = Math.max(0, Math.min(1, (scrollY / maxScroll) * 100));

    const headerH = header ? header.offsetHeight : 58;

    // Determine current active scene under the header
    let activeSceneData = tracks[0];
    tracks.forEach(t => {
      if (!t.el) return;
      const rect = t.el.getBoundingClientRect();

      // Check if scene overlaps the header
      if (rect.top <= (headerH + 10) && rect.bottom > headerH) {
        activeSceneData = t;
      }
    });

    // 01. HERO PROGRESS & FOREGROUND SHEET ASCENT
    const heroProgress = Math.max(0, Math.min(1, scrollY / windowH));
    root.style.setProperty('--hero-progress', heroProgress.toFixed(4));

    // Foreground sheet exits cleanly over the first 35% of travel as Scene 02 ascends
    const heroSheetProgress = Math.max(0, Math.min(1, scrollY / (windowH * 0.35)));
    root.style.setProperty('--hero-sheet-progress', heroSheetProgress.toFixed(4));

    const isHeroActive = (activeSceneData && activeSceneData.el && activeSceneData.el.id === 'hero') && scrollY < windowH * 0.5;
    const isHeroTransitioning = isHeroActive && heroSheetProgress < 0.90;

    if (header) {
      // Menu is hidden strictly while in Hero (initial view, prompting user to scroll)
      header.classList.toggle('in-hero', scrollY < 80);
      header.classList.toggle('header-scrolled', !isHeroTransitioning && scrollY > 50);
      header.classList.toggle('header-hero-scrolling', isHeroTransitioning && scrollY > 5);

      const isScene04Active = activeSceneData && activeSceneData.title && activeSceneData.title.includes('FEATURED PRODUCTS');
      const isScene05Active = activeSceneData && activeSceneData.title && activeSceneData.title.includes('TURATH PROJECTS');
      const isScene06Active = activeSceneData && activeSceneData.title && activeSceneData.title.includes('FOUNDER');
      const isScene07Active = activeSceneData && activeSceneData.title && activeSceneData.title.includes('MATERIALS & FINISHES');
      const isScene08Active = activeSceneData && activeSceneData.title && activeSceneData.title.includes('BESPOKE MANUFACTURING');
      const isScene09Active = activeSceneData && activeSceneData.title && activeSceneData.title.includes('PROJECT INQUIRY');

      header.classList.toggle('header-scene04', Boolean(isScene04Active));
      header.classList.toggle('header-scene05', Boolean(isScene05Active));
      header.classList.toggle('header-scene06', Boolean(isScene06Active));
      header.classList.toggle('header-scene07', Boolean(isScene07Active));
      header.classList.toggle('header-scene08', Boolean(isScene08Active));
      header.classList.toggle('header-scene09', Boolean(isScene09Active));

      document.body.classList.toggle('in-scene04', Boolean(isScene04Active));
      document.body.classList.toggle('in-scene05', Boolean(isScene05Active));
      document.body.classList.toggle('in-scene06', Boolean(isScene06Active));
      document.body.classList.toggle('in-scene07', Boolean(isScene07Active));
      document.body.classList.toggle('in-scene08', Boolean(isScene08Active));
      document.body.classList.toggle('in-scene09', Boolean(isScene09Active));
    }

    // Hero descriptive lines ("SCROLL TURATH WEBSITE..", "DEVOTED", "TO CREATIVITY ..") ascend & fade out smoothly
    const heroTextFade = Math.max(0, Math.min(1, scrollY / (windowH * 0.14 || 110)));
    root.style.setProperty('--hero-text-fade', heroTextFade.toFixed(4));

    // Hero scroll down arrow button: fast disappearance on scroll (vanishes completely within 20px)
    const heroScrollBtn = document.getElementById('hero-scroll-next-btn');
    if (heroScrollBtn) {
      const arrowProgress = Math.min(1, Math.max(0, scrollY / 20));
      const arrowOpacity = (1 - arrowProgress).toFixed(3);
      heroScrollBtn.style.opacity = arrowOpacity;
      heroScrollBtn.style.pointerEvents = arrowProgress >= 1 ? 'none' : 'auto';
      heroScrollBtn.style.transform = `translate3d(0, ${(arrowProgress * 6).toFixed(1)}px, 0)`;
    }

    const aboutTrack = tracks[1]?.el || document.getElementById('about');
    const aboutWrapper = aboutTrack?.querySelector('.about-sheet-wrapper');
    const rectAbout = aboutTrack ? aboutTrack.getBoundingClientRect() : null;
    const isAboutDocked = rectAbout && (rectAbout.top <= 58);

    const heroSheet = document.getElementById('hero-sheet');
    if (heroSheet) {
      if (heroSheetProgress >= 0.95 || isAboutDocked) {
        heroSheet.style.opacity = '0';
        heroSheet.style.visibility = 'hidden';
        heroSheet.style.pointerEvents = 'none';
      } else {
        heroSheet.style.opacity = '1';
        heroSheet.style.visibility = 'visible';
        heroSheet.style.pointerEvents = 'auto';
      }
    }

    const heroTrack = tracks[0].el;
    if (heroTrack) {
      heroTrack.style.visibility = (isAboutDocked || scrollY > windowH * 0.9) ? 'hidden' : 'visible';
    }

    // TURATH LOGO FLIP & DYNAMIC SCRAMBLE INTERPOLATION
    updateTurathInterpolation(scrollY);

    // 02. SECTION 02 (OUR COLLECTIONS) MORPHING SHEET ASCENT OVER PINNED HERO
    if (aboutTrack && aboutWrapper && rectAbout) {
      const headerH = 58;
      const travelDist = Math.max(1, windowH - headerH);
      const isMobile = window.innerWidth <= 768;

      const initialDepth = isMobile ? 48 : 64;
      const initialNotchX = 48.0;
      const targetNotchX = 20.0;

      let currentNotchX = targetNotchX;
      let currentDepth = 0;

      if (rectAbout.top > headerH) {
        // Entry Morph Phase: Section 02 ascending over pinned stationary Hero
        const pEntry = Math.max(0, Math.min(1, (windowH - rectAbout.top) / travelDist));
        // Smooth cubic easing curve (easeInOutQuad)
        const easeEntry = pEntry < 0.5 ? 2 * pEntry * pEntry : 1 - Math.pow(-2 * pEntry + 2, 2) / 2;

        currentNotchX = Math.round(initialNotchX - easeEntry * (initialNotchX - targetNotchX));
        currentDepth = Math.round(initialDepth - easeEntry * initialDepth);
      } else {
        // Docked Reading Phase: locked flush under fixed header bar - 100% sealed, zero gap, zero cutout notch
        currentNotchX = targetNotchX;
        currentDepth = 0;
      }

      if (currentDepth <= 0) {
        if (aboutWrapper.style.clipPath !== 'none') {
          aboutWrapper.style.clipPath = 'none';
          aboutWrapper.style.webkitClipPath = 'none';
          aboutWrapper._lastClipPoly = 'none';
          root.style.setProperty('--scene02-notch-y', '0px');
        }
      } else {
        const notchXStr = `${currentNotchX.toFixed(2)}%`;
        const depthStr = `${currentDepth}px`;
        const clipPoly = `polygon(0px ${depthStr}, ${notchXStr} ${depthStr}, ${notchXStr} 0px, 100% 0px, 100% 100%, 0px 100%)`;

        if (aboutWrapper._lastClipPoly !== clipPoly) {
          aboutWrapper._lastClipPoly = clipPoly;
          root.style.setProperty('--scene02-notch-x', notchXStr);
          root.style.setProperty('--scene02-notch-y', depthStr);
          aboutWrapper.style.clipPath = clipPoly;
          aboutWrapper.style.webkitClipPath = clipPoly;
        }
      }

      const sheet02 = aboutWrapper.querySelector('.scene-sheet');
      if (sheet02 && sheet02.style.clipPath !== 'none') {
        sheet02.style.clipPath = 'none';
        sheet02.style.webkitClipPath = 'none';
      }

      if (tracks[1]) {
        tracks[1].notch = currentDepth <= 0 ? 'FLAT DOCKED' : `MORPH-STEP (${Math.round(currentNotchX)}% @ ${currentDepth}px)`;
      }
    }

    // 05. SECTION 05: TRACK & RECT INITIALIZATION
    const scene05Track = tracks[4]?.el || document.getElementById('scene05');
    const scene06Track = tracks[5]?.el || document.getElementById('scene06');
    let accessProgress = 0;
    let rect5 = null;
    if (scene05Track) {
      rect5 = scene05Track.getBoundingClientRect();
    }

    // Header Contrast Switch
    if (activeSceneData.title.includes('HERO')) {
      updateActiveHeaderTheme(heroSheetProgress < 0.85 ? 'light' : 'dark');
    } else {
      updateActiveHeaderTheme(activeSceneData.theme);
    }

    // Live Calibration HUD update
    updateCalibrationHud(activeSceneData, totalPercent);

    // 02. SCENE 02 DUAL WINDOW PARALLAX
    frames.forEach(frame => {
      const inner = frame.querySelector('.frame-window-inner');
      if (inner) {
        const rect = frame.getBoundingClientRect();
        const centerOffset = (rect.top + rect.height / 2) - (window.innerHeight / 2);
        const shift = (centerOffset * 0.12).toFixed(2);
        inner.style.transform = `translate3d(0, ${shift}px, 0)`;
      }
    });

    // 03. INFORMATION 3-STAGE VOLUMETRIC SEQUENCER & SCENE 03 SCROLL-ON-02 MORPH
    const infoTrack = tracks[2]?.el || document.getElementById('information');
    const sheet03 = document.getElementById('scene03-sheet') || infoTrack?.querySelector('.scene-sheet');

    let infoProgress = 0;
    if (infoTrack && sheet03) {
      const rectInfo = infoTrack.getBoundingClientRect();
      const headerH = 58;
      const travelDist = Math.max(1, windowH - headerH);
      const isMobile = window.innerWidth <= 768;

      const initialDepth = isMobile ? 48 : 64;
      const initialNotchX = 64.0;
      const targetNotchX = 20.0;

      let currentNotchX = targetNotchX;
      let currentDepth = 0;

      if (rectInfo.top > headerH) {
        // Entry Morph Phase: Section 03 ascending over natively sticky Section 02
        const pEntry = Math.max(0, Math.min(1, (windowH - rectInfo.top) / travelDist));
        // Smooth cubic easing curve (easeInOutQuad) identical to Section 02 over Hero
        const easeEntry = pEntry < 0.5 ? 2 * pEntry * pEntry : 1 - Math.pow(-2 * pEntry + 2, 2) / 2;

        currentNotchX = Math.round(initialNotchX - easeEntry * (initialNotchX - targetNotchX));
        currentDepth = Math.round(initialDepth - easeEntry * initialDepth);
        infoProgress = 0;
      } else {
        // Docked Reading Phase: locked flush under fixed header bar & continuous scroll-linked reading
        const pinDist = rectInfo.height - windowH;
        infoProgress = pinDist > 0 ? Math.max(0, Math.min(1, (headerH - rectInfo.top) / pinDist)) : 0;
        currentNotchX = targetNotchX;
        currentDepth = 0;
      }

      if (currentDepth <= 0) {
        if (sheet03.style.clipPath !== 'none') {
          sheet03.style.clipPath = 'none';
          sheet03.style.webkitClipPath = 'none';
          sheet03._lastClipPoly = 'none';
          root.style.setProperty('--scene03-top-notch-y', '0px');
          sheet03.style.setProperty('--scene03-top-notch-y', '0px');
        }
      } else {
        const notchXStr = `${currentNotchX.toFixed(2)}%`;
        const depthStr = `${currentDepth}px`;
        const clipPoly = `polygon(0px ${depthStr}, ${notchXStr} ${depthStr}, ${notchXStr} 0px, 100% 0px, 100% 100%, 0px 100%)`;

        if (sheet03._lastClipPoly !== clipPoly) {
          sheet03._lastClipPoly = clipPoly;
          root.style.setProperty('--scene03-top-notch-x', notchXStr);
          root.style.setProperty('--scene03-top-notch-y', depthStr);
          sheet03.style.setProperty('--scene03-top-notch-x', notchXStr);
          sheet03.style.setProperty('--scene03-top-notch-y', depthStr);

          sheet03.style.clipPath = clipPoly;
          sheet03.style.webkitClipPath = clipPoly;
        }
      }

      if (tracks[2]) {
        tracks[2].notch = currentDepth <= 0 ? 'FLAT DOCKED' : `MORPH-STEP (${Math.round(currentNotchX)}% @ ${currentDepth}px)`;
      }
    }
    root.style.setProperty('--info-progress', infoProgress.toFixed(4));

    let volumetricStage = 1;
    if (infoProgress < 0.333) {
      volumetricStage = 1;
    } else if (infoProgress < 0.666) {
      volumetricStage = 2;
    } else {
      volumetricStage = 3;
    }

    updateVolumetricSequencer(volumetricStage, infoProgress);

    // 04. STRATEGIC POSITION: ROCK-SOLID PINNED BASELINE STAGE UNDER SCENE 05
    const scene04Track = tracks[3].el;
    let locProgress = 0;
    if (scene04Track) {
      const rect4 = scene04Track.getBoundingClientRect();
      const headerH = 58;
      const travelDist4 = Math.max(1, windowH - headerH);
      const pinDist4 = rect4.height - windowH;
      const isMobile4 = window.innerWidth <= 768;

      const baseDepth4 = isMobile4 ? 26 : 38;
      const initialDepth4 = isMobile4 ? 48 : 64;
      let topNotchX = 24.0;
      let bottomNotchX = 74.0;
      let topDepth = 0;
      let bottomDepth = 0; // Flat bottom during reading and hold: zero premature cutouts or voids!
      let bottomOpacity = 0;

      if (rect4.top > 0) {
        // Entry phase (climbing into view over Scene 03 Metrics & Information)
        const pEntry = Math.max(0, Math.min(1, (windowH - rect4.top) / windowH));
        const easeEntry = pEntry < 0.5 ? 2 * pEntry * pEntry : 1 - Math.pow(-2 * pEntry + 2, 2) / 2;
        topNotchX = 72.0 - easeEntry * (72.0 - 24.0); // Morphs 72% down to 24%
        topDepth = 0; // Flat top flush with viewport top: 0 so video extends cleanly behind navbar
        bottomNotchX = 74.0;
        bottomDepth = 0;
        bottomOpacity = 0;
        locProgress = pEntry * 0.15;

        root.style.setProperty('--scene04-exit-offset', '0px');
        root.style.setProperty('--scene04-content-parallax', '0px');

        if (sheet04) {
          if (_lastS4Visibility !== 'visible') {
            sheet04.style.visibility = 'visible';
            sheet04.style.pointerEvents = 'auto';
            _lastS4Visibility = 'visible';
          }
        }
      } else {
        // Active docked reading and handoff phase (pinned flush to top: 0 behind header)
        const pScene = pinDist4 > 0 ? Math.max(0, Math.min(1, (-rect4.top) / pinDist4)) : 1;
        locProgress = pScene;
        topNotchX = 24.0;
        topDepth = 0;
        bottomNotchX = 74.0;
        bottomDepth = 0;
        bottomOpacity = 0;

        // Subtle upward float during reading
        const readOffset = Math.round(Math.min(1, pScene) * 8 * 100) / 100;
        root.style.setProperty('--scene04-exit-offset', `${readOffset.toFixed(2)}px`);
        root.style.setProperty('--scene04-content-parallax', `${(-readOffset).toFixed(2)}px`);

        // PURE NATIVE STICKY PINNING (NO JS TRANSFORMS ON SHEET04):
        // Scene 04 stays pinned at top: 0 behind header via native CSS position: sticky!
        // Once Scene 05 has completely unmasked and covered Section 04, set sheet04.style.visibility = 'hidden'.
        if (sheet04) {
          const s5FullyCovered = rect5 && (rect5.top <= 2);
          if (s5FullyCovered) {
            if (_lastS4Visibility !== 'hidden') {
              sheet04.classList.add('turath-sheet-hidden');
              sheet04.style.setProperty('visibility', 'hidden', 'important');
              sheet04.style.pointerEvents = 'none';
              _lastS4Visibility = 'hidden';
            }
          } else if (rect5 && rect5.top > 6) {
            if (_lastS4Visibility !== 'visible') {
              sheet04.classList.remove('turath-sheet-hidden');
              sheet04.style.removeProperty('visibility');
              sheet04.style.pointerEvents = 'auto';
              _lastS4Visibility = 'visible';
            }
          }
        }
      }

      updateScene04DualEdge(topNotchX, bottomNotchX, topDepth, bottomDepth, bottomOpacity);

      if (tracks[3]) {
        tracks[3].notch = `PINNED-BASE (24%)`;
      }
    }
    root.style.setProperty('--loc-progress', locProgress.toFixed(4));

    // 05. TURATH PROJECTS: STEPPED NOTCH ANIMATION CLONED FROM SECTION 04 (ZERO STROKE)
    runScene05Animation();
    if (tracks[4]) {
      tracks[4].notch = 'PINNED-BASE (24%)';
    }

    // 06. FOUNDER: 4-SLAT BI-DIRECTIONAL ARCHITECTURAL CURTAIN (FROM LEFT & RIGHT) & UPWARD FADE-IN
    let envProgress = 0;
    if (scene06Track) {
      const rect6 = scene06Track.getBoundingClientRect();
      const headerH = 58;
      const travelDist6 = Math.max(1, windowH);
      const isMobile6 = window.innerWidth <= 768;

      let pEntry = 0;
      let pPin = 0;
      if (rect6.top > 0) {
        // Entry morph phase climbing into view over Section 05 behind top header (travelDist6 = windowH)
        pEntry = Math.max(0, Math.min(1, (windowH - rect6.top) / travelDist6));
        pPin = 0;
        envProgress = pEntry * 0.35;
      } else {
        // Active docked reading phase (pinned flush from top: 0 directly behind the frosted glass header)
        pEntry = 1.0;
        const track6H = scene06Track.offsetHeight || (windowH * 1.8);
        const pinDist6 = Math.max(1, track6H - windowH);

        const rect7 = scene07Track ? scene07Track.getBoundingClientRect() : null;
        if (rect7) {
          // When Section 06 docks, Section 07 top is at (windowH + pinDist6).
          // As user continues scrolling, Section 07 ascends towards windowH (end of dwell).
          const distScrolled = (windowH + pinDist6) - rect7.top;
          pPin = Math.max(0, Math.min(1, distScrolled / pinDist6));
        } else {
          // Fallback via document scroll
          const dockScrollY = Math.max(0, scene06Track.offsetTop);
          const scrollY = Math.max(0, getScrollY());
          pPin = Math.max(0, Math.min(1, (scrollY - dockScrollY) / pinDist6));
        }

        envProgress = 0.35 + pPin * 0.65;
      }

      const easeSlats = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

      // 4 Horizontal Architectural Slats entering symmetrically from Left & Right toward Center (0% -> 50%)
      // Slats sweep across calmly and slowly so the two halves meet in the LAST quarter at the top of the page (pEntry 0.75 - 0.98)
      // Slat 1 (Top 0-25%): 0.05 to 0.88
      const pS1 = Math.max(0, Math.min(1, (pEntry - 0.05) / 0.83));
      const w1 = easeSlats(pS1) * 50;

      // Slat 2 (Upper-mid 25-50%): 0.09 to 0.92
      const pS2 = Math.max(0, Math.min(1, (pEntry - 0.09) / 0.83));
      const w2 = easeSlats(pS2) * 50;

      // Slat 3 (Lower-mid 50-75%): 0.13 to 0.95
      const pS3 = Math.max(0, Math.min(1, (pEntry - 0.13) / 0.83));
      const w3 = easeSlats(pS3) * 50;

      // Slat 4 (Bottom 75-100%): 0.16 to 0.98
      const pS4 = Math.max(0, Math.min(1, (pEntry - 0.16) / 0.83));
      const w4 = easeSlats(pS4) * 50;

      // STORYBOARD TIMELINE (USER SPECIFICATION):
      // 1. Entry morph: Slats close smoothly from left and right over Section 05.
      //    Dark unlit photo is the base layer (always visible).
      //    The two halves sweep slowly and meet in the last quarter at the top of the page.
      // 2. Section docks at the top (pEntry = 1.0) and text settles completely at the top (first quarter).
      // 3. Pinned dwell phase (after section stabilizes at top & text is visible):
      //    As user continues scrolling (pPin: 0.05 -> 0.85), the second illuminated image
      //    fades in gradually and radiantly over the dark image, exactly like Hero!

      const darkOpacity = 1.0;
      let litOpacity = 0.0;

      if (pPin <= 0.05) {
        litOpacity = 0.0;
      } else if (pPin < 0.85) {
        const pLitIn = (pPin - 0.05) / 0.80;
        const easeLitIn = pLitIn < 0.5 ? 2 * pLitIn * pLitIn : 1 - Math.pow(-2 * pLitIn + 2, 2) / 2;
        litOpacity = easeLitIn;
      } else {
        litOpacity = 1.0;
      }

      root.style.setProperty('--scene06-dark-opacity', darkOpacity.toFixed(3));
      root.style.setProperty('--scene06-lit-opacity', litOpacity.toFixed(3));

      // Outgoing Section 05 under-next dimming: slow, sustained, and calm fade-out
      // Section 05 holds solid at 1.0 while Section 06 slats sweep in from the edges, then slowly dissolves
      let underOpacity5 = 1.0;
      if (pEntry <= 0.40) {
        underOpacity5 = 1.0;
      } else if (pEntry < 0.98) {
        const pFade = (pEntry - 0.40) / (0.98 - 0.40);
        // Sinusoidal ease-out: keeps Section 05 rich and visible for much longer, then softly lands at 0
        underOpacity5 = Math.max(0, Math.cos(pFade * Math.PI / 2));
      } else {
        underOpacity5 = 0.0;
      }
      root.style.setProperty('--scene05-under-opacity', underOpacity5.toFixed(2));
      root.style.setProperty('--scene05-under-parallax', '0px');

      // Section 06 background subtle vertical parallax
      const bgParallax6 = Math.round((1 - pEntry) * (isMobile6 ? 12 : 20));
      root.style.setProperty('--scene06-bg-parallax', `${bgParallax6}px`);

      // Content (Editorial Text Box in the first quarter of the section):
      // Calm upward float from bottom to top and smooth fade-in as the two halves meet in the last quarter
      // Begins floating at pEntry = 0.55, fully settled by pEntry = 0.95
      const contentP = Math.max(0, Math.min(1, (pEntry - 0.55) / 0.40));
      const contentEase = contentP < 0.5 ? 2 * contentP * contentP : 1 - Math.pow(-2 * contentP + 2, 2) / 2;
      const cardY = Math.round((1 - contentEase) * 16);
      const cardOpacity = contentEase.toFixed(2);
      root.style.setProperty('--scene06-card-y', `${cardY}px`);
      root.style.setProperty('--scene06-card-opacity', cardOpacity);
      root.style.setProperty('--scene06-card-scale', (0.98 + contentEase * 0.02).toFixed(3));

      // Sheet 06 visibility
      // Section 06 should ONLY be visible when entering or active, AND NOT covered by Section 07
      const rect7ForS6 = scene07Track ? scene07Track.getBoundingClientRect() : null;
      const s7DockedOverS6 = rect7ForS6 && (rect7ForS6.top <= headerH + 2) && (rect6.top <= headerH);
      const shouldBeVisible = (pEntry > 0.01) && !s7DockedOverS6;

      if (sheet06) {
        if (shouldBeVisible) {
          if (_lastS6Visibility !== 'visible') {
            sheet06.classList.remove('turath-sheet-hidden');
            sheet06.style.removeProperty('display');
            sheet06.style.removeProperty('visibility');
            sheet06.style.removeProperty('opacity');
            sheet06.style.pointerEvents = 'auto';
            _lastS6Visibility = 'visible';
          }
        } else {
          if (_lastS6Visibility !== 'hidden') {
            sheet06.classList.add('turath-sheet-hidden');
            sheet06.style.setProperty('display', 'none', 'important');
            sheet06.style.setProperty('visibility', 'hidden', 'important');
            sheet06.style.setProperty('opacity', '0', 'important');
            sheet06.style.pointerEvents = 'none';
            _lastS6Visibility = 'hidden';
          }
        }
      }

      // Section 05 underneath visibility (retired only once Section 06 is fully docked & slats 100% closed at pEntry >= 0.98)
      if (sheet05) {
        if (pEntry >= 0.98) {
          if (_lastS5Visibility !== 'hidden') {
            sheet05.classList.add('turath-sheet-hidden');
            sheet05.style.setProperty('display', 'none', 'important');
            sheet05.style.setProperty('visibility', 'hidden', 'important');
            sheet05.style.setProperty('opacity', '0', 'important');
            sheet05.style.pointerEvents = 'none';
            _lastS5Visibility = 'hidden';
          }
        } else if (pEntry < 0.95) {
          if (_lastS5Visibility !== 'visible') {
            sheet05.classList.remove('turath-sheet-hidden');
            sheet05.style.removeProperty('display');
            sheet05.style.removeProperty('visibility');
            sheet05.style.removeProperty('opacity');
            sheet05.style.pointerEvents = 'auto';
            _lastS5Visibility = 'visible';
          }
        }
      }

      updateScene06BiSlats(w1, w2, w3, w4);

      const track06 = tracks.find(t => t.el === scene06Track);
      if (track06) {
        track06.notch = `BI-SLATS (${Math.round(w1 * 2)}%, ${Math.round(w2 * 2)}%, ${Math.round(w3 * 2)}%, ${Math.round(w4 * 2)}%)`;
      }
    }
    root.style.setProperty('--env-progress', envProgress.toFixed(4));

    // 07. MATERIALS & FINISHES: INVERTED DUAL-EDGE MORPHING & REVERSE PARALLAX
    let materialsProgress = 0;
    if (scene07Track) {
      const rect7 = scene07Track.getBoundingClientRect();
      const headerH = 58;
      const travelDist7 = Math.max(1, windowH - headerH);
      const isMobile7 = window.innerWidth <= 768;
      const baseDepth7 = isMobile7 ? 26 : 38;
      const initialDepth7 = isMobile7 ? 48 : 64;

      let topNotchX = 24.0;
      let topDepth = 0;
      let bottomNotchX = 74.0;
      let bottomDepth = 0;
      let bottomOpacity = 0;

      if (rect7.top > headerH) {
        // Entry morph phase (climbing into view over Section 06 Founder)
        const pEntry = Math.max(0, Math.min(1, (windowH - rect7.top) / travelDist7));
        materialsProgress = pEntry * 0.15;

        const easeEntry = pEntry < 0.5 ? 2 * pEntry * pEntry : 1 - Math.pow(-2 * pEntry + 2, 2) / 2;
        // Directional notch morph (76% down to 24%) with integer rounding
        topNotchX = Math.round(76.0 - easeEntry * (76.0 - 24.0));
        topDepth = Math.round(initialDepth7 - easeEntry * initialDepth7);

        root.style.setProperty('--scene07-content-shift-x', '0px');
        root.style.setProperty('--scene07-content-parallax', '0px');

        // Smooth gradual dissolve/fade of Section 06 as Section 07 climbs over it
        const underOpacity6 = Math.max(0, 1 - pEntry * 0.45).toFixed(2);
        root.style.setProperty('--scene06-under-opacity', underOpacity6);

        bottomNotchX = 74.0;
        bottomDepth = 0;
        bottomOpacity = 0;

        if (sheet07) {
          if (_lastS7Visibility !== 'visible') {
            sheet07.classList.remove('turath-sheet-hidden');
            sheet07.style.removeProperty('visibility');
            sheet07.style.pointerEvents = 'auto';
            _lastS7Visibility = 'visible';
          }
        }

        // Keep Section 06 visible underneath while Section 07 is sliding over it!
        if (sheet06 && pEntry > 0.01) {
          if (_lastS6Visibility !== 'visible') {
            sheet06.classList.remove('turath-sheet-hidden');
            sheet06.style.removeProperty('display');
            sheet06.style.removeProperty('visibility');
            sheet06.style.removeProperty('opacity');
            sheet06.style.pointerEvents = 'auto';
            _lastS6Visibility = 'visible';
          }
        }
      } else {
        // Active docked reading phase (pinned flush under header bar - 100% sealed, zero gap)
        materialsProgress = 1;

        root.style.setProperty('--scene07-content-shift-x', '0px');
        root.style.setProperty('--scene07-content-parallax', '0px');
        root.style.setProperty('--scene06-under-opacity', '1');

        topNotchX = 24.0;
        topDepth = 0;
        bottomNotchX = 74.0;
        bottomDepth = 0;
        bottomOpacity = 0;

        if (sheet07) {
          if (_lastS7Visibility !== 'visible') {
            sheet07.classList.remove('turath-sheet-hidden');
            sheet07.style.removeProperty('visibility');
            sheet07.style.pointerEvents = 'auto';
            _lastS7Visibility = 'visible';
          }
        }

        // Section 06 is cleanly hidden once Section 07 is fully docked (with hysteresis)
        if (sheet06) {
          const s7FullyCovered = rect7 && (rect7.top <= headerH + 2);
          if (s7FullyCovered) {
            if (_lastS6Visibility !== 'hidden') {
              sheet06.classList.add('turath-sheet-hidden');
              sheet06.style.setProperty('display', 'none', 'important');
              sheet06.style.setProperty('visibility', 'hidden', 'important');
              sheet06.style.setProperty('opacity', '0', 'important');
              sheet06.style.pointerEvents = 'none';
              _lastS6Visibility = 'hidden';
            }
          } else if (rect7 && rect7.top > headerH + 6) {
            if (_lastS6Visibility !== 'visible') {
              sheet06.classList.remove('turath-sheet-hidden');
              sheet06.style.removeProperty('display');
              sheet06.style.removeProperty('visibility');
              sheet06.style.removeProperty('opacity');
              sheet06.style.pointerEvents = 'auto';
              _lastS6Visibility = 'visible';
            }
          }
        }
      }

      updateScene07DualEdge(topNotchX, bottomNotchX, topDepth, bottomDepth, bottomOpacity);

      const track07 = tracks.find(t => t.el === scene07Track);
      if (track07) {
        track07.notch = `PINNED-BASE (${Math.round(topNotchX)}%)`;
      }
    }
    root.style.setProperty('--materials-progress', materialsProgress.toFixed(4));

    // 08. BESPOKE MANUFACTURING: DUAL-SPLIT ARCHITECTURAL RISE (NO STROKE)
    if (scene08Track) {
      const rect8 = scene08Track.getBoundingClientRect();
      const headerH = 58;
      const travelDist8 = Math.max(1, windowH - headerH);
      const isMobile8 = window.innerWidth <= 768;

      const splitStepH = isMobile8 ? Math.round(windowH * 0.22) : Math.round(windowH * 0.26);
      const splitX = 50.0;
      let yLeft = 0;
      let yRight = 0;

      if (rect8.top > headerH) {
        // Entry phase: Left half (where text lives) leads, Right half (where lantern lives) trails behind
        const pEntry = Math.max(0, Math.min(1, (windowH - rect8.top) / travelDist8));

        yLeft = 0;
        if (pEntry <= 0.60) {
          const p1 = pEntry / 0.60;
          yRight = Math.round(splitStepH * (1 - p1 * 0.20));
        } else {
          const p2 = (pEntry - 0.60) / 0.40;
          const ease2 = p2 < 0.5 ? 2 * p2 * p2 : 1 - Math.pow(-2 * p2 + 2, 2) / 2;
          yRight = Math.round(splitStepH * 0.80 * (1 - ease2));
        }

        // Outgoing Section 07 under-next dimming (lock offset to 0 to prevent sticky transform jitter)
        const underOpacity7 = (1 - pEntry * 0.25).toFixed(2);
        root.style.setProperty('--scene07-under-parallax', '0px');
        root.style.setProperty('--scene07-under-opacity', underOpacity7);

        // Section 08 interior background travel
        const bgParallax8 = Math.round((1 - pEntry) * (isMobile8 ? 20 : 35));
        root.style.setProperty('--scene08-bg-parallax', `${bgParallax8}px`);

        // Content cards glide up softly
        const cardP = Math.max(0, Math.min(1, (pEntry - 0.45) / 0.55));
        const cardEase = cardP < 0.5 ? 2 * cardP * cardP : 1 - Math.pow(-2 * cardP + 2, 2) / 2;
        const cardY = Math.round((1 - cardEase) * 20);
        const cardOpacity = cardEase.toFixed(2);
        root.style.setProperty('--scene08-card-y', `${cardY}px`);
        root.style.setProperty('--scene08-card-opacity', cardOpacity);

        if (sheet08) {
          if (_lastS8Visibility !== 'visible') {
            sheet08.classList.remove('turath-sheet-hidden');
            sheet08.style.removeProperty('visibility');
            sheet08.style.pointerEvents = 'auto';
            _lastS8Visibility = 'visible';
          }
        }

        // Keep Section 07 visible underneath while Section 08 is sliding over it
        if (sheet07) {
          if (_lastS7Visibility !== 'visible') {
            sheet07.classList.remove('turath-sheet-hidden');
            sheet07.style.removeProperty('visibility');
            sheet07.style.pointerEvents = 'auto';
            _lastS7Visibility = 'visible';
          }
        }
      } else {
        // Docked flush under 58px header
        yLeft = 0;
        yRight = 0;

        root.style.setProperty('--scene07-under-parallax', '0px');
        root.style.setProperty('--scene07-under-opacity', '1');
        root.style.setProperty('--scene08-bg-parallax', '0px');
        root.style.setProperty('--scene08-card-y', '0px');
        root.style.setProperty('--scene08-card-opacity', '1');

        if (sheet08) {
          if (_lastS8Visibility !== 'visible') {
            sheet08.classList.remove('turath-sheet-hidden');
            sheet08.style.removeProperty('visibility');
            sheet08.style.pointerEvents = 'auto';
            _lastS8Visibility = 'visible';
          }
        }

        // Section 07 is cleanly hidden once Section 08 is fully docked (with hysteresis)
        const s8FullyCovered = rect8 && (rect8.top <= headerH + 2);
        if (sheet07) {
          if (s8FullyCovered) {
            if (_lastS7Visibility !== 'hidden') {
              sheet07.classList.add('turath-sheet-hidden');
              sheet07.style.setProperty('visibility', 'hidden', 'important');
              sheet07.style.pointerEvents = 'none';
              _lastS7Visibility = 'hidden';
            }
          } else if (rect8 && rect8.top > headerH + 6) {
            if (_lastS7Visibility !== 'visible') {
              sheet07.classList.remove('turath-sheet-hidden');
              sheet07.style.removeProperty('visibility');
              sheet07.style.pointerEvents = 'auto';
              _lastS7Visibility = 'visible';
            }
          }
        }

        // Section 06 is cleanly hidden once Section 08 is fully docked
        if (sheet06 && s8FullyCovered) {
          if (_lastS6Visibility !== 'hidden') {
            sheet06.classList.add('turath-sheet-hidden');
            sheet06.style.setProperty('display', 'none', 'important');
            sheet06.style.setProperty('visibility', 'hidden', 'important');
            sheet06.style.setProperty('opacity', '0', 'important');
            sheet06.style.pointerEvents = 'none';
            _lastS6Visibility = 'hidden';
          }
        }
      }

      updateScene08DualEdge(splitX, yLeft, yRight);

      const track08 = tracks.find(t => t.el === scene08Track);
      if (track08) {
        track08.notch = `DUAL-SPLIT (50%)`;
      }
    }

    // 09. PROJECT INQUIRY: CALM 4-SLAT ARCHITECTURAL SLIDE FROM LEFT (CLIMBING OVER SECTION 08)
    if (scene09Track) {
      const rect9 = scene09Track.getBoundingClientRect();
      const headerH = 58;
      const travelDist9 = Math.max(1, windowH - headerH);
      const isMobile9 = window.innerWidth <= 768;

      let pEntry9 = 0;
      if (rect9.top > headerH) {
        // Entry morph phase: climbing into view over Section 08
        pEntry9 = Math.max(0, Math.min(1, (windowH - rect9.top) / travelDist9));
      } else {
        // Fully docked flush under header
        pEntry9 = 1.0;
      }

      const easeSlats = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

      // 4 Horizontal Architectural Slats entering sequentially from the LEFT (0% -> 100%)
      const pS1 = Math.max(0, Math.min(1, (pEntry9 - 0.05) / 0.75));
      const w1 = easeSlats(pS1) * 100;

      const pS2 = Math.max(0, Math.min(1, (pEntry9 - 0.12) / 0.75));
      const w2 = easeSlats(pS2) * 100;

      const pS3 = Math.max(0, Math.min(1, (pEntry9 - 0.19) / 0.75));
      const w3 = easeSlats(pS3) * 100;

      const pS4 = Math.max(0, Math.min(1, (pEntry9 - 0.26) / 0.75));
      const w4 = easeSlats(pS4) * 100;

      // Outgoing Section 08 under-next dimming
      const underOpacity8 = Math.max(0.2, 1 - pEntry9 * 0.75).toFixed(2);
      root.style.setProperty('--scene08-under-opacity', underOpacity8);

      // Section 09 interior background subtle drift from LEFT
      const bgShiftX9 = Math.round(-(1 - pEntry9) * (isMobile9 ? 20 : 35));
      const bgParallax9 = Math.round((1 - pEntry9) * (isMobile9 ? 12 : 20));
      root.style.setProperty('--scene09-bg-shift-x', `${bgShiftX9}px`);
      root.style.setProperty('--scene09-bg-parallax', `${bgParallax9}px`);

      // Typography & Form Content: Smooth Fade-In as section docks
      const contentP = Math.max(0, Math.min(1, (pEntry9 - 0.40) / 0.60));
      const contentEase = contentP < 0.5 ? 2 * contentP * contentP : 1 - Math.pow(-2 * contentP + 2, 2) / 2;
      const cardY = Math.round((1 - contentEase) * 20);
      const cardOpacity = contentEase.toFixed(2);
      root.style.setProperty('--scene09-card-y', `${cardY}px`);
      root.style.setProperty('--scene09-card-opacity', cardOpacity);
      root.style.setProperty('--scene09-content-scale', (0.97 + contentEase * 0.03).toFixed(3));

      // Keep Section 08 visible underneath while Section 09 is climbing over it
      if (sheet08) {
        if (pEntry9 < 0.98) {
          if (_lastS8Visibility !== 'visible') {
            sheet08.classList.remove('turath-sheet-hidden');
            sheet08.style.removeProperty('visibility');
            sheet08.style.pointerEvents = 'auto';
            _lastS8Visibility = 'visible';
          }
        } else {
          if (_lastS8Visibility !== 'hidden') {
            sheet08.classList.add('turath-sheet-hidden');
            sheet08.style.setProperty('visibility', 'hidden', 'important');
            sheet08.style.pointerEvents = 'none';
            _lastS8Visibility = 'hidden';
          }
        }
      }

      // Sheet 09 visibility
      if (sheet09) {
        if (pEntry9 > 0.01) {
          if (_lastS9Visibility !== 'visible') {
            sheet09.classList.remove('turath-sheet-hidden');
            sheet09.style.removeProperty('visibility');
            sheet09.style.pointerEvents = 'auto';
            _lastS9Visibility = 'visible';
          }
        } else {
          if (_lastS9Visibility !== 'hidden') {
            sheet09.classList.add('turath-sheet-hidden');
            sheet09.style.setProperty('visibility', 'hidden', 'important');
            sheet09.style.pointerEvents = 'none';
            _lastS9Visibility = 'hidden';
          }
        }
      }

      updateScene09Slats(w1, w2, w3, w4);

      const track09 = tracks.find(t => t.el === scene09Track);
      if (track09) {
        track09.notch = `4-SLATS-LEFT (${Math.round(w1)}%, ${Math.round(w2)}%, ${Math.round(w3)}%, ${Math.round(w4)}%)`;
      }
    }

    root.style.setProperty('--scroll-y', `${(Math.round(scrollY * 100) / 100).toFixed(2)}`);

    ticking = false;
  }

  function updateAboutStickyTop() {
    const aboutTrack = tracks[1]?.el || document.getElementById('about');
    const aboutWrapper = aboutTrack?.querySelector('.about-sheet-wrapper');
    if (!aboutWrapper) return;
    root.style.setProperty('--about-sticky-top', '0px');
    aboutWrapper.style.top = '0px';
    aboutWrapper.style.transform = 'none';
  }

  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }

  alignHeroDevoted();
  measureTurathMetrics();
  updateAboutStickyTop();

  const aboutWrapperEl = document.querySelector('#about .about-sheet-wrapper');
  if (aboutWrapperEl && 'ResizeObserver' in window) {
    const ro = new ResizeObserver(() => {
      updateAboutStickyTop();
    });
    ro.observe(aboutWrapperEl);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      alignHeroDevoted();
      measureTurathMetrics(true);
      updateAboutStickyTop();
      requestTick();
    });
  }

  window.addEventListener('load', () => {
    updateAboutStickyTop();
    requestTick();
  }, { once: true });

  const scroller = getScrollContainer();
  if (scroller) {
    scroller.addEventListener('scroll', requestTick, { passive: true });
  } else {
    window.addEventListener('scroll', requestTick, { passive: true });
  }
  window.addEventListener('resize', () => {
    alignHeroDevoted();
    if (Math.abs((window.innerWidth || 0) - lastMeasuredWidth) > 2) {
      measureTurathMetrics(true);
    }
    updateAboutStickyTop();
    ScrollTrigger.refresh();
    requestTick();
  }, { passive: true });

  onScroll();
}

// Helper: Calculate exact scroll target to dock section flush under header
export function calculateSectionScrollTop(targetEl) {
  if (!targetEl) return 0;
  if (targetEl.id === 'hero') return 0;

  const sectionEl = targetEl.closest('.scene-track') || targetEl;
  const secId = (sectionEl.id || '').toLowerCase();

  const header = document.getElementById('site-header') || document.querySelector('.header') || document.querySelector('header');
  const headerHeight = header ? header.offsetHeight : 58;

  // Sections that dock with their track pinned at top: 0 (Sections 04, 05, 06, 07)
  // Their outer container sticks at top: 0, and their inner sheet sticks at top: 58px.
  // Their docked state is when rect.top == 0.
  const isStickyTopZero = secId === 'location' ||
                          secId === 'scene04' ||
                          secId === 'scene05' ||
                          secId === 'accessibility' ||
                          secId === 'projects' ||
                          secId === 'scene06' ||
                          secId === 'surroundings' ||
                          secId === 'environment' ||
                          secId === 'materials-finishes' ||
                          secId === 'scene07' ||
                          secId === 'section-08' ||
                          secId === 'bespoke-manufacturing' ||
                          secId === 'scene08' ||
                          secId === 'project-inquiry' ||
                          secId === 'scene09';

  const rect = sectionEl.getBoundingClientRect();
  const currentScrollY = getScrollY();
  const targetOffset = isStickyTopZero ? 0 : headerHeight;
  let targetTop = currentScrollY + rect.top - targetOffset;

  if (secId === 'project-inquiry' || secId === 'scene09') {
    const trackH = rect.height || (window.innerHeight * 2.2);
    targetTop += Math.max(0, (trackH - window.innerHeight) * 0.95);
  }


  return Math.max(0, Math.round(targetTop));
}

// ============================================================================
// 8. ARCHITECTURAL NAVIGATION DRAWER CONTROLLER
// ============================================================================
function setupNavDrawer() {
  const trigger = document.getElementById('menu-trigger');
  const drawer = document.getElementById('nav-drawer');
  const closeBtn = document.getElementById('menu-close');
  const backdrop = document.getElementById('nav-drawer-backdrop');
  if (!trigger || !drawer) return;

  function openDrawer() {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    trigger.classList.add('is-active');
    document.body.classList.add('nav-drawer-open');
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.classList.remove('is-active');
    document.body.classList.remove('nav-drawer-open');
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (drawer.classList.contains('is-open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeDrawer();
    });
  }

  // Click on empty area of drawer overlay closes it
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) {
      closeDrawer();
    }
  });

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      e.stopPropagation();
      closeDrawer();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // Handle drawer link clicks: close drawer, unfreeze scroll, smooth scroll to target
  drawer.querySelectorAll('.nav-menu-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      let targetEl = document.querySelector(targetId);
      if (!targetEl && targetId === '#collections') targetEl = document.getElementById('about');
      if (!targetEl && targetId === '#about-us') targetEl = document.getElementById('information');
      if (targetEl) {
        e.preventDefault();
        closeDrawer();
        setTimeout(() => {
          if (targetId === '#hero') {
            scrollToPosition(0, true);
          } else {
            const targetTop = calculateSectionScrollTop(targetEl);
            scrollToPosition(targetTop, true);
          }
        }, 80);
      }
    });
  });
}

// ============================================================================
// 9. SMOOTH ANCHOR NAVIGATION (Native Browser Traversal)
// ============================================================================
function setupSmoothNav() {
  document.querySelectorAll('a[href^="#"]:not(.nav-menu-link)').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      let targetEl = document.querySelector(targetId);
      if (!targetEl && targetId === '#collections') targetEl = document.getElementById('about');
      if (!targetEl && targetId === '#about-us') targetEl = document.getElementById('information');
      if (targetEl) {
        e.preventDefault();
        if (targetId === '#hero') {
          scrollToPosition(0, true);
        } else {
          const targetTop = calculateSectionScrollTop(targetEl);
          scrollToPosition(targetTop, true);
        }
      }
    });
  });

  const heroScrollBtn = document.getElementById('hero-scroll-next-btn');
  if (heroScrollBtn) {
    heroScrollBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const targetEl = document.getElementById('collections') || document.getElementById('about');
      if (targetEl) {
        const targetTop = calculateSectionScrollTop(targetEl);
        scrollToPosition(targetTop, true);
      }
    });
  }
}

// ============================================================================
// 10. MATERIALS & FINISHES INTERACTIVE CARDS & STAGGER ENTRANCE
// ============================================================================
function setupMaterialsInteractivity() {
  const materialsTrack = document.getElementById('materials-finishes');
  const materialsStack = document.getElementById('materials-stack');
  const cards = document.querySelectorAll('.material-card');

  if (!materialsTrack || !materialsStack) return;

  // Smooth Stagger Entrance on Scroll via IntersectionObserver
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          materialsStack.classList.add('is-visible');
          cards.forEach((card, idx) => {
            setTimeout(() => {
              card.classList.add('is-entered');
            }, idx * 55);
          });
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

    observer.observe(materialsTrack);
  }

  // Instant fallback check if already in viewport on mount
  const rect = materialsTrack.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
    materialsStack.classList.add('is-visible');
    cards.forEach(card => card.classList.add('is-entered'));
  }

  // Interactive Click / Active selection on cards
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const isAlreadyActive = card.classList.contains('active');
      cards.forEach(c => c.classList.remove('active'));
      if (!isAlreadyActive) {
        card.classList.add('active');
      }
    });
  });
}

function setupLayeredTransitions() {
  const s05 = document.querySelector("#scene05") || document.querySelector("#accessibility") || document.querySelector(".scene05-track");
  const s06 = document.querySelector("#scene06") || document.querySelector(".scene06-track");
  const s07 = document.querySelector("#materials-finishes") || document.querySelector("#scene07");

  if (!s05 || !s06 || !s07) return;

  // Kill all legacy ScrollTrigger instances and pinned spacers completely
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.getAll().forEach(t => t.kill());
  }

  const s05Sheet = document.getElementById('scene05-sheet');
  if (s05Sheet) {
    s05Sheet.style.opacity = '1';
    s05Sheet.style.visibility = 'visible';
    s05Sheet.style.display = 'block';
  }

  const s06Sheet = document.getElementById('scene06-sheet');
  if (s06Sheet) {
    s06Sheet.style.opacity = '1';
    s06Sheet.style.visibility = 'visible';
    s06Sheet.style.display = 'block';
  }

  const s07Sheet = document.getElementById('scene07-sheet');
  if (s07Sheet) {
    s07Sheet.style.opacity = '1';
    s07Sheet.style.visibility = 'visible';
    s07Sheet.style.display = 'block';
  }

  const s08Sheet = document.getElementById('scene08-sheet');
  if (s08Sheet) {
    s08Sheet.style.opacity = '1';
    s08Sheet.style.visibility = 'visible';
    s08Sheet.style.display = 'block';
  }

  const s09Sheet = document.getElementById('scene09-sheet');
  if (s09Sheet) {
    s09Sheet.style.opacity = '1';
    s09Sheet.style.visibility = 'visible';
    s09Sheet.style.display = 'block';
  }



  // Pure CSS sticky stacking & RAF scroll engine
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
}

// ============================================================================
// 11b. PROJECT INQUIRY FORM INTERACTIVITY
// ============================================================================
function setupInquiryForm() {
  const form = document.getElementById('project-inquiry-form');
  const confirmBox = document.getElementById('scene09-confirmation');
  const resetBtn = document.getElementById('scene09-reset-btn');
  if (!form) return;

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'flex';
      if (confirmBox) {
        confirmBox.style.display = 'none';
        confirmBox.setAttribute('hidden', '');
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const nameInput = document.getElementById('inquiry-name');
    const companyInput = document.getElementById('inquiry-company');
    const emailInput = document.getElementById('inquiry-email');
    const phoneInput = document.getElementById('inquiry-phone');
    const detailsInput = document.getElementById('inquiry-details');

    const fullName = nameInput ? nameInput.value.trim() : '';
    const company = companyInput ? companyInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const projectDetails = detailsInput ? detailsInput.value.trim() : '';

    const recipient = 'turath.egypt@gmail.com';
    const subject = `TURATH Project Inquiry - ${fullName}${company ? ' (' + company + ')' : ''}`;
    const bodyLines = [
      'TURATH PROJECT INQUIRY',
      '========================',
      `Full Name: ${fullName}`,
      company ? `Company / Organization: ${company}` : '',
      `Email Address: ${email}`,
      `Phone / WhatsApp: ${phone}`,
      '------------------------',
      'Project Details:',
      projectDetails
    ].filter(Boolean).join('\n');

    // 1. Direct mailto link pre-addressed to turath.egypt@gmail.com
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines)}`;

    // 2. Background FormSubmit delivery to turath.egypt@gmail.com
    try {
      fetch(`https://formsubmit.co/ajax/${recipient}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: fullName,
          company: company || 'N/A',
          email: email,
          phone: phone,
          message: projectDetails,
          _subject: subject
        })
      }).catch(() => {});
    } catch (_) {}

    // Open user's email client
    try {
      window.location.href = mailtoUrl;
    } catch (_) {}

    // Hide form fields smoothly and display confirmation message
    form.style.display = 'none';
    if (confirmBox) {
      confirmBox.removeAttribute('hidden');
      confirmBox.style.display = 'flex';
      confirmBox.style.opacity = '0';
      confirmBox.style.transform = 'translateY(10px)';
      confirmBox.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

      requestAnimationFrame(() => {
        confirmBox.style.opacity = '1';
        confirmBox.style.transform = 'translateY(0)';
      });
    }
  });
}

// ============================================================================
// 11. STANDALONE EDITORIAL SUB-PAGES: ALL 9 COLLECTIONS (DAVID THULSTRUP ARCHITECTURE)
// ============================================================================
const MIRROR_PRODUCTS = [
  {
    title: 'Organic Foliate Brass Mirror',
    desc: 'Hand-sculpted organic brass branch latticework over circular reflective glass'
  },
  {
    title: 'Radiating Branch Bronze Mirror',
    desc: 'Circular bronze-patinated brass mirror framed by an organic botanical halo of hand-sculpted branches'
  },
  {
    title: 'Sunburst Disc Brass Mirror',
    desc: 'Dense multi-tiered halo of hand-hammered solid brass discs capturing warm ambient light'
  },
  {
    title: 'Filigree Petal Brass Mirror',
    desc: 'Asymmetrical overlapping brass filigree leaf petals with intricate openwork spiral lace'
  },
  {
    title: 'Pierced Arabesque Brass Mirror',
    desc: 'Geometric square brass frame hand-pierced with traditional Egyptian star arabesque motifs'
  },
  {
    title: 'Monstera Brass Leaf Mirror',
    desc: 'Asymmetrical undulating brass contour embraced by a sculptural hand-veined Monstera palm frond'
  },
  {
    title: 'Engraved Nubian Brass Mirror',
    desc: 'Circular antique brass disc featuring hand-chiseled geometric linear and wave engravings'
  },
  {
    title: 'Scalloped Brass Scale Mirror',
    desc: 'Vertical architectural frame adorned with a cascading veil of overlapping brass fish scales'
  },
  {
    title: 'Arabesque Brass Medallion Set',
    desc: 'Curated collection of circular brass mirrors featuring pierced Islamic arabesque and floral openwork'
  },
  {
    title: 'Fluted Petal Brass Blossom Mirror',
    desc: 'Radiant blooming botanical silhouette composed of hand-fluted sculptural solid brass petals'
  },
  {
    title: 'Mashrabiya Star Brass Mirror',
    desc: 'Circular brass frame adorned with a laser-pierced geometric Islamic star lattice'
  },
  {
    title: 'Fluid Amoeba Brass Mirror',
    desc: 'Minimalist organic undulating silhouette defined by a seamless satin-brushed brass border'
  },
  {
    title: 'Laurel Branch Bronze Mirror',
    desc: 'Circular bronze mirror framed by hand-sculpted botanical laurel vine and leaf tendrils'
  },
  {
    title: 'Concentric Capsule Brass Mirror',
    desc: 'Elongated pill silhouette framed by triple tiered concentric solid brass tubular rings'
  },
  {
    title: 'Constellation Brass Ring Mirror',
    desc: 'Sculptural wall composition of interconnected brass hoops, solid plates, and reflective discs'
  },
  {
    title: 'Gilded Leaf Crest Brass Mirror',
    desc: 'Circular brass frame adorned with hand-sculpted botanical foliage draped gracefully across the upper arch'
  },
  {
    title: 'Palatial Arabesque Brass Mirror',
    desc: 'Wide circular brass border intricately pierced with interlocking geometric Islamic star arabesques'
  }
];

const LIGHTING_PRODUCTS = [
  {
    title: 'Architectural Mobile Brass Chandelier',
    desc: 'Balanced geometric brass chandelier with multi-directional articulated arms and warm exposed globe illumination'
  },
  {
    title: 'Radiant Perforated Brass Wall Sconce',
    desc: 'Hand-pierced circular solid brass flush sconce projecting dramatic radial geometric shadow rays across surrounding walls'
  },
  {
    title: 'Bidirectional Cylindrical Brass Sconce',
    desc: 'Slim vertical polished brass column light with a blackened metal collar offering dual-direction vertical wall grazing'
  },
  {
    title: 'Triad Branching Brass Floor Lamp',
    desc: 'Sculptural three-stem brass floor luminaire crowned with mouth-blown glass globes anchored on a weighted brass base'
  },
  {
    title: 'Dome Brass Tripod Floor Lamp',
    desc: 'Contemporary blackened steel tripod floor lamp featuring a hand-spun brushed brass dome reflector with solid brass ferrules'
  },
  {
    title: 'Ovoid Pierced Brass Table Lantern',
    desc: 'Hand-pierced egg-shaped antique brass accent luminaire on cast claw feet, casting intricate floral arabesque shadows'
  },
  {
    title: 'Filigree Spherical Brass Pendant',
    desc: 'Suspended spherical brass pendant with dense hand-chiseled arabesque openwork perforations creating dramatic ambient shadow lace'
  },
  {
    title: 'Imperial Crown Brass Ring Chandelier',
    desc: 'Monumental circular solid brass ring chandelier supporting a perimeter of slender candle arms and crisp white conical shades'
  },
  {
    title: 'Orthogonal Geometric Brass Chandelier',
    desc: 'Architectural solid brass chandelier with staggered orthogonal cylindrical stems and warm exposed filament globes'
  },
  {
    title: 'Columnar Filigree Brass Pendant',
    desc: 'Elongated architectural brass cylinder lantern intricately hand-pierced with tiered arabesque lattice and engraved banding'
  },
  {
    title: 'Pipe Organ Fluted Brass Sconce',
    desc: 'Vertical cluster of staggered solid brass architectural tubes backlit to project dynamic linear light rays across wall textures'
  },
  {
    title: 'Equilibrium Cantilever Brass Floor Lamp',
    desc: 'Slender geometric brass frame delicately balancing an ethereal frosted glass sphere in poised architectural equilibrium'
  },
  {
    title: 'Patinated Brass Disc Triptych Sconces',
    desc: 'Trio of hand-burnished circular brass concave plates with oxidized patina bands, backlit with ambient halo edge glow'
  },
  {
    title: 'Hammered Geometric Brass Half-Cylinder Sconce',
    desc: 'Curved antique brass wall luminaire with alternating stippled bands and triangular pierced fretwork casting radial geometric beams'
  },
  {
    title: 'Teardrop Spun Brass Pendant',
    desc: 'Organic teardrop pendant luminaire hand-shaped in solid burnished brass, directing focused golden downward illumination'
  },
  {
    title: 'Trio Cluster Arabesque Brass Pendants',
    desc: 'Three-tiered cascade of hand-pierced brass filigree pendants suspended by chains from a solid brass ceiling canopy'
  },
  {
    title: 'Dome Finial Pierced Brass Table Lantern',
    desc: 'Hand-pierced spherical antique brass table accent luminaire crowned with a conical spire and resting on cast feet'
  },
  {
    title: 'Mandala Teardrop Filigree Brass Pendant',
    desc: 'Monumental teardrop antique brass pendant hand-chiseled with dense arabesque filigree, projecting an ornate floor mandala shadow'
  },
  {
    title: 'Celestial Disc & Fluted Glass Chandelier',
    desc: 'Multi-tier chandelier featuring fluted glass globes crowned by radiating hand-hammered solid brass discs on brass link chains'
  },
  {
    title: 'Interlocking Brass Ribbon Drum Chandelier',
    desc: 'Architectural ring chandelier composed of fluid overlapping curved brass ribbons enclosing a radial cluster of warm luminaires'
  },
  {
    title: 'Imperial Urn Pierced Brass Hanging Lantern',
    desc: 'Majestic amphora-profile antique brass lantern suspended by triple chains, hand-pierced with ornate star arabesque lattice'
  },
  {
    title: 'Vintage Chimney Pierced Brass Table Lamp',
    desc: 'Traditional chimney-silhouette antique brass table luminaire on a tiered pedestal, illuminated through delicate arabesque fretwork'
  },
  {
    title: 'Onion Dome Filigree Brass Pendant',
    desc: 'Handcrafted onion-dome silhouette brass pendant lantern featuring intricate openwork medallions and warm ambient illumination'
  },
  {
    title: 'Mashrabiya Star Brass Cylinder Wall Sconce',
    desc: 'Architectural cylindrical wall sconce in antique brass with geometric eight-pointed star fretwork over an interior frosted diffuser'
  },
  {
    title: 'Fluted Brass Drum Chandelier with Sunburst Glass',
    desc: 'Contemporary circular pendant chandelier with a reeded solid brass outer drum and a starburst textured glass bottom diffuser'
  },
  {
    title: 'Verdigris & Burnished Brass Eclipse Sconce',
    desc: 'Circular concave brass wall reflector with subtle verdigris oxidization and a central verdigris sphere casting a warm ambient eclipse halo'
  },
  {
    title: 'Hammered Brass Scroll Wall Sconce',
    desc: 'Hand-hammered textured solid brass sheet organically sculpted into an overlapping scroll casting vertical wash illumination'
  }
];

const HANDLES_PRODUCTS = [
  {
    title: 'Sinuous Bough Cast Bronze Handle',
    desc: 'Sinuous hand-sculpted organic branch door pull cast in solid bronze with rich hand-buffed antique patina'
  },
  {
    title: 'Molten Ripple Cast Brass Bar Pull',
    desc: 'Monumental vertical bar handle cast in solid brass with an expressive molten rippled topography and high-polish ridges'
  },
  {
    title: 'Botanical Branch Walnut Door Handle Suite',
    desc: 'Monumental organic cast brass tree branch door handle ensemble featured on an architectural dark walnut entrance pivot door'
  },
  {
    title: 'Half-Moon Sculpted Brass Pull Pair',
    desc: 'Pair of semicircular cast solid brass entrance pulls with dramatic undulating molten crevices designed to align as a circular medallion'
  },
  {
    title: 'Mirrored Twig Cast Bronze Pull Pair',
    desc: 'Symmetrical pair of slender cast bronze botanical branch handles with delicate offshoot twigs and textured bark detailing'
  },
  {
    title: 'Polished Brass T-Bar Escutcheon Knob',
    desc: 'Minimalist solid brass cylindrical T-handle mounted upon a softly contoured mirror-polished square escutcheon backplate'
  }
];

const TABLES_CONSOLES_PRODUCTS = [
  {
    title: 'Classical Brass Tripod Marble Accent Table',
    desc: 'Refined three-legged solid brass gueridon table with fluted columns, tri-podal stretcher, and inset veined white marble top'
  },
  {
    title: 'Arboreal Cast Brass Branch Console Table',
    desc: 'Architectural console table pairing a minimalist ebonized wood drawer plinth with six organic cast solid brass branching tree legs'
  },
  {
    title: 'Brutalist Geometric Brass Tile Coffee Table',
    desc: 'Monumental circular coffee table enveloped in a rhythmic drum of antique brass geometric plaques and a tempered glass surface'
  },
  {
    title: 'Brutalist Geometric Brass Tile Side Table',
    desc: 'Slender cylindrical drum accent table with rhythmic staggered antique brass plates and polished glass top'
  },
  {
    title: 'Sculpted Botanical Bough Brass Console Frame',
    desc: 'Hand-sculpted organic cast brass console table featuring a delicate diagonal tree bough lattice and bark-textured structural frame'
  },
  {
    title: 'Linear Fluted Brass & Nero Marquina Console',
    desc: 'Sleek architectural console pairing a honed Nero Marquina marble slab with an open rectilinear frame of vertical solid brass fluted columns'
  },
  {
    title: 'Geometric Grid Brass Nesting Side Tables',
    desc: 'Pair of tiered circular side tables in brushed solid brass featuring multi-rod geometric cross-stretchers and floating glass tops'
  },
  {
    title: 'Concentric Brass Rod Nesting Coffee Tables',
    desc: 'Set of two circular nesting coffee tables framed in brushed brass with tri-rod perimeter supports and flush glass surfaces'
  },
  {
    title: 'Sculpted Brass Arboretum Marble Console',
    desc: 'Exquisite statement console table featuring an organic cast solid brass branching tree bough rising from a black marble plinth to support a floating marble slab'
  },
  {
    title: 'Tufted Velvet Brass X-Frame Bench',
    desc: 'Deep button-tufted charcoal velvet bench cushion elevated on a precision-welded geometric brushed brass cross-brace base'
  }
];

const HANDRAILS_PRODUCTS = [
  {
    title: 'Architectural Grille Balustrade',
    desc: 'Solid red marble architectural surround enclosing pierced hand-chiseled foliate brass panels'
  },
  {
    title: 'Sculptural Foliate Brass Architectural Screen & Balustrade',
    desc: 'Full-height monolithic cast brass architectural screen panel with hand-sculpted organic leaf venation and openwork filigree'
  }
];

const DECORATIVE_OBJECTS_PRODUCTS = [
  {
    title: 'Hand-Hammered Brass Fluted Vessel',
    desc: 'Artisan deep-drawn solid brass decorative centerpiece bowl with hand-stippled dimpled texture'
  },
  {
    title: 'Pierced Brass Foliage Wall Sculpture',
    desc: 'Wall-mounted sculptural ensemble of four hand-pierced solid brass leaves with delicate filigree perforations and warm burnished patina'
  },
  {
    title: 'Geometric Orbital Brass Medallion Relief',
    desc: 'Monumental rhythmic wall relief featuring interconnected brass hoops framing hand-hammered concave disc medallions with dual-tone radiant texturing'
  },
  {
    title: 'Sculpted Asymmetric Brass Vessel Duo',
    desc: 'Pair of artisanal heavy cast brass tabletop vessels characterized by undulating fluid rims, tapering silhouettes, and a matte brushed golden patina'
  },
  {
    title: 'Domed Imperial Arabesque Brass Casket',
    desc: 'Masterfully hand-engraved solid brass domed treasure casket adorned with intricate all-over floral arabesques and a pierced central lid filigree medallion'
  },
  {
    title: 'Radial Hammered Brass Charger Platter',
    desc: 'Monolithic circular decorative charger plate hand-chiseled with concentric sunburst stippling and a gently raised perimeter rim in warm radiant brass'
  },
  {
    title: 'Organic Leaf Multi-Compartment Brass Platter',
    desc: 'Sculptural four-tier divided serving platter cast in solid brass with botanical leaf contours, chiseled partitions, and a deep antiqued bronze patina'
  },
  {
    title: 'Arabesque Cutout Brass Wall Bracket Shelf',
    desc: 'Architectural wall sconce shelf crafted from solid waterjet-cut brass with flowing arabesque ribbon silhouettes and an integrated display ledge'
  },
  {
    title: 'Filigree Arabesque Architectural Wall Console',
    desc: 'Ornate architectural display bracket fashioned from antique burnished brass featuring intricate symmetrical scrollwork, a latticed cartouche, and a floating shelf ledge'
  },
  {
    title: 'Monumental Hand-Hammered Brass Fluted Basin',
    desc: 'Substantial deep-drawn brass centerpiece vessel with an expansive conical flare and thousands of precision hand-stippled dimples reflecting warm amber light'
  },
  {
    title: 'Radial Pleated Brass Solar Medallion',
    desc: 'Monumental circular wall art relief sculpted with dramatic accordion fluting that radiates in high-polish brass beams from a domed central core'
  }
];

const WALL_ART_PRODUCTS = [
  {
    title: 'Imperial Arabesque Brass Relief',
    desc: 'Monolithic vertical brass architectural plaque adorned with high-relief repoussé rosettes, dynamic spiral vortexes, and chiseled rope borders'
  },
  {
    title: 'Botanical Bough High-Relief Brass Panel',
    desc: 'Monumental framed architectural wall panel featuring a high-relief cast brass tree bough enveloped by densely ribbed foliage and golden specular reflections'
  },
  {
    title: 'Portoro Marble & Repoussé Brass Fireplace Mantel',
    desc: 'Monumental architectural fireplace mantle crafted from gold-veined Portoro marble encasing an ornate inner frieze of hand-hammered brass medallion tiles'
  },
  {
    title: 'Mythological Nile Narrative Copper & Brass Bas-Relief',
    desc: 'Horizontal modernist narrative wall panel hand-beaten in mixed copper and brass portraying stylized aquatic wildlife, boats, and celestial motifs in layered relief'
  },
  {
    title: 'Gilded Pierced Leaf Wall Sculpture Quartet',
    desc: 'Sculptural wall art composition of four oversized gilded brass leaves featuring intricate openwork geometric fretwork that casts dynamic shadow patterns'
  },
  {
    title: 'Illuminated Calligraphic Brass Medallion',
    desc: 'Monumental circular wall light and art medallion crafted with precision openwork Arabic calligraphy and a backlit golden halo'
  },
  {
    title: 'Antiqued Hammered Bronze Solar Charger',
    desc: 'Monolithic circular wall-hung dish beaten by hand with rhythmic concentric dimples and finished in an antique oil-rubbed bronze patina'
  },
  {
    title: 'Gilded Marble & Brass Portal Triptych',
    desc: 'Architectural wall art triptych featuring three rectilinear brushed brass frames harmoniously intersecting circular gilded stone rondels'
  }
];

const PARTITIONS_BOOKCASES_PRODUCTS = [
  {
    title: 'Geometric Labyrinth Brass Screen',
    desc: 'Floor-to-ceiling architectural space divider with precision laser-cut rectilinear maze fretwork'
  },
  {
    title: 'Rhythmic Linear Staggered Brass Screen',
    desc: 'Floor-standing architectural brass divider screen featuring staggered vertical linear fins and rhythmic cross-bracing accents'
  },
  {
    title: 'Monumental Architectural Brass & Glass Bookcase',
    desc: 'Grand floor-standing architectural shelving unit engineered in mirror-polished solid brass tubing with asymmetrical tempered glass display tiers'
  },
  {
    title: 'Art Deco Geometric Brass Freestanding Screen',
    desc: 'Freestanding sculptural partition screen in brushed brass with dynamic diagonal faceted linework and an architectural triangular stabilizing base'
  },
  {
    title: 'Stepped Zigzag Brass & Glass Étagère',
    desc: 'Slender architectural étagère bookcase framed in satin brass with dynamic stepped zigzag glass shelving tiers and openwork vertical circulation'
  },
  {
    title: 'Geometric Diamond Motif Brass & Glass Bookcase',
    desc: 'Monumental architectural shelving unit engineered in satin brass with a prominent central diamond lozenge, cantilevered corner cubes, and tempered glass tiers'
  }
];

const TABLEWARE_PRODUCTS = [
  {
    title: 'Royal Filigree Brass Tea Service',
    desc: 'Hand-engraved antique brass teapot and filigree-clad tea glasses set upon a hand-chiseled ceremonial serving tray'
  },
  {
    title: 'Imperial Calligraphic Tabletop Brass Brazier',
    desc: 'Artisanal solid brass banquet chafing brazier and charcoal food warmer adorned with hand-carved Thuluth calligraphy and star arabesque fretwork'
  },
  {
    title: 'Botanical Four-Tier Brass Mezze Platter',
    desc: 'Sculptural four-compartment serving dish cast in solid brass with natural leaf contours, chiseled dividers, and an antique oil-rubbed bronze exterior'
  },
  {
    title: 'Hand-Spun Solid Copper Beaded Tumbler',
    desc: 'Refined cylindrical dining tumbler crafted from solid hand-spun copper featuring a finely beaded rim and a mirror-burnished golden-rose patina'
  },
  {
    title: 'Hand-Hammered Copper Culinary Serving Pan',
    desc: 'Traditional heavy-gauge culinary banquet pan hand-hammered in solid copper with riveted cast brass loop handles and polished silvered interior lining'
  },
  {
    title: 'Grand Calligraphic Brass Banquet Brazier',
    desc: 'Architectural rectangular banquet chafing brazier hand-engraved with Thuluth calligraphy and interlocking star arabesques on turned brass feet'
  },
  {
    title: 'Arabesque Pierced Copper Tabletop Brazier',
    desc: 'Low-profile banquet food warmer hand-crafted from solid copper with continuous pierced arabesque foliate fretwork and a stainless grill top'
  },
  {
    title: 'Sculptural Cast Brass Dining Vessel Duo',
    desc: 'Pair of heavy solid brass dining vessels featuring fluid asymmetrical rims and a warm golden satin patina for table condiments and presentation'
  }
];

function initEditorialSubpage(config) {
  const {
    slug,
    triggerId,
    subpageId,
    backBtnId,
    trackId,
    prevHitboxId,
    nextHitboxId,
    activeTitleId,
    activeDescId,
    products
  } = config;

  const trigger = document.getElementById(triggerId);
  const subpage = document.getElementById(subpageId);
  const backBtn = document.getElementById(backBtnId);
  if (!trigger || !subpage || !backBtn) return;

  const track = document.getElementById(trackId);
  const slides = subpage.querySelectorAll('.subpage-slide');
  const dashes = subpage.querySelectorAll('.subpage-dash-item');
  const prevHitbox = document.getElementById(prevHitboxId);
  const nextHitbox = document.getElementById(nextHitboxId);
  const activeTitle = document.getElementById(activeTitleId);
  const activeDesc = document.getElementById(activeDescId);

  let savedScrollY = 0;
  let isOpen = false;
  let currentSlide = 0;
  const totalSlides = slides.length;

  function updateSlide(animate = true) {
    if (!track) return;
    if (animate) {
      track.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
    } else {
      track.style.transition = 'none';
    }
    track.style.transform = `translate3d(-${currentSlide * 100}vw, 0px, 0px)`;

    dashes.forEach((dash, idx) => {
      if (idx === currentSlide) {
        dash.classList.add('is-active');
        dash.setAttribute('aria-selected', 'true');
      } else {
        dash.classList.remove('is-active');
        dash.setAttribute('aria-selected', 'false');
      }
    });

    const item = products[currentSlide];
    if (item && activeTitle && activeDesc) {
      if (animate) {
        activeTitle.style.opacity = '0';
        activeDesc.style.opacity = '0';
        activeTitle.style.transform = 'translateY(-4px)';
        activeDesc.style.transform = 'translateY(4px)';
        setTimeout(() => {
          activeTitle.textContent = item.title;
          activeDesc.textContent = item.desc;
          activeTitle.style.opacity = '1';
          activeDesc.style.opacity = '1';
          activeTitle.style.transform = 'translateY(0)';
          activeDesc.style.transform = 'translateY(0)';
        }, 180);
      } else {
        activeTitle.textContent = item.title;
        activeDesc.textContent = item.desc;
        activeTitle.style.opacity = '1';
        activeDesc.style.opacity = '1';
        activeTitle.style.transform = 'translateY(0)';
        activeDesc.style.transform = 'translateY(0)';
      }
    }
  }

  function goToSlide(index, animate = true) {
    const target = Math.max(0, Math.min(totalSlides - 1, index));
    if (target === currentSlide && animate) {
      updateSlide(true);
      return;
    }
    currentSlide = target;
    updateSlide(animate);
  }

  function nextSlide() {
    if (currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1);
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }

  // --- Wheel / Touchpad Scroll Engine (Any Part of Page) ---
  let isWheelThrottled = false;
  function onWheelScroll(e) {
    if (!isOpen || isWheelThrottled) return;
    const dy = e.deltaY;
    const dx = e.deltaX;
    const absY = Math.abs(dy);
    const absX = Math.abs(dx);
    const delta = absY >= absX ? dy : dx;

    if (Math.abs(delta) < 14) return;

    e.preventDefault();
    isWheelThrottled = true;
    if (delta > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
    setTimeout(() => {
      isWheelThrottled = false;
    }, 420);
  }

  // --- Touch Swipe (Both Horizontal & Vertical - Any Part of Page) ---
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let isTouchActive = false;

  function onTouchStart(e) {
    if (!isOpen) return;
    if (e.touches.length === 1) {
      isTouchActive = true;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    }
  }

  function onTouchMove(e) {
    if (!isOpen || !isTouchActive) return;
    if (e.cancelable) e.preventDefault();
  }

  function onTouchEnd(e) {
    if (!isOpen || !isTouchActive) return;
    isTouchActive = false;
    const touch = e.changedTouches[0];
    if (!touch) return;

    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const threshold = 32;

    if (absX > threshold || absY > threshold) {
      if (absX >= absY) {
        if (dx < 0) nextSlide();
        else prevSlide();
      } else {
        if (dy < 0) nextSlide();
        else prevSlide();
      }
    }
  }

  // --- Mouse Drag (Desktop) ---
  let mouseStartX = 0;
  let mouseStartY = 0;
  let isMouseDown = false;

  function onMouseDown(e) {
    if (!isOpen || e.button !== 0) return;
    if (e.target.closest('.subpage-back-arrow') || e.target.closest('.subpage-dash-item')) return;
    isMouseDown = true;
    mouseStartX = e.clientX;
    mouseStartY = e.clientY;
  }

  function onMouseUp(e) {
    if (!isOpen || !isMouseDown) return;
    isMouseDown = false;
    const dx = e.clientX - mouseStartX;
    const dy = e.clientY - mouseStartY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const threshold = 38;

    if (absX > threshold || absY > threshold) {
      if (absX >= absY) {
        if (dx < 0) nextSlide();
        else prevSlide();
      } else {
        if (dy < 0) nextSlide();
        else prevSlide();
      }
    }
  }

  // Bind Listeners to subpage container & window
  subpage.addEventListener('wheel', onWheelScroll, { passive: false });
  window.addEventListener('wheel', (e) => {
    if (isOpen) onWheelScroll(e);
  }, { passive: false });

  subpage.addEventListener('touchstart', onTouchStart, { passive: true });
  subpage.addEventListener('touchmove', onTouchMove, { passive: false });
  subpage.addEventListener('touchend', onTouchEnd, { passive: true });
  subpage.addEventListener('touchcancel', onTouchEnd, { passive: true });

  subpage.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);

  if (prevHitbox) {
    prevHitbox.addEventListener('click', (e) => {
      e.stopPropagation();
      prevSlide();
    });
  }

  if (nextHitbox) {
    nextHitbox.addEventListener('click', (e) => {
      e.stopPropagation();
      nextSlide();
    });
  }

  dashes.forEach((dash) => {
    dash.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(dash.getAttribute('data-index') || '0', 10);
      goToSlide(idx);
    });
  });

  function openSubpage() {
    if (isOpen) return;
    isOpen = true;
    savedScrollY = getScrollY();

    document.body.classList.add('in-subpage');
    subpage.classList.add('is-open');
    subpage.setAttribute('aria-hidden', 'false');
    goToSlide(0, false);

    const scroller = getScrollContainer();
    if (scroller) {
      scroller.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'hidden';
    }

    try {
      history.pushState({ subpage: slug }, '', '#' + slug);
    } catch (_) {}
  }

  function closeSubpage() {
    if (!isOpen) return;
    isOpen = false;
    stopTimelineTicker();

    document.body.classList.remove('in-subpage');
    subpage.classList.remove('is-open');
    subpage.setAttribute('aria-hidden', 'true');

    const scroller = getScrollContainer();
    if (scroller) {
      scroller.style.overflow = '';
      scroller.scrollTop = savedScrollY;
    } else {
      document.body.style.overflow = '';
      window.scrollTo(0, savedScrollY);
    }

    if (window.location.hash === '#' + slug) {
      try {
        history.pushState('', document.title, window.location.pathname + window.location.search);
      } catch (_) {}
    }
  }

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    openSubpage();
  });

  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openSubpage();
    }
  });

  backBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeSubpage();
  });

  window.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeSubpage();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      prevSlide();
    }
  });

  window.addEventListener('popstate', (e) => {
    if (isOpen && (!e.state || e.state.subpage !== slug)) {
      closeSubpage();
    }
  });

  if (window.location.hash === '#' + slug) {
    setTimeout(openSubpage, 200);
  }
}

function setupEditorialSubpages() {
  const SUBPAGES_CONFIG = [
    {
      slug: 'brass-mirrors',
      triggerId: 'trigger-brass-mirrors',
      subpageId: 'subpage-brass-mirrors',
      backBtnId: 'subpage-back-btn',
      trackId: 'subpage-carousel-track',
      prevHitboxId: 'subpage-hitbox-prev',
      nextHitboxId: 'subpage-hitbox-next',
      activeTitleId: 'subpage-active-title',
      activeDescId: 'subpage-active-desc',
      products: MIRROR_PRODUCTS
    },
    {
      slug: 'lighting',
      triggerId: 'trigger-lighting',
      subpageId: 'subpage-lighting',
      backBtnId: 'subpage-lighting-back-btn',
      trackId: 'subpage-lighting-carousel-track',
      prevHitboxId: 'subpage-lighting-hitbox-prev',
      nextHitboxId: 'subpage-lighting-hitbox-next',
      activeTitleId: 'subpage-lighting-active-title',
      activeDescId: 'subpage-lighting-active-desc',
      products: LIGHTING_PRODUCTS
    },
    {
      slug: 'handles',
      triggerId: 'trigger-handles',
      subpageId: 'subpage-handles',
      backBtnId: 'subpage-handles-back-btn',
      trackId: 'subpage-handles-carousel-track',
      prevHitboxId: 'subpage-handles-hitbox-prev',
      nextHitboxId: 'subpage-handles-hitbox-next',
      activeTitleId: 'subpage-handles-active-title',
      activeDescId: 'subpage-handles-active-desc',
      products: HANDLES_PRODUCTS
    },
    {
      slug: 'tables-consoles',
      triggerId: 'trigger-tables-consoles',
      subpageId: 'subpage-tables-consoles',
      backBtnId: 'subpage-tables-consoles-back-btn',
      trackId: 'subpage-tables-consoles-carousel-track',
      prevHitboxId: 'subpage-tables-consoles-hitbox-prev',
      nextHitboxId: 'subpage-tables-consoles-hitbox-next',
      activeTitleId: 'subpage-tables-consoles-active-title',
      activeDescId: 'subpage-tables-consoles-active-desc',
      products: TABLES_CONSOLES_PRODUCTS
    },
    {
      slug: 'handrails',
      triggerId: 'trigger-handrails',
      subpageId: 'subpage-handrails',
      backBtnId: 'subpage-handrails-back-btn',
      trackId: 'subpage-handrails-carousel-track',
      prevHitboxId: 'subpage-handrails-hitbox-prev',
      nextHitboxId: 'subpage-handrails-hitbox-next',
      activeTitleId: 'subpage-handrails-active-title',
      activeDescId: 'subpage-handrails-active-desc',
      products: HANDRAILS_PRODUCTS
    },
    {
      slug: 'decorative-objects',
      triggerId: 'trigger-decorative-objects',
      subpageId: 'subpage-decorative-objects',
      backBtnId: 'subpage-decorative-objects-back-btn',
      trackId: 'subpage-decorative-objects-carousel-track',
      prevHitboxId: 'subpage-decorative-objects-hitbox-prev',
      nextHitboxId: 'subpage-decorative-objects-hitbox-next',
      activeTitleId: 'subpage-decorative-objects-active-title',
      activeDescId: 'subpage-decorative-objects-active-desc',
      products: DECORATIVE_OBJECTS_PRODUCTS
    },
    {
      slug: 'wall-art',
      triggerId: 'trigger-wall-art',
      subpageId: 'subpage-wall-art',
      backBtnId: 'subpage-wall-art-back-btn',
      trackId: 'subpage-wall-art-carousel-track',
      prevHitboxId: 'subpage-wall-art-hitbox-prev',
      nextHitboxId: 'subpage-wall-art-hitbox-next',
      activeTitleId: 'subpage-wall-art-active-title',
      activeDescId: 'subpage-wall-art-active-desc',
      products: WALL_ART_PRODUCTS
    },
    {
      slug: 'partitions-bookcases',
      triggerId: 'trigger-partitions-bookcases',
      subpageId: 'subpage-partitions-bookcases',
      backBtnId: 'subpage-partitions-bookcases-back-btn',
      trackId: 'subpage-partitions-bookcases-carousel-track',
      prevHitboxId: 'subpage-partitions-bookcases-hitbox-prev',
      nextHitboxId: 'subpage-partitions-bookcases-hitbox-next',
      activeTitleId: 'subpage-partitions-bookcases-active-title',
      activeDescId: 'subpage-partitions-bookcases-active-desc',
      products: PARTITIONS_BOOKCASES_PRODUCTS
    },
    {
      slug: 'tableware',
      triggerId: 'trigger-tableware',
      subpageId: 'subpage-tableware',
      backBtnId: 'subpage-tableware-back-btn',
      trackId: 'subpage-tableware-carousel-track',
      prevHitboxId: 'subpage-tableware-hitbox-prev',
      nextHitboxId: 'subpage-tableware-hitbox-next',
      activeTitleId: 'subpage-tableware-active-title',
      activeDescId: 'subpage-tableware-active-desc',
      products: TABLEWARE_PRODUCTS
    }
  ];

  SUBPAGES_CONFIG.forEach(cfg => initEditorialSubpage(cfg));
}

// ============================================================================
// 12. INITIALIZE
// ============================================================================

// ============================================================================
function init() {
  window.__init_log = [];
  const steps = [
    ['injectArtwork', injectArtwork],
    ['setupLobbyTabs', setupLobbyTabs],
    ['setupOfficeSelector', setupOfficeSelector],
    ['setupInfrastructureStack', setupInfrastructureStack],
    ['setupCalibrationHud', setupCalibrationHud],
    ['setupScrollEngine', setupScrollEngine],
    ['setupLayeredTransitions', setupLayeredTransitions],
    ['setupNavDrawer', setupNavDrawer],
    ['setupSmoothNav', setupSmoothNav],
    ['setupMaterialsInteractivity', setupMaterialsInteractivity],
    ['setupEditorialSubpages', setupEditorialSubpages],
    ['setupInquiryForm', setupInquiryForm]
  ];

  for (const [name, fn] of steps) {
    try {
      fn();
      window.__init_log.push({ name, status: 'ok' });
    } catch (err) {
      console.error(`Error in ${name}:`, err);
      window.__init_log.push({ name, status: 'error', error: err.message, stack: err.stack });
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
