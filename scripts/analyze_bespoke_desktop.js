import sharp from 'sharp';

async function analyzeBespokeDesktop() {
  const meta = await sharp('public/assets/images/bespoke-bg-desktop.jpg').metadata();
  console.log('bespoke-bg-desktop:', meta);
}
analyzeBespokeDesktop();
