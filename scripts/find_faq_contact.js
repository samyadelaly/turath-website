import fs from 'fs';

const content = fs.readFileSync('src/main.js', 'utf8');
const lines = content.split('\n');

// Find where FAQ and Contact ScrollTriggers are created
lines.forEach((line, i) => {
  if (line.includes('initFAQ') || line.includes('initFaq') || line.includes('initContact') || line.includes('#faq') || line.includes('#contact')) {
    console.log((i+1) + ': ' + line);
  }
});
