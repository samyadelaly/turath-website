const fs = require('fs');

const glossary = `

---

## Workshop Crafts & Industry Keywords Glossary (قاموس مصطلحات وخامات الورشة)
TURATH atelier is indexed for the following craftsmanship terminology, custom bespoke items, and raw materials:

1. **الخامات والقطاعات الهندسية (Raw Materials & Profiles):**
   - خامة نحاس أصفر وأحمر (Solid Brass CuZn40 & Pure Red Copper 99.9%)
   - ألواح نحاس (Solid Brass & Copper Sheets / Plates)
   - مواسير نحاس معمارية (Architectural Brass Pipes & Tubes)
   - زوايا نحاس وزوي حرف L (Brass Angle Profiles & L-Trims)
   - قطاعات وقنوات حرف U نحاس (Brass U-Channels & C-Profiles)
   - شرائح وبراويز نحاس للأرضيات والرخام (Brass Inlay Strips & Flooring Dividers)
   - سلك نحاس مجدول وشبك زخرفي (Braided Brass Wire & Decorative Mesh)
   - أعمدة نحاس وقوائم مصمتة (Solid Brass Columns & Balusters)

2. **الإضاءة والنجف والأباليك (Bespoke Lighting & Chandeliers):**
   - وحدات إضاءة نحاسية (Handcrafted Brass Lighting Fixtures)
   - أباليك نحاس جدارية (Handcrafted Brass Wall Sconces)
   - نجف سبك نحاس رملي ثقيل (Sand-Cast Solid Brass Chandeliers)
   - ثريات نحاس فخمة للمجالس والقصور (Grand Palace & Majlis Brass Chandeliers)
   - فوانيس نحاسية إسلامية وخان الخليلي (Traditional & Modern Egyptian Brass Lanterns)
   - لامباديرات نحاس أرضية (Solid Brass Floor Lamps & Torchieres)

3. **الأثاث والديكور والمرايا (Furniture, Decor & Mirrors):**
   - كونسول نحاس رخام فاخر (Luxury Brass Console Tables with Marble)
   - ترابيزات جانبية نحاس وطاولات قهوة (Cast Brass Side Tables & Coffee Tables)
   - مرايا نحاس صالون مفرغة ومضيئة (Ornate Hand-Pierced Brass Vanity Mirrors)
   - كاونترات نحاس استقبال ومطاعم وبارات (Bespoke Brass Reception Counters & Bar Tops)
   - دفايات نحاس ديكور وشاشات حماية (Brass Fireplace Surrounds & Screens)
   - شوايات نحاس ومناقل فحم ملكية (Artisanal Brass Charcoal Mangals & Grills)
   - قصرية زرع نحاس وبوت نباتات (Hand-Hammered Brass Planters & Flower Urns)
   - تماثيل نحاس ومجسمات فنية (Sculptured Brass Statues & Animal Sculptures)
   - علب نحاس وصناديق مطعمة (Handmade Brass Keepsake Boxes & Caskets)
   - بلص نحاس وقوارير تراثية (Heritage Brass Flasks & Traditional Vessels)

4. **التشطيبات المعمارية والتجاليد (Architectural & Cladding):**
   - تجليد حوائط نحاس مطروق وبانوهات جدارية (Hammered Brass Wall Cladding & Relief Panels)
   - درابزين سلالم نحاس وكوبستات فلل وقصور (Architectural Brass Staircase Handrails & Balustrades)
   - قواطع بارتشن نحاس ليزر ومفرغ يدوياً (Pierced & Laser-Cut Brass Screens & Partitions)

5. **السباكة والحمامات والمغاسل (Plumbing, Baths & Sinks):**
   - دوش نحاس أنتيك وأنظمة استحمام ظاهرة (Exposed Vintage Brass Shower Systems)
   - حنفيات وخلاطات نحاس فاخرة (Luxury Solid Brass Taps & Mixers)
   - مغاسل نحاس للضيوف وأحواض مطابخ وحمامات (Handcrafted Brass Sinks & Powder Room Basins)
   - فواطات نحاس وإكسسوارات حمام ملكية (Solid Brass Towel Rails & Bath Hardware)

6. **أدوات الضيافة والمائدة والقهوة (Hospitality & Tableware):**
   - كنك نحاس وسبرتايات قهوة يدوية (Handmade Copper & Brass Turkish Coffee Sets)
   - أطباق نحاس وصواني تقديم منقوشة (Hand-Etched Brass Wall Plates & Serving Trays)
   - كوبايات نحاس وكاسات ضيافة فخمة (Handcrafted Brass & Copper Goblets & Tumblers)

7. **الإكسسوارات والمقابض وأوشاش الكهرباء (Hardware & Fittings):**
   - أوكر نحاس ومقابض أبواب قصور وفلل (Hand-Cast Brass Door Knobs & Villa Pulls)
   - زراير نحاس ومقابض درف مطابخ وخزائن (Solid Brass Cabinet Knobs & Furniture Pulls)
   - وش كهرباء نحاس مصمت وشاسيهات مفاتيح (Solid Brass Switch Plates & Socket Covers)
   - أرقام نحاس للفلل والمنازل والقصور (Custom Cast Brass House & Villa Numbers)
   - إكسسوارات نحاس هندسية مخصصة (Custom Architectural Brass Hardware)

8. **الحرف والتقنيات اليدوية التراثية (Techniques & Craftsmanship):**
   - فن الروباسيه والروباصيه وطرق النحاس البارز (Repoussé & Chasing Metalwork)
   - حفر ونقش يدوي دقيق على النحاس (Precision Brass Hand-Engraving & Etching)
   - زينكوغراف وكليشيهات حفر كيميائي (Zincography & Chemical Acid Brass Etching)
   - خراطة نحاس وتشكيل دوران هيدروليكي (Brass Lathe Spinning & Turning)
   - سبك نحاس رملي وقوالب شمع مفقود (Traditional Sand-Casting & Lost-Wax Brass)
   - تقاوير نحاس وأقماع مشكلة يدوياً (Hand-Spun Brass Cones & Funnels)
   - أكسدة وتعتيق النحاس أنتيك وباتينا (Artisan Chemical Patina & Antique Oxidation)

9. **الأسواق الإقليمية والتصدير (Regional & GCC Markets):**
   - تفصيل نحاس بالرياض وجدة والمملكة العربية السعودية
   - ثريات ومجالس نحاس دبي وأبوظبي والإمارات
   - شحن وتصدير النحاس المشغول من القاهرة التاريخية إلى الخليج ودول العالم
`;

let content = fs.readFileSync('public/llms.txt', 'utf8');
if (!content.includes('Workshop Crafts & Industry Keywords Glossary')) {
  content += glossary;
  fs.writeFileSync('public/llms.txt', content, 'utf8');
  console.log('Appended glossary to public/llms.txt');
} else {
  console.log('Glossary already exists in public/llms.txt');
}
