'use client';

// News images with click-to-zoom lightbox. Accepts 1+ images (cover + gallery).
import { useState, useEffect } from 'react';

export default function NewsCover({ images, alt, objectPosition }: { images: string[]; alt: string; objectPosition?: string }) {
  const [active, setActive] = useState<number | null>(null);
  const open = active !== null;
  const close = () => setActive(null);
  const step = (d: number) => setActive((a) => (a === null ? a : (a + d + images.length) % images.length));

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
    <>
      <button type="button" className="news-cover news-cover-btn" onClick={() => setActive(0)} aria-label="ดูรูปขนาดเต็ม">
        <img src={images[0]} alt={alt} style={{ objectPosition }} />
        <span className="news-cover-zoom" aria-hidden="true">⤢</span>
      </button>

      {images.length > 1 && (
        <div className="news-thumbs">
          {images.map((src, i) => (
            <button key={src} type="button" className="news-thumb" onClick={() => setActive(i)} aria-label={`ดูรูปที่ ${i + 1}`}>
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {open && (
        <div className="pf-lb" role="dialog" aria-modal="true" aria-label="รูปข่าวขนาดเต็ม" onClick={close}>
          <button className="pf-lb-close" onClick={close} aria-label="ปิด">✕</button>
          {images.length > 1 && <button className="pf-lb-nav pf-lb-prev" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="ก่อนหน้า">‹</button>}
          <figure className="pf-lb-stage" onClick={(e) => e.stopPropagation()}>
            <img src={images[active]} alt={alt} />
            {images.length > 1 && <figcaption>{active + 1} / {images.length}</figcaption>}
          </figure>
          {images.length > 1 && <button className="pf-lb-nav pf-lb-next" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="ถัดไป">›</button>}
        </div>
      )}
    </>
  );
}
