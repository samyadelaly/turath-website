import sharp from 'sharp';

async function checkBespoke() {
  const meta = await sharp('public/assets/images/bespoke-bg-desktop.jpg').metadata();
  console.log('bespoke-bg-desktop:', meta.width, meta.height);
}
checkBespoke();
