const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

// Read docx as zip
const filePath = 'C:/Users/SAM/Downloads/TURATH.docx';
if (fs.existsSync(filePath)) {
  console.log('TURATH.docx size:', fs.statSync(filePath).size);
} else {
  console.log('TURATH.docx does not exist');
}
