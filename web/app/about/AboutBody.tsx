'use client';

// ─────────────────────────────────────────────────────────────
// About — Web Cinematic (Apple/Netflix style scroll-storytelling)
// 8 scenes, scroll-driven animations, pure black + white + brand.
// Ported from prototype about-cinematic.jsx → Next.js / TypeScript.
// Nav / Footer / StickyCTA are rendered globally by the layout.
// ─────────────────────────────────────────────────────────────

import { useRef, useState, useEffect, type RefObject } from 'react';

// Scroll progress hook: returns 0 → 1 as element scrolls from below-viewport to above
function useSceneProgress(ref: RefObject<HTMLElement | null>) {
  const [p, setP] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const scrolled = vh - rect.top;
      setP(Math.max(0, Math.min(1, scrolled / total)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ref]);
  return p;
}

// Sticky scene progress: 0 when scene starts sticking, 1 when it un-sticks
function useStickyProgress(wrapRef: RefObject<HTMLElement | null>) {
  // wrapRef should be the OUTER tall wrapper. The sticky child has 100vh.
  // Progress = how far into the sticky range we are (0 → 1).
  const [p, setP] = useState(0);
  useEffect(() => {
    if (!wrapRef.current) return;
    const onScroll = () => {
      if (!wrapRef.current) return;
      const r = wrapRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height - vh; // distance during which it's sticky
      const scrolled = -r.top;
      setP(Math.max(0, Math.min(1, scrolled / Math.max(1, total))));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [wrapRef]);
  return p;
}

// Count-up component (triggered when scene enters)
function CountUp({
  target,
  duration = 1800,
  suffix = '',
  prefix = '',
  start,
}: {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  start: boolean;
}) {
  const [v, setV] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!start || started.current) return;
    started.current = true;
    const t0 = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      const e = 1 - Math.pow(1 - t, 3);
      setV(Math.floor(target * e));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setV(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return <>{prefix}{v.toLocaleString()}{suffix}</>;
}

// ── Scene 1: Opening — full-bleed hero with ken burns ──────
function SceneOpening() {
  const ref = useRef<HTMLElement>(null);
  const p = useSceneProgress(ref);
  // Image zoom: 1.0 → 1.18 across the scene
  const imgScale = 1.0 + p * 0.18;
  // Title fades in 0 → 0.3, sustained, fades out 0.7 → 1
  const fadeIn = Math.min(1, p * 4);
  const fadeOut = Math.max(0, 1 - Math.max(0, (p - 0.7) * 3.3));
  const titleOpacity = Math.min(fadeIn, fadeOut);
  // Subtitle delayed
  const subOpacity = Math.min(1, Math.max(0, (p - 0.1) * 4)) * fadeOut;
  const subY = (1 - subOpacity) * 24;
  // Scroll cue
  const cueOpacity = Math.max(0, 1 - p * 8);
  return (
    <section ref={ref} className="cine-scene cine-opening">
      <div className="cine-bg">
        <img src="/assets/slide-2-eec.webp" alt="" className="cine-bg-img" style={{ transform: `scale(${imgScale})` }} />
        <div className="cine-tint cine-tint-strong" />
      </div>
      <div className="cine-content">
        <div className="cine-label" style={{ opacity: titleOpacity }}>ABOUT · EEC ENGINEER LAEMCHABANG</div>
        <h1 className="cine-h1" style={{ opacity: titleOpacity, transform: `translateY(${(1 - titleOpacity) * 20}px)` }}>
          <span>กว่า <em>30 ปี</em></span>
          <span>เราสร้าง <em>ช่างฝีมือ</em></span>
          <span>ป้อนสู่ <em>นิคม EEC</em></span>
        </h1>
        <p className="cine-lede" style={{ opacity: subOpacity, transform: `translateY(${subY}px)` }}>
          จาก 1 มีนาคม 2538 จนถึงวันนี้ — เรื่องราวการสร้างคน สร้างฝีมือ และสร้างอนาคต ของวิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง
        </p>
      </div>
      <div className="cine-scroll-cue" style={{ opacity: cueOpacity }}>
        <span>SCROLL TO BEGIN</span>
        <div className="cine-scroll-line"><div /></div>
      </div>
    </section>
  );
}

// ── Scene 2: Numbers ────────────────────────────────────────
function SceneStats() {
  const ref = useRef<HTMLElement>(null);
  const p = useSceneProgress(ref);
  const triggered = p > 0.2;
  const stats = [
    { v: 30, suf: '+', label: 'ปีแห่งประสบการณ์', sub: 'ก่อตั้ง พ.ศ. 2538', delay: 0 },
    { v: 12000, suf: '+', label: 'ศิษย์เก่า', sub: 'ปล่อยช่างฝีมือออกสู่อุตสาหกรรม', delay: 1 },
    { v: 18, suf: '', label: 'สาขาวิชา', sub: 'ปวช. · ปวส. · ปริญญาตรี', delay: 2 },
    { v: 100, suf: '%', label: 'อัตรามีงานทำ', sub: 'รับรองโดยพันธมิตรองค์กร', delay: 3 },
  ];
  return (
    <section ref={ref} className="cine-scene cine-stats">
      <div className="cine-stats-eyebrow" style={{ opacity: Math.min(1, p * 5) }}>
        <span />BY THE NUMBERS<span />
      </div>
      <div className="cine-stats-grid">
        {stats.map((s, i) => {
          const localStart = triggered && p > 0.2 + i * 0.04;
          return (
            <div key={i} className={`cine-stat ${localStart ? 'on' : ''}`}>
              <div className="cine-stat-v">
                <CountUp target={s.v} suffix={s.suf} duration={1600 + i * 200} start={localStart} />
              </div>
              <div className="cine-stat-label">{s.label}</div>
              <div className="cine-stat-sub">{s.sub}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Scene 3: Timeline (sticky horizontal scrub) ─────────────
const TIMELINE = [
  { y: '2538', t: 'จุดเริ่มต้น', d: 'ก่อตั้ง 1 มี.ค. 2538 ในชื่อ "โรงเรียนเทคโนโลยีศรีราชาช่างอุตสาหกรรม" โดย ดร.สัมภาษณ์ บุญจี๊ด', img: '/assets/slide-2-eec.webp' },
  { y: '2539', t: 'เปลี่ยนชื่อ', d: 'เปลี่ยนชื่อเป็น "โรงเรียนเทคโนโลยีแหลมฉบัง"', img: '/assets/courses/yon.webp' },
  { y: '2554', t: 'ยกระดับ', d: 'ปรับฐานะเป็น "วิทยาลัยเทคโนโลยีแหลมฉบัง" เปิดสอน ปวส.', img: '/assets/courses/faifaa.webp' },
  { y: '2563', t: 'เพิ่มหลักสูตร', d: 'เปิดสาขาคอมพิวเตอร์กราฟิก ประเภทวิชาศิลปกรรม', img: '/assets/courses/digital-graphic.webp' },
  { y: '2564', t: 'ชื่อปัจจุบัน', d: 'เปลี่ยนชื่อเป็น "วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง"', img: '/assets/courses/ps-mecha.webp' },
  { y: '2569', t: 'ปัจจุบัน', d: '18 สาขา · ศูนย์ทดสอบมาตรฐานฝีมือแรงงาน · พร้อมก้าวต่อไป', img: '/assets/slide-4-community.webp' },
];
function SceneTimeline() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const p = useStickyProgress(wrapRef);
  // Total scroll: 0 → 1, mapped to 6 frames
  const N = TIMELINE.length;
  const frame = Math.min(N - 1, Math.floor(p * N * 1.001));
  // X offset: scroll the timeline track horizontally
  const trackX = -p * (N - 1) * 100;
  return (
    <div ref={wrapRef} className="cine-tl-wrap">
      <div className="cine-tl-sticky">
        <div className="cine-tl-header">
          <div className="cine-tl-eyebrow"><span />OUR JOURNEY · ตลอด 30 ปี<span /></div>
          <h2 className="cine-h2"><em>เส้นทาง</em>ของวิทยาลัย</h2>
        </div>
        <div className="cine-tl-track" style={{ transform: `translateX(${trackX}%)` }}>
          {TIMELINE.map((it, i) => (
            <div key={i} className={`cine-tl-card ${frame === i ? 'on' : ''}`}>
              <div className="cine-tl-img">
                <img src={it.img} alt="" style={{ transform: `scale(${frame === i ? 1.08 : 1})` }} />
              </div>
              <div className="cine-tl-meta">
                <div className="cine-tl-year">{it.y}</div>
                <div className="cine-tl-title">{it.t}</div>
                <div className="cine-tl-desc">{it.d}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="cine-tl-progress">
          {TIMELINE.map((it, i) => (
            <button key={i} className={`cine-tl-dot ${frame === i ? 'on' : ''} ${i < frame ? 'done' : ''}`} aria-label={it.y}>
              <span className="cine-tl-dot-y">{it.y}</span>
            </button>
          ))}
          <div className="cine-tl-bar"><div style={{ width: `${(frame / (N - 1)) * 100}%` }} /></div>
        </div>
      </div>
    </div>
  );
}

// ── Scene 4: Philosophy (5 full-bleed panels with parallax) ─
const PHILOSOPHY = [
  { num: '01', th: 'มุ่งสร้างคนดี', en: 'Be Good', d: 'ทั้งต่อตนเองและสังคม', img: '/assets/slide-1-apply.webp', accent: '#F26530' },
  { num: '02', th: 'มีระเบียบวินัย', en: 'Discipline', d: 'แบบแผนการปฏิบัติตน', img: '/assets/news-3-military.webp', accent: '#40ABE0' },
  { num: '03', th: 'ก้าวไกลเทคโนโลยี', en: 'Future-Ready', d: 'พัฒนาเทคโนโลยีให้เจริญก้าวหน้าทันยุคทันสมัย', img: '/assets/courses/ps-mecha.webp', accent: '#FBD609' },
  { num: '04', th: 'ฝีมือเยี่ยม', en: 'Master Craft', d: 'ทักษะวิชาชีพระดับสูง พร้อมปฏิบัติงานจริง', img: '/assets/courses/ps-mechanical.webp', accent: '#B12B25' },
  { num: '05', th: 'เปี่ยมคุณธรรม', en: 'Virtuous Mind', d: 'มีคุณธรรม จริยธรรม ค่านิยมที่ดี', img: '/assets/slide-4-community.webp', accent: '#7B5CA7' },
];
function ScenePhilosophy() {
  const wrapRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={wrapRef} className="cine-philo-wrap">
      <div className="cine-philo-intro">
        <div className="cine-stats-eyebrow"><span />PHILOSOPHY · ปรัชญา 5 ประการ<span /></div>
        <h2 className="cine-h2"><em>เปี่ยมคุณธรรม</em> มุ่งสร้างคนดี<br />มีระเบียบวินัย ก้าวไกลเทคโนโลยี ฝีมือเยี่ยม</h2>
      </div>
      {PHILOSOPHY.map((p, i) => <PhiloPanel key={i} item={p} index={i} />)}
    </div>
  );
}
function PhiloPanel({ item }: { item: (typeof PHILOSOPHY)[number]; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const p = useSceneProgress(ref);
  const imgScale = 1.0 + p * 0.15;
  const imgY = (p - 0.5) * 80; // parallax: image drifts vertically
  const textY = (1 - Math.min(1, p * 2)) * 40;
  const opacity = Math.min(1, p * 2.5) * Math.max(0, 1 - Math.max(0, p - 0.85) * 6);
  return (
    <section ref={ref} className="cine-philo-panel" style={{ '--accent': item.accent }}>
      <div className="cine-bg">
        <img src={item.img} alt="" className="cine-bg-img" style={{ transform: `translateY(${imgY}px) scale(${imgScale})` }} />
        <div className="cine-tint cine-philo-tint" style={{ background: `linear-gradient(135deg, ${item.accent}88 0%, rgba(0,0,0,0.85) 80%)` }} />
      </div>
      <div className="cine-philo-content" style={{ opacity, transform: `translateY(${textY}px)` }}>
        <div className="cine-philo-num">{item.num}</div>
        <div className="cine-philo-en">{item.en}</div>
        <h3 className="cine-philo-th">{item.th}</h3>
        <p className="cine-philo-d">{item.d}</p>
      </div>
    </section>
  );
}

// ── Scene 5: Vision + Mission ──────────────────────────────
function SceneVision() {
  const ref = useRef<HTMLElement>(null);
  const p = useSceneProgress(ref);
  const left = Math.min(1, Math.max(0, (p - 0.1) * 3));
  const right = Math.min(1, Math.max(0, (p - 0.25) * 3));
  return (
    <section ref={ref} className="cine-scene cine-vision">
      <div className="cine-vision-grid">
        <div className="cine-vision-col" style={{ opacity: left, transform: `translateX(${(1 - left) * -40}px)` }}>
          <div className="cine-vision-key">VISION · วิสัยทัศน์</div>
          <h2 className="cine-vision-head">
            สถานศึกษา<em>คุณธรรม</em><br />ที่มีคุณภาพ
          </h2>
          <p className="cine-vision-body">
            “เป็นสถานศึกษาคุณธรรมที่มีคุณภาพตามมาตรฐานอาชีวศึกษา ผู้เรียนมีความรู้และทักษะวิชาชีพตามนโยบายประเทศไทย 4.0 เป็นที่ต้องการของสถานประกอบการ”
          </p>
          <div className="cine-vision-tags">
            <span><b>เอกลักษณ์</b> เทคโนโลยีดี ฝีมือเยี่ยม เปี่ยมคุณธรรม</span>
            <span><b>อัตลักษณ์</b> ทักษะเทคโนโลยีดี มีคุณธรรม</span>
          </div>
        </div>
        <div className="cine-vision-col" style={{ opacity: right, transform: `translateX(${(1 - right) * 40}px)` }}>
          <div className="cine-vision-key">MISSION · พันธกิจ</div>
          <h2 className="cine-vision-head">
            <em>10 พันธกิจ</em><br />ที่เราขับเคลื่อน
          </h2>
          <ol className="cine-vision-list cine-vision-list-compact">
            <li><strong>พัฒนาสมรรถนะวิชาชีพ</strong> ตรงความต้องการสถานประกอบการ</li>
            <li><strong>ทักษะศตวรรษที่ 21</strong> (3R8C) ตามหลักเศรษฐกิจพอเพียง</li>
            <li><strong>ปลูกฝังคุณธรรม</strong> จริยธรรม และจิตสำนึกอนุรักษ์</li>
            <li><strong>หลักสูตรฐานสมรรถนะ</strong> ตรงความต้องการตลาดแรงงาน</li>
            <li><strong>สรรหา-พัฒนาครู</strong> ให้มีคุณธรรมและความรู้</li>
            <li><strong>พัฒนาอาคาร-ห้องปฏิบัติการ</strong> สื่อ เทคโนโลยี ตามไทยแลนด์ 4.0</li>
            <li><strong>บริหารตามหลักธรรมาภิบาล</strong></li>
            <li><strong>ความร่วมมือระบบทวิภาคี</strong> กับสถานประกอบการ</li>
            <li><strong>ส่งเสริมนวัตกรรม</strong> สิ่งประดิษฐ์ งานวิจัย เผยแพร่สู่สาธารณะ</li>
            <li><strong>ศูนย์บ่มเพาะ</strong> ผู้ประกอบการอาชีวศึกษา</li>
          </ol>
        </div>
      </div>
    </section>
  );
}

// ── Scene 6: Leadership ────────────────────────────────────
const LEADERS = [
  { n: 'อ.จิดาภา เพ็ชรรัตน์', r: 'รองผู้อำนวยการฝ่ายบริหาร', d: 'ฝ่ายบริหาร', a: 'จ', c: '#026451' },
  { n: 'อ.ทรงพล แม้นชล', r: 'รองผู้อำนวยการกิจการนักเรียน', d: 'กิจการนักเรียน', a: 'ท', c: '#1c2a4e' },
  { n: 'อ.ปิยะ ยิ้มเจริญ', r: 'หัวหน้าภาคไฟฟ้า', d: 'ช่างไฟฟ้า', a: 'ป', c: '#8a1f2b' },
  { n: 'อ.อุมาพร เกยเลื่อน', r: 'หัวหน้าภาคบริหาร', d: 'บริหาร', a: 'อ', c: '#f5b800' },
];
function SceneLeadership() {
  const ref = useRef<HTMLElement>(null);
  const p = useSceneProgress(ref);
  return (
    <section ref={ref} className="cine-scene cine-leaders">
      <div className="cine-leaders-head" style={{ opacity: Math.min(1, p * 4) }}>
        <div className="cine-stats-eyebrow"><span />LEADERSHIP · ทีมผู้บริหาร<span /></div>
        <h2 className="cine-h2"><em>ทีม</em>ที่ขับเคลื่อนคุณภาพ</h2>
      </div>
      <div className="cine-leaders-grid">
        {LEADERS.map((l, i) => {
          const localP = Math.max(0, Math.min(1, (p - 0.2 - i * 0.06) * 3));
          return (
            <div key={i} className="cine-leader" style={{ opacity: localP, transform: `translateY(${(1 - localP) * 40}px)` }}>
              <div className="cine-leader-portrait" style={{ background: `linear-gradient(135deg, ${l.c}, ${l.c}99)` }}>
                <span>{l.a}</span>
              </div>
              <div className="cine-leader-name">{l.n}</div>
              <div className="cine-leader-role">{l.r}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Scene 7: EEC Partners ──────────────────────────────────
function SceneEEC() {
  const ref = useRef<HTMLElement>(null);
  const p = useSceneProgress(ref);
  const headOpacity = Math.min(1, p * 3);
  return (
    <section ref={ref} className="cine-scene cine-eec">
      <div className="cine-eec-head" style={{ opacity: headOpacity }}>
        <div className="cine-stats-eyebrow"><span />INDUSTRY PARTNERS · 50+ องค์กรในเขต EEC<span /></div>
        <h2 className="cine-h2"><em>เครือข่าย</em>นิคมอุตสาหกรรมตะวันออก</h2>
      </div>
    </section>
  );
}

// ── Scene 8: Closing CTA ───────────────────────────────────
function SceneClosing() {
  const ref = useRef<HTMLElement>(null);
  const p = useSceneProgress(ref);
  const headOpacity = Math.min(1, p * 3);
  const ctaOpacity = Math.max(0, Math.min(1, (p - 0.3) * 4));
  const ctaScale = 0.9 + Math.min(0.1, ctaOpacity * 0.1);
  return (
    <section ref={ref} className="cine-scene cine-closing">
      <div className="cine-bg">
        <img src="/assets/slide-4-community.webp" alt="" className="cine-bg-img" style={{ transform: `scale(${1 + p * 0.12})` }} />
        <div className="cine-tint cine-tint-strong" />
      </div>
      <div className="cine-closing-content">
        <div className="cine-closing-key" style={{ opacity: headOpacity }}>JOIN THE STORY</div>
        <h2 className="cine-closing-head" style={{ opacity: headOpacity }}>
          พร้อมเป็น<em>ส่วนหนึ่ง</em><br />ของเรื่องราว 30 ปีนี้?
        </h2>
        <p className="cine-closing-sub" style={{ opacity: headOpacity }}>
          เปิดรับสมัครนักศึกษาใหม่ ปีการศึกษา 2569
        </p>
        <div className="cine-closing-cta" style={{ opacity: ctaOpacity, transform: `scale(${ctaScale})` }}>
          <a href="/admission" className="cine-cta-btn primary">
            สมัครเรียนออนไลน์
            <span className="cine-cta-arrow">→</span>
          </a>
          <a href="/courses" className="cine-cta-btn ghost">ดูหลักสูตรทั้งหมด</a>
        </div>
      </div>
    </section>
  );
}

// ── About body ─────────────────────────────────────────────
export default function AboutBody() {
  return (
    <main className="cine-main">
      <SceneOpening />
      <SceneStats />
      <SceneTimeline />
      <ScenePhilosophy />
      <SceneVision />
      <SceneLeadership />
      <SceneEEC />
      <SceneClosing />
    </main>
  );
}
