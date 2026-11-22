import fs from 'fs';

const srcRight = 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/.user_uploaded/media_1795325628321_fa3c180f.jpg';
const srcLeft = 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/.user_uploaded/media_1795325628155_31ccc115.jpg';

const destRight = 'public/assets/images/turath_right_1376x768.jpg';
const destLeft = 'public/assets/images/turath_left_1376x768.jpg';

fs.copyFileSync(srcRight, destRight);
fs.copyFileSync(srcLeft, destLeft);

console.log('Copied right:', fs.statSync(destRight).size, 'bytes');
console.log('Copied left:', fs.statSync(destLeft).size, 'bytes');
