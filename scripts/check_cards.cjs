const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const arHtml = fs.readFileSync('ar.html', 'utf8');

const getCards = (html) => {
  const cards = [];
  const regex = /<div class="collection-card[^>]*>[\s\S]*?<\/div>\s*<\/div>/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    cards.push(match[0]);
  }
  return cards;
};

const indexCards = getCards(indexHtml);
const arCards = getCards(arHtml);

console.log('Index cards count:', indexCards.length);
console.log('AR cards count:', arCards.length);

arCards.forEach((c, i) => {
  const onclickMatch = c.match(/onclick="([^"]+)"/);
  const titleMatch = c.match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
  console.log(`Card ${i + 1}:`, onclickMatch ? onclickMatch[1] : 'no onclick', '| Title:', titleMatch ? titleMatch[1].trim() : 'no title');
});
