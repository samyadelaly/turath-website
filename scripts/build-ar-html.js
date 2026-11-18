import fs from 'fs';
import path from 'path';

const srcHtml = fs.readFileSync('index.html', 'utf8');

let arHtml = srcHtml;

// 1. Language & Direction
arHtml = arHtml.replace(/<html\s+lang="en"[^>]*>/i, '<html lang="ar" dir="rtl" class="is-rtl">');

// 2. Cairo Font Injection
const cairoFont = `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">`;

arHtml = arHtml.replace('</head>', `  ${cairoFont}\n</head>`);

// 3. Title & SEO Meta
arHtml = arHtml.replace(
  /<title>.*?<\/title>/i,
  '<title>تراث مصر | تصنيع نحاس يدوي | سامي عادل</title>'
);

arHtml = arHtml.replace(
  /<meta name="description" content=".*?"/i,
  '<meta name="description" content="ورشة تراث بإدارة سامي عادل لتصنيع النحاس الأصفر والأحمر يدوياً بالقاهرة التاريخية منذ 2012؛ نجف، أباليك، مرايا، كونسول، تجليد حوائط، وسبك النحاس."'
);

// 4. Header Top-Right Language Button (Points back to index.html with EN)
arHtml = arHtml.replace(
  /<a href="\/ar\.html" id="lang-toggle-btn"[\s\S]*?<\/a>/i,
  `<a href="/index.html" id="lang-toggle-btn" class="lang-toggle-btn" aria-label="Switch to English" title="English Version">
        <span id="lang-toggle-text">EN</span>
      </a>`
);

// 5. Desktop Horizontal Navigation
arHtml = arHtml.replace(
  /<nav class="desktop-nav-menu[\s\S]*?<\/nav>/i,
  `<nav class="desktop-nav-menu hidden lg:flex items-center gap-6 xl:gap-8 mx-auto" aria-label="Desktop Navigation">
      <a href="#home" class="desktop-nav-link text-xs xl:text-sm font-medium tracking-widest text-white/80 hover:text-[#D7C797] transition-all uppercase">الرئيسية</a>
      <a href="#about" class="desktop-nav-link text-xs xl:text-sm font-medium tracking-widest text-white/80 hover:text-[#D7C797] transition-all uppercase">عن تراث</a>
      <a href="#gallery" class="desktop-nav-link text-xs xl:text-sm font-medium tracking-widest text-white/80 hover:text-[#D7C797] transition-all uppercase">المجموعات</a>
      <a href="#bespoke" class="desktop-nav-link text-xs xl:text-sm font-medium tracking-widest text-white/80 hover:text-[#D7C797] transition-all uppercase">تصنيع مخصص</a>
      <a href="#masterpieces" class="desktop-nav-link text-xs xl:text-sm font-medium tracking-widest text-white/80 hover:text-[#D7C797] transition-all uppercase">روائع نادرة</a>
      <a href="#craftsmanship" class="desktop-nav-link text-xs xl:text-sm font-medium tracking-widest text-white/80 hover:text-[#D7C797] transition-all uppercase">حرفيتنا</a>
      <a href="#founder" class="desktop-nav-link text-xs xl:text-sm font-medium tracking-widest text-white/80 hover:text-[#D7C797] transition-all uppercase">المؤسس</a>
      <a href="#contact" class="desktop-nav-link text-xs xl:text-sm font-medium tracking-widest text-white/80 hover:text-[#D7C797] transition-all uppercase">تواصل معنا</a>
    </nav>`
);

// 6. Mobile Drawer Navigation Links
arHtml = arHtml.replace(
  /<ul class="nav-menu-list space-y-4 md:space-y-6">[\s\S]*?<\/ul>/i,
  `<ul class="nav-menu-list space-y-4 md:space-y-6">
          <li class="nav-menu-item"><a href="#gallery" class="nav-menu-link text-2xl md:text-4xl text-[#D7C797] hover:text-white transition-colors uppercase tracking-widest">المجموعات المعمارية</a></li>
          <li class="nav-menu-item"><a href="#craftsmanship" class="nav-menu-link text-2xl md:text-4xl text-[#D7C797] hover:text-white transition-colors uppercase tracking-widest">الحرفية في الحركة</a></li>
          <li class="nav-menu-item"><a href="#bespoke" class="nav-menu-link text-2xl md:text-4xl text-[#D7C797] hover:text-white transition-colors uppercase tracking-widest">التصنيع حسب الطلب</a></li>
          <li class="nav-menu-item"><a href="#about" class="nav-menu-link text-2xl md:text-4xl text-[#D7C797] hover:text-white transition-colors uppercase tracking-widest">عن تراث مصر</a></li>
          <li class="nav-menu-item"><a href="#faq" class="nav-menu-link text-2xl md:text-4xl text-[#D7C797] hover:text-white transition-colors uppercase tracking-widest">الأسئلة الشائعة</a></li>
          <li class="nav-menu-item"><a href="#contact" class="nav-menu-link text-2xl md:text-4xl text-[#D7C797] hover:text-white transition-colors uppercase tracking-widest">تواصل معنا</a></li>
        </ul>`
);

// 7. Hero Section
arHtml = arHtml.replace(
  'SCROLL TURATH WEBSITE..',
  'تصفح موقع تراث مصر..'
);
arHtml = arHtml.replace(
  '<h1 class="hero-headline-1 lg:text-6xl xl:text-7xl lg:tracking-tight">DEVOTED</h1>',
  '<h1 class="hero-headline-1 lg:text-6xl xl:text-7xl lg:tracking-tight">شغفٌ</h1>'
);
arHtml = arHtml.replace(
  '<h2 class="hero-headline-2 lg:text-4xl xl:text-5xl lg:font-light">TO CREATIVITY ..</h2>',
  '<h2 class="hero-headline-2 lg:text-4xl xl:text-5xl lg:font-light">بالإبداع ..</h2>'
);
arHtml = arHtml.replace(
  'Handcrafted Brass &amp; Copper Excellence from Egypt',
  'شغفٌ بالإبداع ..'
);
arHtml = arHtml.replace(
  /Premium handcrafted brass, copper and decorative metal products, made in Cairo, Egypt for luxury homes, hotels, restaurants, palaces/i,
  'تميز الحرفية اليدوية في النحاس الأصفر والأحمر من مصر منذ 2012'
);

// 8. Scene 02 About Turath
arHtml = arHtml.replace(
  '<h2 class="hero-bottom-title about-title">ABOUT TURATH</h2>',
  '<h2 class="hero-bottom-title about-title">عن تراث</h2>'
);
arHtml = arHtml.replace(
  /<p>Turath is an Egyptian atelier specialising in handcrafted brass and copper metalwork[\s\S]*?<\/p>/i,
  '<p>تراث هي ورشة مصرية متخصصة في التشكيل اليدوي للنحاس الأصفر والأحمر والقطع الفنية المصممة حسب الطلب. تأسست عام 2012 على يد سامي عادل، ويقع مقرها في القاهرة التاريخية بالقرب من باب النصر في حي الجمالية.</p>'
);

arHtml = arHtml.replace(
  '<h2 class="hero-bottom-title about-title">OUR CRAFT</h2>',
  '<h2 class="hero-bottom-title about-title">حرفتنا</h2>'
);
arHtml = arHtml.replace(
  /<p>We combine time-honoured Egyptian craftsmanship with contemporary design[\s\S]*?<\/p>/i,
  '<p>نجمع بين الحرفية المصرية الأصيلة والتصميم المعاصر لابتكار قطع مميزة تناسب المساحات السكنية والفندقية والتجارية، تُنفّذ يدوياً بأيدي أمهر الحرفيين بأساليب متوارثة عبر الأجيال.</p>'
);

arHtml = arHtml.replace(
  '<h2 class="hero-bottom-title about-title">OUR VISION</h2>',
  '<h2 class="hero-bottom-title about-title">رؤيتنا</h2>'
);
arHtml = arHtml.replace(
  /<p>Preserving the art of hand-formed metal with creativity, precision, and enduring design\.<\/p>/i,
  '<p>الحفاظ على فن تشكيل المعادن اليدوي بالإبداع والدقة والتصميم الخالد.</p>'
);
arHtml = arHtml.replace(
  'TURATH — HANDMADE IN EGYPT.',
  'تراث — صناعة يدوية مصرية.'
);

// 9. Scene 03 Collections Overview
arHtml = arHtml.replace(
  '<h2 id="collections-title" class="collections-title collections-text-anim text-left uppercase text-[#D7C797] lg:text-4xl xl:text-5xl">OUR COLLECTIONS</h2>',
  '<h2 id="collections-title" class="collections-title collections-text-anim text-right uppercase text-[#D7C797] lg:text-4xl xl:text-5xl font-extrabold">المجموعات المعمارية</h2>'
);
arHtml = arHtml.replace(
  /Discover our handcrafted brass &amp; copper collections, each piece forged with architectural precision\./i,
  'اكتشف مجموعاتنا المشغولة يدوياً من النحاس الأصفر والأحمر، المصنوعة بحرفية أصيلة وتصميم مميز.'
);

// Arabic titles for Collections Cards in Scene 03
arHtml = arHtml.replace(/LIGHTING COLLECTION/gi, 'وحدات إضاءة نحاسية');
arHtml = arHtml.replace(/BRASS MIRRORS/gi, 'مرايا نحاسية فاخرة');
arHtml = arHtml.replace(/TABLES &amp; CONSOLES/gi, 'طاولات وكونسول نحاسي');
arHtml = arHtml.replace(/BRASS DOOR HANDLES/gi, 'مقابض أبواب نحاسية');
arHtml = arHtml.replace(/BRASS HANDRAILS/gi, 'درابزين سلالم نحاسي');
arHtml = arHtml.replace(/DECORATIVE OBJECTS/gi, 'تحف وصواني ديكور نحاسية');
arHtml = arHtml.replace(/WALL ART/gi, 'لوحات وجداريات نحاسية');
arHtml = arHtml.replace(/PARTITIONS &amp; SCREENS/gi, 'قواطع وفواصل نحاسية');
arHtml = arHtml.replace(/BRASS TABLEWARE/gi, 'أدوات مائدة وأواني ضيافة');
arHtml = arHtml.replace(/ATELIER IN MOTION/gi, 'الورشة أثناء العمل');
arHtml = arHtml.replace(/RARE MASTERPIECES/gi, 'التحف والروائع النادرة');

// 10. Bespoke Form Section
arHtml = arHtml.replace(
  'BESPOKE MANUFACTURING',
  'التصنيع حسب الطلب'
);
arHtml = arHtml.replace(
  'Tell us about your custom request',
  'خدمة التصنيع المخصص للأعمال المعمارية والمشاريع الفاخرة'
);
arHtml = arHtml.replace(
  '<label for="fullName" class="text-xs uppercase tracking-widest text-[#D7C797] drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] font-medium">Full Name</label>',
  '<label for="fullName" class="text-xs uppercase tracking-widest text-[#D7C797] drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] font-medium">الاسم الكامل</label>'
);
arHtml = arHtml.replace(
  'placeholder="Your full name"',
  'placeholder="الاسم الكريم"'
);
arHtml = arHtml.replace(
  '<label for="email" class="text-xs uppercase tracking-widest text-[#D7C797] drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] font-medium">Email</label>',
  '<label for="email" class="text-xs uppercase tracking-widest text-[#D7C797] drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] font-medium">البريد الإلكتروني</label>'
);
arHtml = arHtml.replace(
  'placeholder="Turath.egypt@gmail.com"',
  'placeholder="example@domain.com"'
);
arHtml = arHtml.replace(
  '<label for="phone" class="text-xs uppercase tracking-widest text-[#D7C797] drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] font-medium">Phone / WhatsApp</label>',
  '<label for="phone" class="text-xs uppercase tracking-widest text-[#D7C797] drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] font-medium">رقم الهاتف / واتساب</label>'
);
arHtml = arHtml.replace(
  'placeholder="002 01016771010"',
  'placeholder="+20 100 000 0000"'
);
arHtml = arHtml.replace(
  '<label for="material" class="text-xs uppercase tracking-widest text-[#D7C797] drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] font-medium">Material</label>',
  '<label for="material" class="text-xs uppercase tracking-widest text-[#D7C797] drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] font-medium">الخامة المطلوبة</label>'
);
arHtml = arHtml.replace('Select primary metal', 'اختر الخامة المطلوبة');
arHtml = arHtml.replace('<option value="Brass" class="text-gray-900">BRASS</option>', '<option value="Brass" class="text-gray-900">نحاس أصفر فاخر</option>');
arHtml = arHtml.replace('<option value="Copper" class="text-gray-900">COPPER</option>', '<option value="Copper" class="text-gray-900">نحاس أحمر نقي</option>');
arHtml = arHtml.replace('<option value="Aluminium" class="text-gray-900">Aluminium</option>', '<option value="Aluminium" class="text-gray-900">ألومنيوم معماري</option>');
arHtml = arHtml.replace('<option value="Stainless steel" class="text-gray-900">Stainless steel</option>', '<option value="Stainless steel" class="text-gray-900">ستانلس ستيل</option>');
arHtml = arHtml.replace('<option value="Iron" class="text-gray-900">Iron</option>', '<option value="Iron" class="text-gray-900">حديد مشغول</option>');

arHtml = arHtml.replace(
  '<label for="message" class="text-xs uppercase tracking-widest text-[#D7C797] drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] font-medium">Project Details &amp; Specifications</label>',
  '<label for="message" class="text-xs uppercase tracking-widest text-[#D7C797] drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] font-medium">تفاصيل ومقاسات المشروع</label>'
);
arHtml = arHtml.replace(
  'placeholder="Describe dimensions, finishes, quantity, and design intent..."',
  'placeholder="صف فكرتك، المقاسات التقريبية، ونوع التشطيب المطلوب..."'
);
arHtml = arHtml.replace(
  'SUBMIT INQUIRY',
  'إرسال الطلب'
);

// 11. Scene 05 Signature Masterpieces
arHtml = arHtml.replace(
  /FEATURED HANDCRAFTED<br \/>MASTERPIECES/i,
  'مختارات تراث النحاسية المميزة'
);
arHtml = arHtml.replace(
  /Our best-selling products and most requested custom manufacturing pieces, crafted in brass, copper, and other materials to meet a wide range of design and project requirements\./i,
  'أكثر أعمالنا طلباً ومبيعاً، منفذة يدوياً من النحاس الأصفر والأحمر والمعادن المختلفة لتلبي مختلف الأذواق ومتطلبات المشاريع.'
);
arHtml = arHtml.replace(
  'Click to see the best selling products',
  'استعرض الأكثر مبيعاً'
);

// 12. Scene 06 Motion
arHtml = arHtml.replace(
  'CRAFTSMANSHIP IN MOTION',
  'الحرفية في الحركة'
);
arHtml = arHtml.replace(
  'A direct look at our work',
  'نظرة مباشرة من داخل الورشة ومواقع التركيب'
);

// 13. Scene 07 Founder
arHtml = arHtml.replace(
  'FOUNDER | SAMY ADEL',
  'المؤسس | سامي عادل'
);
arHtml = arHtml.replace(
  'FROM GRAPHIC DESIGN &amp; MARKETING TO BRASS &amp; COPPER CRAFTSMANSHIP',
  'من التصميم الجرافيكي والتسويق البصري إلى حرفية تشكيل النحاس'
);
arHtml = arHtml.replace(
  /<p>Founded in 2016, Turath is the culmination of Samy’s transition from visual marketing to artisanal metalworking[\s\S]*?<\/p>/i,
  '<p>تأسست ورشة تراث عام 2012 لتتوج مسيرة سامي عادل وانتقاله من التصميم الجرافيكي والتسويق البصري إلى فنون تشكيل المعادن اليدوية، حيث يجمع اليوم بين دقة التصميم الحديث وأصالة الحرفية المصرية في النحاس الأصفر والأحمر بالقاهرة التاريخية.</p>'
);

// 14. Contact Section
arHtml = arHtml.replace(
  'CONTACT TURATH',
  'تواصل مع تراث'
);
arHtml = arHtml.replace(
  'Bespoke brass &amp; copper architectural commissions and private consultations.',
  'طلبات تصنيع النحاس حسب الطلب والاستشارات الخاصة.'
);
arHtml = arHtml.replace(
  'Historic Cairo, Egypt',
  'عمارة كحلة، باب النصر، حي الجمالية، القاهرة التاريخية'
);

fs.writeFileSync('ar.html', arHtml, 'utf8');
console.log('ar.html generated successfully! Length:', arHtml.length);
