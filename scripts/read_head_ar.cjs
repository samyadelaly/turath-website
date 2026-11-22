const fs = require('fs');

const ar = fs.readFileSync('ar.html', 'utf8');

// Print head section of ar.html
const head = ar.slice(0, ar.indexOf('</head>'));
console.log(head.slice(0, 1500));
