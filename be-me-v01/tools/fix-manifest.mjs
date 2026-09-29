import fs from 'fs';
import path from 'path';

const manifest = JSON.parse(fs.readFileSync('public/assets/manifest.json', 'utf8'));

const updated = manifest.assets.map(asset => {
  if (!asset.files || !asset.files.front) return asset;
  
  // Remove leading / and join with public dir
  const filePath = asset.files.front.startsWith('/') 
    ? asset.files.front.substring(1) 
    : asset.files.front;
  const fullPath = path.join('public', filePath);
  const exists = fs.existsSync(fullPath);
  
  if (!exists && asset.enabled) {
    console.log(`✗ ${asset.id} (${fullPath})`);
    return { ...asset, enabled: false };
  }
  if (exists && !asset.enabled) {
    console.log(`✓ ${asset.id}`);
    return { ...asset, enabled: true };
  }
  return asset;
});

fs.writeFileSync('public/assets/manifest.json', JSON.stringify({
  ...manifest,
  assets: updated
}, null, 2));

const enabled = updated.filter(a => a.enabled).length;
const disabled = updated.filter(a => !a.enabled).length;
console.log(`\n✓ Manifest fixed: ${enabled} enabled, ${disabled} disabled`);
