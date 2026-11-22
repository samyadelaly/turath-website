import fs from 'fs';

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
        const film = (typeof filmsData !== 'undefined' && filmsData[currentIndex]) ? filmsData[currentIndex] : filmsData[0];
        const pageName = '${isArabic ? 'action-ar.html' : 'action.html'}';
        const shareUrl = 'https://turath-egypt.vercel.app/' + pageName + '?film=' + currentIndex;
        const shareTitle = film.title + ' | Turath Egypt';
        const shareText = ${isArabic
          ? "film.title + '\\n' + film.desc + '\\n\\nشاهد وثائقي حرفية النحاس اليدوي في ورش تراث التاريخية:\\n' + shareUrl"
          : "film.title + '\\n' + film.desc + '\\n\\nWatch our documentary capturing handcrafted brass artistry at Turath workshops:\\n' + shareUrl"};

        // Live video frame snapshot or poster fallback
        let fileToShare = null;
        try {
          if (navigator.canShare) {
            let blob = null;
            const videoEl = document.getElementById('slider-video');
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
              const file = new File([blob], 'turath-documentary-' + (currentIndex + 1) + '.jpg', { type: 'image/jpeg' });
              if (navigator.canShare({ files: [file] })) {
                fileToShare = file;
              }
            }
          }
        } catch (err) {}

        // Native share with file & text (with link inside text for 100% platform support)
        if (navigator.share) {
          try {
            const shareData = {
              title: shareTitle,
              text: shareText
            };
            if (fileToShare) {
              shareData.files = [fileToShare];
            } else {
              shareData.url = shareUrl;
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
          showShareToast(${isArabic ? "'تم نسخ رابط الفيديو بنجاح!'" : "'Video link copied to clipboard!'"});
          shareBtn.classList.add('text-white', 'scale-110');
          setTimeout(() => shareBtn.classList.remove('text-white', 'scale-110'), 1500);
        } catch(err) {
          showShareToast(${isArabic ? "'تم نسخ رابط الفيديو بنجاح!'" : "'Video link copied to clipboard!'"});
        }
      });
    }

    // Direct WhatsApp Inquiry Button (Direct Link to Video)
    const productWaBtn = document.getElementById('product-wa-btn');
    if (productWaBtn) {
      productWaBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const film = (typeof filmsData !== 'undefined' && filmsData[currentIndex]) ? filmsData[currentIndex] : filmsData[0];
        const title = (film && film.title) || document.title;
        const pageName = '${isArabic ? 'action-ar.html' : 'action.html'}';
        const videoUrl = 'https://turath-egypt.vercel.app/' + pageName + '?film=' + currentIndex;

        // Track Conversion Events
        if (typeof window.fbq === 'function') {
          window.fbq('track', 'Contact', { content_name: title, content_category: 'WhatsApp Documentary Inquiry' });
        }
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'generate_lead', { event_category: 'WhatsApp', event_label: title });
        }

        const waText = ${isArabic
          ? "`مرحباً ورشة تراث، أود الاستفسار عن هذا العمل التوثيقي:\\n\${title}\\n\${videoUrl}`"
          : "`Hello Turath Egypt, I would like to inquire about this craftsmanship documentary:\\n\${title}\\n\${videoUrl}`"};
        window.open('https://wa.me/201016771010?text=' + encodeURIComponent(waText), '_blank', 'noopener,noreferrer');
      });
    }

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

  html = html.substring(0, shareBtnStart) + newBlock + html.substring(protectionStart);
  fs.writeFileSync(fileName, html, 'utf8');
  console.log(`Updated ${fileName} video share & WhatsApp successfully.`);
});
