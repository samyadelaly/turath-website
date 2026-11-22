const fs = require('fs');

const content = fs.readFileSync('lighting-ar.html', 'utf8');
const updateSlideMatch = content.match(/function\s+updateSlide[\s\S]*?{[\s\S]*?}/);
if (updateSlideMatch) {
  console.log('updateSlide function:', updateSlideMatch[0].slice(0, 400));
} else {
  // search for sliderImage.src
  const idx = content.indexOf('sliderImage.src');
  if (idx !== -1) {
    console.log('Around sliderImage.src:', content.slice(idx - 100, idx + 200));
  } else {
    console.log('No sliderImage.src found');
  }
}
