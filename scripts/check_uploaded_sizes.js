import fs from 'fs';

function getJpegSize(filePath) {
  const buffer = fs.readFileSync(filePath);
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xFF) break;
    const marker = buffer[offset + 1];
    if (marker === 0xC0 || marker === 0xC2) {
      const height = buffer.readUInt16BE(offset + 5);
      const width = buffer.readUInt16BE(offset + 7);
      return { width, height };
    }
    const len = buffer.readUInt16BE(offset + 2);
    offset += 2 + len;
  }
  return null;
}

const f1 = 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/.user_uploaded/media_1795325628321_fa3c180f.jpg';
const f2 = 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/.user_uploaded/media_1795325628155_31ccc115.jpg';

console.log('f1 (fa3c180f - artwork on right):', getJpegSize(f1));
console.log('f2 (31ccc115 - artwork on left):', getJpegSize(f2));
