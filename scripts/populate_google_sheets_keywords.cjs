const fs = require('fs');
const { execSync } = require('child_process');

const keywords = JSON.parse(fs.readFileSync('scripts/curated_keywords.json', 'utf8'));

// Format rows:
// Row 1: Header
// Rows 2..N: Data
const rows = [
  ['Keyword', 'Market', 'Language', 'Category', 'English_Equivalent', 'French_Equivalent', 'Added_Date']
];

keywords.forEach(item => {
  rows.push([
    item.ar,
    item.market,
    'ar',
    item.category,
    item.en,
    item.fr,
    '2026-11-22'
  ]);
});

// Also add English rows for any automated workflows querying Language == 'en'
keywords.forEach(item => {
  rows.push([
    item.en,
    item.market,
    'en',
    item.category,
    item.ar,
    item.fr,
    '2026-11-22'
  ]);
});

console.log('Total rows to write:', rows.length);

// Escape function for gsheets CLI format (commas become \, and pipes become \|)
const escapeCell = (val) => {
  if (val === undefined || val === null) return '';
  return String(val).replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/\|/g, '\\|').replace(/\n/g, ' ');
};

// Process in chunks of 25 rows to avoid CLI argument length limitations
const chunkSize = 25;
const spreadsheetId = '16vvR6FtXNnwL9kzPC5jcEVUA2PzCfcXFHWgxveshC_Q';

for (let i = 0; i < rows.length; i += chunkSize) {
  const chunk = rows.slice(i, i + chunkSize);
  const startRow = i + 1;
  const endRow = i + chunk.length;
  const range = `'SEO_Keywords'!A${startRow}:G${endRow}`;
  
  const payload = chunk.map(r => r.map(escapeCell).join(',')).join('|');
  
  console.log(`Writing rows ${startRow} to ${endRow}...`);
  const cmd = `gsheets mutate write ${spreadsheetId} "${range}" "${payload}"`;
  
  execSync(cmd, {
    env: { ...process.env, AGY_ACCOUNT: 'turath.egypt@gmail.com' },
    stdio: 'inherit'
  });
}

console.log('Successfully written all keywords to Google Sheets!');
