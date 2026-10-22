import puppeteer from 'puppeteer-core';

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle2' });

  const brainDir = 'C:\\Users\\SAM\\.gemini\\antigravity\\brain\\4a138245-4728-4ee1-9f79-b3ec32249cff';
  const fs = await import('fs');

  // 1. Mobile Menu Open
  await page.click('#menu-trigger');
  await new Promise(r => setTimeout(r, 800)); // wait for curtain transition
  await page.screenshot({ path: 'menu_mobile_open.png' });
  fs.copyFileSync('menu_mobile_open.png', `${brainDir}\\menu_mobile_open.png`);
  console.log('Menu mobile screenshot saved to menu_mobile_open.png');

  // Close menu
  await page.click('#menu-trigger');
  await new Promise(r => setTimeout(r, 600));

  // 2. Mobile Section 02 (Our Collections)
  await page.evaluate(() => {
    const el = document.getElementById('about');
    const header = document.querySelector('.site-header') || document.querySelector('header');
    const headerH = header ? header.offsetHeight : 58;
    const rect = el.getBoundingClientRect();
    window.scrollTo({ top: window.pageYOffset + rect.top - headerH, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'section02_collections_mobile.png' });
  fs.copyFileSync('section02_collections_mobile.png', `${brainDir}\\section02_collections_mobile.png`);
  console.log('Section 02 mobile screenshot saved to section02_collections_mobile.png');

  // Mobile Section 07 (Materials & Finishes)
  await page.evaluate(() => {
    const el = document.getElementById('materials-finishes');
    const header = document.querySelector('.site-header') || document.querySelector('header');
    const headerH = header ? header.offsetHeight : 58;
    if (el) {
      const rect = el.getBoundingClientRect();
      window.scrollTo({ top: window.pageYOffset + rect.top - headerH, behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'materials_stack_mobile.png' });
  fs.copyFileSync('materials_stack_mobile.png', `${brainDir}\\materials_stack_mobile.png`);
  console.log('Section 07 mobile screenshot saved to materials_stack_mobile.png');

  // Mobile Section 15 (Contact & Architectural Footer)
  await page.evaluate(() => {
    const el = document.getElementById('contact');
    const header = document.querySelector('.site-header') || document.querySelector('header');
    const headerH = header ? header.offsetHeight : 58;
    if (el) {
      const rect = el.getBoundingClientRect();
      window.scrollTo({ top: window.pageYOffset + rect.top - headerH, behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'contact_mobile.png' });
  fs.copyFileSync('contact_mobile.png', `${brainDir}\\contact_mobile.png`);
  console.log('Contact mobile screenshot saved to contact_mobile.png');

  // Mobile Section 15 - Lower Footer (Newsletter, Navigation & Watermark)
  await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'contact_footer_mobile.png' });
  fs.copyFileSync('contact_footer_mobile.png', `${brainDir}\\contact_footer_mobile.png`);
  console.log('Contact footer mobile screenshot saved to contact_footer_mobile.png');

  // 3. Desktop Viewport
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  
  // Desktop Menu Open
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));
  await page.click('#menu-trigger');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'menu_desktop_open.png' });
  fs.copyFileSync('menu_desktop_open.png', `${brainDir}\\menu_desktop_open.png`);
  console.log('Menu desktop screenshot saved to menu_desktop_open.png');

  // Close desktop menu
  await page.click('#menu-trigger');
  await new Promise(r => setTimeout(r, 600));

  // Desktop Section 02 (Our Collections)
  await page.evaluate(() => {
    const el = document.getElementById('about');
    const header = document.querySelector('.site-header') || document.querySelector('header');
    const headerH = header ? header.offsetHeight : 58;
    const rect = el.getBoundingClientRect();
    window.scrollTo({ top: window.pageYOffset + rect.top - headerH, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'section02_collections_desktop.png' });
  fs.copyFileSync('section02_collections_desktop.png', `${brainDir}\\section02_collections_desktop.png`);
  console.log('Section 02 desktop screenshot saved to section02_collections_desktop.png');

  // Desktop Section 07 (Materials & Finishes)
  await page.evaluate(() => {
    const el = document.getElementById('materials-finishes');
    const header = document.querySelector('.site-header') || document.querySelector('header');
    const headerH = header ? header.offsetHeight : 58;
    if (el) {
      const rect = el.getBoundingClientRect();
      window.scrollTo({ top: window.pageYOffset + rect.top - headerH, behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'materials_stack_desktop.png' });
  fs.copyFileSync('materials_stack_desktop.png', `${brainDir}\\materials_stack_desktop.png`);
  console.log('Section 07 desktop screenshot saved to materials_stack_desktop.png');

  // Desktop Section 15 (Contact & Architectural Footer)
  await page.evaluate(() => {
    const el = document.getElementById('contact');
    const header = document.querySelector('.site-header') || document.querySelector('header');
    const headerH = header ? header.offsetHeight : 58;
    if (el) {
      const rect = el.getBoundingClientRect();
      window.scrollTo({ top: window.pageYOffset + rect.top - headerH, behavior: 'instant' });
    }
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'contact_desktop.png' });
  fs.copyFileSync('contact_desktop.png', `${brainDir}\\contact_desktop.png`);
  console.log('Contact desktop screenshot saved to contact_desktop.png');

  // Verify social links in DOM
  const socialLinks = await page.evaluate(() => {
    const fb = document.querySelector('a[href="https://www.facebook.com/Egyptian.Turath"]');
    const ig = document.querySelector('a[href="https://www.instagram.com/turath_egypt"]');
    return {
      facebookHref: fb ? fb.href : null,
      facebookTarget: fb ? fb.target : null,
      instagramHref: ig ? ig.href : null,
      instagramTarget: ig ? ig.target : null
    };
  });
  console.log('Verified social links:', JSON.stringify(socialLinks));

  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
