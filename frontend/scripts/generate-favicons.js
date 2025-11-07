const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const faviconSvg = path.join(publicDir, 'favicon.svg');

async function generateFavicons() {
  if (!fs.existsSync(faviconSvg)) {
    console.error('❌ favicon.svg not found!');
    return;
  }

  const sizes = [
    { size: 16, name: 'favicon-16x16.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 192, name: 'favicon-192x192.png' },
    { size: 512, name: 'favicon-512x512.png' },
  ];

  console.log('🎨 Generating favicon files...\n');

  for (const { size, name } of sizes) {
    try {
      await sharp(faviconSvg)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 69, g: 127, b: 255, alpha: 1 }
        })
        .png()
        .toFile(path.join(publicDir, name));
      console.log(`✅ Created ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Failed to create ${name}:`, error.message);
    }
  }

  // Create favicon.ico (multi-size ICO)
  try {
    const ico16 = await sharp(faviconSvg).resize(16, 16).png().toBuffer();
    const ico32 = await sharp(faviconSvg).resize(32, 32).png().toBuffer();
    
    // Note: Creating a proper multi-size ICO requires a specialized library
    // For now, we'll create a simple ICO from the 32x32 PNG
    await sharp(ico32)
      .toFile(path.join(publicDir, 'favicon.ico'));
    console.log(`✅ Created favicon.ico`);
  } catch (error) {
    console.error(`❌ Failed to create favicon.ico:`, error.message);
    console.log('💡 Tip: Use an online tool to create a proper multi-size ICO file');
  }

  console.log('\n✨ Favicon generation complete!');
}

generateFavicons().catch(console.error);

