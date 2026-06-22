'use client';

// ─────────────────────────────────────────────────────────────
// Homepage body — Hero (slideshow) + sections.
// Ported from prototype homepage-sections.jsx. Production bakes the
// prototype's default tweaks: hero=slideshow, cards=lift, tone=forest.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react';
import { Icon, Reveal } from './chrome';
import { FAQS } from './faq-data';
import { NEWS } from '../news/news-data';
import INNOV from '../../public/assets/portfolio/innovation/innovation.json';

type HpProject = { id: string; type: string; title: string; titleEn: string; cover: string; photos: string[] };
const HP_PROJECTS = INNOV as HpProject[];

// ── Animated counter ────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', duration = 1800 }: { target: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setStarted(true); });
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.floor(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);
  return <span ref={ref}>{value.toLocaleString()}{suffix}</span>;
}

// ── Hero Slideshow ──────────────────────────────────────────
const SLIDES = [
  {
    key: 'apply', img: '/assets/slide-1-apply.webp',
    eyebrow: 'รับสมัครนักศึกษาใหม่', title: 'ปีการศึกษา 2569 เปิดรับแล้ว',
    sub: 'ปวช. ปวส. ป.ตรี · 18 สาขา · ฟอร์มสมัครออนไลน์ 5 นาที',
    cta: { href: '/admission', label: 'สมัครเรียนออนไลน์' },
    tint: 'linear-gradient(135deg, rgba(1,35,28,0.22) 0%, rgba(2,100,81,0.12) 50%, rgba(4,130,105,0.05) 100%)',
    accent: 'var(--accent-amber)',
  },
  {
    key: 'eec', img: '/assets/slide-2-eec.webp',
    eyebrow: 'ครอบครัวเทคโน EEC', title: 'ทีมงานคุณภาพ · 30 ปี แห่งความเชี่ยวชาญ',
    sub: 'อาจารย์มืออาชีพ + พันธมิตรนิคม EEC 50+ องค์กร · ฝึกงานจริง มีงานทำ',
    cta: { href: '/about', label: 'รู้จักวิทยาลัย' },
    tint: 'linear-gradient(135deg, rgba(1,61,51,0.25) 0%, rgba(2,100,81,0.12) 60%, rgba(10,161,131,0.05) 100%)',
    accent: 'var(--accent-amber)',
  },
  {
    key: 'innovation', img: '/assets/slide-3-innovation.webp',
    eyebrow: 'นวัตกรรมและสิ่งประดิษฐ์', title: 'ฝีมือเยี่ยมระดับชาติ',
    sub: 'ผลงาน Smart Farm · AGV · ระบบไฟฟ้าอัจฉริยะ จากนักศึกษาและอาจารย์',
    cta: { href: '/portfolio', label: 'ดูผลงานทั้งหมด' },
    tint: 'linear-gradient(135deg, rgba(28,42,78,0.22) 0%, rgba(1,61,51,0.15) 50%, rgba(4,130,105,0.05) 100%)',
    accent: '#f5b800',
  },
  {
    key: 'community', img: '/assets/slide-4-community.webp',
    eyebrow: '12,000+ ศิษย์เก่า', title: 'ยินดีด้วยกับบัณฑิต EEC',
    sub: 'ปลูกฝังคุณธรรมและฝีมือควบคู่กัน · เปี่ยมคุณธรรม มุ่งสร้างคนดี',
    cta: { href: '/about', label: 'ปรัชญาวิทยาลัย' },
    tint: 'linear-gradient(135deg, rgba(2,100,81,0.15) 0%, rgba(1,35,28,0.1) 60%, rgba(4,130,105,0.05) 100%)',
    accent: '#fff',
  },
];

function HeroSlideshow() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [drag, setDrag] = useState({ active: false, startX: 0, dx: 0 });
  const stageRef = useRef<HTMLElement>(null);
  const DURATION = 6500;
  const SWIPE_THRESHOLD = 60;
  useEffect(() => {
    if (paused || drag.active) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), DURATION);
    return () => clearInterval(t);
  }, [paused, drag.active]);
  const go = (n: number) => setIdx((n + SLIDES.length) % SLIDES.length);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== undefined && e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button, a, [role="tab"]')) return;
    const x = e.clientX ?? 0;
    setDrag({ active: true, startX: x, dx: 0 });
    if (stageRef.current && e.pointerId !== undefined) {
      try { stageRef.current.setPointerCapture(e.pointerId); } catch {}
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.active) return;
    const x = e.clientX ?? 0;
    setDrag((d) => ({ ...d, dx: x - d.startX }));
  };
  const onPointerUp = () => {
    if (!drag.active) return;
    const dx = drag.dx;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      go(dx < 0 ? idx + 1 : idx - 1);
    }
    setDrag({ active: false, startX: 0, dx: 0 });
  };

  const dragOffset = drag.active ? Math.max(-120, Math.min(120, drag.dx)) : 0;

  return (
    <section
      ref={stageRef}
      className={`hero hero-slideshow ${drag.active ? 'is-dragging' : ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); if (drag.active) onPointerUp(); }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ touchAction: 'pan-y', userSelect: 'none' }}>

      <div className="hss-stage" style={{ transform: dragOffset ? `translateX(${dragOffset * 0.3}px)` : 'none' }}>
        {SLIDES.map((s, i) =>
          <div key={s.key} className={`hss-slide ${idx === i ? 'on' : ''} ${idx === i - 1 || (idx === SLIDES.length - 1 && i === 0) ? 'next' : ''}`} aria-hidden={idx !== i}>
            <div className="hss-bg">
              <img src={s.img} alt="" className="hss-img" loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : 'auto'} draggable="false" />
              <div className="hss-tint" style={{ background: s.tint }} />
              <div className="hss-vignette" />
            </div>
          </div>
        )}
      </div>
      <div className="container hss-inner">
        <div className="hss-content">
          {SLIDES.map((s, i) =>
            <div key={s.key} className={`hss-copy ${idx === i ? 'on' : ''}`} aria-hidden={idx !== i}>
              <div className="hero-eyebrow hss-eyebrow"><span className="hero-eyebrow-dot" />{s.eyebrow}</div>
              <h1 className="hero-title hss-title">{s.title}</h1>
              <p className="hero-sub hss-sub">{s.sub}</p>
              <div className="hero-cta hss-cta">
                <a href={s.cta.href} className="btn btn-white btn-lg" onClick={(e) => { if (Math.abs(drag.dx) > 8) e.preventDefault(); }}>{s.cta.label}<Icon name="arrow" className="btn-icon" /></a>
              </div>
            </div>
          )}
        </div>
        <div className="hss-controls">
          <button className="hss-nav" onClick={() => go(idx - 1)} aria-label="สไลด์ก่อนหน้า">
            <Icon name="chevronRight" style={{ width: 22, height: 22, transform: 'rotate(180deg)' }} />
          </button>
          <div className="hss-progress" role="tablist">
            {SLIDES.map((s, i) =>
              <button key={s.key} className={`hss-prog-bar ${i === idx ? 'on' : ''} ${i < idx ? 'done' : ''}`} onClick={() => go(i)} aria-label={`ไปสไลด์ ${i + 1}`} role="tab">
                <span className="hss-prog-fill" key={`${idx}-${i}`} />
              </button>
            )}
          </div>
          <button className="hss-nav" onClick={() => go(idx + 1)} aria-label="สไลด์ถัดไป">
            <Icon name="chevronRight" style={{ width: 22, height: 22 }} />
          </button>
        </div>
      </div>
      <div className="hss-counter">
        <strong>{String(idx + 1).padStart(2, '0')}</strong>
        <span>/</span>
        <em>{String(SLIDES.length).padStart(2, '0')}</em>
      </div>
    </section>
  );
}

// ── Highlights / News strip ─────────────────────────────────
function Highlights() {
  const news = NEWS.slice(0, 3);
  return (
    <section className="section section-sm highlights-section" id="highlights">
      <div className="container">
        <Reveal className="highlights-head">
          <span className="eyebrow">ข่าวสารล่าสุด</span>
          <a href="/news" className="highlights-all">ดูทั้งหมด <Icon name="arrow" style={{ width: 16, height: 16 }} /></a>
        </Reveal>
        <div className="highlights-grid">
          {news.map((n, i) =>
            <Reveal key={n.slug} delay={i * 0.08}>
              <a href={`/news/${n.slug}`} className="hl-card">
                <div className="hl-img hl-img-photo">
                  <img src={n.image} alt={n.title} loading="lazy" style={{ objectPosition: n.objectPosition }} />
                </div>
                <div className="hl-body">
                  <span className="hl-tag" style={{ fontSize: '16px' }}>{n.tag}</span>
                  <h3 className="hl-t">{n.title}</h3>
                  <p className="hl-d">{n.excerpt}</p>
                  <span className="hl-arrow">อ่านต่อ <Icon name="arrow" style={{ width: 14, height: 14 }} /></span>
                </div>
              </a>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Stats bar + marquee ─────────────────────────────────────
function StatsBar() {
  const stats = [
    { v: 30, s: '+', l: 'ปีแห่งประสบการณ์' },
    { v: 18, s: '', l: 'สาขาวิชา' },
    { v: 12000, s: '+', l: 'ศิษย์เก่า' },
    { v: 100, s: '%', l: 'มีงานทำ / ศึกษาต่อ' },
  ];
  return (
    <section className="stats-bar">
      <div className="container">
        <div className="stats-grid">
          {stats.map((s, i) =>
            <Reveal key={i} delay={i * 0.06} className="stat-item">
              <div className="stat-v"><AnimatedCounter target={s.v} suffix={s.s} duration={1500 + i * 100} /></div>
              <div className="stat-l">{s.l}</div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Trust band (accreditation + awards) ─────────────────────
// All claims sourced from official docs (สมศ. cert V00578, แข่งฝีมือแรงงานครั้งที่29,
// ใบอนุญาตศูนย์ทดสอบ, SAR 2564). Hard facts — no PII, no consent needed.
function TrustBand() {
  const items = [
    { icon: 'shield', t: 'รับรองคุณภาพภายนอกโดย สมศ.', d: 'ด้านการอาชีวศึกษา · พ.ศ. 2565–2569' },
    { icon: 'award', t: '🥇 ชนะเลิศอันดับ 1 ระดับภาค', d: 'แข่งขันฝีมือแรงงานแห่งชาติ ครั้งที่ 29' },
    { icon: 'check', t: 'ศูนย์ทดสอบมาตรฐานฝีมือแรงงาน', d: 'ได้รับอนุญาต 4 สาขา · กรมพัฒนาฝีมือแรงงาน' },
    { icon: 'sparkle', t: 'ประเมินตนเอง (SAR) ระดับ "ดีเลิศ"', d: 'ปีการศึกษา 2564 · มาตรฐานวิชาชีพ "ยอดเยี่ยม"' },
  ];
  return (
    <section className="trust-band" aria-label="การรับรองและรางวัล">
      <div className="container">
        <div className="trust-grid">
          {items.map((it, i) =>
            <Reveal key={i} delay={i * 0.06} className="trust-item">
              <span className="trust-ic"><Icon name={it.icon} style={{ width: 22, height: 22 }} /></span>
              <span className="trust-tx">
                <strong>{it.t}</strong>
                <span>{it.d}</span>
              </span>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Graduate outcomes (จบแล้วมีงานทำ) ────────────────────────
// Source: รายงานติดตามนักศึกษาที่สำเร็จ 2565. PUBLISH AGGREGATE % ONLY — no names (PDPA).
// Honest framing: figures are on a TRACKED basis (268 reachable), stated in the footnote.
function GraduateOutcomes() {
  const stats = [
    { v: 83, s: '%', l: 'ปวส. มีงานทำ', sub: 'หลังสำเร็จการศึกษา' },
    { v: 16, s: '%', l: 'ปวส. ศึกษาต่อ', sub: 'ระดับสูงขึ้น' },
    { v: 89, s: '%', l: 'ปวช. ศึกษาต่อ', sub: 'ต่อ ปวส. / ป.ตรี' },
    { v: 12500, s: '฿', l: 'เงินเดือนเริ่มต้น', sub: 'เฉลี่ย (ปวส.) ต่อเดือน' },
  ];
  const employers = ['ปตท.', 'Mitsubishi', 'Caterpillar', 'เคียวเดน', 'ซูมิเดน สตีล', 'AGC', 'ซัมมิท ออโต้บอดี้', 'อีสเทิร์น คอนทรานส์'];
  return (
    <section className="section grad-section" id="outcomes">
      <div className="container">
        <Reveal className="section-head" style={{ textAlign: 'center' }}>
          <span className="eyebrow">จบแล้วไปไหน</span>
          <h2 className="section-title">เรียนจบ <span className="grad">มีงานทำจริง</span></h2>
          <p className="section-sub">บัณฑิตสายอาชีพที่ตลาดอุตสาหกรรมตะวันออกต้องการ — มีงานรองรับและเส้นทางเติบโตชัดเจน</p>
        </Reveal>
        <div className="grad-grid">
          {stats.map((s, i) =>
            <Reveal key={i} delay={i * 0.07} className="grad-card">
              <div className="grad-v"><AnimatedCounter target={s.v} suffix={s.s} duration={1500 + i * 120} /></div>
              <div className="grad-l">{s.l}</div>
              <div className="grad-sub">{s.sub}</div>
            </Reveal>
          )}
        </div>
        <Reveal className="grad-employers" delay={0.1}>
          <span className="grad-emp-label">ศิษย์เก่าทำงานที่</span>
          <div className="grad-emp-list">
            {employers.map((e) => <span key={e} className="grad-emp-chip">{e}</span>)}
            <span className="grad-emp-chip grad-emp-more">และอีกหลายแห่ง</span>
          </div>
        </Reveal>
        <p className="grad-foot">
          * ข้อมูลผู้สำเร็จการศึกษา ปีการศึกษา 2565 จากการสำรวจภาวะการมีงานทำ/ศึกษาต่อ
          เฉพาะผู้ที่ติดตามได้ 268 คน (ปวช. 138 · ปวส. 130)
        </p>
      </div>
    </section>
  );
}

// ── Partners / ทวิภาคี (MOU) ────────────────────────────────
// Company list from share (003 งานทวิ memo, 2565). TH names confirmed by user.
// EN names were soft-OCR → omitted. No official logos → monogram cards.
function Partners() {
  const partners = [
    { name: 'ฮอนด้า ศรีราชา', field: 'ยานยนต์', color: '#B12B25' },
    { name: 'สยามคอมเมอร์เชียล ซีพอร์ท', field: 'โลจิสติกส์ท่าเรือ', color: '#F26530' },
    { name: 'สยามโกลบอลมารีน', field: 'อุตสาหกรรมทางทะเล', color: '#40ABE0' },
    { name: 'สยามโกลบอล (บ่อวิน)', field: 'อุตสาหกรรม', color: '#048269' },
    { name: 'เอส.ที.ที. เอ็นจิเนียริ่ง', field: 'วิศวกรรม & ซัพพลาย', color: '#7B5CA7' },
    { name: 'เอมมาลีน พาวเวอร์', field: 'พลังงาน & ไฟฟ้า', color: '#385BF3' },
    { name: 'เอสพี', field: 'อุตสาหกรรม', color: '#EB559F' },
  ];
  return (
    <section className="section partners-section" id="partners">
      <div className="container">
        <Reveal className="section-head" style={{ textAlign: 'center' }}>
          <span className="eyebrow">ระบบทวิภาคี · เครือข่ายความร่วมมือ</span>
          <h2 className="section-title">เรียนจริง ทำงานจริง <span className="grad">กับสถานประกอบการ</span></h2>
          <p className="section-sub">นักศึกษาฝึกประสบการณ์ตรงในโรงงานและบริษัทชั้นนำของนิคมอุตสาหกรรมตะวันออก — จบแล้วพร้อมทำงานทันที</p>
        </Reveal>
        <div className="partners-grid">
          {partners.map((p, i) =>
            <Reveal key={p.name} delay={i * 0.05} className="partner-card" style={{ '--pc': p.color }}>
              <span className="partner-mono">{p.name.replace(/^(บริษัท|ห้างหุ้นส่วน[จำกัด]*)\s*/, '').charAt(0)}</span>
              <span className="partner-tx">
                <strong>{p.name}</strong>
                <span>{p.field}</span>
              </span>
            </Reveal>
          )}
        </div>
        <Reveal className="partners-foot" delay={0.1}>
          <a href="/courses" className="btn btn-ghost">ดูหลักสูตรทวิภาคี <Icon name="arrow" className="btn-icon" /></a>
        </Reveal>
      </div>
    </section>
  );
}

// ── Courses (lift cards) ────────────────────────────────────
type Course = { code: string; slug: string; name: string; icon: string; cat: string; hot?: boolean; img?: string; color?: string };
const COURSES: Course[] = [
  { code: 'ปวช.', slug: 'yon', name: 'ช่างยนต์', icon: 'car', cat: 'อุตสาหกรรม', hot: true, img: '/assets/courses/yon.webp', color: '#B12B25' },
  { code: 'ปวช.', slug: 'faifaa', name: 'ช่างไฟฟ้ากำลัง', icon: 'bolt', cat: 'อุตสาหกรรม', hot: true, img: '/assets/courses/faifaa.webp', color: '#40ABE0' },
  { code: 'ปวช.', slug: 'gear', name: 'ช่างกลโรงงาน', icon: 'gear', cat: 'อุตสาหกรรม', img: '/assets/courses/gear.webp', color: '#FBD609' },
  { code: 'ปวช.', slug: 'electronic', name: 'อิเล็กทรอนิกส์', icon: 'chip', cat: 'อุตสาหกรรม', img: '/assets/courses/electronic.webp' },
  { code: 'ปวช.', slug: 'mecha', name: 'เมคคาทรอนิกส์และหุ่นยนต์', icon: 'robot', cat: 'อุตสาหกรรม', hot: true, img: '/assets/courses/mecha.webp', color: '#FBDC6B' },
  { code: 'ปวช.', slug: 'graphic', name: 'ดิจิทัลกราฟิก', icon: 'palette', cat: 'ดิจิทัล', img: '/assets/courses/digital-graphic.webp', color: '#385BF3' },
  { code: 'ปวช.', slug: 'biz-digital', name: 'เทคโนโลยีธุรกิจดิจิทัล', icon: 'chart', cat: 'บริหาร', img: '/assets/courses/digital-business.webp', color: '#EB559F' },
  { code: 'ปวช.', slug: 'accounting', name: 'การบัญชี', icon: 'briefcase', cat: 'บริหาร', img: '/assets/courses/accounting.webp', color: '#7B5CA7' },
  { code: 'ปวส.', slug: 'ps-mech', name: 'เทคนิคเครื่องกล', icon: 'car', cat: 'อุตสาหกรรม', img: '/assets/courses/ps-mechanical.webp', color: '#B12B25' },
  { code: 'ปวส.', slug: 'ps-electrical', name: 'ไฟฟ้า', icon: 'bolt', cat: 'อุตสาหกรรม', img: '/assets/courses/ps-electrical.webp', color: '#40ABE0' },
  { code: 'ปวส.', slug: 'ps-production', name: 'เทคนิคการผลิต', icon: 'gear', cat: 'อุตสาหกรรม', img: '/assets/courses/ps-production.webp', color: '#FBD609' },
  { code: 'ปวส.', slug: 'ps-mecha', name: 'เมคคาทรอนิกส์และหุ่นยนต์', icon: 'robot', cat: 'อุตสาหกรรม', img: '/assets/courses/ps-mecha.webp', color: '#FBDC6B' },
  { code: 'ปวส.', slug: 'ps-network', name: 'เครือข่ายคอมฯ & ความปลอดภัย', icon: 'network', cat: 'ดิจิทัล', img: '/assets/courses/ps-network.webp', color: '#EB559F' },
  { code: 'ปวส.', slug: 'ps-graphic', name: 'ดิจิทัลกราฟิก', icon: 'palette', cat: 'ดิจิทัล', img: '/assets/courses/ps-graphic.webp', color: '#385BF3' },
  { code: 'ปวส.', slug: 'ps-logistics', name: 'การจัดการโลจิสติกส์', icon: 'truck', cat: 'บริหาร', hot: true, img: '/assets/courses/ps-logistics.webp', color: '#F26530' },
  { code: 'ปวส.', slug: 'ps-accounting', name: 'การบัญชี', icon: 'briefcase', cat: 'บริหาร', img: '/assets/courses/ps-accounting.webp', color: '#7B5CA7' },
  { code: 'ปวส.', slug: 'ps-electronic', name: 'อิเล็กทรอนิกส์', icon: 'chip', cat: 'อุตสาหกรรม', img: '/assets/courses/ps-electronic.webp' },
  { code: 'ปวส.', slug: 'ps-industrial', name: 'เทคนิคอุตสาหกรรม', icon: 'shield', cat: 'อุตสาหกรรม', img: '/assets/courses/ps-industrial.webp' },
];

function CourseCard({ course }: { course: Course }) {
  const c = course;
  return (
    <a href={`/courses/${c.slug}`} className="course-card cc-lift" style={c.color ? { '--dept': c.color } : undefined}>
      {c.img &&
        <div className="cc-photo">
          <img src={c.img} alt="" loading="lazy" />
          {c.color && <div className="cc-color-bar" style={{ background: c.color }} />}
        </div>
      }
      <div className="cc-body">
        <div className="cc-code">{c.code} · {c.cat}</div>
        <h3 className="cc-name">{c.name}</h3>
        <div className="cc-foot">
          <span style={{ height: '20px', fontSize: '16px' }}>ดูรายละเอียด</span>
          <Icon name="arrow" style={{ width: 18, height: 18 }} />
        </div>
      </div>
    </a>
  );
}

function Courses() {
  const [filter, setFilter] = useState('ทั้งหมด');
  const cats = ['ทั้งหมด', 'อุตสาหกรรม', 'ดิจิทัล', 'บริหาร'];
  const shown = filter === 'ทั้งหมด' ? COURSES : COURSES.filter((c) => c.cat === filter);
  return (
    <section className="section" id="courses">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">หลักสูตรของเรา</span>
          <h2 className="section-title">
            18 สาขาวิชา <span className="grad">ครอบคลุมทุกสายอาชีพ</span>
          </h2>
          <p className="section-sub">เรียนกับอาจารย์ที่มีประสบการณ์จริงในอุตสาหกรรม พร้อมห้องปฏิบัติการมาตรฐาน และเครื่องมือทันสมัย</p>
        </Reveal>
        <Reveal className="course-filters" delay={0.1}>
          {cats.map((c) =>
            <button key={c} className={`chip ${filter === c ? 'chip-active' : ''}`} onClick={() => setFilter(c)}>
              {c}
            </button>
          )}
        </Reveal>
        <div className="course-grid card-lift">
          {shown.map((c, i) =>
            <Reveal key={`${c.code}-${c.name}`} delay={Math.min(i * 0.04, 0.4)} dir="scale">
              <CourseCard course={c} />
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

// ── About / Philosophy ──────────────────────────────────────
function About() {
  const philosophy = [
    { t: 'มุ่งสร้างคนดี', d: 'มุ่งหวังที่จะสร้างนักศึกษาให้เป็นคนดีทั้งต่อตนเองและสังคม', icon: 'users' },
    { t: 'มีระเบียบวินัย', d: 'ความมีระเบียบแบบแผนและวินัย เป็นแนวทางการปฏิบัติตน', icon: 'check' },
    { t: 'ก้าวไกลเทคโนโลยี', d: 'พัฒนาเทคโนโลยีให้เจริญก้าวหน้าทันยุคทันสมัย', icon: 'chip' },
    { t: 'ฝีมือเยี่ยม', d: 'มีฝีมือและทักษะทางวิชาชีพระดับสูง พร้อมปฏิบัติงานจริง', icon: 'award' },
    { t: 'เปี่ยมคุณธรรม', d: 'มีคุณธรรม จริยธรรม ค่านิยมที่ดี ยึดถือวัฒนธรรมและประเพณีอันดีงาม', icon: 'shield' },
  ];
  return (
    <section className="section about-section">
      <div className="container about-grid">
        <Reveal dir="left" className="about-copy">
          <span className="eyebrow">ปรัชญาวิทยาลัย</span>
          <h2 className="section-title">
            เปี่ยมคุณธรรม <br /><span className="grad">มุ่งสร้างคนดี</span>
          </h2>
          <p className="section-sub">
            ตั้งแต่ปี พ.ศ. 2538 วิทยาลัยฯ ได้ผลิตช่างฝีมือคุณภาพให้แก่นิคมอุตสาหกรรมตะวันออก ปลูกฝังทั้งวิชาชีพและจริยธรรมควบคู่กัน
          </p>
          <div className="about-stats">
            <div><strong>30+</strong><span>ปี</span></div>
            <div><strong>1995</strong><span>ก่อตั้ง</span></div>
            <div><strong>5</strong><span>หลักธรรม</span></div>
          </div>
          <a href="/about" className="btn btn-primary">เรียนรู้เพิ่มเติม<Icon name="arrow" className="btn-icon" /></a>
        </Reveal>
        <Reveal dir="right" className="philosophy-stack">
          {philosophy.map((p, i) =>
            <div key={i} className="philo-row" style={{ '--i': i }}>
              <div className="philo-icon"><Icon name={p.icon} style={{ width: 22, height: 22 }} /></div>
              <div>
                <h3 className="philo-t">{p.t}</h3>
                <p className="philo-d">{p.d}</p>
              </div>
              <div className="philo-num">0{i + 1}</div>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

// ── Portfolio preview ───────────────────────────────────────
function PortfolioPreview() {
  return (
    <section className="section portfolio-section">
      <div className="container">
        <Reveal className="section-head" style={{ textAlign: 'center' }}>
          <span className="eyebrow">ผลงานวิทยาลัย</span>
          <h2 className="section-title">
            นวัตกรรม สิ่งประดิษฐ์ <span className="grad">ลงมือทำจริง</span>
          </h2>
          <p className="section-sub">ผลงานและกิจกรรมจริงของนักศึกษา ปีการศึกษา 2568 — ดูภาพและรายละเอียดเพิ่มเติมได้</p>
        </Reveal>
        <div className="hp-proj-grid">
          {HP_PROJECTS.map((p, i) =>
            <Reveal key={p.id} delay={i * 0.06} dir="scale">
              <a href="/portfolio" className="hp-proj-card">
                <div className="hp-proj-cover">
                  <img src={p.cover} alt={p.title} loading="lazy" />
                  <span className="hp-proj-type">{p.type}</span>
                  <span className="hp-proj-count">{p.photos.length} ภาพ</span>
                </div>
                <div className="hp-proj-meta">
                  <h3>{p.title}</h3>
                  <span className="hp-proj-en">{p.titleEn} <Icon name="arrow" style={{ width: 14, height: 14 }} /></span>
                </div>
              </a>
            </Reveal>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <a href="/portfolio" className="btn btn-ghost btn-lg">ดูผลงานทั้งหมด <Icon name="arrow" className="btn-icon" /></a>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ────────────────────────────────────────────
const TESTIMONIALS = [
  { name: 'นางสาว บงกช สินฉาย', dept: 'สาขา การจัดการโลจิสติกส์', text: 'เรียนที่นี่เหมือนเรียนกับครอบครัวค่ะ ทุกคนเพื่อนและอาจารย์ทุกท่านให้ความเป็นกันเอง สงสัยอะไรเมื่อไหร่ให้คำตอบได้เสมอ', avatar: 'บ', color: '#0f7a3e' },
  { name: 'นาย ฉัตรชัย สุขภักดี', dept: 'สาขา โลจิสติกส์ ปวส.2', text: 'ได้ความรู้ที่แน่นและเป็นประโยชน์ต่อการใช้ในอาชีพได้จริง และมีความสุขทุกครั้งที่เรียนครับ', avatar: 'ฉ', color: '#1c2a4e' },
  { name: 'นางสาว ปุณณภา พรมชาติ', dept: 'สาขา โลจิสติกส์', text: 'เป็นสถาบันที่ให้ความรู้และความเข้าใจดีมาก สามารถนำไปใช้ในที่ทำงานจริงและชีวิตจริงได้ดี การเรียนการสอนของอาจารย์ทุกท่านเข้าใจง่ายและเป็นกันเอง', avatar: 'ป', color: '#8a1f2b' },
  { name: 'นาย แหวนเพชร จุพิมาย', dept: 'แผนก โลจิสติกส์ ปวส.2', text: 'ผมมีความสุขที่ได้เรียนรู้ ได้พบเพื่อนใหม่ ได้รับความห่วงใย จากอาจารย์ทุกท่าน', avatar: 'ห', color: '#22a85a' },
];

function Testimonials() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="section testimonials-section">
      <div className="testi-bg" aria-hidden="true" />
      <div className="container">
        <Reveal className="section-head" style={{ textAlign: 'center' }}>
          <span className="eyebrow" style={{ background: 'rgba(255,255,255,0.12)', color: 'var(--green-200)' }}>เสียงจากนักศึกษา</span>
          <h2 className="section-title" style={{ color: 'white' }}>
            ครอบครัวที่ <span className="grad-light">ส่งเสริมให้คุณเติบโต</span>
          </h2>
        </Reveal>
        <div className="testi-carousel">
          <div className="testi-track" style={{ transform: `translateX(-${idx * 100}%)` }}>
            {TESTIMONIALS.map((t, i) =>
              <div key={i} className="testi-slide">
                <div className="testi-card">
                  <Icon name="quote" style={{ width: 48, height: 48, color: 'var(--green-300)' }} />
                  <p className="testi-text">{t.text}</p>
                  <div className="testi-author">
                    <div className="testi-avatar" style={{ background: t.color }}>{t.avatar}</div>
                    <div>
                      <div className="testi-name">{t.name}</div>
                      <div className="testi-dept">{t.dept}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="testi-dots">
            {TESTIMONIALS.map((_, i) =>
              <button key={i} className={`testi-dot ${idx === i ? 'on' : ''}`} onClick={() => setIdx(i)} aria-label={`testimonial ${i + 1}`} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FAQ ─────────────────────────────────────────────────────

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section faq-section" id="faq">
      <div className="container faq-grid">
        <Reveal dir="left" className="faq-side">
          <span className="eyebrow">FAQ</span>
          <h2 className="section-title">คำถามที่ <span className="grad">พบบ่อย</span></h2>
          <p className="section-sub">รวบรวมคำถามที่ผู้ปกครองและนักศึกษาสอบถามเข้ามาบ่อยที่สุด หากยังไม่พบคำตอบ ติดต่อเราได้ทันที</p>
          <a href="/contact" className="btn btn-primary" style={{ marginTop: 24 }}>
            <Icon name="phone" style={{ width: 16, height: 16 }} /> สอบถามเพิ่มเติม
          </a>
        </Reveal>
        <Reveal dir="right" className="faq-list">
          {FAQS.map((f, i) =>
            <div key={i} className={`faq-item ${open === i ? 'open' : ''}`} onClick={() => setOpen(open === i ? -1 : i)}>
              <div className="faq-q">
                <span className="faq-num">0{i + 1}</span>
                <span className="faq-q-text">{f.q}</span>
                <Icon name={open === i ? 'minus' : 'plus'} style={{ width: 20, height: 20, color: 'var(--green-700)' }} />
              </div>
              <div className="faq-a"><div className="faq-a-inner">{f.a}</div></div>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

// ── CTA banner ──────────────────────────────────────────────
function CTABanner() {
  return (
    <section className="section cta-section">
      <div className="container">
        <Reveal className="cta-banner" dir="scale">
          <div className="cta-bg-mesh" />
          <div className="cta-content">
            <span className="eyebrow" style={{ background: 'rgba(255,255,255,0.18)', color: 'white' }}>เปิดรับสมัคร</span>
            <h2 className="cta-title">พร้อมเริ่มต้นเส้นทาง<br /><span className="grad-light">อาชีพที่ใช่</span>หรือยัง?</h2>
            <p className="cta-sub">สมัครออนไลน์ใช้เวลาเพียง 5 นาที — ทีมงานติดต่อกลับภายใน 24 ชม.</p>
            <div className="cta-actions">
              <a href="/admission" className="btn btn-white btn-lg">สมัครเรียนออนไลน์<Icon name="arrow" className="btn-icon" /></a>
              <a href="tel:038494066" className="btn btn-ghost btn-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>
                <Icon name="phone" style={{ width: 16, height: 16 }} /> 038-494-066
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Homepage body ───────────────────────────────────────────
export default function HomepageBody() {
  return (
    <main>
      <HeroSlideshow />
      <TrustBand />
      <Highlights />
      <StatsBar />
      <Courses />
      <About />
      <GraduateOutcomes />
      <Partners />
      <PortfolioPreview />
      <Testimonials />
      <FAQ />
      <CTABanner />
    </main>
  );
}
