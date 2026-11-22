import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });

await page.goto('http://127.0.0.1:5173/ar.html#gallery', { waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 1500));

// Reconfigure bespokeEntranceTl in browser to start at 'top 30%'
await page.evaluate(() => {
  const bespoke = document.getElementById('bespoke');
  const bespokeSlices = document.querySelectorAll('#bespoke .b-slice');
  const bespokeForm = document.getElementById('bespoke-form');
  
  // Kill old bespokeEntranceTl
  const allST = ScrollTrigger.getAll();
  allST.forEach(st => {
    if (st.vars && st.vars.trigger === '#bespoke' && st.animation) {
      st.kill(true);
    }
  });

  gsap.set(bespokeSlices, { clipPath: 'inset(100% 0% 0% 0%)' });
  if (bespokeForm) gsap.set(bespokeForm, { opacity: 0, y: 35 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#bespoke',
      start: 'top 30%',
      end: 'top top',
      scrub: 1.2,
      invalidateOnRefresh: true
    }
  });

  tl.to(bespokeSlices, {
    clipPath: 'inset(0% 0% 0% 0%)',
    stagger: 0.1,
    ease: 'power2.inOut',
    duration: 0.70
  }, 0);

  if (bespokeForm) {
    tl.to(bespokeForm, {
      opacity: 1,
      y: 0,
      ease: 'power2.out',
      duration: 0.45
    }, 0.4);
  }
});

// Test scrollY = 3800 (the exact scroll from user screenshot 1!)
await page.evaluate(() => window.scrollTo(0, 3800));
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: 'test_fixed_gallery_3800.png' });

const check3800 = await page.evaluate(() => {
  const bespokeSlices = document.querySelectorAll('#bespoke .b-slice');
  const form = document.getElementById('bespoke-form');
  return {
    scrollY: window.scrollY,
    slice0Clip: bespokeSlices[0] ? window.getComputedStyle(bespokeSlices[0]).clipPath : null,
    formOpacity: form ? window.getComputedStyle(form).opacity : null
  };
});
console.log('Fixed at scrollY = 3800:', check3800);

// Test scrollY = 4536 (fully docked at bespoke)
await page.evaluate(() => window.scrollTo(0, 4536));
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: 'test_fixed_bespoke_docked.png' });

const check4536 = await page.evaluate(() => {
  const bespokeSlices = document.querySelectorAll('#bespoke .b-slice');
  const form = document.getElementById('bespoke-form');
  return {
    scrollY: window.scrollY,
    slice0Clip: bespokeSlices[0] ? window.getComputedStyle(bespokeSlices[0]).clipPath : null,
    formOpacity: form ? window.getComputedStyle(form).opacity : null
  };
});
console.log('Fixed at scrollY = 4536:', check4536);

await browser.close();
