import fs from 'fs';

let css = fs.readFileSync('src/style.css', 'utf8');

// 1. Replace #bespoke background-color: #050505 !important;
const target1 = `  #bespoke {
    background-color: #050505 !important;
  }`;

const replacement1 = `  #bespoke,
  .custom-order-section {
    background-color: transparent !important;
    background: transparent !important;
  }`;

if (css.includes(target1)) {
  css = css.replace(target1, replacement1);
  console.log('Replaced bespoke background in media query');
} else {
  console.log('target1 not found directly, checking variations...');
  css = css.replace(/#bespoke\s*\{\s*background-color:\s*#050505\s*!important;\s*\}/g, replacement1);
}

// 2. Add base rule for #bespoke transparency
const target2 = `#bespoke {
  position: relative;
  z-index: 40;
  overflow: hidden;
}`;

const replacement2 = `#bespoke,
.custom-order-section {
  position: relative;
  z-index: 40;
  overflow: hidden;
  background-color: transparent !important;
  background: transparent !important;
}`;

if (css.includes(target2)) {
  css = css.replace(target2, replacement2);
  console.log('Replaced base #bespoke rule');
} else {
  console.log('target2 not found directly');
}

fs.writeFileSync('src/style.css', css, 'utf8');
console.log('Updated src/style.css successfully');
