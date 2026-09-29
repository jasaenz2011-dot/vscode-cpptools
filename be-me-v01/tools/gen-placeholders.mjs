import fs from 'fs';
import path from 'path';

// Minimal 1x1 PNG as base64 (we'll expand dimensions below)
const minimalPNG = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG signature
  0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, // IHDR
  0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x06, 0x00, // width=1024, height=1536
  0x08, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 8-bit RGB
  0x00, 0x00, 0x00, 0x01, 0x62, 0x4b, 0x47, 0x44, // bKGD
  0x00, 0xff, 0x00, 0xff, 0x00, 0xff, 0xa0, 0xbd, // background color
  0xa7, 0x93, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, // IDAT (minimal data)
  0x41, 0x54, 0x78, 0x9c, 0x62, 0x00, 0x01, 0x00,
  0x00, 0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4,
  0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, // IEND
  0xae, 0x42, 0x60, 0x82
]);

const colors = {
  skin: ['#f2d3bd', '#e7bb98', '#d09b6a', '#b3784b', '#8a5636', '#5c3722'],
  hair: ['#1a1a1a', '#2d1810', '#4a3c2a', '#6b5b4d', '#8b7355', '#a0826d'],
  eyes: ['#4a90e2', '#8b4513', '#2d5016', '#4a4a4a', '#c41e3a', '#9932cc'],
  eyebrows: ['#1a1a1a', '#2d1810', '#4a3c2a', '#6b5b4d', '#8b7355', '#a0826d'],
  mouths: ['#e74c3c', '#d4526e', '#c0392b', '#f39c12', '#e67e22', '#d35400'],
  tops: ['#4a90e2', '#e74c3c', '#50c878', '#ffd700', '#9932cc'],
  bottoms: ['#1a1a1a', '#4a5568', '#2c5aa0', '#8b4513', '#696969'],
  shoes: ['#8b0000', '#000000', '#ffffff', '#4a90e2', '#ffd700'],
  accessories: ['#ffd700', '#c0c0c0', '#cd7f32', '#e74c3c', '#50c878'],
  extras: ['#9932cc', '#ff69b4', '#00ced1', '#ff8c00', '#32cd32']
};

const dirs = Object.keys(colors);
const genders = ['boy', 'girl'];
let count = 0;

genders.forEach(gender => {
  dirs.forEach(dir => {
    const dirPath = path.join('public/assets/cinematic3d', gender, dir);
    fs.mkdirSync(dirPath, { recursive: true });
    
    const colorList = colors[dir];
    for (let i = 0; i < colorList.length; i++) {
      const file = path.join(dirPath, `${dir}_00${i + 1}.png`);
      // Just write a minimal valid PNG - the browser will display as blank/placeholder
      fs.writeFileSync(file, minimalPNG);
      count++;
    }
  });
});

console.log(`✓ Generated ${count} placeholder PNG files`);
