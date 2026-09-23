import { useEffect, useRef, useState, type RefObject } from 'react';
import { Icon } from './chrome-lite';
import { COURSES } from '../../data/course-data';
import { COLLEGE_PHOTO, PRACTICE_PHOTO } from '../../data/about-canva-data';
import { TIMELINE as COLLEGE_TIMELINE, EXTENDED_TIMELINE, HISTORY_HERO, HISTORY_VIDEO, PHILOSOPHY, PRINCIPALS, DEPUTIES, type Leader } from '../../data/about-college-data';

const LEGACY_TIMELINE = [...COLLEGE_TIMELINE, {
  y: '2569',
  t: 'ปัจจุบัน',
  d: `เปิดเผยรายละเอียด ${COURSES.length} หลักสูตรบนเว็บไซต์ พร้อมข้อมูลการเรียนและการฝึกปฏิบัติของแต่ละสาขา`,
  img: PRACTICE_PHOTO.src,
}];
const ENHANCED_TIMELINE = [...EXTENDED_TIMELINE, {
  y: '2569',
  t: 'ปัจจุบัน',
  d: `เปิดเผยรายละเอียด ${COURSES.length} หลักสูตรบนเว็บไซต์ พร้อมข้อมูลการเรียนและการฝึกปฏิบัติของแต่ละสาขา`,
  img: PRACTICE_PHOTO.src,
}];
const HERO_SLIDES = [
  { src: COLLEGE_PHOTO.src, alt: COLLEGE_PHOTO.alt },
  { src: HISTORY_HERO, alt: 'ภาพวิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง' },
  { src: PRACTICE_PHOTO.src, alt: PRACTICE_PHOTO.alt },
];


const CHAPTERS = [
  { id: 'our-story', label: 'เรื่องราวของเรา' },
  { id: 'our-values', label: 'ปรัชญาวิทยาลัย' },
  { id: 'our-vision', label: 'วิสัยทัศน์' },
  { id: 'our-people', label: 'ทีมผู้บริหาร' },
];
const MISSIONS = [
  ['พัฒนาสมรรถนะวิชาชีพ', 'ตรงความต้องการสถานประกอบการ'],
  ['ทักษะศตวรรษที่ 21', '(3R8C) ตามหลักเศรษฐกิจพอเพียง'],
  ['ปลูกฝังคุณธรรม', 'จริยธรรม และจิตสำนึกอนุรักษ์'],
  ['หลักสูตรฐานสมรรถนะ', 'ตรงความต้องการตลาดแรงงาน'],
  ['สรรหาและพัฒนาครู', 'ให้มีคุณธรรมและความรู้'],
  ['พัฒนาอาคารและห้องปฏิบัติการ', 'สื่อ เทคโนโลยี ตามไทยแลนด์ 4.0'],
  ['บริหารตามหลักธรรมาภิบาล', ''],
  ['ความร่วมมือระบบทวิภาคี', 'กับสถานประกอบการ'],
  ['ส่งเสริมนวัตกรรม', 'สิ่งประดิษฐ์ งานวิจัย เผยแพร่สู่สาธารณะ'],
  ['ศูนย์บ่มเพาะ', 'ผู้ประกอบการอาชีวศึกษา'],
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

// One frame per scroll event batch. Transforms update directly; React state only
// changes when the active chapter, timeline milestone, or philosophy changes.
function useStoryMotion(rootRef: RefObject<HTMLElement | null>, reduced: boolean) {
  const [chapter, setChapter] = useState(0);
  const [milestone, setMilestone] = useState(0);
  const [value, setValue] = useState(0);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const header = document.querySelector<HTMLElement>('header.nav');
    const chapterNav = root.querySelector<HTMLElement>('.about-chapters');
    const journeyVisual = root.querySelector<HTMLElement>('.about-journey-visual');
    const valueVisual = root.querySelector<HTMLElement>('.about-value-visual');
    const chapters = Array.from(root.querySelectorAll<HTMLElement>('[data-chapter]'));
    const milestones = Array.from(root.querySelectorAll<HTMLElement>('[data-milestone]'));
    const values = Array.from(root.querySelectorAll<HTMLElement>('[data-value]'));
    const parallax = Array.from(root.querySelectorAll<HTMLElement>('[data-parallax]'));
    const reveal = Array.from(root.querySelectorAll<HTMLElement>('[data-about-reveal]'));
    let frame = 0;
    let headerHeight = 76;
    let milestoneMarker = 196;
    let valueMarker = 196;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('about-pending');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    reveal.forEach((el) => {
      if (!reduced && el.getBoundingClientRect().top > innerHeight * .92) {
        el.classList.add('about-pending');
        observer.observe(el);
      } else el.classList.remove('about-pending');
    });
    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight)));
      root.style.setProperty('--about-progress', String(progress));
      const marker = headerHeight + 120;
      let activeChapter = 0;
      chapters.forEach((el, i) => { if (el.getBoundingClientRect().top <= marker) activeChapter = i; });
      setChapter((current) => current === activeChapter ? current : activeChapter);
      let activeMilestone = 0;
      milestones.forEach((el, i) => { if (el.getBoundingClientRect().top <= milestoneMarker + 1) activeMilestone = i; });
      setMilestone((current) => current === activeMilestone ? current : activeMilestone);
      let activeValue = 0;
      values.forEach((el, i) => { if (el.getBoundingClientRect().top <= valueMarker + 1) activeValue = i; });
      setValue((current) => current === activeValue ? current : activeValue);
      parallax.forEach((el) => {
        const bounds = el.getBoundingClientRect();
        const offset = reduced ? 0 : Math.max(-36, Math.min(36, (innerHeight / 2 - bounds.top - bounds.height / 2) * .07));
        el.style.setProperty('--about-parallax', `${offset.toFixed(2)}px`);
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const measure = () => {
      headerHeight = header?.getBoundingClientRect().height ?? 76;
      const chapterHeight = chapterNav?.getBoundingClientRect().height ?? 70;
      root.style.setProperty('--about-header', `${headerHeight}px`);
      root.style.setProperty('--about-chapter-height', `${chapterHeight}px`);
      const visualHeight = journeyVisual?.getBoundingClientRect().height ?? 0;
      const valueVisualHeight = valueVisual?.getBoundingClientRect().height ?? 0;
      const stickyTop = headerHeight + chapterHeight + 24;
      const stacked = window.matchMedia('(max-width: 600px)').matches;
      // On phones, read the milestones below the pinned photo. On wider
      // screens, align their activation with the top of the photo beside them.
      milestoneMarker = stickyTop + (stacked ? visualHeight + 24 : 20);
      root.style.setProperty('--about-milestone-marker', `${milestoneMarker}px`);
      // Give every photograph a reading interval during normal wheel gestures,
      // rather than advancing multiple years within a single viewport.
      const step = stacked
        ? Math.max(480, innerHeight - milestoneMarker + 120)
        : Math.max(560, innerHeight - stickyTop - 32);
      root.style.setProperty('--about-journey-step', `${step}px`);
      const readingRoom = Math.max(560, innerHeight * .85);
      const tail = Math.max(step, visualHeight, innerHeight - milestoneMarker) + readingRoom;
      root.style.setProperty('--about-journey-tail', `${tail}px`);
      valueMarker = stickyTop + (stacked ? valueVisualHeight + 24 : 20);
      root.style.setProperty('--about-value-marker', `${valueMarker}px`);
      const valueStep = stacked
        ? Math.max(480, innerHeight - valueMarker + 120)
        : Math.max(560, innerHeight - stickyTop - 32);
      root.style.setProperty('--about-value-step', `${valueStep}px`);
      const valueTail = Math.max(valueStep, valueVisualHeight, innerHeight - valueMarker) + readingRoom;
      root.style.setProperty('--about-value-tail', `${valueTail}px`);
      schedule();
    };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    const resize = new ResizeObserver(measure);
    resize.observe(root);
    if (header) resize.observe(header);
    if (chapterNav) resize.observe(chapterNav);
    if (journeyVisual) resize.observe(journeyVisual);
    if (valueVisual) resize.observe(valueVisual);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      reveal.forEach((el) => el.classList.remove('about-pending'));
    };
  }, [rootRef, reduced]);
  return { chapter, milestone, value };
}

function LeaderPortrait({ item, compact = false, order = 0 }: { item: Leader; compact?: boolean; order?: number }) {
  return <article className={`about-person ${compact ? 'about-person-compact' : ''}`} data-about-reveal style={{ '--about-delay': `${(order % 3) * 70}ms` }}>
    <div className="about-person-photo"><img src={item.img} alt={item.n} loading="lazy" width="480" height="600" /></div>
    <div className="about-person-copy"><span>{item.r}</span><h3>{item.n}</h3></div>
  </article>;
}

export default function AboutStory({ enhancedHistory = false }: { enhancedHistory?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { chapter, milestone, value } = useStoryMotion(root, reduced);
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroDragging, setHeroDragging] = useState(false);
  const [heroDragOffset, setHeroDragOffset] = useState(0);
  const heroDragStart = useRef<number | null>(null);
  const timeline = enhancedHistory ? ENHANCED_TIMELINE : LEGACY_TIMELINE;
  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => setHeroSlide((current) => (current + 1) % HERO_SLIDES.length), 6000);
    return () => window.clearInterval(timer);
  }, [reduced]);
  const finishHeroDrag = () => {
    if (heroDragStart.current === null) return;
    if (Math.abs(heroDragOffset) > 60) setHeroSlide((current) => (current + (heroDragOffset < 0 ? 1 : -1) + HERO_SLIDES.length) % HERO_SLIDES.length);
    heroDragStart.current = null;
    setHeroDragging(false);
    setHeroDragOffset(0);
  };
  return (
    <main ref={root} className="about-story">
      <section className={`about-opening ${heroDragging ? 'is-dragging' : ''}`} aria-labelledby="about-title" style={{ touchAction: 'pan-y', userSelect: 'none' }} onPointerDown={(event) => { if (event.button !== 0 || (event.target as HTMLElement).closest('button')) return; heroDragStart.current = event.clientX; setHeroDragging(true); event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={(event) => { if (heroDragStart.current !== null) setHeroDragOffset(Math.max(-120, Math.min(120, event.clientX - heroDragStart.current))); }} onPointerUp={finishHeroDrag} onPointerCancel={finishHeroDrag} onPointerLeave={finishHeroDrag}>
        <h1 id="about-title" className="about-sr-only">เกี่ยวกับเรา · วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง</h1>
        <div className="about-hss-stage" style={{ transform: heroDragging ? `translateX(${heroDragOffset * .3}px)` : undefined }}>{HERO_SLIDES.map((slide, i) => <div key={slide.src} className={`about-hss-slide ${heroSlide === i ? 'on' : ''}`} aria-hidden={heroSlide !== i}><img src={slide.src} alt={slide.alt} loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : undefined} draggable="false" /></div>)}</div>
        <div className="about-hss-progress" role="group" aria-label="เลือกภาพแบนเนอร์">{HERO_SLIDES.map((slide, i) => <button key={slide.src} type="button" className={`${heroSlide === i ? 'on' : ''} ${i < heroSlide ? 'done' : ''}`} aria-label={`แสดงภาพแบนเนอร์ ${i + 1}`} aria-pressed={heroSlide === i} onClick={() => setHeroSlide(i)}><span aria-hidden="true" /></button>)}</div>
      </section>

      <nav className="about-chapters" aria-label="เนื้อหาเกี่ยวกับวิทยาลัย">
        <div className="about-reading-progress" aria-hidden="true" />
        <div className="about-shell about-chapter-links">
          {CHAPTERS.map((item, i) => <a key={item.id} href={`#${item.id}`} aria-current={chapter === i ? 'location' : undefined}><span>0{i + 1}</span>{item.label}<Icon name="arrow" /></a>)}
        </div>
      </nav>

      <section id="our-story" className="about-journey about-section" data-chapter aria-labelledby="journey-title">
        <div className="about-shell">
          <div className="about-section-heading" data-about-reveal>
            <div><span className="about-eyebrow">01 / OUR JOURNEY</span><h2 id="journey-title">จากก้าวแรก<br /><em>สู่อนาคตที่เราสร้างร่วมกัน</em></h2></div>
            <p>จาก 1 มีนาคม 2538 จนถึงวันนี้<br />เรื่องราวของวิทยาลัยที่เติบโตไปพร้อมกับ<br />คน ชุมชน และอุตสาหกรรมตะวันออก</p>
          </div>
          {enhancedHistory && <div className="about-history-media" data-about-reveal>
            <div className="about-history-video"><video controls preload="metadata" poster={HISTORY_HERO} aria-label="วิดีโอประวัติวิทยาลัย"><source src={HISTORY_VIDEO} type="video/mp4" />เบราว์เซอร์ของคุณไม่รองรับวิดีโอ</video></div>
            <div className="about-history-media-copy"><span>HISTORY FILM · 01:12</span><h3>เรื่องราวที่เริ่มจาก<br />ความเชื่อในคนรุ่นใหม่</h3><p>ชมวิดีโอประวัติวิทยาลัย ก่อนเลื่อนดูหมุดหมายสำคัญตั้งแต่วันก่อตั้งจนถึงปัจจุบัน</p></div>
          </div>}
          <div className="about-journey-grid">
            <div className="about-journey-visual">
              <div className="about-journey-frame">
                {timeline.map((item, i) => <img key={item.y} src={item.img} alt="" loading="lazy" className={milestone === i ? 'is-active' : ''} />)}
              </div>
              <nav className="about-year-links" aria-label="เลือกปีในประวัติวิทยาลัย">{timeline.map((item, i) => <a key={item.y} href={`#year-${item.y}`} aria-current={milestone === i ? 'step' : undefined}>{item.y}</a>)}</nav>
            </div>
            <ol className="about-timeline">
              {timeline.map((item, i) => <li key={item.y} id={`year-${item.y}`} data-milestone className={milestone === i ? 'is-active' : ''}>
                <div className="about-timeline-entry">
                  <span className="about-timeline-dot" aria-hidden="true" />
                  <span className="about-timeline-year">{item.y}</span>
                  <div><h3>{item.t}</h3><p>{item.d}</p></div>
                </div>
              </li>)}
            </ol>
          </div>
        </div>
      </section>

      <section id="our-values" className="about-values about-section" data-chapter aria-labelledby="values-title">
        <div className="about-shell">
          <div className="about-section-heading" data-about-reveal><div><span className="about-eyebrow">02 / WHAT WE BELIEVE</span><h2 id="values-title">เก่งในวิชาชีพ<br /><em>เติบโตอย่างมีคุณค่า</em></h2></div><p>ปรัชญา 5 ประการ<br />ที่อยู่เบื้องหลังการเรียนรู้ทุกวันของเรา</p></div>
          <div className="about-values-grid">
            <div className="about-journey-visual about-value-visual">
              <div className="about-journey-frame about-value-frame" role="img" aria-label={`ภาพประกอบปรัชญา ${PHILOSOPHY[value].th}`}>
              {PHILOSOPHY.map((item, i) => <img key={item.num} src={item.img} alt="" loading="lazy" className={value === i ? 'is-active' : ''} />)}
              </div>
              <nav className="about-year-links about-value-links" aria-label="เลือกปรัชญาวิทยาลัย">{PHILOSOPHY.map((item, i) => <a key={item.num} href={`#value-${item.num}`} aria-current={value === i ? 'step' : undefined}>{item.num}</a>)}</nav>
            </div>
            <ol className="about-timeline about-value-timeline">{PHILOSOPHY.map((item, i) => <li key={item.num} id={`value-${item.num}`} data-value className={value === i ? 'is-active' : ''}>
              <div className="about-timeline-entry about-value-entry"><span className="about-timeline-dot" aria-hidden="true" /><span className="about-timeline-year">{item.num}</span><div><h3>{item.th}</h3><p>{item.d}</p><small>{item.en}</small></div></div>
            </li>)}</ol>
          </div>
        </div>
      </section>

      <section id="our-vision" className="about-vision about-section" data-chapter aria-labelledby="vision-title">
        <div className="about-shell">
          <div className="about-vision-intro">
            <div data-about-reveal><span className="about-eyebrow">03 / VISION & MISSION</span><h2 id="vision-title">สถานศึกษา<em>คุณธรรม</em><br />ที่มีคุณภาพ</h2></div>
            <div className="about-vision-quote" data-about-reveal><p>“เป็นสถานศึกษาคุณธรรมที่มีคุณภาพตามมาตรฐานอาชีวศึกษา ผู้เรียนมีความรู้และทักษะวิชาชีพตามนโยบายประเทศไทย 4.0 เป็นที่ต้องการของสถานประกอบการ”</p><span>วิสัยทัศน์ของวิทยาลัย</span></div>
          </div>
          <div className="about-identity" data-about-reveal><div><span>เอกลักษณ์</span><strong>เทคโนโลยีดี ฝีมือเยี่ยม เปี่ยมคุณธรรม</strong></div><div><span>อัตลักษณ์</span><strong>ทักษะเทคโนโลยีดี มีคุณธรรม</strong></div></div>
          <div className="about-mission-heading" data-about-reveal><h3>10 พันธกิจที่เราขับเคลื่อน</h3><span>OUR COMMITMENTS</span></div>
          <ol className="about-missions">{MISSIONS.map(([title, text], i) => <li key={title} data-about-reveal style={{ '--about-delay': `${(i % 2) * 70}ms` }}><span>{String(i + 1).padStart(2, '0')}</span><div><h4>{title}</h4>{text && <p>{text}</p>}</div></li>)}</ol>
        </div>
      </section>

      <section id="our-people" className="about-people about-section" data-chapter aria-labelledby="people-title">
        <div className="about-shell">
          <div className="about-section-heading" data-about-reveal><div><span className="about-eyebrow">04 / THE PEOPLE BEHIND EEC</span><h2 id="people-title">คนที่เชื่อใน<br /><em>ศักยภาพของคนรุ่นใหม่</em></h2></div><a className="about-text-link" href="/personnel/">รู้จักบุคลากรทั้งหมด <Icon name="arrow" /></a></div>
          <div className="about-principals">{PRINCIPALS.map((item, i) => <LeaderPortrait key={item.n} item={item} order={i} />)}</div>
          <div className="about-deputy-heading"><h3>รองผู้อำนวยการ</h3><span>6 ฝ่าย · ร่วมขับเคลื่อนคุณภาพ</span></div>
          <div className="about-deputies">{DEPUTIES.map((item, i) => <LeaderPortrait key={item.n} item={item} compact order={i} />)}</div>
        </div>
      </section>

      <section className="about-closing" aria-labelledby="closing-title">
        <div className="about-closing-photo" data-parallax><img src={PRACTICE_PHOTO.src} alt={PRACTICE_PHOTO.alt} loading="lazy" /></div>
        <div className="about-shell about-closing-inner" data-about-reveal><span className="about-eyebrow">THE NEXT CHAPTER IS YOURS</span><h2 id="closing-title">เรื่องราวบทต่อไป<br /><em>เริ่มต้นที่คุณ</em></h2><p>ร่วมเป็นส่วนหนึ่งของครอบครัว EEC<br />เปิดรับสมัครนักศึกษาใหม่ ปีการศึกษา 2569</p><div className="about-actions"><a className="about-button" href="/admission/">สมัครเรียนออนไลน์ <Icon name="arrow" /></a><a className="about-button about-button-outline" href="/courses/">ค้นหาหลักสูตรที่ใช่ <Icon name="arrow" /></a></div></div>
      </section>
    </main>
  );
}
