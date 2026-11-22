import sharp from 'sharp';

async function samplePixels() {
  const buf = await sharp('public/assets/images/bespoke-bg-desktop.jpg').raw().toBuffer({ resolveWithObject: true });
  const w = buf.info.width;
  const h = buf.info.height;
  const data = buf.data;

  // Sample at x = 100, 200, 300, 400, 500 at y = 384 (middle)
  for (const x of [50, 150, 300, 450, 600, 750, 900, 1100]) {
    const idx = (384 * w + x) * 3;
    console.log(`x=${x}, y=384: R=${data[idx]}, G=${data[idx+1]}, B=${data[idx+2]}`);
  }
}
samplePixels();
