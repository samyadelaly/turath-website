import sharp from 'sharp';

async function inspectBespokeBg() {
  const meta = await sharp('public/assets/images/bespoke-bg-desktop.jpg').metadata();
  console.log('width:', meta.width, 'height:', meta.height);

  // Check left half vs right half
  const leftBuf = await sharp('public/assets/images/bespoke-bg-desktop.jpg')
    .extract({ left: 0, top: 0, width: Math.floor(meta.width / 2), height: meta.height })
    .raw()
    .toBuffer();

  const rightBuf = await sharp('public/assets/images/bespoke-bg-desktop.jpg')
    .extract({ left: Math.floor(meta.width / 2), top: 0, width: Math.floor(meta.width / 2), height: meta.height })
    .raw()
    .toBuffer();

  let leftAvg = 0;
  for (let i = 0; i < leftBuf.length; i += 3) leftAvg += leftBuf[i];
  leftAvg /= (leftBuf.length / 3);

  let rightAvg = 0;
  for (let i = 0; i < rightBuf.length; i += 3) rightAvg += rightBuf[i];
  rightAvg /= (rightBuf.length / 3);

  console.log(`Left half avg brightness: ${leftAvg.toFixed(1)}, Right half avg brightness: ${rightAvg.toFixed(1)}`);
}
inspectBespokeBg();
