const puppeteer = require('puppeteer-core');
const path = require('path');
const os = require('os');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const brainDir = 'C:\\Users\\SAM\\.gemini\\antigravity\\brain\\4a138245-4728-4ee1-9f79-b3ec32249cff';

async function safeEval(page, fn, ...args) {
  for (let i = 0; i < 6; i++) {
    try {
      return await page.evaluate(fn, ...args);
    } catch (e) {
      if (i === 5) throw e;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

(async () => {
  const profileDir = path.join(os.tmpdir(), 'puppeteer_verify_' + Date.now());
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    userDataDir: profileDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // TEST 1: Founder section at #founder on 1920x1080 (same as user's screenshot resolution)
  console.log('=== TEST 1: Founder Section at #founder (1920x1080) ===');
  const desktopPage = await browser.newPage();
  await desktopPage.setViewport({ width: 1920, height: 1080 });
  await desktopPage.goto('http://127.0.0.1:5173/index.html#founder', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3500));

  // Dismiss loader
  await safeEval(desktopPage, () => {
    const l = document.getElementById('loader') || document.querySelector('.loader-wrapper');
    if (l) l.remove();
  });
  await new Promise(r => setTimeout(r, 1500));

  const founderCheck = await safeEval(desktopPage, () => {
    const s7 = document.getElementById('scene-07');
    const faq = document.getElementById('faq');
    const s7Rect = s7 ? s7.getBoundingClientRect() : null;
    const faqRect = faq ? faq.getBoundingClientRect() : null;

    // Check if any element from FAQ is visible on screen
    const pointsToCheck = [
      { x: 1700, y: 900 },
      { x: 1600, y: 800 },
      { x: 1800, y: 1000 },
      { x: 1500, y: 950 }
    ];
    const elementsAtPoints = pointsToCheck.map(p => {
      const el = document.elementFromPoint(p.x, p.y);
      return {
        point: p,
        tag: el ? el.tagName : null,
        id: el ? el.id : null,
        className: el ? el.className : null,
        isInsideFaq: el ? !!el.closest('#faq') : false,
        isInsideFounder: el ? !!el.closest('#scene-07') : false
      };
    });

    return {
      windowHeight: window.innerHeight,
      scrollY: window.scrollY,
      s7Rect: s7Rect ? { top: s7Rect.top, height: s7Rect.height } : null,
      faqRect: faqRect ? { top: faqRect.top, height: faqRect.height } : null,
      isFaqCompletelyOffscreen: faqRect ? faqRect.top >= window.innerHeight : true,
      elementsAtPoints
    };
  });
  console.log('Founder Check (1920x1080):', JSON.stringify(founderCheck, null, 2));
  await desktopPage.screenshot({ path: path.join(brainDir, 'verify_founder_1080p_clean.png') });

  // TEST 2: FAQ 2-Step Morphing Ascent over Founder
  console.log('\n=== TEST 2: FAQ 2-Step Morphing Ascent ===');
  // Scroll to where FAQ starts ascending (faqTop around 500px)
  await safeEval(desktopPage, () => {
    const faq = document.getElementById('faq');
    if (faq) {
      window.scrollTo(0, faq.offsetTop - 500);
    }
  });
  await new Promise(r => setTimeout(r, 1500));

  const morphState = await safeEval(desktopPage, () => {
    const faq = document.getElementById('faq');
    return {
      scrollY: window.scrollY,
      faqTop: faq ? faq.getBoundingClientRect().top : null,
      clipPath: faq ? window.getComputedStyle(faq).clipPath : null
    };
  });
  console.log('FAQ Morphing State during ascent:', JSON.stringify(morphState, null, 2));
  await desktopPage.screenshot({ path: path.join(brainDir, 'verify_faq_2step_morphing.png') });

  // TEST 3: Arabic Collections on Desktop (1440x900)
  console.log('\n=== TEST 3: Arabic Collections on Desktop (1440x900) ===');
  await desktopPage.setViewport({ width: 1440, height: 900 });
  await desktopPage.goto('http://127.0.0.1:5173/ar.html#collections', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3500));
  await safeEval(desktopPage, () => {
    const l = document.getElementById('loader') || document.querySelector('.loader-wrapper');
    if (l) l.remove();
  });
  await new Promise(r => setTimeout(r, 1000));

  const arDesktopCollections = await safeEval(desktopPage, () => {
    const track = document.querySelector('#scene-03 .collections-track');
    const cards = Array.from(track ? track.querySelectorAll('.collection-card') : []);
    return {
      trackDisplay: track ? window.getComputedStyle(track).display : null,
      trackGridCols: track ? window.getComputedStyle(track).gridTemplateColumns : null,
      cardCount: cards.length,
      cardsLayout: cards.slice(0, 3).map((c, i) => ({
        index: i,
        rect: c.getBoundingClientRect(),
        title: c.querySelector('.collection-card-title')?.textContent.trim(),
        tag: c.querySelector('.collection-card-tag')?.textContent.trim(),
        cta: c.querySelector('.collection-card-cta')?.textContent.trim()
      }))
    };
  });
  console.log('AR Desktop Collections:', JSON.stringify(arDesktopCollections, null, 2));
  await desktopPage.screenshot({ path: path.join(brainDir, 'verify_ar_desktop_collections.png') });

  // TEST 4: Arabic Collections on Mobile (393x852)
  console.log('\n=== TEST 4: Arabic Collections on Mobile (393x852) ===');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true });
  await mobilePage.goto('http://127.0.0.1:5173/ar.html#collections', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 3500));
  await safeEval(mobilePage, () => {
    const l = document.getElementById('loader') || document.querySelector('.loader-wrapper');
    if (l) l.remove();
  });
  await new Promise(r => setTimeout(r, 1000));

  const arMobileCollections = await safeEval(mobilePage, () => {
    const track = document.querySelector('#scene-03 .collections-track');
    const cards = Array.from(track ? track.querySelectorAll('.collection-card') : []);
    return {
      trackDir: track ? window.getComputedStyle(track).direction : null,
      trackDisplay: track ? window.getComputedStyle(track).display : null,
      cardCount: cards.length,
      card1Width: cards[0] ? cards[0].getBoundingClientRect().width : null,
      card1SnapAlign: cards[0] ? window.getComputedStyle(cards[0]).scrollSnapAlign : null,
      card1Left: cards[0] ? cards[0].getBoundingClientRect().left : null,
      card1Right: cards[0] ? cards[0].getBoundingClientRect().right : null,
      card2Left: cards[1] ? cards[1].getBoundingClientRect().left : null,
      card2Right: cards[1] ? cards[1].getBoundingClientRect().right : null
    };
  });
  console.log('AR Mobile Collections:', JSON.stringify(arMobileCollections, null, 2));
  await mobilePage.screenshot({ path: path.join(brainDir, 'verify_ar_mobile_collections_card1.png') });

  // Test clicking next arrow on mobile
  console.log('Testing Next Arrow click on Arabic mobile...');
  await safeEval(mobilePage, () => {
    const nextArrow = document.getElementById('collections-next-arrow') || document.getElementById('track-next-btn');
    if (nextArrow) nextArrow.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  const arMobileCard2State = await safeEval(mobilePage, () => {
    const track = document.querySelector('#scene-03 .collections-track');
    const cards = Array.from(track ? track.querySelectorAll('.collection-card') : []);
    return {
      scrollLeft: track ? track.scrollLeft : null,
      card1Left: cards[0] ? cards[0].getBoundingClientRect().left : null,
      card2Left: cards[1] ? cards[1].getBoundingClientRect().left : null,
      card2Width: cards[1] ? cards[1].getBoundingClientRect().width : null
    };
  });
  console.log('AR Mobile after Next Arrow:', JSON.stringify(arMobileCard2State, null, 2));
  await mobilePage.screenshot({ path: path.join(brainDir, 'verify_ar_mobile_collections_card2.png') });

  await browser.close();
  console.log('\n=== ALL TESTS COMPLETED SUCCESSFULLY ===');
})();
