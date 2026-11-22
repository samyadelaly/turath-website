import sharp from 'sharp';

async function checkOriginal() {
  const meta = await sharp('public/assets/images/bespoke-bg.jpg').metadata();
  console.log('bespoke-bg:', meta.width, meta.height);
}
checkOriginal();
