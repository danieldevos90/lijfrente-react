const fs = require('fs');
const path = require('path');

// Simple SVG favicon with "G" for GeldGeregeld
const faviconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#457fff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2d5cdd;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="32" height="32" fill="url(#grad)" rx="6"/>
  <text x="16" y="23" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="white" text-anchor="middle">G</text>
</svg>`;

// Write SVG favicon
fs.writeFileSync(path.join(__dirname, 'public', 'favicon.svg'), faviconSVG);
console.log('✅ Created favicon.svg');

// Note: PNG and ICO files need to be generated using an image processing tool
// Run: npm install sharp --save-dev
// Then use the generate-favicons.js script

console.log('\n📝 Next steps:');
console.log('1. Install sharp: npm install sharp --save-dev');
console.log('2. Run: node scripts/generate-favicons.js');
console.log('3. Or use an online tool like https://realfavicongenerator.net/');

