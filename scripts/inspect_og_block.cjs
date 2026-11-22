const fs = require('fs');

const content = fs.readFileSync('lighting-ar.html', 'utf8');
const head = content.slice(0, content.indexOf('</head>'));
const ogStart = head.indexOf('og:type');
if (ogStart !== -1) {
  console.log(head.slice(ogStart - 50, ogStart + 500));
}
