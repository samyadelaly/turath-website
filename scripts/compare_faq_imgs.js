import fs from 'fs';

const f1 = fs.readFileSync('public/assets/images/turath_left_1376x768.jpg');
const f2 = fs.readFileSync('C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/.user_uploaded/media_1795325628155_31ccc115.jpg');

console.log('turath_left length:', f1.length);
console.log('uploaded 31ccc115 length:', f2.length);
console.log('Buffer equals?', f1.equals(f2));

const r1 = fs.readFileSync('public/assets/images/turath_right_1376x768.jpg');
const r2 = fs.readFileSync('C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/.user_uploaded/media_1795325628321_fa3c180f.jpg');
console.log('turath_right length:', r1.length);
console.log('uploaded fa3c180f length:', r2.length);
console.log('Buffer equals?', r1.equals(r2));
