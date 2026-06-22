// One-off: convert 35 staff portraits (.jpg, Thai-named) from the network share
// into optimized .webp in public/assets/staff/portraits/, with a name manifest.
import sharp from 'sharp';
import { readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = '\\\\166.166.1.24\\ay 2565\\001 ข้อมูลส่วนกลาง\\ลงเว็บ\\ข้อมูลส่งให้คุณนัด\\รูปบุคลลากร\\ภาพอาจารย์';
const OUT = 'public/assets/staff/portraits';
mkdirSync(OUT, { recursive: true });

const files = readdirSync(SRC).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
const manifest = [];
let i = 0;
for (const f of files) {
  i++;
  const id = 'p' + String(i).padStart(2, '0');
  const out = `${id}.webp`;
  const info = await sharp(join(SRC, f))
    .rotate()
    .resize({ width: 640, height: 800, fit: 'cover', position: 'top' })
    .webp({ quality: 82 })
    .toFile(join(OUT, out));
  const thai = f.replace(/\.(jpe?g|png)$/i, '');
  manifest.push({ id, file: `/assets/staff/portraits/${out}`, name: thai, kb: Math.round(info.size / 1024) });
  console.log(`${id}  ${thai}  -> ${out} (${Math.round(info.size / 1024)}KB)`);
}
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`\nDone: ${manifest.length} portraits -> ${OUT}`);
