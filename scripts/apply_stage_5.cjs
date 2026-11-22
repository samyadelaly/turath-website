const fs = require('fs');

const categoriesData = [
  {
    key: 'lighting',
    arFile: 'lighting-ar.html',
    enFile: 'lighting.html',
    arCategoryName: 'وحدات إضاءة وثريات نحاسية',
    enCategoryName: 'Lighting Fixtures',
    arFaq: [
      {
        q: 'هل تصنع ورشة تراث ثريات ونجف نحاس عمولة حسب المقاس والتصميم المعماري؟',
        a: 'نعم، نقوم بتصنيع وتشكيل ثريات ونجف النحاس الأصفر والأحمر يدوياً بالسباكة الرملية والتخريم المعماري للمساجد والقصور والفلل والفنادق وفق أي مقاسات ومخططات هندسية معتمدة.'
      },
      {
        q: 'ما هي سبائك النحاس المستخدمة في وحدات الإضاءة والأباليك؟',
        a: 'نستخدم النحاس الأصفر المصمت عالي النقاء (CuZn40) والنحاس الأحمر النقي بنسبة 99.9%، مع معالجة بطبقات حماية عازلة أو تعتيق أنتيك باتينا دائم.'
      },
      {
        q: 'هل تتوفر خدمة الشحن والتوريد لمنتجات الإضاءة إلى دول الخليج؟',
        a: 'نعم، نقوم بالتجهيز والتغليف الآمن وشحن وحدات الإضاءة والنجف من القاهرة التاريخية إلى الرياض، جدة، دبي، أبوظبي، الدوحة، الكويت وكافة دول العالم.'
      }
    ],
    enFaq: [
      {
        q: 'Does TURATH fabricate bespoke brass chandeliers to custom architectural dimensions?',
        a: 'Yes, we custom-craft solid brass and copper chandeliers, lanterns, and wall sconces via traditional sand-casting and piercing for mosques, luxury villas, and hotels worldwide.'
      },
      {
        q: 'What metal alloys are used in TURATH lighting fixtures?',
        a: 'We use high-purity solid brass (CuZn40) and 99.9% pure red copper, treated with protective clear lacquer or hand-applied antique oxidation patina.'
      },
      {
        q: 'Does TURATH ship handcrafted lighting to Saudi Arabia, UAE, and internationally?',
        a: 'Yes, we provide export-grade crating and international shipping from Historic Cairo directly to Riyadh, Jeddah, Dubai, Abu Dhabi, Doha, Kuwait, and worldwide.'
      }
    ]
  },
  {
    key: 'mirrors',
    arFile: 'mirrors-ar.html',
    enFile: 'mirrors.html',
    arCategoryName: 'مرايا نحاسية فاخرة',
    enCategoryName: 'Bespoke Mirrors',
    arFaq: [
      {
        q: 'هل تصنع ورشة تراث إطارات مرايا نحاس مفرغة بمقاسات مخصصة للمجالس والمغاسل؟',
        a: 'نعم، يتم تفصيل إطارات المرايا النحاسية يدوياً بالنقش والتفريغ والسباكة بجميع المقاسات الهندسية للمجالس الفخمة ومغاسل الضيوف والقصور.'
      },
      {
        q: 'كيف تتم معالجة مرايا النحاس لحمايتها من الرطوبة والأكسدة في الحمامات؟',
        a: 'يتم تطبيق طبقات حماية شفافة عازلة ومقاومة للرطوبة والبخار (Clear Protective Lacquer) تمنع تغير لون النحاس وتحافظ على بريقه الدائم.'
      },
      {
        q: 'هل يمكن تنفيذ مرايا نحاس بتصميمات إسلامية أو مودرن حسب الطلب؟',
        a: 'نعم، ننفذ كافة النقوش الهندسية الإسلامية المخرمة، والتصميمات النباتية، والأطر المودرن الانسيابية المشغولة يدوياً.'
      }
    ],
    enFaq: [
      {
        q: 'Does TURATH manufacture custom-dimension filigree and pierced brass mirrors?',
        a: 'Yes, all brass mirror frames are hand-chiseled, pierced, and cast to exact project specifications for luxury vanity areas, guest powder rooms, and royal majlis.'
      },
      {
        q: 'How are brass mirrors protected against bathroom humidity and oxidation?',
        a: 'All frames receive protective moisture-resistant sealant coats or specialized patina stabilization, ensuring long-lasting durability in humid spaces.'
      },
      {
        q: 'Can TURATH craft modern and Islamic brass mirror designs to order?',
        a: 'Yes, we execute intricate Islamic geometric star latticework, botanical reliefs, and sleek contemporary silhouettes.'
      }
    ]
  },
  {
    key: 'tables',
    arFile: 'tables-ar.html',
    enFile: 'tables.html',
    arCategoryName: 'طاولات وكونسول نحاسي',
    enCategoryName: 'Tables & Consoles',
    arFaq: [
      {
        q: 'هل تصنع ورشة تراث كونسول وطاولات نحاس مسبوك بالكامل مع أسطح رخام؟',
        a: 'نعم، نقوم بسبك أرجل وقواعد الكونسول والطاولات من النحاس الأصفر المصمت الثقيل مع تجهيزها لتحمل أسطح الرخام الطبيعي والزجاج الفاخر.'
      },
      {
        q: 'هل يمكن تنفيذ كونسول فروع شجر أو أشكال عضوية من مخططات معمارية؟',
        a: 'نعم، نتخصص في التشكيل والنحت اليدوي لقواعد الكونسول العضوية كأغصان الشجر والكتل المنحوتة المسبوكة بالرمل واللحام الدقيق.'
      }
    ],
    enFaq: [
      {
        q: 'Does TURATH fabricate heavy solid cast brass console tables and coffee tables?',
        a: 'Yes, we sand-cast solid brass table bases and structural legs engineered to support heavy natural marble and glass tops.'
      },
      {
        q: 'Can TURATH produce organic tree-branch consoles from architectural drawings?',
        a: 'Yes, our master craftsmen sculpt and cast organic brass branch consoles and fluid silhouettes according to architectural specs and 3D models.'
      }
    ]
  },
  {
    key: 'handles',
    arFile: 'handles-ar.html',
    enFile: 'handles.html',
    arCategoryName: 'مقابض أبواب نحاسية',
    enCategoryName: 'Bespoke Handles & Hardware',
    arFaq: [
      {
        q: 'هل تصنع ورشة تراث مقابض أبواب قصور وفلل من النحاس المصمت المسبوك؟',
        a: 'نعم، نصنع مقابض أبواب رئيسية وداخلية بطول يصل إلى مترين وأكثر بأسلوب السباكة الرملية والنقش اليدوي البارز.'
      },
      {
        q: 'هل تتوافق مقابض النحاس مع الأبواب الخشبية والزجاجية والمصفحة؟',
        a: 'نعم، نزود كافة المقابض بأنظمة تثبيت ميكانيكية متوافقة مع الأبواب الخشبية الضخمة، والواجهات الزجاجية، والأبواب المصفحة.'
      }
    ],
    enFaq: [
      {
        q: 'Does TURATH manufacture heavy-duty cast brass door pulls for palaces and villas?',
        a: 'Yes, we sand-cast monumental solid brass entrance door pulls and hardware up to 2 meters in length with custom artisanal textures.'
      },
      {
        q: 'Are TURATH brass handles compatible with wood, glass, and security doors?',
        a: 'Yes, all pulls come with precision mounting hardware tailored for heavy timber doors, tempered glass entryways, and armored pivot doors.'
      }
    ]
  },
  {
    key: 'handrails',
    arFile: 'handrails-ar.html',
    enFile: 'handrails.html',
    arCategoryName: 'درابزين سلالم وكوبستات نحاس',
    enCategoryName: 'Handrails & Balustrades',
    arFaq: [
      {
        q: 'هل تصنع ورشة تراث درابزين سلالم وكوبستات نحاس معمارية مفرغة للفلل؟',
        a: 'نعم، نصنع درابزين السلالم والبالوسترات من قطاعات النحاس الأصفر المصمت مع الزخارف المخرمة والمطروقة يدوياً.'
      }
    ],
    enFaq: [
      {
        q: 'Does TURATH manufacture architectural solid brass balustrades and staircase handrails?',
        a: 'Yes, we forge and fabricate bespoke solid brass staircase railings, balusters, and curved handrails for luxury residences and hotels.'
      }
    ]
  },
  {
    key: 'decor',
    arFile: 'decor-ar.html',
    enFile: 'decor.html',
    arCategoryName: 'تحف وصواني ديكور نحاسية',
    enCategoryName: 'Luxury Metal Decor',
    arFaq: [
      {
        q: 'هل تتوفر صواني وأطباق جدارية نحاسية منقوشة يدوياً بكتابات عربية وزخارف إسلامية؟',
        a: 'نعم، يتم نقش وتفريغ الصواني والأطباق الجدارية يدوياً بأيدي أمهر حرفيي القاهرة التاريخية بزخارف هندسية وخطوط عربية أصيلة.'
      }
    ],
    enFaq: [
      {
        q: 'Does TURATH craft hand-etched brass wall chargers and decorative plates with Arabic calligraphy?',
        a: 'Yes, each plate and charger is individually hand-etched and chiseled with authentic Islamic geometric patterns and Arabic calligraphy.'
      }
    ]
  },
  {
    key: 'wall-art',
    arFile: 'wall-art-ar.html',
    enFile: 'wall-art.html',
    arCategoryName: 'لوحات جدارية وتجاليد نحاس',
    enCategoryName: 'Solid Brass Wall Art',
    arFaq: [
      {
        q: 'هل تنفذ ورشة تراث تجليد حوائط وبانوهات جدارية من النحاس المطروق؟',
        a: 'نعم، ننفذ تجاليد جدارية معمارية وبانوهات ريبوسيه بارزة من النحاس الأصفر والأحمر بأحجام مخصصة للقصور والفنادق.'
      }
    ],
    enFaq: [
      {
        q: 'Does TURATH produce custom hammered brass and copper wall cladding panels?',
        a: 'Yes, we fabricate large-scale architectural wall cladding and repoussé relief panels in solid brass and copper for luxury interiors.'
      }
    ]
  },
  {
    key: 'partitions',
    arFile: 'partitions-ar.html',
    enFile: 'partitions.html',
    arCategoryName: 'قواطع وبارتشن نحاس معماري',
    enCategoryName: 'Bespoke Partitions & Screens',
    arFaq: [
      {
        q: 'هل تصنع ورشة تراث قواطع وبارتشن نحاس مفرغ كلاسيك ومودرن؟',
        a: 'نعم، نصنع فواصل وقواطع معمارية مفرغة يدوياً وبالليزر من قطاعات النحاس الأصفر المصمت لتقسيم المساحات بفخامة.'
      }
    ],
    enFaq: [
      {
        q: 'Does TURATH craft bespoke pierced and laser-cut brass architectural partitions?',
        a: 'Yes, we engineer freestanding and ceiling-mounted solid brass screens and partitions with custom geometric and arabesque latticework.'
      }
    ]
  },
  {
    key: 'tableware',
    arFile: 'tableware-ar.html',
    enFile: 'tableware.html',
    arCategoryName: 'أدوات مائدة وأواني ضيافة نحاسية',
    enCategoryName: 'Luxury Tableware',
    arFaq: [
      {
        q: 'هل تتوفر أطقم ضيافة وأواني نحاسية وسخانات بوفيه مصنعة يدوياً؟',
        a: 'نعم، نصنع أطقم القهوة، الكنك، السبرتايات، أواني التقديم، وسخانات الضيافة الفندقية من النحاس الأصفر والأحمر المشغول يدوياً.'
      }
    ],
    enFaq: [
      {
        q: 'Does TURATH produce luxury brass and copper hospitality tableware and chafing dishes?',
        a: 'Yes, we handcraft traditional Turkish coffee sets, chafing dishes, and sculptural serving hollowware for premium hospitality venues.'
      }
    ]
  },
  {
    key: 'masterpieces',
    arFile: 'masterpieces-ar.html',
    enFile: 'masterpieces.html',
    arCategoryName: 'روائع ومشغولات نحاسية نادرة',
    enCategoryName: 'Bespoke Masterpieces',
    arFaq: [
      {
        q: 'ما هي قطع الروائع والتحف النادرة في ورشة تراث؟',
        a: 'هي مجسمات ومنحوتات ومصنوعات نحاسية فريدة يتم تنفيذها يدوياً كأعمال فنية معمارية مخصصة ذات طابع استثنائي للقصور والمشاريع الكبرى.'
      }
    ],
    enFaq: [
      {
        q: 'What characterizes TURATH bespoke masterpieces and sculptural metalwork?',
        a: 'They represent monumental, one-of-a-kind art bronzes, animal sculptures, and complex custom metal architecture handcrafted for prestigious projects.'
      }
    ]
  }
];

// Process each category
categoriesData.forEach(cat => {
  // 1. Process Arabic File
  let arContent = fs.readFileSync(cat.arFile, 'utf8');
  const arMatch = arContent.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/);
  if (arMatch) {
    let json = JSON.parse(arMatch[1]);
    
    // Fix Breadcrumb to Arabic
    let breadcrumb = json['@graph'].find(i => i['@type'] === 'BreadcrumbList');
    if (breadcrumb) {
      breadcrumb.itemListElement = [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "الرئيسية | تراث مصر",
          "item": "https://turath-egypt.vercel.app/ar.html"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": cat.arCategoryName,
          "item": `https://turath-egypt.vercel.app/${cat.arFile}`
        }
      ];
    }
    
    // Remove existing FAQPage if any
    json['@graph'] = json['@graph'].filter(i => i['@type'] !== 'FAQPage');
    
    // Add Category FAQPage
    const faqObj = {
      "@type": "FAQPage",
      "mainEntity": cat.arFaq.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    };
    json['@graph'].push(faqObj);
    
    const replacement = `<script type="application/ld+json">\n${JSON.stringify(json, null, 2)}\n  </script>`;
    arContent = arContent.replace(/<script type=\"application\/ld\+json\">[\s\S]*?<\/script>/, replacement);
    fs.writeFileSync(cat.arFile, arContent, 'utf8');
    console.log(`[ENRICHED AR] ${cat.arFile} (Arabic Breadcrumbs + ${cat.arFaq.length} FAQs)`);
  }

  // 2. Process English File
  let enContent = fs.readFileSync(cat.enFile, 'utf8');
  const enMatch = enContent.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/);
  if (enMatch) {
    let json = JSON.parse(enMatch[1]);
    
    // Verify Breadcrumb
    let breadcrumb = json['@graph'].find(i => i['@type'] === 'BreadcrumbList');
    if (breadcrumb) {
      breadcrumb.itemListElement = [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "TURATH Home",
          "item": "https://turath-egypt.vercel.app/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": cat.enCategoryName,
          "item": `https://turath-egypt.vercel.app/${cat.enFile}`
        }
      ];
    }
    
    // Remove existing FAQPage if any
    json['@graph'] = json['@graph'].filter(i => i['@type'] !== 'FAQPage');
    
    // Add Category FAQPage
    const faqObj = {
      "@type": "FAQPage",
      "mainEntity": cat.enFaq.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    };
    json['@graph'].push(faqObj);
    
    const replacement = `<script type="application/ld+json">\n${JSON.stringify(json, null, 2)}\n  </script>`;
    enContent = enContent.replace(/<script type=\"application\/ld\+json\">[\s\S]*?<\/script>/, replacement);
    fs.writeFileSync(cat.enFile, enContent, 'utf8');
    console.log(`[ENRICHED EN] ${cat.enFile} (English Breadcrumbs + ${cat.enFaq.length} FAQs)`);
  }
});

// Also fix action-ar.html breadcrumb
let actionArContent = fs.readFileSync('action-ar.html', 'utf8');
const actionMatch = actionArContent.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/);
if (actionMatch) {
  let json = JSON.parse(actionMatch[1]);
  let breadcrumb = json['@graph'].find(i => i['@type'] === 'BreadcrumbList');
  if (breadcrumb) {
    breadcrumb.itemListElement = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "الرئيسية | تراث مصر",
        "item": "https://turath-egypt.vercel.app/ar.html"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "حرفية النحاس في ورش تراث التاريخية",
        "item": "https://turath-egypt.vercel.app/action-ar.html"
      }
    ];
    const replacement = `<script type="application/ld+json">\n${JSON.stringify(json, null, 2)}\n  </script>`;
    actionArContent = actionArContent.replace(/<script type=\"application\/ld\+json\">[\s\S]*?<\/script>/, replacement);
    fs.writeFileSync('action-ar.html', actionArContent, 'utf8');
    console.log('[ENRICHED AR] action-ar.html (Arabic Breadcrumbs)');
  }
}

console.log('\nStage 5 execution finished successfully!');
