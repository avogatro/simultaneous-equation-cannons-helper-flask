import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const inputPath = './public/img/icon.png';
const outputPath192 = './public/img/icon-192.png';
const outputPath512 = './public/img/icon-512.png';

async function generateIcons() {
  try {
    await sharp(inputPath)
      .resize(192, 192)
      .png()
      .toFile(outputPath192);
      
    await sharp(inputPath)
      .resize(512, 512)
      .png()
      .toFile(outputPath512);
      
    console.log('Successfully generated PWA icons.');
  } catch (err) {
    console.error('Error generating icons:', err);
  }
}

generateIcons();
