import sharp from 'sharp';

async function inspectBespokeSrc() {
  const meta = await sharp('public/assets/images/bespoke-bg.jpg').metadata();
  console.log('bespoke-bg.jpg:', meta.width, meta.height);
}
inspectBespokeSrc();
