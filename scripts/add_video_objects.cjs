const fs = require('fs');

function updateFile(filePath, isArabic) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Extract filmsData
  const matchFilms = content.match(/const filmsData = (\[[\s\S]*?\]);/);
  if (!matchFilms) {
    console.error('No filmsData in', filePath);
    return;
  }
  const films = eval(matchFilms[1]);
  
  // Extract JSON-LD script
  const jsonLdMatch = content.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/);
  if (!jsonLdMatch) {
    console.error('No JSON-LD in', filePath);
    return;
  }
  
  const parsed = JSON.parse(jsonLdMatch[1]);
  if (!parsed['@graph']) {
    console.error('No @graph in', filePath);
    return;
  }
  
  // Remove any existing VideoObject from @graph to avoid duplicate
  parsed['@graph'] = parsed['@graph'].filter(item => item['@type'] !== 'VideoObject');
  
  // Add VideoObject for each film
  films.forEach((f, idx) => {
    const pageUrl = isArabic ? 'action-ar.html' : 'action.html';
    const videoObj = {
      "@type": "VideoObject",
      "name": f.title,
      "description": f.desc || (isArabic ? `${f.title} داخل ورش تراث لتصنيع وتشكيل النحاس في القاهرة التاريخية.` : `${f.title} inside Turath handcrafted brass atelier in Historic Cairo.`),
      "thumbnailUrl": `https://turath-egypt.vercel.app${f.poster}`,
      "uploadDate": "2026-08-01T12:00:00+02:00",
      "contentUrl": `https://turath-egypt.vercel.app${f.src}`,
      "embedUrl": `https://turath-egypt.vercel.app/${pageUrl}?film=${idx}`
    };
    parsed['@graph'].push(videoObj);
  });
  
  const formattedJson = JSON.stringify(parsed, null, 2);
  const replacement = `<script type="application/ld+json">\n${formattedJson}\n  </script>`;
  
  content = content.replace(/<script type=\"application\/ld\+json\">[\s\S]*?<\/script>/, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath} with ${films.length} VideoObjects in @graph`);
}

updateFile('action-ar.html', true);
updateFile('action.html', false);
