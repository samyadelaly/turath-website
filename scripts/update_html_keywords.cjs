const fs = require('fs');

const keywords = JSON.parse(fs.readFileSync('scripts/curated_keywords.json', 'utf8'));

// Build Arabic keywords string (clean, comma-separated)
const arKeywordsList = [
  // User's specific items & craft terms:
  "ورشة نحاس", "ورش تصنيع نحاس", "اكسسوارات نحاس", "روباسيه", "روباصيه", "repoussé", "خامه نحاس", "نحاس أصفر مصمت", "نحاس احمر", 
  "زوي نحاس", "زوايا نحاس", "علبه نحاس", "ماسوره نحاس", "كاونتر نحاس", "ابليك نحاس", "وحده اضاءه نحاس", "دفايه نحاس", "شوايه نحاس", 
  "كنكه نحاس", "سبرتايه نحاس", "سيلك نحاس", "سلك نحاس مجدول", "حرف u نحاس", "طبق نحاس", "الواح نحاس", "ترابيزه جانبيه نحاس", 
  "شرايح نحاس", "شرائح نحاس", "زاويه حرف L نحاس", "ارقام نحاس للفلل", "زينكوغراف", "حفر على النحاس", "نقش على النحاس", "نحاس منقوش", 
  "دوش نحاس", "حنفيه نحاس", "فواطه نحاس", "كوبايه نحاس", "كاسه نحاس", "كاسة نحاس", "فانوس نحاس", "لامبادير نحاس", "وش كهرباء نحاس", 
  "اوكره نحاس", "زرار نحاس", "خراطه نحاس", "بلص نحاس", "تقاوير نحاس", "عامود نحاس", "نجف سبك نحاس", "تماثيل نحاس", "شاور نحاس", 
  "خلاط نحاس", "قصريه زرع نحاس", "بوت نحاس",
  // High-intent strategic categories & locations:
  "تصنيع نحاس يدوي", "ورشة نحاس بالجمالية", "ورش نحاس خان الخليلي", "تشكيل نحاس عمولة", "مصنع نحاس في مصر", "تجليد حوائط نحاس", 
  "بانوهات نحاس جدارية", "قواطع بارتشن نحاس", "سبك نحاس رملي", "أكسدة وتعتيق النحاس أنتيك", "مرايا نحاس صالون", "كونسول نحاس رخام", 
  "درابزين سلالم نحاس", "مقابض ابواب قصور", "مغاسل نحاس للضيوف", "ثريات نحاس فخمة للمجالس", "تفصيل نحاس بالرياض", "شغل خان الخليلي بالرياض ودبي", 
  "سامي عادل", "ورشة تراث", "القاهرة التاريخية"
];

// Deduplicate
const arUnique = Array.from(new Set(arKeywordsList));
const arKeywordsStr = arUnique.join('، ');

// Build English/International keywords string
const enKeywordsList = [
  ...arUnique.slice(0, 25), // high-value Arabic anchors for regional searches
  "custom brass fabrication Cairo", "bespoke architectural metalwork", "handcrafted Egyptian brass chandeliers",
  "solid brass vanity mirrors", "sculptured brass console tables", "custom brass handrails", "artisanal door pulls",
  "Khan el-Khalili brass antiques", "brass repoussé and chasing", "brass fireplace screens", "brass counters and bars",
  "solid brass switch plates", "vintage exposed brass showers", "brass bathroom taps and faucets", "hand-hammered brass sinks",
  "sand-cast brass lighting", "brass inlay strips", "brass angle profiles", "brass Turkish coffee sets",
  "cast brass house numbers", "chemical brass etching zincography", "antique patina unlacquered brass",
  "artisanat d art egyptien", "luminaires en laiton massif martelé", "mobilier sur mesure laiton cuivre",
  "ferronnerie d art Le Caire", "dinanderie traditionnelle", "robinetterie laiton vintage"
];
const enKeywordsStr = Array.from(new Set(enKeywordsList)).join(', ');

console.log('Arabic keywords count:', arUnique.length);
console.log('English/International keywords count:', enKeywordsList.length);

// 1. Update ar.html
let arHtml = fs.readFileSync('ar.html', 'utf8');
const arMetaTarget = /<meta name="keywords" content="[^"]*">/;
if (arMetaTarget.test(arHtml)) {
  arHtml = arHtml.replace(arMetaTarget, `<meta name="keywords" content="${arKeywordsStr}">`);
  console.log('Updated meta keywords in ar.html');
}

// Update LocalBusiness JSON-LD in ar.html to include keywords array
const arLdTarget = /("@id":\s*"https:\/\/turath-egypt\.vercel\.app\/#organization",\s*"name":\s*"[^"]*",\s*"alternateName":\s*\[[\s\S]*?\],)/;
if (arLdTarget.test(arHtml) && !arHtml.includes('"keywords": [')) {
  const jsonKw = JSON.stringify(arUnique.slice(0, 30));
  arHtml = arHtml.replace(arLdTarget, `$1\n  "keywords": ${jsonKw},`);
  console.log('Added keywords array to LocalBusiness JSON-LD in ar.html');
}

fs.writeFileSync('ar.html', arHtml, 'utf8');

// 2. Update index.html
let enHtml = fs.readFileSync('index.html', 'utf8');
const enMetaTarget = /<meta name="keywords" content="[^"]*">/;
if (enMetaTarget.test(enHtml)) {
  enHtml = enHtml.replace(enMetaTarget, `<meta name="keywords" content="${enKeywordsStr}">`);
  console.log('Updated meta keywords in index.html');
}

if (arLdTarget.test(enHtml) && !enHtml.includes('"keywords": [')) {
  const jsonKwEn = JSON.stringify(enKeywordsList.slice(0, 30));
  enHtml = enHtml.replace(arLdTarget, `$1\n  "keywords": ${jsonKwEn},`);
  console.log('Added keywords array to LocalBusiness JSON-LD in index.html');
}

fs.writeFileSync('index.html', enHtml, 'utf8');

console.log('HTML files successfully updated!');
