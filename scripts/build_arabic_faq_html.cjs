const fs = require('fs');
const { faqSectionsAr, closingStatementAr } = require('../scratch/faq_data_ar.cjs');

function generateArabicFaqHtml() {
  let categoriesHtml = '';

  faqSectionsAr.forEach((sec, sIdx) => {
    let itemsHtml = '';
    sec.items.forEach((item) => {
      itemsHtml += `
            <!-- Question: ${item.id} -->
            <div class="faq-card flex flex-col gap-2">
              <div class="faq-question flex items-start gap-3">
                <span class="text-xs text-[#D7C797]/70 font-mono shrink-0 mt-0.5">${item.id}.</span>
                <h4 class="text-sm sm:text-base md:text-lg font-bold text-white tracking-wide" style="font-family: 'Cairo', sans-serif;">
                  ${item.q}
                </h4>
              </div>
              <div class="faq-answer pr-6 sm:pr-8">
                <p class="text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed" style="font-family: 'Cairo', sans-serif;">
                  ${item.a}
                </p>
              </div>
            </div>`;
    });

    categoriesHtml += `
          <!-- ${sec.sectionTitle} -->
          <div class="faq-category-group flex flex-col gap-3">
            <div class="faq-category-header flex items-center gap-2 border-b border-[#D7C797]/30 pb-2 mb-1">
              <span class="w-1.5 h-1.5 rounded-full bg-[#D7C797]"></span>
              <h3 class="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#D7C797]" style="font-family: 'Cairo', sans-serif;">
                ${sec.sectionTitle}
              </h3>
            </div>
            <div class="faq-items-list flex flex-col gap-5">
              ${itemsHtml}
            </div>
          </div>
`;
  });

  return `  <!-- ========================================================================
       10.5. SECTION: FAQ (أسئلة شائعة / SCROLL-DRIVEN CANVAS & DESKTOP IMAGE)
       ======================================================================== -->
  <section id="faq" class="relative w-full z-75 bg-[#050505] text-white overflow-clip faq-section mt-[150vh]" style="margin-top: 150vh;" data-theme="dark">
    <!-- Anchor alias for navigation -->
    <a id="faq-anchor" class="sr-only"></a>

    <!-- Sticky Full-Viewport Background (Canvas on Mobile/Tablet / Image on Desktop) -->
    <div class="faq-bg-sticky sticky top-0 left-0 w-full h-[100dvh] pointer-events-none overflow-hidden z-0" id="faq-bg-media">
      <!-- Mobile & Tablet Canvas: 60fps / 120fps Instant Frame-Sequence Scrubbing (Zero Stutter) -->
      <canvas
        id="faq-scroll-canvas"
        class="block lg:hidden w-full h-full object-cover object-center"
        style="will-change: transform; transform: translateZ(0); -webkit-transform: translateZ(0);"
      ></canvas>

      <!-- Desktop Static Background Image (1920x1080 Mirrored in RTL with Sculpted Brass Artwork on Left) -->
      <picture class="hidden lg:block w-full h-full">
        <source media="(min-width: 1025px)" srcset="/assets/images/faq-bg-desktop.jpg">
        <img src="/assets/images/faq-bg-desktop.jpg" alt="الأسئلة الشائعة حول تصنيع النحاس المخصص | ورشة تراث مصر" class="w-full h-full object-cover object-center" fetchpriority="high" />
      </picture>

      <!-- Subtle Dark Overlay for Optimal Readability & Clarity -->
      <div class="faq-bg-overlay absolute inset-0 pointer-events-none"></div>
    </div>

    <!-- Content Layer: Full Width -->
    <div class="faq-content-layer relative z-10 -mt-[100dvh] w-full max-w-full box-border">
      
      <!-- Full-Width Sticky Top Header (Pinned below Navbar at top: var(--nav-height, 50px)) -->
      <div class="faq-sticky-header sticky left-0 w-full z-40 px-4 sm:px-8 md:px-12 text-right pointer-events-none">
        <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider text-white uppercase drop-shadow-md" style="font-family: 'Cairo', sans-serif;">
          أسئلة شائعة
        </h2>
      </div>

      <!-- Scrollable Questions Container: 62% on Mobile/Tablet / 66.66% on Desktop (Flush Right in RTL) -->
      <div class="faq-scroll-list relative z-20 w-[62%] max-w-[62%] lg:w-[66.66%] lg:max-w-[66.66%] mr-0 ml-auto px-4 sm:px-8 md:px-12 pt-6 sm:pt-8 md:pt-10 pb-32 flex flex-col gap-6 box-border text-right" dir="rtl">
        ${categoriesHtml}

        <!-- Closing Statement -->
        <div class="faq-closing-statement text-right pt-10 pb-16 border-t border-[#D7C797]/20 flex flex-col gap-2">
          <p class="text-sm md:text-base font-bold text-[#D7C797] tracking-wider" style="font-family: 'Cairo', sans-serif;">
            تراث — تصنيع يدوي مصري فاخر من النحاس الخالص
          </p>
          <p class="text-xs md:text-sm text-neutral-400 font-normal leading-relaxed" style="font-family: 'Cairo', sans-serif;">
            نحوّل الأفكار والتصاميم إلى تحف نحاسية ومعمارية متقنة للمشاريع السكنية والفندقية والتجارية.
          </p>
        </div>

      </div>
    </div>
  </section>`;
}

fs.writeFileSync('scratch/arabic_faq_section.html', generateArabicFaqHtml(), 'utf8');
console.log('Generated scratch/arabic_faq_section.html successfully!');
