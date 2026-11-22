import fs from 'fs';

// Helper function to showShareToast
const toastFunctionDef = `
    function showShareToast(message) {
      let toast = document.getElementById('turath-share-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'turath-share-toast';
        toast.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(20px);background:rgba(20,18,16,0.94);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(215,199,151,0.6);color:#D7C797;padding:10px 24px;border-radius:30px;font-family:sans-serif;font-size:13px;letter-spacing:0.05em;z-index:999999;box-shadow:0 10px 35px rgba(0,0,0,0.7);opacity:0;transition:all 0.35s cubic-bezier(0.16,1,0.3,1);pointer-events:none;';
        document.body.appendChild(toast);
      }
      toast.innerText = message;
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
      clearTimeout(toast._timeout);
      toast._timeout = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
      }, 2500);
    }
`;

// 1. Process 20 product subpages
const productFiles = [
  'decor-ar.html', 'decor.html',
  'handles-ar.html', 'handles.html',
  'handrails-ar.html', 'handrails.html',
  'lighting-ar.html', 'lighting.html',
  'masterpieces-ar.html', 'masterpieces.html',
  'mirrors-ar.html', 'mirrors.html',
  'partitions-ar.html', 'partitions.html',
  'tables-ar.html', 'tables.html',
  'tableware-ar.html', 'tableware.html',
  'wall-art-ar.html', 'wall-art.html'
];

productFiles.forEach(fileName => {
  let html = fs.readFileSync(fileName, 'utf8');
  const isArabic = fileName.includes('-ar.html');
  const isMasterpieces = fileName.startsWith('masterpieces');

  // Match the block from `const shareBtn = document.getElementById('share-btn');` to `// Surgical Image & Media Protection`
  const shareBtnStart = html.indexOf("const shareBtn = document.getElementById('share-btn');");
  const protectionStart = html.indexOf("// Surgical Image & Media Protection");

  if (shareBtnStart === -1 || protectionStart === -1) {
    console.error(`Could not locate block in ${fileName}`);
    return;
  }

  const newBlock = `const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // Extract category slug from URL
        const path = window.location.pathname;
        const match = path.match(/\\/([a-z0-9-]+)(?:\\.html)?$/i);
        let categorySlug = match ? match[1].toLowerCase() : '${isMasterpieces ? 'masterpieces' : 'lighting'}';
        if (categorySlug === 'index' || !categorySlug) categorySlug = '${isMasterpieces ? 'masterpieces' : 'lighting'}';
        
        // Determine active product item & ID based on current slide
        const currentItem = (typeof sliderData !== 'undefined' && sliderData[currentIndex]) 
          ? sliderData[currentIndex] 
          : (typeof masterpiecesData !== 'undefined' && masterpiecesData[currentIndex])
          ? masterpiecesData[currentIndex]
          : null;
        
        const activeProductId = (currentItem && currentItem.id) 
          ? currentItem.id 
          : \`\${categorySlug}-item-\${(typeof currentIndex !== 'undefined' ? currentIndex : 0) + 1}\`;
        
        const title = (currentItem && currentItem.title) || (typeof titleEl !== 'undefined' && titleEl ? titleEl.innerText : document.title);
        const desc = (currentItem && currentItem.desc) || (${isArabic ? "'تحفة فنية فريدة مشغولة يدوياً من النحاس الخالص من ورشة تراث مصر.'" : "'A handcrafted authentic pure brass masterpiece by Turath Egypt.'"});
        
        const shareUrl = \`https://turath-egypt.vercel.app/products/\${activeProductId}/\`;
        const shareTitle = title + ' | Turath Egypt';
        const shareText = ${isArabic 
          ? "`\${title}\\n\${desc}\\n\\nاستكشف تفاصيل القطعة وصورها المشغولة يدوياً من النحاس الخالص:`" 
          : "`\${title}\\n\${desc}\\n\\nExplore high-resolution handcrafted brass details and craftsmanship:`"};

        // Capture product image as File for native share
        let fileToShare = null;
        try {
          const imgEl = document.getElementById('slider-image') || document.getElementById('masterpiece-img') || document.querySelector('.slider-card img');
          if (imgEl && navigator.canShare) {
            let blob = null;
            if (imgEl.naturalWidth > 0) {
              const canvas = document.createElement('canvas');
              canvas.width = imgEl.naturalWidth;
              canvas.height = imgEl.naturalHeight;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(imgEl, 0, 0);
              blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.90));
            }
            if (!blob && imgEl.src) {
              const res = await fetch(imgEl.src);
              blob = await res.blob();
            }
            if (blob) {
              const file = new File([blob], activeProductId + '.jpg', { type: 'image/jpeg' });
              if (navigator.canShare({ files: [file] })) {
                fileToShare = file;
              }
            }
          }
        } catch(err) {}

        if (navigator.share) {
          try {
            const shareData = {
              title: shareTitle,
              text: shareText,
              url: shareUrl
            };
            if (fileToShare) {
              shareData.files = [fileToShare];
            }
            await navigator.share(shareData);
            return;
          } catch (err) {
            if (fileToShare) {
              try {
                await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
                return;
              } catch (e2) {}
            }
          }
        }

        // Clipboard copy fallback with golden toast
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(shareUrl);
          } else {
            const ta = document.createElement('textarea');
            ta.value = shareUrl;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
          }
          showShareToast(${isArabic ? "'تم نسخ الرابط بنجاح!'" : "'Link copied to clipboard!'"});
          shareBtn.classList.add('text-white', 'scale-110');
          setTimeout(() => shareBtn.classList.remove('text-white', 'scale-110'), 1500);
        } catch(err) {
          showShareToast(${isArabic ? "'تم نسخ الرابط بنجاح!'" : "'Link copied to clipboard!'"});
        }
      });
    }

    // Direct WhatsApp Product Inquiry Button (With Rich Link Card Preview)
    const productWaBtn = document.getElementById('product-wa-btn');
    if (productWaBtn) {
      productWaBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const path = window.location.pathname;
        const match = path.match(/\\/([a-z0-9-]+)(?:\\.html)?$/i);
        let categorySlug = match ? match[1].toLowerCase() : '${isMasterpieces ? 'masterpieces' : 'lighting'}';
        if (categorySlug === 'index' || !categorySlug) categorySlug = '${isMasterpieces ? 'masterpieces' : 'lighting'}';

        const currentItem = (typeof sliderData !== 'undefined' && sliderData[currentIndex]) 
          ? sliderData[currentIndex] 
          : (typeof masterpiecesData !== 'undefined' && masterpiecesData[currentIndex])
          ? masterpiecesData[currentIndex]
          : null;
        const title = (currentItem && currentItem.title) || (typeof titleEl !== 'undefined' && titleEl ? titleEl.innerText : document.title);
        
        const activeProductId = (currentItem && currentItem.id) ? currentItem.id : \`\${categorySlug}-item-\${(typeof currentIndex !== 'undefined' ? currentIndex : 0) + 1}\`;
        const productUrl = \`https://turath-egypt.vercel.app/products/\${activeProductId}/\`;

        // Track Conversion Events
        if (typeof window.fbq === 'function') {
          window.fbq('track', 'Contact', { content_name: title, content_category: 'WhatsApp Product Inquiry' });
        }
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'generate_lead', { event_category: 'WhatsApp', event_label: title });
        }

        const waText = ${isArabic
          ? "`مرحباً ورشة تراث، أود الاستفسار عن تفصيل وسعر هذه القطعة:\\n\${title}\\n\${productUrl}`"
          : "`Hello Turath Egypt, I would like to inquire about customizing and pricing for this piece:\\n\${title}\\n\${productUrl}`"};
        window.open('https://wa.me/201016771010?text=' + encodeURIComponent(waText), '_blank', 'noopener,noreferrer');
      });
    }

    ${toastFunctionDef}

    `;

  html = html.substring(0, shareBtnStart) + newBlock + html.substring(protectionStart);
  fs.writeFileSync(fileName, html, 'utf8');
  console.log(`Updated ${fileName} successfully.`);
});

// 2. Process 2 video pages: action-ar.html & action.html
const videoFiles = ['action-ar.html', 'action.html'];
videoFiles.forEach(fileName => {
  let html = fs.readFileSync(fileName, 'utf8');
  const isArabic = fileName.includes('-ar.html');

  const shareBtnStart = html.indexOf("const shareBtn = document.getElementById('share-btn');");
  const protectionStart = html.indexOf("// Surgical Image & Media Protection");

  if (shareBtnStart === -1 || protectionStart === -1) {
    console.error(`Could not locate block in ${fileName}`);
    return;
  }

  const newBlock = `const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const film = filmsData[currentIndex] || filmsData[0];
        const activeProductId = film.id || ('action-item-' + (currentIndex + 1));
        const shareUrl = 'https://turath-egypt.vercel.app/products/' + activeProductId + '/';
        const shareTitle = film.title + ' | Turath Egypt';
        const shareText = ${isArabic
          ? "film.desc + '\\n\\nشاهد وثائقي حرفية النحاس اليدوي في ورش تراث التاريخية:'"
          : "film.desc + '\\n\\nWatch our documentary capturing handcrafted brass artistry at Turath workshops:'"};

        // Attempt live video frame snapshot or poster fallback
        let fileToShare = null;
        try {
          if (navigator.canShare) {
            let blob = null;
            if (videoEl && videoEl.videoWidth > 0) {
              const canvas = document.createElement('canvas');
              canvas.width = videoEl.videoWidth;
              canvas.height = videoEl.videoHeight;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
              blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.90));
            }
            if (!blob) {
              const posterSrc = (film && (film.poster || film.thumb)) || (videoEl && videoEl.poster);
              if (posterSrc) {
                const res = await fetch(posterSrc);
                blob = await res.blob();
              }
            }
            if (blob) {
              const file = new File([blob], activeProductId + '-frame.jpg', { type: 'image/jpeg' });
              if (navigator.canShare({ files: [file] })) {
                fileToShare = file;
              }
            }
          }
        } catch (err) {}

        if (navigator.share) {
          try {
            const shareData = {
              title: shareTitle,
              text: shareText,
              url: shareUrl
            };
            if (fileToShare) {
              shareData.files = [fileToShare];
            }
            await navigator.share(shareData);
            return;
          } catch (err) {
            if (fileToShare) {
              try {
                await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
                return;
              } catch (e) {}
            }
          }
        }

        // Clipboard copy fallback with golden toast
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(shareUrl);
          } else {
            const ta = document.createElement('textarea');
            ta.value = shareUrl;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
          }
          showShareToast(${isArabic ? "'تم نسخ الرابط بنجاح!'" : "'Link copied to clipboard!'"});
          shareBtn.classList.add('text-white', 'scale-110');
          setTimeout(() => shareBtn.classList.remove('text-white', 'scale-110'), 1500);
        } catch(err) {
          showShareToast(${isArabic ? "'تم نسخ الرابط بنجاح!'" : "'Link copied to clipboard!'"});
        }
      });
    }

    // Direct WhatsApp Product Inquiry Button (With Rich Link Card Preview)
    const productWaBtn = document.getElementById('product-wa-btn');
    if (productWaBtn) {
      productWaBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const film = filmsData[currentIndex] || filmsData[0];
        const title = (film && film.title) || document.title;
        const activeProductId = film.id || ('action-item-' + (currentIndex + 1));
        const productUrl = 'https://turath-egypt.vercel.app/products/' + activeProductId + '/';

        // Track Conversion Events
        if (typeof window.fbq === 'function') {
          window.fbq('track', 'Contact', { content_name: title, content_category: 'WhatsApp Documentary Inquiry' });
        }
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'generate_lead', { event_category: 'WhatsApp', event_label: title });
        }

        const waText = ${isArabic
          ? "`مرحباً ورشة تراث، أود الاستفسار عن هذا العمل التوثيقي:\\n\${title}\\n\${productUrl}`"
          : "`Hello Turath Egypt, I would like to inquire about this craftsmanship documentary:\\n\${title}\\n\${productUrl}`"};
        window.open('https://wa.me/201016771010?text=' + encodeURIComponent(waText), '_blank', 'noopener,noreferrer');
      });
    }

    ${toastFunctionDef}

    `;

  html = html.substring(0, shareBtnStart) + newBlock + html.substring(protectionStart);
  fs.writeFileSync(fileName, html, 'utf8');
  console.log(`Updated ${fileName} successfully.`);
});
