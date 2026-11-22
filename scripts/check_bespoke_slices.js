import sharp from 'sharp';

async function checkBespokeSlices() {
  const imgPath = 'public/assets/images/bespoke-bg-desktop.jpg';
  const meta = await sharp(imgPath).metadata();
  const w = meta.width;
  const h = meta.height;

  for (let s = 0; s < 3; s++) {
    const left = Math.floor(s * w / 3);
    const sliceW = Math.floor(w / 3);
    const buf = await sharp(imgPath).extract({ left, top: 0, width: sliceW, height: h }).raw().toBuffer();
    let sum = 0;
    for (let i = 0; i < buf.length; i += 3) sum += buf[i];
    console.log(`Slice ${s + 1} (left: ${left}): avg brightness = ${(sum / (buf.length / 3)).toFixed(1)}`);
  }
}
checkBespokeSlices();
