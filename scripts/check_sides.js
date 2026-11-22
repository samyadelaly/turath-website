import sharp from 'sharp';

async function checkSides(imgPath, label) {
  const img = sharp(imgPath);
  const meta = await img.metadata();
  const { width, height } = meta;
  
  // Sample left quarter and right quarter
  const leftBuf = await sharp(imgPath).extract({ left: 0, top: 0, width: Math.floor(width * 0.25), height }).raw().toBuffer();
  const rightBuf = await sharp(imgPath).extract({ left: Math.floor(width * 0.75), top: 0, width: Math.floor(width * 0.25), height }).raw().toBuffer();
  
  let leftSum = 0;
  for (let i = 0; i < leftBuf.length; i += 3) leftSum += leftBuf[i];
  let rightSum = 0;
  for (let i = 0; i < rightBuf.length; i += 3) rightSum += rightBuf[i];
  
  console.log(`${label} (${width}x${height}): leftAvg=${(leftSum / (leftBuf.length / 3)).toFixed(1)}, rightAvg=${(rightSum / (rightBuf.length / 3)).toFixed(1)}`);
}

async function main() {
  await checkSides('C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/.user_uploaded/media_1795325628155_31ccc115.jpg', '31ccc115');
  await checkSides('C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/.user_uploaded/media_1795325628321_fa3c180f.jpg', 'fa3c180f');
}
main();
