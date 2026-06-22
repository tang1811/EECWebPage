// One-off: convert curated department photos from the share into optimized .webp
// under public/assets/courses/depts/<slug>/, max 5 per dept, + a gallery manifest.
import sharp from 'sharp';
import { readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = '\\\\166.166.1.24\\ay 2565\\001 ข้อมูลส่วนกลาง\\ลงเว็บ\\ข้อมูลส่งให้คุณนัด\\รูปแต่ะละแผก ลงเว็บ';

// share folder name -> course slug
const MAP = {
  'ช่างยนต์(ปวช)': 'yon',
  'ช่างไฟฟ้า(ปวช)': 'faifaa',
  'ช่างกลโรงงาน (ปวช)': 'gear',
  'เมคคาทรอนิกส์และหุ่นยนต์ (ปวช)': 'mecha',
  'ดิจิทัลกราฟิก(ปวช)': 'graphic',
  'เทคโนโลยีธุรกิจดิจิทัล(ปวช)': 'biz-digital',
  'ไฟฟ้า (ปวส)': 'ps-electrical',
  'เทคนิคการผลิต( ปวส)': 'ps-production',
  'การจัดการโลจิสติกส์และซัพพลายเชน (ปวส)': 'ps-logistics',
  'ดิจิทัลกราฟิก(ปวส)': 'ps-graphic',
  'เมคคาทรอนิกส์และหุ่นยนต์(ปวส)': 'ps-mecha',
};
const MAX = 5;
const manifest = {};

for (const [folder, slug] of Object.entries(MAP)) {
  const dir = join(ROOT, folder);
  let files;
  try { files = readdirSync(dir).filter((f) => /\.(jpe?g|png)$/i.test(f)); }
  catch { console.log(`SKIP ${folder} (not found)`); continue; }
  // prefer the edited "-Enhanced-NR" shots, then the rest, cap at MAX
  files.sort((a, b) => (b.includes('Enhanced') ? 1 : 0) - (a.includes('Enhanced') ? 1 : 0) || a.localeCompare(b));
  const pick = files.slice(0, MAX);
  const out = join('public/assets/courses/depts', slug);
  mkdirSync(out, { recursive: true });
  manifest[slug] = [];
  let i = 0;
  for (const f of pick) {
    i++;
    const name = `g${i}.webp`;
    const info = await sharp(join(dir, f))
      .rotate()
      .resize({ width: 1280, height: 854, fit: 'cover', position: 'attention' })
      .webp({ quality: 80 })
      .toFile(join(out, name));
    manifest[slug].push(`/assets/courses/depts/${slug}/${name}`);
    console.log(`${slug}/${name}  (${Math.round(info.size / 1024)}KB)  <- ${f}`);
  }
}
writeFileSync('public/assets/courses/depts/gallery.json', JSON.stringify(manifest, null, 2));
console.log(`\nDone: ${Object.keys(manifest).length} depts.`);
