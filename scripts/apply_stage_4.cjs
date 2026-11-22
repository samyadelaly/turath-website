const fs = require('fs');

const subpages = [
  'action-ar.html', 'action.html',
  'lighting-ar.html', 'lighting.html',
  'mirrors-ar.html', 'mirrors.html',
  'tables-ar.html', 'tables.html',
  'handles-ar.html', 'handles.html',
  'handrails-ar.html', 'handrails.html',
  'decor-ar.html', 'decor.html',
  'wall-art-ar.html', 'wall-art.html',
  'partitions-ar.html', 'partitions.html',
  'tableware-ar.html', 'tableware.html',
  'masterpieces-ar.html', 'masterpieces.html'
];

// 1. Add Geolocation Tags to all subpages if missing
const geoSnippet = `  <!-- Geographic & Local Search Meta Tags -->
  <meta name="geo.region" content="EG-C">
  <meta name="geo.placename" content="Cairo, Bab El-Nasr, El-Gamaliya">
  <meta name="geo.position" content="30.0511;31.2622">
  <meta name="ICBM" content="30.0511, 31.2622">\n`;

subpages.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('name="geo.region"')) {
    // Insert right before <title>
    content = content.replace(/(<title>)/i, geoSnippet + '  $1');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`[GEO ADDED] ${file}`);
  } else {
    console.log(`[GEO ALREADY EXISTS] ${file}`);
  }
});

// 2. Enrich LocalBusiness Schema in ar.html and index.html
['ar.html', 'index.html'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const match = content.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/);
  if (match) {
    let json = JSON.parse(match[1]);
    
    // Add hasMap
    json.hasMap = "https://www.google.com/maps/search/?api=1&query=30.0511,31.2622";
    
    // Add contactPoint
    json.contactPoint = [
      {
        "@type": "ContactPoint",
        "telephone": "+201016771010",
        "contactType": "sales",
        "email": "Turath.egypt@gmail.com",
        "areaServed": ["EG", "SA", "AE", "KW", "QA", "US", "GB"],
        "availableLanguage": ["Arabic", "English", "French"],
        "contactOption": "TollFree"
      }
    ];

    const replacement = `<script type="application/ld+json">\n${JSON.stringify(json, null, 2)}\n  </script>`;
    content = content.replace(/<script type=\"application\/ld\+json\">[\s\S]*?<\/script>/, replacement);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`[SCHEMA LOCAL BUSINESS ENRICHED] ${file}`);
  }
});

// 3. Expand Speculation Rules API list for 0ms prerendering across all subpages
const allSubpageUrls = [
  "/", "/ar.html",
  "/lighting.html", "/lighting-ar.html",
  "/mirrors.html", "/mirrors-ar.html",
  "/tables.html", "/tables-ar.html",
  "/handles.html", "/handles-ar.html",
  "/handrails.html", "/handrails-ar.html",
  "/decor.html", "/decor-ar.html",
  "/wall-art.html", "/wall-art-ar.html",
  "/partitions.html", "/partitions-ar.html",
  "/tableware.html", "/tableware-ar.html",
  "/masterpieces.html", "/masterpieces-ar.html",
  "/action.html", "/action-ar.html"
];

const newSpeculationScript = `<script type="speculationrules">
  {
    "prerender": [
      {
        "source": "list",
        "urls": ${JSON.stringify(allSubpageUrls)}
      }
    ],
    "prefetch": [
      {
        "source": "document",
        "where": { "and": [{ "href_matches": "/*" }] },
        "eagerness": "moderate"
      }
    ]
  }
  </script>`;

['ar.html', 'index.html', ...subpages].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('type="speculationrules"')) {
    content = content.replace(/<script type=\"speculationrules\">[\s\S]*?<\/script>/, newSpeculationScript);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`[SPECULATION RULES UPDATED] ${file}`);
  }
});

console.log('\nStage 4 script executed successfully!');
