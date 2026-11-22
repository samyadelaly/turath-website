const fs = require('fs');
const html = fs.readFileSync('ar.html', 'utf8');
const headEnd = html.indexOf('</head>');
console.log(html.substring(headEnd - 500, headEnd));
