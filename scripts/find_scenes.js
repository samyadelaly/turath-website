import fs from 'fs';

const mainJs = fs.readFileSync('src/main.js', 'utf8');

function findFn(name) {
  const idx = mainJs.indexOf(`function ${name}`);
  if (idx !== -1) {
    console.log(`=== ${name} ===`);
    console.log(mainJs.slice(idx, idx + 1200));
  }
}

findFn('initScene05');
findFn('initScene06');
findFn('initScene07');
findFn('initFeaturedProducts');
