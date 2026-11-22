import fs from 'fs';
import path from 'path';

const userDir = 'C:/Users/SAM/.gemini/antigravity/brain/4a138245-4728-4ee1-9f79-b3ec32249cff/.user_uploaded';
const files = fs.readdirSync(userDir)
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
  .map(f => {
    const stat = fs.statSync(path.join(userDir, f));
    return { name: f, size: stat.size, mtime: stat.mtime };
  })
  .sort((a, b) => b.mtime - a.mtime);

console.log(files.slice(0, 10));
