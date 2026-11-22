const fs = require('fs');

const arHtml = fs.readFileSync('ar.html', 'utf8');

const arCards = [
  {
    num: '01',
    title: 'مجموعة الإضاءة',
    desc: 'ثريات ومصابيح وفوانيس نحاسية يدوية الصنع مصبوبة من النحاس المصري الخالص.',
    img: '/assets/images/lighting-02.jpg',
    alt: 'وحدات إضاءة وثريات نحاسية فاخرة | ورشة تراث مصر',
    url: '/lighting-ar.html'
  },
  {
    num: '02',
    title: 'المرايا النحاسية',
    desc: 'مرايا جدارية بإطارات نحاسية معتقة ومحفورة يدوياً بدقة وتفاصيل معمارية راقية.',
    img: '/assets/images/brass-mirrors-01.jpg',
    alt: 'مرايا نحاسية يدوية الصنع بتصاميم فنية فريدة | ورشة تراث مصر',
    url: '/mirrors-ar.html'
  },
  {
    num: '03',
    title: 'طاولات وكونسول',
    desc: 'طاولات قهوة وكونسول فاخرة من النحاس المصبوب مع الرخام الطبيعي والزجاج.',
    img: '/assets/images/tables-consoles-04.jpg',
    alt: 'طاولات وكونسول نحاسي مصبوب ومنحوت يدوياً | ورشة تراث مصر',
    url: '/tables-ar.html'
  },
  {
    num: '04',
    title: 'مقابض الأبواب النحاسية',
    desc: 'مقابض سحب وأقفال أبواب مصبوبة يدوياً بتشطيبات برونزية وذهبية فاخرة.',
    img: '/assets/images/handles-card-hero.jpg',
    alt: 'مقابض أبواب نحاسية فاخرة مصبوبة يدوياً | ورشة تراث مصر',
    url: '/handles-ar.html'
  },
  {
    num: '05',
    title: 'درابزين السلالم النحاسي',
    desc: 'درابزينات سلالم هندسية وزخرفية مصنوعة يدوياً للقصور والفلل والمشاريع الراقية.',
    img: '/assets/images/handrails-05.jpg',
    alt: 'درابزين سلالم نحاسي فاخر بتصاميم هندسية دقيقة | ورشة تراث مصر',
    url: '/handrails-ar.html'
  },
  {
    num: '06',
    title: 'القطع الديكورية والتحف',
    desc: 'تحف ومجسمات فنية وإكسسوارات معمارية مصبوبة يدوياً من النحاس الأصفر والأحمر.',
    img: '/assets/images/decor-accessories-06.jpg',
    alt: 'تحف ومجسمات ديكورية فاخرة من النحاس الخالص | ورشة تراث مصر',
    url: '/decor-ar.html'
  },
  {
    num: '07',
    title: 'لوحات الحائط النحاسية',
    desc: 'لوحات جدارية وكسوات حوائط نحاسية مطروقة بتأثيرات بصرية فنية ثلاثية الأبعاد.',
    img: '/assets/images/brass-copper-wall-art-07.jpg',
    alt: 'لوحات جدارية وكسوات حوائط من النحاس الأصفر والأحمر المطروق | ورشة تراث مصر',
    url: '/wall-art-ar.html'
  },
  {
    num: '08',
    title: 'القواطع والمكتبات النحاسية',
    desc: 'فواصل مساحات ومكتبات مفتوحة من النحاس المصمت تجمع بين الخصوصية والجمال المعماري.',
    img: '/assets/images/partitions-bookcases-08.jpg',
    alt: 'قواطع وفواصل ومكتبات نحاسية فاخرة مفتوحة | ورشة تراث مصر',
    url: '/partitions-ar.html'
  },
  {
    num: '09',
    title: 'أواني الضيافة والمائدة',
    desc: 'صواني وأواني ضيافة ومباخر نحاسية فاخرة تعكس كرم الضيافة وأصالة التراث المصري.',
    img: '/assets/images/tableware-09.jpg',
    alt: 'أواني ضيافة وصواني مائدة فاخرة من النحاس الخالص | ورشة تراث مصر',
    url: '/tableware-ar.html'
  }
];

const cardsString = arCards.map((c, i) => {
  return `        <!-- Card ${i + 1}: ${c.title} -->\r\n` +
    `        <div class="collection-card relative h-full aspect-[9/16] min-w-[85vw] md:min-w-[400px] snap-center shrink-0 overflow-hidden group cursor-pointer border border-white/10 rounded-sm z-50 lg:min-w-0 lg:w-full lg:h-[460px] lg:aspect-auto lg:shrink-0 lg:rounded-lg" onclick="window.location.href='${c.url}'">\r\n` +
    `          <img src="${c.img}" alt="${c.alt}" class="collection-card-img absolute top-0 left-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" decoding="async" />\r\n` +
    `          <div class="collection-card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-0 pointer-events-none"></div>\r\n` +
    `          <div class="collection-card-content absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end z-10 transition-transform duration-500 group-hover:-translate-y-2 text-right">\r\n` +
    `            <span class="collection-card-tag text-[9px] uppercase tracking-[0.3em] text-[#D7C797] font-semibold mb-2 block font-sans">المجموعة ${c.num}</span>\r\n` +
    `            <h3 class="collection-card-title text-xl md:text-2xl font-light text-white mb-2 font-serif tracking-wide group-hover:text-[#D7C797] transition-colors">${c.title}</h3>\r\n` +
    `            <p class="collection-card-desc text-xs text-white/70 line-clamp-2 mb-4 font-light leading-relaxed">${c.desc}</p>\r\n` +
    `            <span class="collection-card-cta text-xs tracking-widest uppercase text-[#D7C797] flex items-center gap-2 font-medium justify-start flex-row-reverse">استكشف المجموعة &larr;</span>\r\n` +
    `          </div>\r\n` +
    `        </div>`;
}).join('\r\n\r\n');

const card1Idx = arHtml.indexOf('<!-- Card 1:');
const trackEndIdx = arHtml.indexOf('</div>\r\n      </div>\r\n\r\n      <!-- Right Floating Arrow Button', card1Idx);

if (card1Idx !== -1 && trackEndIdx !== -1) {
  const newHtml = arHtml.substring(0, card1Idx) + cardsString + '\r\n      ' + arHtml.substring(trackEndIdx);
  fs.writeFileSync('ar.html', newHtml, 'utf8');
  console.log('Successfully updated ar.html collections markup with parity!');
} else {
  console.error('Indices not found:', { card1Idx, trackEndIdx });
}
