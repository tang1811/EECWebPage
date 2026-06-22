// Convert real innovation-project photos from the share into optimized webp,
// GROUPED per project (only projects that actually have photos get a card).
import sharp from 'sharp';
import { readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = '\\\\166.166.1.24\\ay 2565\\002 งานประกันคุณภาพ\\04งานประกันคุณภาพ\\SAR_2568\\มาตรฐานที่3\\3.2 ด้านนวัตกรรม\\3.2.1 ด้านนวัตกรรม\\2.Do';

const PROJECTS = [
  {
    id: 'foam-cutter', type: 'สิ่งประดิษฐ์',
    title: 'เครื่องตัดโฟมอัตโนมัติ',
    titleEn: 'Automatic Foam Cutting Machine',
    desc: 'สิ่งประดิษฐ์ของนักศึกษาที่นำหลักการควบคุมอัตโนมัติมาสร้างเครื่องตัดโฟมตามแบบ ใช้งานจริงในห้องปฏิบัติการ และเข้าร่วมการประกวดสิ่งประดิษฐ์ระดับอาชีวศึกษา ปีการศึกษา 2568',
    dir: '5.โครงการประกวดนวัตกรรมสิ่งประดิษฐ์\\รูปการนำไปใช้', take: 6,
  },
  {
    id: 'contest', type: 'การประกวด',
    title: 'ประกวดสิ่งประดิษฐ์ ระดับอาชีวศึกษา 2568',
    titleEn: 'Innovation & Invention Contest 2568',
    desc: 'นักศึกษานำผลงานสิ่งประดิษฐ์และนวัตกรรมเข้าร่วมการประกวดระดับอาชีวศึกษาเอกชน กลุ่มภาคกลาง ปีการศึกษา 2568',
    dir: '5.โครงการประกวดนวัตกรรมสิ่งประดิษฐ์\\รูปภาพการประกวด', take: 6,
  },
  {
    id: 'project-present', type: 'โครงงาน / งานวิจัย',
    title: 'นำเสนอโครงงานวิชาชีพ 2568',
    titleEn: 'Professional Project Presentation 2568',
    desc: 'นักศึกษา ปวช.3 และ ปวส.2 นำเสนอโครงงานวิชาชีพ งานวิจัย และนวัตกรรม ปีการศึกษา 2568 — รวมงานวิจัยกรณีศึกษาจากสถานประกอบการจริงในเขต EEC',
    dir: '8.โครงงานวิชาชีพ\\รูปภาพพรีเซ็นโครงงาน', take: 6,
  },
];

const OUT = 'public/assets/portfolio/innovation';
mkdirSync(OUT, { recursive: true });
const manifest = [];
for (const p of PROJECTS) {
  let files;
  try { files = readdirSync(join(BASE, p.dir)).filter((f) => /\.(jpe?g|png)$/i.test(f)); }
  catch { console.log(`SKIP ${p.id}`); continue; }
  files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const photos = [];
  let n = 0;
  for (const f of files.slice(0, p.take)) {
    n++;
    const name = `${p.id}-${n}.webp`;
    const info = await sharp(join(BASE, p.dir, f))
      .rotate().resize({ width: 1280, height: 854, fit: 'cover', position: 'attention' })
      .webp({ quality: 80 }).toFile(join(OUT, name));
    photos.push(`/assets/portfolio/innovation/${name}`);
    console.log(`${name}  (${Math.round(info.size / 1024)}KB)  <- ${f}`);
  }
  if (photos.length) manifest.push({ id: p.id, type: p.type, title: p.title, titleEn: p.titleEn, desc: p.desc, cover: photos[0], photos });
}
writeFileSync(join(OUT, 'innovation.json'), JSON.stringify(manifest, null, 2));
console.log(`\nDone: ${manifest.length} projects.`);
