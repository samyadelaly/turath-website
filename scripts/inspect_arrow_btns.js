import fs from 'fs';

const arHtml = fs.readFileSync('ar.html', 'utf8');
const match1 = arHtml.match(/id="(track-prev-btn|track-next-btn|collections-prev-arrow|collections-next-arrow|slats-prev-btn|slats-next-btn)"[\s\S]*?>/g);
console.log('AR Buttons:', match1);

const indexHtml = fs.readFileSync('index.html', 'utf8');
const match2 = indexHtml.match(/id="(track-prev-btn|track-next-btn|collections-prev-arrow|collections-next-arrow|slats-prev-btn|slats-next-btn)"[\s\S]*?>/g);
console.log('EN Buttons:', match2);
