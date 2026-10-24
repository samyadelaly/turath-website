/**
 * TURATH (تراث) — Egyptian Architectural Metalwork
 * Pure, Optimized, High-Performance JS Engine
 * Built strictly according to the Master Blueprint:
 * 1. Global Reset & Zero Gaps
 * 2. 58px Frosted Glass Header
 * 3. Stacking Sticky Scroll (Sec 1-9: 100svh, Sec 2: min-height 200svh)
 * 4. Hero Logo Zero Drift (transform-origin: center center, x: 0)
 * 5. Stepped-Notch Masks (#0A0A0A base, #D7C797 borders, no white flashes)
 * 6. 4-Slats Morphing Right to Left & 5 Staggered Videos
 * 7. Subpages & Copper Scrubbable Timeline (no roman numerals, no external strokes)
 * 8. GSAP pinSpacing: false
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
  collectionsBgImage,
  infoStageImage1,
  infoStageImage2,
  infoStageImage3,
  transitDepthImage,
  founderDarkImage,
  founderLitImage
} from './artwork.js';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;

// CRITICAL BLUEPRINT RULE: Enforce pinSpacing: false globally across all ScrollTriggers
ScrollTrigger.defaults({
  pinSpacing: false
});

// Product Catalogs for 9 Editorial Subpages
const MIRROR_PRODUCTS = [
  { title: 'Organic Foliate Brass Mirror', desc: 'Hand-sculpted organic brass branch latticework over circular reflective glass' },
  { title: 'Radiating Branch Bronze Mirror', desc: 'Circular bronze-patinated brass mirror framed by an organic botanical halo of hand-sculpted branches' },
  { title: 'Sunburst Disc Brass Mirror', desc: 'Dense multi-tiered halo of hand-hammered solid brass discs capturing warm ambient light' },
  { title: 'Filigree Petal Brass Mirror', desc: 'Asymmetrical overlapping brass filigree leaf petals with intricate openwork spiral lace' },
  { title: 'Pierced Arabesque Brass Mirror', desc: 'Geometric square brass frame hand-pierced with traditional Egyptian star arabesque motifs' },
  { title: 'Monstera Brass Leaf Mirror', desc: 'Asymmetrical undulating brass contour embraced by a sculptural hand-veined Monstera palm frond' },
  { title: 'Engraved Nubian Brass Mirror', desc: 'Circular antique brass disc featuring hand-chiseled geometric linear and wave engravings' },
  { title: 'Scalloped Brass Scale Mirror', desc: 'Vertical architectural frame adorned with a cascading veil of overlapping brass fish scales' }
];

const LIGHTING_PRODUCTS = [
  { title: 'Architectural Mobile Brass Chandelier', desc: 'Balanced geometric brass chandelier with multi-directional articulated arms and warm exposed globe illumination' },
  { title: 'Radiant Perforated Brass Wall Sconce', desc: 'Hand-pierced circular solid brass flush sconce projecting dramatic radial geometric shadow rays across surrounding walls' },
  { title: 'Bidirectional Cylindrical Brass Sconce', desc: 'Slim vertical polished brass column light with a blackened metal collar offering dual-direction vertical wall grazing' },
  { title: 'Triad Branching Brass Floor Lamp', desc: 'Sculptural three-stem brass floor luminaire crowned with mouth-blown glass globes anchored on a weighted brass base' },
  { title: 'Dome Brass Tripod Floor Lamp', desc: 'Contemporary blackened steel tripod floor lamp featuring a hand-spun brushed brass dome reflector with solid brass ferrules' },
  { title: 'Ovoid Pierced Brass Table Lantern', desc: 'Hand-pierced egg-shaped antique brass accent luminaire on cast claw feet, casting intricate floral arabesque shadows' },
  { title: 'Filigree Spherical Brass Pendant', desc: 'Suspended spherical brass pendant with dense hand-chiseled arabesque openwork perforations creating dramatic ambient shadow lace' },
  { title: 'Imperial Crown Brass Ring Chandelier', desc: 'Monumental circular solid brass ring chandelier supporting a perimeter of slender candle arms and crisp white conical shades' }
];

const HANDLES_PRODUCTS = [
  { title: 'Sinuous Bough Cast Bronze Handle', desc: 'Sinuous hand-sculpted organic branch door pull cast in solid bronze with rich hand-buffed antique patina' },
  { title: 'Molten Ripple Cast Brass Bar Pull', desc: 'Monumental vertical bar handle cast in solid brass with an expressive molten rippled topography and high-polish ridges' },
  { title: 'Botanical Branch Walnut Door Handle Suite', desc: 'Monumental organic cast brass tree branch door handle ensemble featured on an architectural dark walnut entrance pivot door' },
  { title: 'Half-Moon Sculpted Brass Pull Pair', desc: 'Pair of semicircular cast solid brass entrance pulls with dramatic undulating molten crevices designed to align as a circular medallion' },
  { title: 'Mirrored Twig Cast Bronze Pull Pair', desc: 'Symmetrical pair of slender cast bronze botanical branch handles with delicate offshoot twigs and textured bark detailing' },
  { title: 'Polished Brass T-Bar Escutcheon Knob', desc: 'Minimalist solid brass cylindrical T-handle mounted upon a softly contoured mirror-polished square escutcheon backplate' }
];

const TABLES_CONSOLES_PRODUCTS = [
  { title: 'Classical Brass Tripod Marble Accent Table', desc: 'Refined three-legged solid brass gueridon table with fluted columns, tri-podal stretcher, and inset veined white marble top' },
  { title: 'Arboreal Cast Brass Branch Console Table', desc: 'Architectural console table pairing a minimalist ebonized wood drawer plinth with six organic cast solid brass branching tree legs' },
  { title: 'Brutalist Geometric Brass Tile Coffee Table', desc: 'Monumental circular coffee table enveloped in a rhythmic drum of antique brass geometric plaques and a tempered glass surface' },
  { title: 'Brutalist Geometric Brass Tile Side Table', desc: 'Slender cylindrical drum accent table with rhythmic staggered antique brass plates and polished glass top' },
  { title: 'Sculpted Botanical Bough Brass Console Frame', desc: 'Hand-sculpted organic cast brass console table featuring a delicate diagonal tree bough lattice and bark-textured structural frame' },
  { title: 'Linear Fluted Brass & Nero Marquina Console', desc: 'Sleek architectural console pairing a honed Nero Marquina marble slab with an open rectilinear frame of vertical solid brass fluted columns' }
];

const HANDRAILS_PRODUCTS = [
  { title: 'Architectural Grille Balustrade', desc: 'Solid red marble architectural surround enclosing pierced hand-chiseled foliate brass panels' },
  { title: 'Sculptural Foliate Brass Architectural Screen & Balustrade', desc: 'Full-height monolithic cast brass architectural screen panel with hand-sculpted organic leaf venation and openwork filigree' }
];

const DECORATIVE_OBJECTS_PRODUCTS = [
  { title: 'Hand-Hammered Brass Fluted Vessel', desc: 'Artisan deep-drawn solid brass decorative centerpiece bowl with hand-stippled dimpled texture' },
  { title: 'Pierced Brass Foliage Wall Sculpture', desc: 'Wall-mounted sculptural ensemble of four hand-pierced solid brass leaves with delicate filigree perforations and warm burnished patina' },
  { title: 'Geometric Orbital Brass Medallion Relief', desc: 'Monumental rhythmic wall relief featuring interconnected brass hoops framing hand-hammered concave disc medallions with dual-tone radiant texturing' },
  { title: 'Sculpted Asymmetric Brass Vessel Duo', desc: 'Pair of artisanal heavy cast brass tabletop vessels characterized by undulating fluid rims, tapering silhouettes, and a matte brushed golden patina' },
  { title: 'Domed Imperial Arabesque Brass Casket', desc: 'Masterfully hand-engraved solid brass domed treasure casket adorned with intricate all-over floral arabesques and a pierced central lid filigree medallion' },
  { title: 'Radial Hammered Brass Charger Platter', desc: 'Monolithic circular decorative charger plate hand-chiseled with concentric sunburst stippling and a gently raised perimeter rim in warm radiant brass' }
];

const WALL_ART_PRODUCTS = [
  { title: 'Layered Geometric Sunburst Brass Medallion', desc: 'Triple-tier circular brass wall artwork relief composed of offset hand-chiseled solar plaques surrounding a central domed convex focal core' },
  { title: 'Arabesque Lattice Brass Arch Diptych', desc: 'Pair of tall Moorish arched brass panels hand-perforated with continuous Islamic star geometry and framed in brushed brass angle iron' },
  { title: 'Chiseled Calligraphic Brass Cartouche', desc: 'Monumental rectangular antique brass tablet inscribed with fluid calligraphic flourishes hand-chiseled into heavy cold-rolled brass' },
  { title: 'Hammered Brass Organic Wave Relief', desc: 'Curving horizontal architectural wall sculpture evoking desert dune contours through continuous repoussé texturing and fire-rubbed bronze shading' }
];

const PARTITIONS_BOOKCASES_PRODUCTS = [
  { title: 'Interlocking Brass Ring Screen', desc: 'Geometric room divider constructed from interlocking solid brass rings framing perforated brass and bronze mesh infill' },
  { title: 'Moorish Trellis Brass Freestanding Screen', desc: 'Four-panel folding partition articulated in solid brushed brass with hand-pierced Moorish arch cutouts and satin piano hinges' },
  { title: 'Geometric Asymmetric Brass Architectural Etagere', desc: 'Floor-to-ceiling modular bookcase featuring staggered rectangular solid brass compartments and cantilevered smoked glass shelves' },
  { title: 'Mashrabiya Hexagon Brass Sliding Screen', desc: 'Ceiling-suspended architectural room divider sliding on recessed brass tracks, adorned with a contemporary hexagonal Islamic latticework' }
];

const TABLEWARE_PRODUCTS = [
  { title: 'Fluted Brass Pedestal Centerpiece Bowl', desc: 'Statuesque hand-spun solid brass compote dish elevated on a turned columnar stem with a satin-buffed reflective interior' },
  { title: 'Hammered Brass Oval Serving Tray with Cast Handles', desc: 'Heavy brass serving platter with a stippled surface texture and cast sculptural branch handles finished in antique brass patina' },
  { title: 'Engraved Arabesque Brass Coaster Ensemble', desc: 'Set of six circular brass drink coasters hand-chiseled with alternating floral arabesque medallions, stored in a matching brass caddy' },
  { title: 'Sculpted Cast Brass Napkin Ring Set', desc: 'Suite of four organic cast brass napkin rings modeled after undulating vine tendrils with high-polish highlights' }
];

const CRAFT_FILMS = [
  {
    index: 0,
    title: 'The Art of Repoussé & Hand-Chiseling',
    desc: 'Master artisans sculpting intricate floral arabesque motifs directly into heavy gauge raw brass plate using tempered steel chisels in Historic Cairo.',
    videoSrc: '/video/commute2.mp4'
  },
  {
    index: 1,
    title: 'Precision Piercing & Architectural Latticework',
    desc: 'Intricate geometric perforations and fretwork pierced by hand with jeweler saws to cast ethereal arabesque light and shadow projections.',
    videoSrc: '/video/commute3.mp4'
  },
  {
    index: 2,
    title: 'Artisan Finishing & Liquid Satin Patina',
    desc: 'Multi-stage manual oxidation, polishing, and bespoke hand-rubbed patination revealing warm undertones of natural copper and brass.',
    videoSrc: '/video/commute4.mp4'
  },
  {
    index: 3,
    title: 'Grand Chandelier Structural Assembly',
    desc: 'Assembly of monumental hand-forged architectural lighting installations engineered for luxury residential and hospitality ballrooms.',
    videoSrc: '/video/VN20260909_233157.mp4'
  },
  {
    index: 4,
    title: 'Molten Bronze Casting & Sand Mold Pouring',
    desc: 'Ancient crucible furnace bronze casting into hand-packed silica sand molds, carrying thousands of years of Nile Valley metalcraft.',
    videoSrc: '/video/commute1.mp4'
  }
];

// ============================================================================
// 1. INJECT ARTWORK (High-Resolution Media & Backgrounds)
// ============================================================================
function injectArtwork() {
  const heroDay = document.getElementById('hero-day-container');
  const heroNight = document.getElementById('hero-night-container');
  const aboutDepth = document.getElementById('about-depth-plate');
  const stageImg1 = document.getElementById('info-stage-img-1');
  const stageImg2 = document.getElementById('info-stage-img-2');
  const stageImg3 = document.getElementById('info-stage-img-3');
  const scene04Video = document.getElementById('scene04-video');
  const scene05PinnedImg = document.getElementById('scene05-pinned-img');
  const plateDarkImg = document.querySelector('#scene06-plate-dark img');
  const plateLitImg = document.querySelector('#scene06-plate-lit img');

  if (heroDay) {
    heroDay.innerHTML = `<img src="${heroDayImage}" alt="Turath Base" class="scene-photo-cover" />`;
  }
  if (heroNight) {
    heroNight.innerHTML = `<img src="${heroNightImage}" alt="Turath Reveal" class="scene-photo-cover" />`;
  }
  if (aboutDepth) {
    aboutDepth.innerHTML = `<img src="${collectionsBgImage}" alt="Collections" class="scene-photo-cover" /><div class="photo-scrim-dark"></div>`;
  }

  // 9 Collection Cards
  const collectionImages = [
    aboutImage1, aboutImage2, aboutImage3,
    aboutImage4, aboutImage5, aboutImage6,
    aboutImage7, aboutImage8, aboutImage9
  ];
  for (let i = 1; i <= 9; i++) {
    const frame = document.getElementById(`about-frame-${i}`);
    if (frame && collectionImages[i - 1]) {
      frame.innerHTML = `<img src="${collectionImages[i - 1]}" alt="Collection ${i}" class="scene-photo-cover" loading="lazy" />`;
    }
  }

  // Section 03 Stages
  if (stageImg1) stageImg1.innerHTML = `<img src="${infoStageImage1}" alt="Stage 1" class="scene-photo-cover" />`;
  if (stageImg2) stageImg2.innerHTML = `<img src="${infoStageImage2}" alt="Stage 2" class="scene-photo-cover" />`;
  if (stageImg3) stageImg3.innerHTML = `<img src="${infoStageImage3}" alt="Stage 3" class="scene-photo-cover" />`;

  // Section 04 Video
  if (scene04Video) {
    scene04Video.muted = true;
    scene04Video.playsInline = true;
    scene04Video.play().catch(() => {});
  }

  // Section 05 Project
  if (scene05PinnedImg) {
    scene05PinnedImg.src = transitDepthImage;
  }

  // Section 06 Founder
  if (plateDarkImg) plateDarkImg.src = `${founderDarkImage}?v=4`;
  if (plateLitImg) plateLitImg.src = `${founderLitImage}?v=5`;
}

// ============================================================================
// 2. DYNAMICALLY MOUNT CRAFT IN MOTION (5 Videos, Slats, Cinema Subpage)
// ============================================================================
function mountCraftInMotionAssets() {
  // 1. Nav Drawer Link
  const navList = document.querySelector('.nav-menu-items');
  if (navList && !document.getElementById('menu-btn-craft')) {
    const li = document.createElement('li');
    li.className = 'nav-menu-item';
    li.innerHTML = `
      <a href="#project-inquiry" class="nav-menu-link nav-menu-highlight" id="menu-btn-craft" data-target="project-inquiry">
        <span class="nav-label">CRAFT IN MOTION</span>
      </a>
    `;
    const inquiryItem = Array.from(navList.children).find(el => el.textContent.includes('PROJECT INQUIRY'));
    if (inquiryItem) {
      navList.insertBefore(li, inquiryItem);
    } else {
      navList.appendChild(li);
    }
  }

  // 2. Video slats removed per user instruction
  const existingSlats = document.getElementById('craft-slats-container');
  if (existingSlats) existingSlats.remove();
  // 3. Fullscreen Cinema Subpage (9:16 Video Detail View)
  if (!document.getElementById('subpage-craft-in-motion')) {
    const modal = document.createElement('div');
    modal.id = 'subpage-craft-in-motion';
    modal.className = 'subpage-view subpage-cinema-view';
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'Craft in Motion Video Viewer');
    modal.innerHTML = `
      <div class="subpage-cinema-container">
        <!-- Header -->
        <header class="subpage-cinema-header">
          <button class="subpage-back-arrow" id="cinema-back-btn" type="button" aria-label="Return to Section">
            <span class="arrow-glyph">&larr;</span>
            <span class="arrow-text">BACK</span>
          </button>
          <h2 class="subpage-page-title">CRAFT IN MOTION</h2>
          <div class="cinema-header-slot"></div>
        </header>

        <!-- 9:16 Video Stage -->
        <div class="subpage-cinema-stage">
          <button class="cinema-hitbox hitbox-prev" id="cinema-hitbox-prev" type="button" aria-label="Previous Film"></button>
          <button class="cinema-hitbox hitbox-next" id="cinema-hitbox-next" type="button" aria-label="Next Film"></button>

          <div class="cinema-aspect-frame">
            <div class="cinema-carousel-viewport">
              <div class="cinema-carousel-track" id="cinema-carousel-track">
                <div class="cinema-slide"><video id="cinema-video-0" class="cinema-video-element" src="/video/commute2.mp4" loop playsinline></video></div>
                <div class="cinema-slide"><video id="cinema-video-1" class="cinema-video-element" src="/video/commute3.mp4" loop playsinline></video></div>
                <div class="cinema-slide"><video id="cinema-video-2" class="cinema-video-element" src="/video/commute4.mp4" loop playsinline></video></div>
                <div class="cinema-slide"><video id="cinema-video-3" class="cinema-video-element" src="/video/VN20260909_233157.mp4" loop playsinline></video></div>
                <div class="cinema-slide"><video id="cinema-video-4" class="cinema-video-element" src="/video/commute1.mp4" loop playsinline></video></div>
              </div>
            </div>

            <!-- Copper Scrubbable Timeline (NO Roman Numerals, NO external strokes) -->
            <div class="copper-timeline-panel">
              <div class="timeline-controls-bar">
                <button class="timeline-ctrl-btn" id="cinema-play-btn" type="button" aria-label="Play or Pause">
                  <span class="icon-pause">&#9646;&#9646;</span>
                  <span class="icon-play" style="display:none;">&#9654;</span>
                </button>
                <div class="cinema-time-display" id="cinema-time-display">0:00 / 0:00</div>
                <button class="timeline-ctrl-btn" id="cinema-mute-btn" type="button" aria-label="Mute or Unmute">
                  <span class="icon-unmuted">&#128266;</span>
                  <span class="icon-muted" style="display:none;">&#128263;</span>
                </button>
              </div>
              <div class="copper-timeline-rail" id="cinema-timeline-rail">
                <div class="copper-timeline-progress" id="cinema-timeline-progress"></div>
                <div class="copper-timeline-handle" id="cinema-timeline-handle"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cinema Footer Meta -->
        <footer class="subpage-cinema-footer">
          <div class="cinema-meta-block">
            <h3 class="cinema-active-title" id="cinema-active-title">The Art of Repoussé &amp; Hand-Chiseling</h3>
            <p class="cinema-active-desc" id="cinema-active-desc">Master artisans sculpting intricate floral arabesque motifs directly into heavy gauge raw brass plate using tempered steel chisels in Historic Cairo.</p>
          </div>
          <div class="subpage-dash-indicators" id="cinema-dash-indicators">
            <button class="subpage-dash-item is-active" data-index="0" aria-label="Film 1"></button>
            <button class="subpage-dash-item" data-index="1" aria-label="Film 2"></button>
            <button class="subpage-dash-item" data-index="2" aria-label="Film 3"></button>
            <button class="subpage-dash-item" data-index="3" aria-label="Film 4"></button>
            <button class="subpage-dash-item" data-index="4" aria-label="Film 5"></button>
          </div>
        </footer>
      </div>
    `;
    document.body.appendChild(modal);
  }
}

// ============================================================================
// 2. TURATH LOGO FLIP & DUAL-SPEED FONT SCRAMBLE ENGINE (Docks Next to Menu)
// ============================================================================
const FONT_PALETTE = [
  "'Cinzel', serif",
  "'Syne', sans-serif",
  "'Space Grotesk', sans-serif",
  "'Playfair Display', serif",
  "'Space Mono', monospace",
  "'Inter', sans-serif"
];

const GEOMETRIC_FONTS = [
  "'Space Grotesk', sans-serif",
  "'Syne', sans-serif",
  "'Inter', sans-serif"
];

const EXPERIMENTAL_FONTS = [
  "'Cinzel', serif",
  "'Playfair Display', serif",
  "'Space Mono', monospace"
];

const BASE_FONT = "'Syne', sans-serif";
const DOCKED_FONT = "'Cinzel', serif";
const CHAR_CADENCES = [3, 4, 2, 5, 3, 4];
let scrambleTick = 0;
let lastScrambleY = 0;


// Helper: Align all 3 Hero lines to have the exact same right edge down to subpixel
function alignHeroLines() {
  const lineDevoted = document.getElementById('hero-line-devoted');
  const lineCreativity = document.getElementById('hero-line-creativity');
  const eyebrow = document.querySelector('.hero-eyebrow');
  if (!lineCreativity || !lineDevoted) return;

  lineDevoted.style.letterSpacing = '0.04em';
  lineCreativity.style.letterSpacing = '0.04em';

  const dWidth = lineDevoted.getBoundingClientRect().width;
  const cWidth = lineCreativity.getBoundingClientRect().width;

  if (cWidth > dWidth && dWidth > 0) {
    const s = (cWidth - dWidth) / 6;
    lineDevoted.style.letterSpacing = `calc(0.04em + ${s.toFixed(3)}px)`;
  } else if (dWidth > cWidth && cWidth > 0) {
    const s = (dWidth - cWidth) / 14;
    lineCreativity.style.letterSpacing = `calc(0.04em + ${s.toFixed(3)}px)`;
  }
}

function setupHeroLogoAnimation() {
  const turathLogo = document.getElementById('turath-logo');
  const heroAnchor = document.getElementById('hero-turath-anchor');
  const headerSlot = document.getElementById('header-logo-slot');
  const siteHeader = document.getElementById('site-header');
  const scrambleChars = document.querySelectorAll('#turath-logo .scramble-char');
  const ghostEl = document.querySelector('.hero-turath-ghost');

  if (!turathLogo || !headerSlot) return;

  // Align DEVOTED and TO CREATIVITY
  alignHeroLines();

  // Kill existing hero triggers
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars && st.vars.id === 'hero-logo-trigger') st.kill();
  });

  const aRect = heroAnchor ? heroAnchor.getBoundingClientRect() : null;
  const sRect = headerSlot.getBoundingClientRect();
  const arrowBtn = document.getElementById('hero-scroll-next-btn');
  const bRect = arrowBtn ? arrowBtn.getBoundingClientRect() : null;

  // SCALE: Match hero ghost size accurately
  turathLogo.style.transform = 'none';
  const naturalTRect = turathLogo.getBoundingClientRect();
  const ghostRect = ghostEl ? ghostEl.getBoundingClientRect() : { width: 190, height: 30 };
  const scaleByW = ghostRect.width > 0 && naturalTRect.width > 0 ? (ghostRect.width / naturalTRect.width) : 1.9;
  const scaleByH = ghostRect.height > 0 && naturalTRect.height > 0 ? (ghostRect.height / naturalTRect.height) : 1.9;
  const startScale = Math.min(scaleByW, scaleByH * 1.05);

  const renderedTurathWidth = naturalTRect.width * startScale;
  if (heroAnchor && renderedTurathWidth > 0) {
    heroAnchor.style.setProperty('width', `${renderedTurathWidth.toFixed(1)}px`, 'important');
    heroAnchor.style.setProperty('min-width', `${renderedTurathWidth.toFixed(1)}px`, 'important');
    heroAnchor.style.setProperty('max-width', `${renderedTurathWidth.toFixed(1)}px`, 'important');
  }

  // ALIGN TURATH VERTICALLY WITH ARROW (اطلع بتراث فوق جمب السهم)
  // Mathematical 0.00px vertical center alignment with arrow button:
  // Since transformOrigin is 'left center', newCenterY = naturalCenterY + startY.
  // Setting startY = arrowCenterY - naturalCenterY guarantees exact 1:1 center alignment!
  const naturalCenterY = naturalTRect.top + naturalTRect.height / 2;
  const arrowCenterY = bRect ? (bRect.top + bRect.height / 2) : (aRect ? aRect.top + 15 : 270);
  const startY = arrowCenterY - naturalCenterY;
  const startX = aRect ? (aRect.left - naturalTRect.left) : 0;

  // CRITICAL: Set initial resting position in the hero sheet immediately on load!
  const curScrollY0 = window.pageYOffset || document.documentElement.scrollTop;
  if (curScrollY0 < 10) {
    turathLogo.classList.add('hero-resting');
    turathLogo.classList.remove('is-docked');
    turathLogo.style.transform = `translate3d(${startX.toFixed(2)}px, ${startY.toFixed(2)}px, 0) scale(${startScale.toFixed(4)})`;
    turathLogo.style.transformOrigin = 'left center';
    turathLogo.style.setProperty('color', '#0A0A0A', 'important');
    turathLogo.style.opacity = '1';
    scrambleChars.forEach(ch => {
      ch.style.fontFamily = BASE_FONT;
      if (ch.dataset.char && ch.textContent !== ch.dataset.char) {
        ch.textContent = ch.dataset.char;
      }
    });
  }

  ScrollTrigger.create({
    id: 'hero-logo-trigger',
    start: 0,
    end: () => Math.max(260, window.innerHeight * 0.35),
    scrub: true,
    onUpdate: (self) => {
      const p = self.progress;

      // 1. TURATH INTERPOLATION: Exact ascent toward navbar slot
      const curX = startX * (1 - p);
      const curY = Math.max(0, startY * (1 - p));
      const curScale = 1.0 + (startScale - 1.0) * (1 - p);

      // 2. LOCKSTEP NOTCH ASCENT: Moves UP by the exact same pixels as Turath (identical physical speed!)
      const notchAscent = (startY - curY) * 0.12;
      const turathPixelsAscended = notchAscent;
      const heroSheetEl = document.getElementById('hero-sheet');
      if (heroSheetEl) {
        heroSheetEl.style.setProperty('transform', `translate3d(0, -${notchAscent.toFixed(2)}px, 0)`, 'important');
      }
      document.documentElement.style.setProperty('--hero-sheet-y', `${notchAscent.toFixed(2)}px`);

      turathLogo.style.opacity = '1'; // Never fades out

      const siteHeaderEl = document.getElementById('site-header');
      if (p >= 0.95) {
        if (siteHeaderEl) siteHeaderEl.classList.remove('in-hero');
        turathLogo.classList.add('is-docked');
        turathLogo.classList.remove('hero-resting');
        turathLogo.style.transform = 'none';
        turathLogo.style.setProperty('color', '#0A0A0A', 'important');
        scrambleChars.forEach(ch => {
          ch.style.fontFamily = DOCKED_FONT;
          if (ch.dataset.char && ch.textContent !== ch.dataset.char) {
            ch.textContent = ch.dataset.char;
          }
        });
      } else {
        if (siteHeaderEl) siteHeaderEl.classList.add('in-hero');
        turathLogo.classList.remove('is-docked');
        turathLogo.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0) scale(${curScale.toFixed(4)})`;
        turathLogo.classList.add('hero-resting');
        turathLogo.style.setProperty('color', '#0A0A0A', 'important');
        turathLogo.style.transformOrigin = 'left center';

        // Dual-speed Font Scramble Motion
        if (p < 0.05) {
          scrambleChars.forEach(ch => {
            ch.style.fontFamily = BASE_FONT;
            if (ch.dataset.char && ch.textContent !== ch.dataset.char) {
              ch.textContent = ch.dataset.char;
            }
          });
        } else {
          const curScrollY = window.pageYOffset || document.documentElement.scrollTop;
          const deltaY = Math.abs(curScrollY - lastScrambleY);
          if (deltaY >= 4) {
            scrambleTick++;
            lastScrambleY = curScrollY;
            scrambleChars.forEach((ch, idx) => {
              const cadence = CHAR_CADENCES[idx % CHAR_CADENCES.length] || 3;
              if ((scrambleTick + idx * 2) % cadence === 0) {
                const pool = (idx % 2 === 0) ? GEOMETRIC_FONTS : EXPERIMENTAL_FONTS;
                ch.style.fontFamily = pool[Math.floor(Math.random() * pool.length)];
              }
            });
          }
        }
      }
    }
  });

  // Notch ascent is synchronized 1:1 with Turath in hero-logo-trigger above

  // Hero Arrow Button Click
  const heroArrowBtn = document.getElementById('hero-scroll-next-btn');
  if (heroArrowBtn) {
    heroArrowBtn.addEventListener('click', () => {
      const about = document.getElementById('about');
      if (about) {
        about.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

// ============================================================================
// 4. THE 8 ARCHITECTURAL SECTION TRANSITIONS (IN STRICT ORDER 1 TO 8)
// ============================================================================
function setupTransitions() {
  // --------------------------------------------------------------------------
  // TRANSITION 1: SECTION 01 (#hero) -> SECTION 02 (#about)
  // Section 2 Layered Scrolling Morphing Ascent Over Hero
  // --------------------------------------------------------------------------

  // 1a. Hero Day/Night Crossfade
  const heroNight = document.getElementById('hero-night-container');
  if (heroNight) {
    gsap.to(heroNight, {
      opacity: 1,
      ease: 'none',
      scrollTrigger: {
        start: 0,
        end: () => Math.max(160, window.innerHeight * 0.20),
        scrub: 0.15
      }
    });
  }

  // 1b. Hero Brand Description, DEVOTED & TO CREATIVITY fade-out on scroll
  const heroTextEls = document.querySelectorAll('.hero-brand-description, .scene-eyebrow, .hero-heading');
  if (heroTextEls.length > 0) {
    gsap.to(heroTextEls, {
      opacity: 0,
      y: -25,
      ease: 'none',
      scrollTrigger: {
        start: 0,
        end: () => Math.max(220, window.innerHeight * 0.28),
        scrub: true
      }
    });
  }

  // Arrow button fades out in-place (no y shift) so it stays 100% locked with Turath shelf
  const arrowBtnEl = document.getElementById('hero-scroll-next-btn');
  if (arrowBtnEl) {
    gsap.to(arrowBtnEl, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        start: 0,
        end: () => Math.max(240, window.innerHeight * 0.32),
        scrub: true
      }
    });
  }

  // 1c. Section 02 Layered Scrolling Morphing Animation over Hero
  const aboutSection = document.getElementById('about');
  const aboutSheet = document.querySelector('#about .scene-sheet');
  const aboutDepthPlate = document.getElementById('about-depth-plate');
  const aboutCards = document.querySelectorAll('.about-frame-item');
  const aboutHeader = document.querySelector('.about-editorial-header');

  if (aboutSection && aboutSheet) {
    ScrollTrigger.create({
      id: 'sec2-morph-trigger',
      trigger: '#about',
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;

        // 1. Morphing Stepped-Notch ClipPath as Section 2 ascends over Hero:
        // Left-side step formula (24% ratio, 48px depth) morphing smoothly
        if (p >= 0.98) {
          aboutSheet.style.clipPath = 'none';
          aboutSheet.style.webkitClipPath = 'none';
        } else {
          const stepX = (24 + (1 - p) * 12).toFixed(1);
          const stepY = (54 * (1 - p * 0.4)).toFixed(1);
          aboutSheet.style.clipPath = `polygon(0% ${stepY}px, ${stepX}% ${stepY}px, ${stepX}% 0%, 100% 0%, 100% 100%, 0% 100%)`;
          aboutSheet.style.webkitClipPath = `polygon(0% ${stepY}px, ${stepX}% ${stepY}px, ${stepX}% 0%, 100% 0%, 100% 100%, 0% 100%)`;
        }

        // 2. Layered Parallax for Background Depth Plate
        if (aboutDepthPlate) {
          const depthY = ((1 - p) * 50).toFixed(1);
          aboutDepthPlate.style.transform = `translate3d(0, ${depthY}px, 0) scale(${1.06 - p * 0.06})`;
        }
      }
    });

    // 3. Staggered Row-by-Row Card Entrance as Section 2 ascends
    if (aboutCards.length > 0) {
      gsap.fromTo(aboutCards,
        { y: 35, opacity: 0.2 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.04,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 85%',
            end: 'top 20%',
            scrub: true,
            pinSpacing: false
          }
        }
      );
    }

    if (aboutHeader) {
      gsap.fromTo(aboutHeader,
        { y: 25, opacity: 0.3 },
        {
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#about',
            start: 'top 90%',
            end: 'top 35%',
            scrub: true,
            pinSpacing: false
          }
        }
      );
    }
  }

  // TRANSITION 2: SECTION 02 (#about) -> SECTION 03 (#information)
  // --------------------------------------------------------------------------
  // 2a. Section 03 Stepped Notch Right Entry
  const sheet03 = document.getElementById('scene03-sheet');
  if (sheet03) {
    ScrollTrigger.create({
      trigger: '#information',
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        if (p >= 0.98) {
          sheet03.style.clipPath = 'none';
        } else {
          // Asymmetric Stepped Notch on the Right
          const stepX = (78 - (1 - p) * 15).toFixed(1);
          const stepY = (48 * p).toFixed(1);
          sheet03.style.clipPath = `polygon(0% 0%, ${stepX}% 0%, ${stepX}% ${stepY}px, 100% ${stepY}px, 100% 100%, 0% 100%)`;
        }
      }
    });
  }

  // 2b. Section 03: 3-Stage Volumetric Sequencer
  const stageImages = [
    document.getElementById('info-stage-img-1'),
    document.getElementById('info-stage-img-2'),
    document.getElementById('info-stage-img-3')
  ];
  const stageTitles = [
    document.getElementById('stage-title-1'),
    document.getElementById('stage-title-2'),
    document.getElementById('stage-title-3')
  ];
  const stagePanes = [
    document.getElementById('stage-pane-1'),
    document.getElementById('stage-pane-2'),
    document.getElementById('stage-pane-3')
  ];
  const counterCurrent = document.getElementById('volumetric-counter-current');
  const counterFill = document.getElementById('volumetric-counter-fill');

  ScrollTrigger.create({
    trigger: '#information',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => {
      const p = self.progress;
      let activeStage = 0;
      if (p < 0.35) {
        activeStage = 0;
      } else if (p < 0.70) {
        activeStage = 1;
      } else {
        activeStage = 2;
      }

      // Update Slides
      stageImages.forEach((img, idx) => {
        if (img) img.classList.toggle('is-active', idx === activeStage);
      });
      stageTitles.forEach((t, idx) => {
        if (t) t.classList.toggle('is-active', idx === activeStage);
      });
      stagePanes.forEach((pane, idx) => {
        if (pane) pane.classList.toggle('is-active', idx === activeStage);
      });

      // Update Counter and Progress Bar
      if (counterCurrent) counterCurrent.textContent = String(activeStage + 1);
      if (counterFill) counterFill.style.width = `${((activeStage + 1) / 3) * 100}%`;
    }
  });

  // --------------------------------------------------------------------------
  // TRANSITION 3: SECTION 03 (#information) -> SECTION 04 (#location)
  // --------------------------------------------------------------------------
  const sheet04 = document.getElementById('scene04-sheet');
  const s04Video = document.getElementById('scene04-video');
  const s04Header = document.querySelector('.scene04-header-block');

  if (sheet04) {
    ScrollTrigger.create({
      trigger: '#location',
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        if (p >= 0.98) {
          sheet04.style.clipPath = 'none';
        } else {
          // Asymmetric Stepped Notch on the Left
          const stepX = (24 + (1 - p) * 10).toFixed(1);
          const stepY = (48 * p).toFixed(1);
          sheet04.style.clipPath = `polygon(0% ${stepY}px, ${stepX}% ${stepY}px, ${stepX}% 0%, 100% 0%, 100% 100%, 0% 100%)`;
        }
      }
    });
  }

  if (s04Video) {
    gsap.fromTo(s04Video,
      { scale: 1.08, opacity: 0.8 },
      {
        scale: 1.0,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '#location',
          start: 'top bottom',
          end: 'top top',
          scrub: true,
          pinSpacing: false
        }
      }
    );
  }

  if (s04Header) {
    gsap.fromTo(s04Header,
      { y: 35, opacity: 0.2 },
      {
        y: 0,
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#location',
          start: 'top 80%',
          end: 'top 20%',
          scrub: true,
          pinSpacing: false
        }
      }
    );
  }

  // --------------------------------------------------------------------------
  // TRANSITION 4: SECTION 04 (#location) -> SECTION 05 (#scene05)
  // --------------------------------------------------------------------------
  const sheet05 = document.getElementById('scene05-sheet');
  const s05Header = document.querySelector('.scene05-header-block');

  if (sheet05) {
    ScrollTrigger.create({
      trigger: '#scene05',
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        if (p >= 0.98) {
          sheet05.style.clipPath = 'none';
        } else {
          sheet05.style.clipPath = `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)`;
        }
      }
    });
  }

  if (s05Header) {
    gsap.fromTo(s05Header,
      { y: 30, opacity: 0.2 },
      {
        y: 0,
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#scene05',
          start: 'top 80%',
          end: 'top 25%',
          scrub: true,
          pinSpacing: false
        }
      }
    );
  }

  // --------------------------------------------------------------------------
  // TRANSITION 5: SECTION 05 (#scene05) -> SECTION 06 (#scene06 - Founder)
  // --------------------------------------------------------------------------
  const sheet06 = document.getElementById('scene06-sheet');
  const plateLit = document.getElementById('scene06-plate-lit');
  const founderLayout = document.getElementById('scene06-founder-layout');

  if (sheet06) {
    ScrollTrigger.create({
      trigger: '#scene06',
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        if (p >= 0.98) {
          sheet06.style.clipPath = 'none';
        } else {
          // Bi-Slats Split Morphing
          const w = (p * 50).toFixed(1);
          const r = (100 - w).toFixed(1);
          sheet06.style.clipPath = `polygon(evenodd, -1% -1%, 101% -1%, 101% 101%, -1% 101%, -1% -1%, ${w}% 0%, ${r}% 0%, ${r}% 25%, ${w}% 25%, ${w}% 50%, ${r}% 50%, ${r}% 75%, ${w}% 75%, ${w}% 100%, ${r}% 100%, ${r}% 75%, ${w}% 75%, ${w}% 50%, ${r}% 50%, ${r}% 25%, ${w}% 25%, ${w}% 0%, -1% -1%)`;
        }
      }
    });
  }

  // Lit Lamp Crossfade on Scroll (Dark vs Lit study)
  if (plateLit) {
    gsap.fromTo(plateLit,
      { opacity: 0 },
      {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '#scene06',
          start: 'top 60%',
          end: 'bottom bottom',
          scrub: true,
          pinSpacing: false
        }
      }
    );
  }

  if (founderLayout) {
    gsap.fromTo(founderLayout,
      { y: 30, opacity: 0.2 },
      {
        y: 0,
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#scene06',
          start: 'top 75%',
          end: 'top 20%',
          scrub: true,
          pinSpacing: false
        }
      }
    );
  }

  // --------------------------------------------------------------------------
  // TRANSITION 6: SECTION 06 (#scene06) -> SECTION 07 (#materials-finishes)
  // --------------------------------------------------------------------------
  const sheet07 = document.getElementById('scene07-sheet');
  const materialsCards = document.querySelectorAll('.material-card');

  if (sheet07) {
    ScrollTrigger.create({
      trigger: '#materials-finishes',
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        if (p >= 0.98) {
          sheet07.style.clipPath = 'none';
        } else {
          // Asymmetric Right Stepped Notch
          const stepX = (76 - (1 - p) * 12).toFixed(1);
          const stepY = (48 * p).toFixed(1);
          sheet07.style.clipPath = `polygon(0% 0%, ${stepX}% 0%, ${stepX}% ${stepY}px, 100% ${stepY}px, 100% 100%, 0% 100%)`;
        }
      }
    });
  }

  if (materialsCards.length > 0) {
    gsap.fromTo(materialsCards,
      { y: 35, opacity: 0.1 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#materials-finishes',
          start: 'top 75%',
          end: 'top 25%',
          scrub: true,
          pinSpacing: false
        }
      }
    );
  }

  // --------------------------------------------------------------------------
  // TRANSITION 7: SECTION 07 (#materials-finishes) -> SECTION 08 (#bespoke-manufacturing)
  // --------------------------------------------------------------------------
  const sheet08 = document.getElementById('scene08-sheet');
  const s08Pillars = document.querySelectorAll('.scene08-pillar-card');

  if (sheet08) {
    ScrollTrigger.create({
      trigger: '#bespoke-manufacturing',
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        if (p >= 0.98) {
          sheet08.style.clipPath = 'none';
        } else {
          sheet08.style.clipPath = `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)`;
        }
      }
    });
  }

  if (s08Pillars.length > 0) {
    gsap.fromTo(s08Pillars,
      { y: 35, opacity: 0.1 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#bespoke-manufacturing',
          start: 'top 75%',
          end: 'top 25%',
          scrub: true,
          pinSpacing: false
        }
      }
    );
  }

  // --------------------------------------------------------------------------
  // TRANSITION 8: SECTION 08 (#bespoke-manufacturing) -> SECTION 09 (#project-inquiry)
  // --------------------------------------------------------------------------
  const sheet09 = document.getElementById('scene09-sheet');
  if (sheet09) {
    ScrollTrigger.create({
      trigger: '#project-inquiry',
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        if (p >= 0.98) {
          sheet09.style.clipPath = 'none';
          return;
        }
        const w1 = Math.min(100, p * 125).toFixed(1);
        const w2 = Math.min(100, Math.max(0, (p - 0.1) * 125)).toFixed(1);
        const w3 = Math.min(100, Math.max(0, (p - 0.2) * 125)).toFixed(1);
        const w4 = Math.min(100, Math.max(0, (p - 0.3) * 125)).toFixed(1);
        
        // Right-to-Left 4-Slats Morphing Polygon
        sheet09.style.clipPath = `polygon(100% 0%, ${100 - w1}% 0%, ${100 - w1}% 25%, ${100 - w2}% 25%, ${100 - w2}% 50%, ${100 - w3}% 50%, ${100 - w3}% 75%, ${100 - w4}% 75%, ${100 - w4}% 100%, 100% 100%)`;
      }
    });
  }

  // Simultaneously: 5 videos rise vertically in a staggered sequence from far right (Video 5) to far left (Video 1)
  const slats = [
    document.getElementById('trigger-craft-slat-5'), // Far Right (Video 5)
    document.getElementById('trigger-craft-slat-4'), // Video 4
    document.getElementById('trigger-craft-slat-3'), // Video 3
    document.getElementById('trigger-craft-slat-2'), // Video 2
    document.getElementById('trigger-craft-slat-1')  // Far Left (Video 1)
  ].filter(Boolean);

  if (slats.length > 0) {
    gsap.fromTo(slats,
      {
        y: 140,
        opacity: 0.1
      },
      {
        y: 0,
        opacity: 1,
        stagger: 0.08, // Staggered from right (Slat 5) to left (Slat 1)
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#project-inquiry',
          start: 'top 85%',
          end: 'top top',
          scrub: true,
          pinSpacing: false
        }
      }
    );
  }
}

// ============================================================================
// 5. SUBPAGES (VIDEO DETAIL VIEW WITH COPPER TIMELINE)
// ============================================================================
function setupCraftInMotionSubpage() {
  const modal = document.getElementById('subpage-craft-in-motion');
  const backBtn = document.getElementById('cinema-back-btn');
  const track = document.getElementById('cinema-carousel-track');
  const activeTitle = document.getElementById('cinema-active-title');
  const activeDesc = document.getElementById('cinema-active-desc');
  const playBtn = document.getElementById('cinema-play-btn');
  const muteBtn = document.getElementById('cinema-mute-btn');
  const timelineRail = document.getElementById('cinema-timeline-rail');
  const timelineProgress = document.getElementById('cinema-timeline-progress');
  const timelineHandle = document.getElementById('cinema-timeline-handle');
  const timeDisplay = document.getElementById('cinema-time-display');
  const prevBtn = document.getElementById('cinema-hitbox-prev');
  const nextBtn = document.getElementById('cinema-hitbox-next');

  if (!modal || !track) return;

  let currentFilm = 0;
  let isPlaying = true;
  let isMuted = false;

  const updateFilm = (idx) => {
    currentFilm = Math.max(0, Math.min(CRAFT_FILMS.length - 1, idx));
    track.style.transform = `translate3d(-${currentFilm * 100}%, 0px, 0px)`;

    const film = CRAFT_FILMS[currentFilm];
    if (activeTitle) activeTitle.textContent = film.title;
    if (activeDesc) activeDesc.textContent = film.desc;

    // Pause all and play active video
    for (let i = 0; i < CRAFT_FILMS.length; i++) {
      const vid = document.getElementById(`cinema-video-${i}`);
      if (vid) {
        if (i === currentFilm) {
          vid.currentTime = 0;
          vid.muted = isMuted;
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      }
    }

    // Update dashes
    const dashes = modal.querySelectorAll('.subpage-dash-item');
    dashes.forEach((d, i) => {
      d.classList.toggle('is-active', i === currentFilm);
    });
  };

  // Open modal triggers from Section 9 slats
  for (let i = 1; i <= 5; i++) {
    const trigger = document.getElementById(`trigger-craft-slat-${i}`);
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const filmIdx = parseInt(trigger.getAttribute('data-index') || '0', 10);
        document.body.classList.add('in-subpage');
        modal.setAttribute('aria-hidden', 'false');
        modal.classList.add('is-open');
        updateFilm(filmIdx);
      });
    }
  }

  // Close modal
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.remove('in-subpage');
      modal.setAttribute('aria-hidden', 'true');
      modal.classList.remove('is-open');

      // Pause all videos
      for (let i = 0; i < CRAFT_FILMS.length; i++) {
        const vid = document.getElementById(`cinema-video-${i}`);
        if (vid) vid.pause();
      }
    });
  }

  // Prev / Next Hitbox clicks
  if (prevBtn) prevBtn.addEventListener('click', () => updateFilm(currentFilm - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => updateFilm(currentFilm + 1));

  // Dash clicks
  const dashes = modal.querySelectorAll('.subpage-dash-item');
  dashes.forEach((dash, idx) => {
    dash.addEventListener('click', () => updateFilm(idx));
  });

  // Play / Pause Toggle
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      const vid = document.getElementById(`cinema-video-${currentFilm}`);
      if (!vid) return;
      if (vid.paused) {
        vid.play();
        isPlaying = true;
        playBtn.querySelector('.icon-pause').style.display = 'inline';
        playBtn.querySelector('.icon-play').style.display = 'none';
      } else {
        vid.pause();
        isPlaying = false;
        playBtn.querySelector('.icon-pause').style.display = 'none';
        playBtn.querySelector('.icon-play').style.display = 'inline';
      }
    });
  }

  // Mute / Unmute Toggle
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      for (let i = 0; i < CRAFT_FILMS.length; i++) {
        const vid = document.getElementById(`cinema-video-${i}`);
        if (vid) vid.muted = isMuted;
      }
      muteBtn.querySelector('.icon-unmuted').style.display = isMuted ? 'none' : 'inline';
      muteBtn.querySelector('.icon-muted').style.display = isMuted ? 'inline' : 'none';
    });
  }

  // Timeline Video Time Tracking & Scrubbing
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const updateTimeline = () => {
    const vid = document.getElementById(`cinema-video-${currentFilm}`);
    if (vid && vid.duration && !isNaN(vid.duration)) {
      const pct = (vid.currentTime / vid.duration) * 100;
      if (timelineProgress) timelineProgress.style.width = `${pct}%`;
      if (timelineHandle) timelineHandle.style.right = `${pct}%`;
      if (timeDisplay) timeDisplay.textContent = `${formatTime(vid.currentTime)} / ${formatTime(vid.duration)}`;
    }
    requestAnimationFrame(updateTimeline);
  };
  requestAnimationFrame(updateTimeline);

  // Timeline Rail Scrub Click (RTL oriented: right is 0%)
  if (timelineRail) {
    timelineRail.addEventListener('click', (e) => {
      const vid = document.getElementById(`cinema-video-${currentFilm}`);
      if (!vid || !vid.duration) return;
      const rect = timelineRail.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const ratio = 1 - (clickX / rect.width);
      vid.currentTime = Math.max(0, Math.min(vid.duration, ratio * vid.duration));
    });
  }
}

// ============================================================================
// 6. 9 EDITORIAL SUBPAGES MODALS
// ============================================================================
function initEditorialSubpage(cfg) {
  const trigger = document.getElementById(cfg.triggerId);
  const subpage = document.getElementById(cfg.subpageId);
  const backBtn = document.getElementById(cfg.backBtnId);
  const track = document.getElementById(cfg.trackId);
  const prevBtn = document.getElementById(cfg.prevHitboxId);
  const nextBtn = document.getElementById(cfg.nextHitboxId);
  const activeTitle = document.getElementById(cfg.activeTitleId);
  const activeDesc = document.getElementById(cfg.activeDescId);

  if (!trigger || !subpage) return;

  let currentSlide = 0;
  const totalSlides = cfg.products ? cfg.products.length : 8;

  const updateSlide = (idx) => {
    currentSlide = Math.max(0, Math.min(totalSlides - 1, idx));
    if (track) {
      track.style.transform = `translate3d(-${currentSlide * 100}%, 0px, 0px)`;
    }
    if (cfg.products && cfg.products[currentSlide]) {
      if (activeTitle) activeTitle.textContent = cfg.products[currentSlide].title;
      if (activeDesc) activeDesc.textContent = cfg.products[currentSlide].desc;
    }
    const dashes = subpage.querySelectorAll('.subpage-dash-item');
    dashes.forEach((d, i) => {
      d.classList.toggle('is-active', i === currentSlide);
    });
  };

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.add('in-subpage');
    subpage.setAttribute('aria-hidden', 'false');
    subpage.classList.add('is-open', 'is-active');
    updateSlide(0);
  });

  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.remove('in-subpage');
      subpage.setAttribute('aria-hidden', 'true');
      subpage.classList.remove('is-open', 'is-active');
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => updateSlide(currentSlide - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => updateSlide(currentSlide + 1));

  const dashes = subpage.querySelectorAll('.subpage-dash-item');
  dashes.forEach((dash, idx) => {
    dash.addEventListener('click', () => updateSlide(idx));
  });
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
// 7. NAVIGATION DRAWER WITH CLOSE 'X' BUTTON & SMOOTH ROUTING
// ============================================================================
function setupNavDrawer() {
  const trigger = document.getElementById('menu-trigger');
  const drawer = document.getElementById('nav-drawer');

  if (!trigger || !drawer) return;

  // Inject 'X' close button into .menu-brand-header if not present
  const brandHeader = drawer.querySelector('.menu-brand-header');
  if (brandHeader && !document.getElementById('menu-close-btn')) {
    const closeBtn = document.createElement('button');
    closeBtn.id = 'menu-close-btn';
    closeBtn.className = 'menu-close-btn';
    closeBtn.setAttribute('type', 'button');
    closeBtn.setAttribute('aria-label', 'Close Navigation Menu');
    closeBtn.innerHTML = '&times;';
    brandHeader.appendChild(closeBtn);

    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('nav-drawer-open');
    });
  }

  trigger.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('is-open');
    drawer.classList.toggle('is-open', !isOpen);
    drawer.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
    document.body.classList.toggle('nav-drawer-open', !isOpen);
  });

  // Close on Esc key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('nav-drawer-open');
    }
  });

  const links = drawer.querySelectorAll('.nav-menu-link');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('nav-drawer-open');

      const targetId = link.getAttribute('data-target') || (link.getAttribute('href') || '').replace('#', '');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ============================================================================
// 8. INQUIRY FORM SUBMISSION & CONFIRMATION
// ============================================================================
function setupInquiryForm() {
  const form = document.getElementById('project-inquiry-form');
  const confirmation = document.getElementById('scene09-confirmation');
  const resetBtn = document.getElementById('scene09-reset-btn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (confirmation) {
        form.style.display = 'none';
        confirmation.hidden = false;
      }
    });
  }

  if (resetBtn && form) {
    resetBtn.addEventListener('click', () => {
      if (confirmation) {
        confirmation.hidden = true;
        form.reset();
        form.style.display = 'block';
      }
    });
  }
}

// ============================================================================
// 9. CORE SYSTEM INITIALIZATION
// ============================================================================
function init() {
  injectArtwork();
  mountCraftInMotionAssets();
  setupHeroLogoAnimation();
  setupTransitions();
  setupCraftInMotionSubpage();
  setupEditorialSubpages();
  setupNavDrawer();
  setupInquiryForm();

  console.log('Turath Core Engine Initialized cleanly.');
  ScrollTrigger.refresh();

  if (document.fonts) {
    document.fonts.ready.then(() => {
      alignHeroLines();
      setupHeroLogoAnimation();
      ScrollTrigger.refresh();
    });
  }
}

window.addEventListener('load', () => {
  alignHeroLines();
  setupHeroLogoAnimation();
  ScrollTrigger.refresh();
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

window.addEventListener('resize', () => {
  setupHeroLogoAnimation();
  ScrollTrigger.refresh();
}, { passive: true });
