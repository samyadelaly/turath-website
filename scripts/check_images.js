import sharp from 'sharp';

async function check() {
  const p1 = 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/.user_uploaded/media_1795325628155_31ccc115.jpg';
  const p2 = 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/.user_uploaded/media_1795325628321_fa3c180f.jpg';
  const m1 = await sharp(p1).metadata();
  console.log('31ccc115:', m1.width, m1.height);
  const m2 = await sharp(p2).metadata();
  console.log('fa3c180f:', m2.width, m2.height);
}
check();
