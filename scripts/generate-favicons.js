import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateFavicons() {
  const src = 'public/turath-brand-logo.jpg';
  
  console.log('Generating favicons from', src);

  // Create 512x512 master square with black background
  // Give it a tiny 5% padding so the logo doesn't touch the borders when rounded by OS
  const master512 = await sharp(src)
    .resize(460, 460, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 1 }
    })
    .extend({
      top: 26,
      bottom: 26,
      left: 26,
      right: 26,
      background: { r: 0, g: 0, b: 0, alpha: 1 }
    })
    .png()
    .toBuffer();

  await sharp(master512).resize(512, 512).png().toFile('public/android-chrome-512x512.png');
  await sharp(master512).resize(192, 192).png().toFile('public/android-chrome-192x192.png');
  await sharp(master512).resize(180, 180).png().toFile('public/apple-touch-icon.png');
  await sharp(master512).resize(32, 32).png().toFile('public/favicon-32x32.png');
  await sharp(master512).resize(16, 16).png().toFile('public/favicon-16x16.png');
  await sharp(master512).resize(32, 32).png().toFile('public/favicon.ico');
  
  console.log('All favicons generated successfully!');
}

generateFavicons().catch(err => {
  console.error(err);
  process.exit(1);
});
