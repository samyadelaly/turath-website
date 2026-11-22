import sharp from 'sharp';

const W = 602;
const H = 1080;

// Get uncompressed raw RGBA pixels of the resized plate image:
const plateAr = await sharp('public/assets/images/contact-bg.jpg')
  .resize(W, H)
  .flop()
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

// Feather the right edge (from x=450 to 602)
const fadeStart = 420;
const fadeWidth = W - fadeStart;

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (y * W + x) * 4;
    if (x >= fadeStart) {
      const p = (x - fadeStart) / fadeWidth;
      const alpha = Math.round(255 * (1 - p));
      plateAr.data[idx + 3] = alpha;
    }
  }
}

// Convert modified raw buffer back to PNG with alpha
const featheredArPng = await sharp(plateAr.data, {
  raw: { width: W, height: H, channels: 4 }
})
.png()
.toBuffer();

// Create base texture from contact-bg.jpg:
// We take the dark wall region (x: 0..250, y: 0..1024), resize to 1920x1080
const darkBase = await sharp('public/assets/images/contact-bg.jpg')
  .extract({ left: 0, top: 0, width: 250, height: 1024 })
  .resize(1920, 1080, { fit: 'fill' })
  .toBuffer();

// Composite Arabic:
await sharp(darkBase)
  .composite([
    { input: featheredArPng, left: 0, top: 0 }
  ])
  .jpeg({ quality: 92 })
  .toFile('public/assets/images/contact-bg-desktop-ar.jpg');

// For English:
const plateEn = await sharp('public/assets/images/contact-bg.jpg')
  .resize(W, H)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const idx = (y * W + x) * 4;
    if (x <= (W - fadeStart)) {
      const p = x / (W - fadeStart);
      const alpha = Math.round(255 * p);
      plateEn.data[idx + 3] = alpha;
    }
  }
}

const featheredEnPng = await sharp(plateEn.data, {
  raw: { width: W, height: H, channels: 4 }
})
.png()
.toBuffer();

await sharp(darkBase)
  .composite([
    { input: featheredEnPng, left: 1920 - W, top: 0 }
  ])
  .jpeg({ quality: 92 })
  .toFile('public/assets/images/contact-bg-desktop.jpg');

console.log('Successfully created beautiful clean desktop images!');
