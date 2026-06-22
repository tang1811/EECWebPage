// Transcode department review clips from the share into web-optimized mp4
// (H.264 + faststart, max 720p) + a poster frame, into public/assets/courses/videos/.
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const FF = 'C:/ffmpeg/bin/ffmpeg.exe';
const SRC = '\\\\166.166.1.24\\ay 2565\\001 ข้อมูลส่วนกลาง\\ลงเว็บ\\ข้อมูลส่งให้คุณนัด\\วีดิโอแผนก';
const OUT = 'public/assets/courses/videos';
mkdirSync(OUT, { recursive: true });

// source clip filename -> slugs that share it (ปวช + ปวส of same dept)
const JOBS = [
  ['Tiktok รีวิวแผนกช่างยนต์2.MOV', ['yon']],
  ['FB รีวิวแผนกช่างกล.mp4', ['gear']],
  ['Tiktok แผนกไฟฟ้า 02.mp4', ['faifaa', 'ps-electrical']],
  ['FB รีวิว เมคคาทรอนิกส์และหุ่นยนต์.mp4', ['mecha', 'ps-mecha']],
  ['Tiltok รีวิวแผนกคอมพิวเตอร์กราฟิก.mp4', ['graphic', 'ps-graphic']],
  ['แผนกเทคโนโลยีธุรกิจดิจิทัล.mp4', ['biz-digital']],
  ['Tiktok รีวิวแผนกโลจิสติกส์2.mp4', ['ps-logistics']],
  ['Tiktok รีวิวแผนกการบัญชี.mp4', ['accounting', 'ps-accounting']],
];

const manifest = {};
for (const [file, slugs] of JOBS) {
  const src = join(SRC, file);
  if (!existsSync(src)) { console.log(`SKIP (missing): ${file}`); continue; }
  const primary = slugs[0];
  const mp4 = join(OUT, `${primary}.mp4`);
  const jpg = join(OUT, `${primary}.jpg`);
  process.stdout.write(`encode ${primary} <- ${file} ... `);
  execFileSync(FF, ['-i', src, '-vf', 'scale=-2:720', '-c:v', 'libx264', '-crf', '28',
    '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '96k',
    '-movflags', '+faststart', '-y', mp4], { stdio: 'ignore' });
  execFileSync(FF, ['-ss', '00:00:01', '-i', src, '-frames:v', '1', '-vf', 'scale=-2:720', '-y', jpg], { stdio: 'ignore' });
  for (const s of slugs) manifest[s] = { src: `/assets/courses/videos/${primary}.mp4`, poster: `/assets/courses/videos/${primary}.jpg` };
  console.log('done');
}
writeFileSync(join(OUT, 'videos.json'), JSON.stringify(manifest, null, 2));
console.log(`\nDone: ${Object.keys(manifest).length} slugs mapped.`);
