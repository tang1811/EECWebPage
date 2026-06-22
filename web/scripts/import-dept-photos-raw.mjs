// Import the remaining departments from the RAW (uncurated) photo sets and MERGE
// into the existing public/assets/courses/depts/gallery.json. Auto-picks first 5.
import sharp from 'sharp';
import { readdirSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const RAW = '\\\\166.166.1.24\\ay 2565\\001 ข้อมูลส่วนกลาง\\ลงเว็บ\\รูปแต่ละแผก';

// slug -> [yearFolder, deptFolder]  (ปวช + ปวส of same dept reuse the same lab shots)
const MAP = {
  electronic:      ['งานถ่ายแต่ละแผนก68', 'อิเล็กทรอนิกส์'],
  'ps-electronic': ['งานถ่ายแต่ละแผนก68', 'อิเล็กทรอนิกส์'],
  accounting:      ['งานถ่ายแต่ละแผนกปี66', 'การบัญชี'],
  'ps-accounting': ['งานถ่ายแต่ละแผนกปี66', 'การบัญชี'],
  'ps-mech':       ['งานถ่ายแต่ละแผนก68', 'เทคนิคยานยนต์'],
};
const MAX = 5;
const manifestPath = 'public/assets/courses/depts/gallery.json';
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

for (const [slug, [yr, dept]] of Object.entries(MAP)) {
  const dir = join(RAW, yr, dept);
  let files;
  try { files = readdirSync(dir).filter((f) => /\.(jpe?g|png)$/i.test(f)); }
  catch { console.log(`SKIP ${slug} (${dept} not found)`); continue; }
  files.sort((a, b) => a.localeCompare(b));
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
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`\nMerged. Total depts now: ${Object.keys(manifest).length}`);
