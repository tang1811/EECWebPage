'use client';

// Original fee-announcement images with click-to-zoom lightbox.
import { useState, useEffect } from 'react';

const SHOTS = [
  { src: '/assets/tuition/LINE_ALBUM_61926_260619_1.jpg', label: 'ปวช. บริหารธุรกิจ · รอบเช้า' },
  { src: '/assets/tuition/LINE_ALBUM_61926_260619_4.jpg', label: 'ปวช. บริหารธุรกิจ · รอบบ่าย' },
  { src: '/assets/tuition/LINE_ALBUM_61926_260619_6.jpg', label: 'ปวช. ช่างอุตสาหกรรม · รอบเช้า' },
  { src: '/assets/tuition/LINE_ALBUM_61926_260619_9.jpg', label: 'ปวช. ช่างอุตสาหกรรม · รอบบ่าย' },
  { src: '/assets/tuition/LINE_ALBUM_61926_260619_3.jpg', label: 'ปวช. อายุเกิน 25 ปี · รอบบ่าย' },
  { src: '/assets/tuition/LINE_ALBUM_61926_260619_5.jpg', label: 'ปวส. บริหารธุรกิจ · รอบเช้า' },
  { src: '/assets/tuition/LINE_ALBUM_61926_260619_2.jpg', label: 'ปวส. บริหารธุรกิจ · รอบบ่าย' },
  { src: '/assets/tuition/LINE_ALBUM_61926_260619_7.jpg', label: 'ปวส. ช่างอุตสาหกรรม · รอบเช้า' },
  { src: '/assets/tuition/LINE_ALBUM_61926_260619_8.jpg', label: 'ปวส. ช่างอุตสาหกรรม · รอบบ่าย' },
];

export default function TuitionGallery() {
  const [active, setActive] = useState<number | null>(null);
  const open = active !== null;
  const close = () => setActive(null);
  const step = (d: number) => setActive((a) => (a === null ? a : (a + d + SHOTS.length) % SHOTS.length));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);

  return (
    <div className="tu-gallery">
      <h2 className="tu-h2">ประกาศค่าเทอม (ต้นฉบับ)</h2>
      <p className="tu-gallery-sub">คลิกที่รูปเพื่อดูขนาดเต็ม</p>
      <div className="tu-gallery-grid">
        {SHOTS.map((s, i) => (
          <button key={s.src} type="button" className="tu-gallery-item" onClick={() => setActive(i)}
            aria-label={`ดูประกาศค่าเทอม ${s.label}`}>
            <img src={s.src} alt={`ประกาศค่าเทอม ${s.label}`} loading="lazy" />
            <span className="tu-gallery-cap">{s.label}</span>
          </button>
        ))}
      </div>

      {open && (
        <div className="tu-lightbox" role="dialog" aria-modal="true" aria-label="ประกาศค่าเทอมขนาดเต็ม" onClick={close}>
          <button className="tu-lb-close" onClick={close} aria-label="ปิด">✕</button>
          <button className="tu-lb-nav tu-lb-prev" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="รูปก่อนหน้า">‹</button>
          <figure className="tu-lb-stage" onClick={(e) => e.stopPropagation()}>
            <img src={SHOTS[active].src} alt={SHOTS[active].label} />
            <figcaption>{SHOTS[active].label} · {active + 1} / {SHOTS.length}</figcaption>
          </figure>
          <button className="tu-lb-nav tu-lb-next" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="รูปถัดไป">›</button>
        </div>
      )}
    </div>
  );
}
