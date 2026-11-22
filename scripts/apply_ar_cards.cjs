const fs = require('fs');

// 1. Update ar.html Collections cards to match index.html with all Arabic content
const indexHtml = fs.readFileSync('index.html', 'utf8');
const arHtml = fs.readFileSync('ar.html', 'utf8');

const arCardsMarkup = `        <!-- Card 1: الإضاءة -->
        <div class="collection-card relative h-full aspect-[9/16] min-w-[85vw] md:min-w-[400px] snap-center shrink-0 overflow-hidden group cursor-pointer border border-white/10 rounded-sm z-50 lg:min-w-0 lg:w-full lg:h-[460px] lg:aspect-auto lg:shrink-0 lg:rounded-lg" onclick="window.location.href='/lighting-ar.html'">
          <img src="/assets/images/lighting-02.jpg" alt="وحدات إضاءة وثريات نحاسية فاخرة | ورشة تراث مصر" class="collection-card-img absolute top-0 left-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" decoding="async" />
          <div class="collection-card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-0 pointer-events-none"></div>
          <div class="collection-card-content absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end z-10 transition-transform duration-500 group-hover:-translate-y-2 text-right">
            <span class="collection-card-tag text-[9px] uppercase tracking-[0.3em] text-[#D7C797] font-semibold mb-2 block font-sans">المجموعة 01</span>
            <h3 class="collection-card-title text-xl md:text-2xl font-light text-white mb-2 font-serif tracking-wide group-hover:text-[#D7C797] transition-colors">مجموعة الإضاءة</h3>
            <p class="collection-card-desc text-xs text-white/70 line-clamp-2 mb-4 font-light leading-relaxed">ثريات ومصابيح وفوانيس نحاسية يدوية الصنع مصبوبة من النحاس المصري الخالص.</p>
            <span class="collection-card-cta text-xs tracking-widest uppercase text-[#D7C797] flex items-center gap-2 font-medium justify-start flex-row-reverse">استكشف المجموعة &larr;</span>
          </div>
        </div>

        <!-- Card 2: المرايا النحاسية -->
        <div class="collection-card relative h-full aspect-[9/16] min-w-[85vw] md:min-w-[400px] snap-center shrink-0 overflow-hidden group cursor-pointer border border-white/10 rounded-sm z-50 lg:min-w-0 lg:w-full lg:h-[460px] lg:aspect-auto lg:shrink-0 lg:rounded-lg" onclick="window.location.href='/mirrors-ar.html'">
          <img src="/assets/images/brass-mirrors-01.jpg" alt="مرايا نحاسية يدوية الصنع بتصاميم فنية فريدة | ورشة تراث مصر" class="collection-card-img absolute top-0 left-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" decoding="async" />
          <div class="collection-card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-0 pointer-events-none"></div>
          <div class="collection-card-content absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end z-10 transition-transform duration-500 group-hover:-translate-y-2 text-right">
            <span class="collection-card-tag text-[9px] uppercase tracking-[0.3em] text-[#D7C797] font-semibold mb-2 block font-sans">المجموعة 02</span>
            <h3 class="collection-card-title text-xl md:text-2xl font-light text-white mb-2 font-serif tracking-wide group-hover:text-[#D7C797] transition-colors">المرايا النحاسية</h3>
            <p class="collection-card-desc text-xs text-white/70 line-clamp-2 mb-4 font-light leading-relaxed">مرايا جدارية بإطارات نحاسية معتقة ومحفورة يدوياً بدقة وتفاصيل معمارية راقية.</p>
            <span class="collection-card-cta text-xs tracking-widest uppercase text-[#D7C797] flex items-center gap-2 font-medium justify-start flex-row-reverse">استكشف المجموعة &larr;</span>
          </div>
        </div>

        <!-- Card 3: طاولات وكونسول -->
        <div class="collection-card relative h-full aspect-[9/16] min-w-[85vw] md:min-w-[400px] snap-center shrink-0 overflow-hidden group cursor-pointer border border-white/10 rounded-sm z-50 lg:min-w-0 lg:w-full lg:h-[460px] lg:aspect-auto lg:shrink-0 lg:rounded-lg" onclick="window.location.href='/tables-ar.html'">
          <img src="/assets/images/tables-consoles-04.jpg" alt="طاولات وكونسول نحاسي مصبوب ومنحوت يدوياً | ورشة تراث مصر" class="collection-card-img absolute top-0 left-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" decoding="async" />
          <div class="collection-card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-0 pointer-events-none"></div>
          <div class="collection-card-content absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end z-10 transition-transform duration-500 group-hover:-translate-y-2 text-right">
            <span class="collection-card-tag text-[9px] uppercase tracking-[0.3em] text-[#D7C797] font-semibold mb-2 block font-sans">المجموعة 03</span>
            <h3 class="collection-card-title text-xl md:text-2xl font-light text-white mb-2 font-serif tracking-wide group-hover:text-[#D7C797] transition-colors">طاولات وكونسول</h3>
            <p class="collection-card-desc text-xs text-white/70 line-clamp-2 mb-4 font-light leading-relaxed">طاولات قهوة وكونسول فاخرة من النحاس المصبوب مع الرخام الطبيعي والزجاج.</p>
            <span class="collection-card-cta text-xs tracking-widest uppercase text-[#D7C797] flex items-center gap-2 font-medium justify-start flex-row-reverse">استكشف المجموعة &larr;</span>
          </div>
        </div>

        <!-- Card 4: مقابض الأبواب النحاسية -->
        <div class="collection-card relative h-full aspect-[9/16] min-w-[85vw] md:min-w-[400px] snap-center shrink-0 overflow-hidden group cursor-pointer border border-white/10 rounded-sm z-50 lg:min-w-0 lg:w-full lg:h-[460px] lg:aspect-auto lg:shrink-0 lg:rounded-lg" onclick="window.location.href='/handles-ar.html'">
          <img src="/assets/images/handles-card-hero.jpg" alt="مقابض أبواب نحاسية فاخرة مصبوبة يدوياً | ورشة تراث مصر" class="collection-card-img absolute top-0 left-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" decoding="async" />
          <div class="collection-card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-0 pointer-events-none"></div>
          <div class="collection-card-content absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end z-10 transition-transform duration-500 group-hover:-translate-y-2 text-right">
            <span class="collection-card-tag text-[9px] uppercase tracking-[0.3em] text-[#D7C797] font-semibold mb-2 block font-sans">المجموعة 04</span>
            <h3 class="collection-card-title text-xl md:text-2xl font-light text-white mb-2 font-serif tracking-wide group-hover:text-[#D7C797] transition-colors">مقابض الأبواب النحاسية</h3>
            <p class="collection-card-desc text-xs text-white/70 line-clamp-2 mb-4 font-light leading-relaxed">مقابض سحب وأقفال أبواب مصبوبة يدوياً بتشطيبات برونزية وذهبية فاخرة.</p>
            <span class="collection-card-cta text-xs tracking-widest uppercase text-[#D7C797] flex items-center gap-2 font-medium justify-start flex-row-reverse">استكشف المجموعة &larr;</span>
          </div>
        </div>

        <!-- Card 5: درابزين السلالم النحاسي -->
        <div class="collection-card relative h-full aspect-[9/16] min-w-[85vw] md:min-w-[400px] snap-center shrink-0 overflow-hidden group cursor-pointer border border-white/10 rounded-sm z-50 lg:min-w-0 lg:w-full lg:h-[460px] lg:aspect-auto lg:shrink-0 lg:rounded-lg" onclick="window.location.href='/handrails-ar.html'">
          <img src="/assets/images/handrails-05.jpg" alt="درابزين سلالم نحاسي فاخر بتصاميم هندسية دقيقة | ورشة تراث مصر" class="collection-card-img absolute top-0 left-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" decoding="async" />
          <div class="collection-card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-0 pointer-events-none"></div>
          <div class="collection-card-content absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end z-10 transition-transform duration-500 group-hover:-translate-y-2 text-right">
            <span class="collection-card-tag text-[9px] uppercase tracking-[0.3em] text-[#D7C797] font-semibold mb-2 block font-sans">المجموعة 05</span>
            <h3 class="collection-card-title text-xl md:text-2xl font-light text-white mb-2 font-serif tracking-wide group-hover:text-[#D7C797] transition-colors">درابزين السلالم النحاسي</h3>
            <p class="collection-card-desc text-xs text-white/70 line-clamp-2 mb-4 font-light leading-relaxed">درابزينات سلالم هندسية وزخرفية مصنوعة يدوياً للقصور والفلل والمشاريع الراقية.</p>
            <span class="collection-card-cta text-xs tracking-widest uppercase text-[#D7C797] flex items-center gap-2 font-medium justify-start flex-row-reverse">استكشف المجموعة &larr;</span>
          </div>
        </div>

        <!-- Card 6: القطع الديكورية والتحف -->
        <div class="collection-card relative h-full aspect-[9/16] min-w-[85vw] md:min-w-[400px] snap-center shrink-0 overflow-hidden group cursor-pointer border border-white/10 rounded-sm z-50 lg:min-w-0 lg:w-full lg:h-[460px] lg:aspect-auto lg:shrink-0 lg:rounded-lg" onclick="window.location.href='/decor-ar.html'">
          <img src="/assets/images/decor-accessories-06.jpg" alt="تحف ومجسمات ديكورية فاخرة من النحاس الخالص | ورشة تراث مصر" class="collection-card-img absolute top-0 left-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" decoding="async" />
          <div class="collection-card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-0 pointer-events-none"></div>
          <div class="collection-card-content absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end z-10 transition-transform duration-500 group-hover:-translate-y-2 text-right">
            <span class="collection-card-tag text-[9px] uppercase tracking-[0.3em] text-[#D7C797] font-semibold mb-2 block font-sans">المجموعة 06</span>
            <h3 class="collection-card-title text-xl md:text-2xl font-light text-white mb-2 font-serif tracking-wide group-hover:text-[#D7C797] transition-colors">القطع الديكورية والتحف</h3>
            <p class="collection-card-desc text-xs text-white/70 line-clamp-2 mb-4 font-light leading-relaxed">تحف ومجسمات فنية وإكسسوارات معمارية مصبوبة يدوياً من النحاس الأصفر والأحمر.</p>
            <span class="collection-card-cta text-xs tracking-widest uppercase text-[#D7C797] flex items-center gap-2 font-medium justify-start flex-row-reverse">استكشف المجموعة &larr;</span>
          </div>
        </div>

        <!-- Card 7: لوحات الحائط النحاسية -->
        <div class="collection-card relative h-full aspect-[9/16] min-w-[85vw] md:min-w-[400px] snap-center shrink-0 overflow-hidden group cursor-pointer border border-white/10 rounded-sm z-50 lg:min-w-0 lg:w-full lg:h-[460px] lg:aspect-auto lg:shrink-0 lg:rounded-lg" onclick="window.location.href='/wall-art-ar.html'">
          <img src="/assets/images/brass-copper-wall-art-07.jpg" alt="لوحات جدارية وكسوات حوائط من النحاس الأصفر والأحمر المطروق | ورشة تراث مصر" class="collection-card-img absolute top-0 left-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" decoding="async" />
          <div class="collection-card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-0 pointer-events-none"></div>
          <div class="collection-card-content absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end z-10 transition-transform duration-500 group-hover:-translate-y-2 text-right">
            <span class="collection-card-tag text-[9px] uppercase tracking-[0.3em] text-[#D7C797] font-semibold mb-2 block font-sans">المجموعة 07</span>
            <h3 class="collection-card-title text-xl md:text-2xl font-light text-white mb-2 font-serif tracking-wide group-hover:text-[#D7C797] transition-colors">لوحات الحائط النحاسية</h3>
            <p class="collection-card-desc text-xs text-white/70 line-clamp-2 mb-4 font-light leading-relaxed">لوحات جدارية وكسوات حوائط نحاسية مطروقة بتأثيرات بصرية فنية ثلاثية الأبعاد.</p>
            <span class="collection-card-cta text-xs tracking-widest uppercase text-[#D7C797] flex items-center gap-2 font-medium justify-start flex-row-reverse">استكشف المجموعة &larr;</span>
          </div>
        </div>

        <!-- Card 8: القواطع والمكتبات النحاسية -->
        <div class="collection-card relative h-full aspect-[9/16] min-w-[85vw] md:min-w-[400px] snap-center shrink-0 overflow-hidden group cursor-pointer border border-white/10 rounded-sm z-50 lg:min-w-0 lg:w-full lg:h-[460px] lg:aspect-auto lg:shrink-0 lg:rounded-lg" onclick="window.location.href='/partitions-ar.html'">
          <img src="/assets/images/partitions-bookcases-08.jpg" alt="قواطع وفواصل ومكتبات نحاسية فاخرة مفتوحة | ورشة تراث مصر" class="collection-card-img absolute top-0 left-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" decoding="async" />
          <div class="collection-card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-0 pointer-events-none"></div>
          <div class="collection-card-content absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end z-10 transition-transform duration-500 group-hover:-translate-y-2 text-right">
            <span class="collection-card-tag text-[9px] uppercase tracking-[0.3em] text-[#D7C797] font-semibold mb-2 block font-sans">المجموعة 08</span>
            <h3 class="collection-card-title text-xl md:text-2xl font-light text-white mb-2 font-serif tracking-wide group-hover:text-[#D7C797] transition-colors">القواطع والمكتبات النحاسية</h3>
            <p class="collection-card-desc text-xs text-white/70 line-clamp-2 mb-4 font-light leading-relaxed">فواصل مساحات ومكتبات مفتوحة من النحاس المصمت تجمع بين الخصوصية والجمال المعماري.</p>
            <span class="collection-card-cta text-xs tracking-widest uppercase text-[#D7C797] flex items-center gap-2 font-medium justify-start flex-row-reverse">استكشف المجموعة &larr;</span>
          </div>
        </div>

        <!-- Card 9: أواني الضيافة والمائدة -->
        <div class="collection-card relative h-full aspect-[9/16] min-w-[85vw] md:min-w-[400px] snap-center shrink-0 overflow-hidden group cursor-pointer border border-white/10 rounded-sm z-50 lg:min-w-0 lg:w-full lg:h-[460px] lg:aspect-auto lg:shrink-0 lg:rounded-lg" onclick="window.location.href='/tableware-ar.html'">
          <img src="/assets/images/tableware-09.jpg" alt="أواني ضيافة وصواني مائدة فاخرة من النحاس الخالص | ورشة تراث مصر" class="collection-card-img absolute top-0 left-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" decoding="async" />
          <div class="collection-card-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-0 pointer-events-none"></div>
          <div class="collection-card-content absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end z-10 transition-transform duration-500 group-hover:-translate-y-2 text-right">
            <span class="collection-card-tag text-[9px] uppercase tracking-[0.3em] text-[#D7C797] font-semibold mb-2 block font-sans">المجموعة 09</span>
            <h3 class="collection-card-title text-xl md:text-2xl font-light text-white mb-2 font-serif tracking-wide group-hover:text-[#D7C797] transition-colors">أواني الضيافة والمائدة</h3>
            <p class="collection-card-desc text-xs text-white/70 line-clamp-2 mb-4 font-light leading-relaxed">صواني وأواني ضيافة ومباخر نحاسية فاخرة تعكس كرم الضيافة وأصالة التراث المصري.</p>
            <span class="collection-card-cta text-xs tracking-widest uppercase text-[#D7C797] flex items-center gap-2 font-medium justify-start flex-row-reverse">استكشف المجموعة &larr;</span>
          </div>
        </div>`;

// Replace in ar.html between <div class="collections-track... and </div>
const trackRegex = /(<div class="collections-track[^>]*>)([\s\S]*?)(<\/div>\s*<\/div>\s*<!-- Background subtle layer)/;
if (trackRegex.test(arHtml)) {
  const newArHtml = arHtml.replace(trackRegex, `$1\n${arCardsMarkup}\n      $3`);
  fs.writeFileSync('ar.html', newArHtml, 'utf8');
  console.log('ar.html updated successfully with complete 9 cards!');
} else {
  console.log('Regex did not match track in ar.html');
}
