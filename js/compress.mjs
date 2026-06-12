import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const dir = './public/img';

// Define the source pngs and target webps
const filesToConvert = [
  { src: 'icon.png', dest: 'icon.webp' },
  { src: 'level_to_match.png', dest: 'level_to_match.webp' },
  { src: 'pre_banish.png', dest: 'pre_banish.webp' },
  { src: 'total_cards.png', dest: 'total_cards.webp' },
  { src: 'what_to_send.png', dest: 'what_to_send.webp' }
];

for (const { src, dest } of filesToConvert) {
  const srcPath = path.join(dir, src);
  const destPath = path.join(dir, dest);
  
  try {
    const srcStats = await fs.stat(srcPath);
    
    // Delete target if exists to avoid EPERM rename issues
    try {
      await fs.unlink(destPath);
    } catch(e) {}
    
    await sharp(srcPath)
      .webp({ quality: 60, effort: 6 }) 
      .toFile(destPath);
      
    const destStats = await fs.stat(destPath);
    console.log(`${dest}: Original PNG was ${Math.round(srcStats.size/1024)}KB -> Compressed WebP is ${Math.round(destStats.size/1024)}KB`);
  } catch (e) {
    console.error(`Failed to convert ${src} to ${dest}:`, e.message);
  }
}
