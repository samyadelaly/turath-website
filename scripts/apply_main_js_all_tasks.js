import fs from 'fs';

let mainJs = fs.readFileSync('src/main.js', 'utf8');

// 1. Task 2: Contact section architectural geometric morphing reveal
const oldContactSection = /\/\/ 11\. SECTION 08: CONTACT TURATH[\s\S]*?function initContactSection\(\) \{[\s\S]*?\}\n\}/;

const newContactSection = `// 11. SECTION 08: CONTACT TURATH (ARCHITECTURAL 2-STEP GEOMETRIC SCROLLING MORPHING ASCENDING OVER FAQ)
function initContactSection() {
  const contact = document.querySelector("#contact");
  const faqSection = document.querySelector("#faq");
  if (!contact) return;

  // Clear any residual border radius
  contact.style.borderTopLeftRadius = '0px';
  contact.style.borderTopRightRadius = '0px';

  // Curtain overlap: Pin FAQ when its bottom reaches bottom of viewport,
  // allowing Contact to climb directly OVER it as the user scrolls
  if (faqSection) {
    ScrollTrigger.create({
      trigger: faqSection,
      start: "bottom bottom",
      endTrigger: contact,
      end: "top top",
      pin: true,
      pinSpacing: false,
      anticipatePin: 1
    });
  }

  // Signature Architectural Geometric 2-step Staircase Reveal matching Scenes 05 & 06
  const isRTL = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';
  const startPoly = isRTL
    ? "polygon(0% 100%, 0% 0%, 33% 0%, 33% 33%, 66% 33%, 66% 66%, 100% 66%, 100% 100%)"
    : "polygon(0% 100%, 0% 66%, 33% 66%, 33% 33%, 66% 33%, 66% 0%, 100% 0%, 100% 100%)";

  const endPoly = "polygon(0% 100%, 0% 0%, 33% 0%, 33% 0%, 66% 0%, 66% 0%, 100% 0%, 100% 100%)";

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
      scrub: 1.2,
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
          scrub: 1.2
        }
      }
    );
  }
}`;

if (oldContactSection.test(mainJs)) {
  mainJs = mainJs.replace(oldContactSection, newContactSection);
  console.log('Task 2: Replaced initContactSection with architectural geometric staircase reveal!');
} else {
  console.error('Task 2: oldContactSection regex did not match!');
}

// 2. Task 4: Reverse card movement in Collections and Craftsmanship for Arabic
// In scrollCollections:
const oldScrollCollections = `    function scrollCollections(direction) {
      const card = collectionsTrack.querySelector('.collection-card');
      const scrollStep = card ? (card.offsetWidth + 16) : (collectionsTrack.clientWidth * 0.8);
      const isRTL = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar' || window.getComputedStyle(collectionsTrack).direction === 'rtl';
      const dirMultiplier = isRTL ? -direction : direction;
      collectionsTrack.scrollBy({
        left: dirMultiplier * scrollStep,
        behavior: 'smooth'
      });
    }`;

const newScrollCollections = `    function scrollCollections(direction) {
      const card = collectionsTrack.querySelector('.collection-card');
      const scrollStep = card ? (card.offsetWidth + 16) : (collectionsTrack.clientWidth * 0.8);
      const isRTL = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar' || window.getComputedStyle(collectionsTrack).direction === 'rtl';
      // Invert card movement direction for Arabic site per user specification
      const dirMultiplier = isRTL ? direction : -direction;
      collectionsTrack.scrollBy({
        left: dirMultiplier * scrollStep,
        behavior: 'smooth'
      });
    }`;

if (mainJs.includes(oldScrollCollections)) {
  mainJs = mainJs.replace(oldScrollCollections, newScrollCollections);
  console.log('Task 4a: Reversed Collections scroll direction for Arabic!');
} else {
  console.error('Task 4a: oldScrollCollections string not found!');
}

// In scrollSlats:
const oldScrollSlats = `  function scrollSlats(direction) {
    if (!slatsTrack) return;
    const card = slatsTrack.querySelector(".video-slat-item");
    const step = card ? (card.offsetWidth + 20) : (slatsTrack.clientWidth * 0.7);
    slatsTrack.scrollBy({
      left: direction * step,
      behavior: "smooth"
    });
  }`;

const newScrollSlats = `  function scrollSlats(direction) {
    if (!slatsTrack) return;
    const card = slatsTrack.querySelector(".video-slat-item");
    const step = card ? (card.offsetWidth + 20) : (slatsTrack.clientWidth * 0.7);
    const isRTL = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar';
    // Invert craftsmanship slats movement direction for Arabic site per user specification
    const dirMultiplier = isRTL ? -direction : direction;
    slatsTrack.scrollBy({
      left: dirMultiplier * step,
      behavior: "smooth"
    });
  }`;

if (mainJs.includes(oldScrollSlats)) {
  mainJs = mainJs.replace(oldScrollSlats, newScrollSlats);
  console.log('Task 4b: Reversed Craftsmanship slats scroll direction for Arabic!');
} else {
  console.error('Task 4b: oldScrollSlats string not found!');
}

// 3. Task 5: Founder image settles at daytime / fully lit phase
// In smoothScrollToSemanticHash:
mainJs = mainJs.replace(
  /\/\/ Land at start of pinned illumination crossfade where founder & lamp are centered and FAQ is safely off-screen\s+const targetY = st && typeof st\.start === 'number'\s+\?\s+st\.start\s+:\s+\(founderEl\.getBoundingClientRect\(\)\.top \+ window\.scrollY\);/,
  `// Target 35% of the pinned illumination crossfade where the founder & lamp are 100% lit in the daytime phase
        const targetY = st && typeof st.start === 'number'
          ? (st.start + (st.end - st.start) * 0.35)
          : (founderEl.getBoundingClientRect().top + window.scrollY);`
);

// In handleInitialDeepLink:
mainJs = mainJs.replace(
  /} else if \(realId === 'scene-07' \|\| hashToResolve === 'founder'\) \{\s+const triggers = ScrollTrigger\.getAll\(\)\.filter\(t => t\.trigger === target\);\s+const st = triggers\.find\(t => t\.pin\) \|\| triggers\[0\];\s+targetY = st && typeof st\.start === 'number'\s+\?\s+st\.start\s+:\s+\(target\.getBoundingClientRect\(\)\.top \+ window\.scrollY\);/,
  `} else if (realId === 'scene-07' || hashToResolve === 'founder') {
    const triggers = ScrollTrigger.getAll().filter(t => t.trigger === target);
    const st = triggers.find(t => t.pin) || triggers[0];
    targetY = st && typeof st.start === 'number'
      ? (st.start + (st.end - st.start) * 0.35)
      : (target.getBoundingClientRect().top + window.scrollY);`
);

fs.writeFileSync('src/main.js', mainJs, 'utf8');
console.log('All main.js updates applied successfully!');
