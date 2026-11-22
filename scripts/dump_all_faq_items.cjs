const { faqSections, closingStatement } = require('../scratch/faq_data.cjs');

console.log('Sections count:', faqSections.length);
faqSections.forEach((sec, idx) => {
  console.log(`\n--- Section ${idx + 1}: ${sec.sectionTitle} (${sec.items.length} items) ---`);
  sec.items.forEach(it => {
    console.log(`[${it.id}] ${it.q}\n  -> ${it.a.slice(0, 80)}...`);
  });
});
console.log('\nClosing statement:', closingStatement);
