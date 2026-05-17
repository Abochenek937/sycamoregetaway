// Reorganizes photos into category folders. Run once, then delete.
// Reads original photos from public/photos/<room>/ and copies them into
// public/photos/<category>/NN.jpeg with new sequential numbers.

import fs from 'node:fs';
import path from 'node:path';

const root = 'public/photos';

// Source files → target category. Order within each category preserved.
const map = {
  'master': [
    'sycamore/02.jpeg',
    'sycamore/03.png',
    'sycamore/01.jpeg',
    'sycamore/04.jpeg',
    'sycamore/06.jpeg',
    'sycamore/08.jpeg',
    'sycamore/09.jpeg',
    'sycamore/10.jpeg',
    'sycamore/11.jpeg',
    'sycamore/12.jpeg',
  ],
  'kitchen-living': [
    'oak/01.jpeg',     // Main Kitchen Photo (placed first - hero)
    'sycamore/05.jpeg',
    'buckeye/08.jpeg',
    'buckeye/09.jpeg',
    'oak/05.jpeg',
    'oak/06.jpeg',
    'oak/09.jpeg',
    'oak/10.jpeg',
    'oak/11.jpeg',
    'oak/12.jpeg',
    'maple/10.jpeg',
    'maple/11.jpeg',
  ],
  'back-porch-pool': [
    'buckeye/04.jpeg',
    'buckeye/06.jpeg',
    'oak/08.jpeg',
    'maple/05.jpeg',
    'maple/08.jpeg',
    'maple/09.jpeg',
  ],
  'courtyard': [
    'buckeye/07.jpeg',
    'willow/07.jpeg',
    'willow/11.jpeg',
  ],
  'sandy': [
    'buckeye/11.jpeg',
  ],
  'front-of-house': [
    'buckeye/12.jpeg',
    'oak/07.jpg',
    'willow/04.jpg',
    'willow/05.jpeg',
  ],
  'bathroom': [
    'maple/06.jpeg',
    'maple/07.jpeg',
  ],
  // Bedroom hero shots — kept in their original room folders for clarity.
  // Buckeye: 01, 02, 03 are bedroom shots
  // Oak: 02, 03, 04 are bedroom shots (01 is the kitchen, already moved above)
  // Maple: 01, 02, 03, 04 are bedroom shots
};

// Bedroom shots that should stay in their existing room folder (but renumbered/cleaned).
// Source → just stays put; we'll reference them by current path.
const bedrooms = {
  'buckeye-bedroom': ['buckeye/01.jpeg', 'buckeye/02.jpeg', 'buckeye/03.jpeg'],
  'oak-bedroom':     ['oak/02.jpeg', 'oak/03.jpeg', 'oak/04.jpeg'],
  'maple-bedroom':   ['maple/01.jpeg', 'maple/02.jpeg', 'maple/03.jpeg', 'maple/04.jpeg'],
  // Willow has NO bedroom shots — will be a placeholder on the site.
};

// Stragglers that don't fit any category but stay on disk (referenced nowhere).
const ignored = ['willow/02.jpg', 'willow/09.jpg'];

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyPhotoToCategory(srcRel, targetDir, idx) {
  const src = path.join(root, srcRel);
  if (!fs.existsSync(src)) {
    console.warn(`  MISSING: ${srcRel}`);
    return null;
  }
  const ext = path.extname(srcRel).toLowerCase();
  const fname = String(idx + 1).padStart(2, '0') + ext;
  const dest = path.join(targetDir, fname);
  fs.copyFileSync(src, dest);
  return `/photos/${path.basename(targetDir)}/${fname}`;
}

const result = {};

console.log('--- Categories ---');
for (const [cat, files] of Object.entries(map)) {
  const dir = path.join(root, cat);
  ensureDir(dir);
  result[cat] = [];
  for (let i = 0; i < files.length; i++) {
    const url = copyPhotoToCategory(files[i], dir, i);
    if (url) result[cat].push(url);
  }
  console.log(`  ${cat}: ${result[cat].length} photos`);
}

console.log('\n--- Bedrooms ---');
for (const [cat, files] of Object.entries(bedrooms)) {
  const dir = path.join(root, cat);
  ensureDir(dir);
  result[cat] = [];
  for (let i = 0; i < files.length; i++) {
    const url = copyPhotoToCategory(files[i], dir, i);
    if (url) result[cat].push(url);
  }
  console.log(`  ${cat}: ${result[cat].length} photos`);
}

// Write a manifest the rooms.ts can import.
fs.writeFileSync(
  path.join(root, 'manifest.json'),
  JSON.stringify(result, null, 2)
);
console.log('\nManifest written to public/photos/manifest.json');
console.log('Done. Originals still in /photos/<room>/ — delete those folders manually if you want.');
