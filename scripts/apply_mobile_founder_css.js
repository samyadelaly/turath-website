import fs from 'fs';

let css = fs.readFileSync('src/style.css', 'utf8');

const mobileFounderAndContactCSS = `
/* ==========================================================================
   MOBILE & TABLET: FOUNDER & CONTACT LAYOUT TUNING (NAV CLEARANCE & FULL SCROLL)
   ========================================================================== */
@media (max-width: 1023px) {
  /* 1. Founder: Ensure clear clearance below the 50px navbar, tighten vertical spacing */
  #scene-07.founder-section,
  html[dir="rtl"] #scene-07.founder-section {
    padding-top: clamp(62px, 8.5vh, 75px) !important;
    padding-bottom: 2rem !important;
  }
  .founder-editorial-card {
    padding: 0 !important;
    margin: 0 auto !important;
  }
  .founder-tag {
    font-size: 0.65rem !important;
    margin-bottom: 0.2rem !important;
    letter-spacing: 0.18em !important;
  }
  .founder-section h2,
  .founder-title,
  .founder-name,
  html[dir="rtl"] .founder-title,
  html[dir="rtl"] .founder-name,
  html[dir="rtl"] .founder-section h2 {
    font-size: clamp(1.1rem, 4.2vw, 1.35rem) !important;
    font-weight: 600 !important;
    line-height: 1.25 !important;
    margin: 0 auto 0.3rem auto !important;
  }
  .founder-subhead,
  html[dir="rtl"] .founder-subhead {
    font-size: clamp(0.70rem, 2.7vw, 0.82rem) !important;
    line-height: 1.35 !important;
    margin: 0 auto 0.4rem auto !important;
  }
  .founder-bio,
  html[dir="rtl"] .founder-bio {
    gap: 0.25rem !important;
    font-size: clamp(0.75rem, 2.8vw, 0.84rem) !important;
    line-height: 1.5 !important;
  }
  .founder-bio p,
  html[dir="rtl"] .founder-bio p {
    margin: 0 !important;
  }

  /* 2. Contact: Generous bottom clearance ensuring touch scroll glides to the end */
  #contact.contact-section,
  html[dir="rtl"] #contact.contact-section {
    padding-bottom: clamp(6rem, 15vh, 9rem) !important;
  }
}
`;

// Append to src/style.css
css += '\n' + mobileFounderAndContactCSS;
fs.writeFileSync('src/style.css', css, 'utf8');
console.log('Appended mobileFounderAndContactCSS to src/style.css');
