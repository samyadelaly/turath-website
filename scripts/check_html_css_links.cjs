const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  const links = [...html.matchAll(/<link[^>]*rel=[\"']stylesheet[\"'][^>]*>/g)].map(m => m[0]);
  const hasStyleTag = html.includes('<style');
  console.log(f.padEnd(22), { linksCount: links.length, hasStyleTag, links: links.map(l => l.match(/href=[\"']([^\"']+)[\"']/)?.[1]) });
});
