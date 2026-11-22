import fs from 'fs';

let js = fs.readFileSync('src/main.js', 'utf8');

const oldFuncStart = '// 11. SECTION 08: CONTACT TURATH (DYNAMIC CORNER MORPHING & OVERLAP SCROLL)';
const oldFuncEnd = '// 12. PHONE DROPDOWN (CALL & WHATSAPP)';

const startIdx = js.indexOf(oldFuncStart);
const endIdx = js.indexOf(oldFuncEnd);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find start or end index for initContactSection');
  process.exit(1);
}

const newFunc = `// 11. SECTION 08: CONTACT TURATH (2-STEP SCROLLING MORPHING ANIMATION OVER PREVIOUS SECTION)
function initContactSection() {
  const contact = document.querySelector("#contact");
  if (!contact) return;

  // Clear any residual dome styles
  contact.style.borderTopLeftRadius = '0px';
  contact.style.borderTopRightRadius = '0px';

  // 2-step geometric staircase reveal (Scrolling Morphing Animation ascending over FAQ)
  // In LTR: Right column leads at 0vh, middle at 33vh, left at 66vh
  // In RTL: Mirrored horizontally from right to left so left column leads at 0vh
  const isRTL = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';
  const startPoly = isRTL
    ? 'polygon(0% 100%, 0% 0vh, 33.33% 0vh, 33.33% 33vh, 66.66% 33vh, 66.66% 66vh, 100% 66vh, 100% 100%)'
    : 'polygon(0% 100%, 0% 66vh, 33.33% 66vh, 33.33% 33vh, 66.66% 33vh, 66.66% 0vh, 100% 0vh, 100% 100%)';

  const endPoly = 'polygon(0% 100%, 0% 0vh, 33.33% 0vh, 33.33% 0vh, 66.66% 0vh, 66.66% 0vh, 100% 0vh, 100% 100%)';

  gsap.set(contact, { 
    clipPath: startPoly,
    borderTopLeftRadius: '0px',
    borderTopRightRadius: '0px'
  });

  gsap.to(contact, {
    clipPath: endPoly,
    ease: "none",
    scrollTrigger: {
      trigger: contact,
      start: "top bottom",
      end: "top top",
      scrub: 1.5,
      invalidateOnRefresh: true
    }
  });

  // Parallax subtle float on contact background media
  const contactMedia = document.getElementById("contact-bg-media");
  if (contactMedia) {
    gsap.fromTo(contactMedia,
      { y: -25 },
      {
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: contact,
          start: 'top bottom',
          end: 'top top',
          scrub: 1.5
        }
      }
    );
  }
}

`;

js = js.substring(0, startIdx) + newFunc + js.substring(endIdx);
fs.writeFileSync('src/main.js', js, 'utf8');
console.log('Successfully updated initContactSection in src/main.js');
