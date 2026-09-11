import { useEffect, useRef, useState, type RefObject } from 'react';
import { Icon } from './chrome-lite';

// Existing college history, philosophy, and personnel.
const TIMELINE = [
  { y: '2538', t: 'จุดเริ่มต้น', d: 'ก่อตั้ง 1 มี.ค. 2538 ในชื่อ "โรงเรียนเทคโนโลยีศรีราชาช่างอุตสาหกรรม" โดย ดร.สัมภาษณ์ บุญจี๊ด', img: '/assets/slide-2-eec.webp' },
  { y: '2539', t: 'เปลี่ยนชื่อ', d: 'เปลี่ยนชื่อเป็น "โรงเรียนเทคโนโลยีแหลมฉบัง"', img: '/assets/courses/yon.webp' },
  { y: '2554', t: 'ยกระดับ', d: 'ปรับฐานะเป็น "วิทยาลัยเทคโนโลยีแหลมฉบัง" เปิดสอน ปวส.', img: '/assets/courses/faifaa.webp' },
  { y: '2563', t: 'เพิ่มหลักสูตร', d: 'เปิดสาขาคอมพิวเตอร์กราฟิก ประเภทวิชาศิลปกรรม', img: '/assets/courses/digital-graphic.webp' },
  { y: '2564', t: 'ชื่อปัจจุบัน', d: 'เปลี่ยนชื่อเป็น "วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง"', img: '/assets/courses/ps-mecha.webp' },
  { y: '2569', t: 'ปัจจุบัน', d: '18 สาขา · ศูนย์ทดสอบมาตรฐานฝีมือแรงงาน · พร้อมก้าวต่อไป', img: '/assets/slide-4-community.webp' },
];

const PHILOSOPHY = [
  { num: '01', th: 'มุ่งสร้างคนดี', en: 'Be Good', d: 'ทั้งต่อตนเองและสังคม', img: '/assets/slide-1-apply.webp', accent: '#F26530' },
  { num: '02', th: 'มีระเบียบวินัย', en: 'Discipline', d: 'แบบแผนการปฏิบัติตน', img: '/assets/news-3-military.webp', accent: '#40ABE0' },
  { num: '03', th: 'ก้าวไกลเทคโนโลยี', en: 'Future-Ready', d: 'พัฒนาเทคโนโลยีให้เจริญก้าวหน้าทันยุคทันสมัย', img: '/assets/courses/ps-mecha.webp', accent: '#FBD609' },
  { num: '04', th: 'ฝีมือเยี่ยม', en: 'Master Craft', d: 'ทักษะวิชาชีพระดับสูง พร้อมปฏิบัติงานจริง', img: '/assets/courses/ps-mechanical.webp', accent: '#B12B25' },
  { num: '05', th: 'เปี่ยมคุณธรรม', en: 'Virtuous Mind', d: 'มีคุณธรรม จริยธรรม ค่านิยมที่ดี', img: '/assets/slide-4-community.webp', accent: '#7B5CA7' },
];

const EXEC = '/assets/staff/executives/';
type Leader = { n: string; r: string; img: string; c: string };
const PRINCIPALS: Leader[] = [
  { n: 'ดร.ยงลักษณ์ บุญจี๊ด', r: 'ผู้รับใบอนุญาต', img: EXEC + 'license-yonglak.webp', c: '#026451' },
  { n: 'อ.ภาตะวัน บุญจี๊ด', r: 'ผู้อำนวยการ', img: EXEC + 'director-phatawan.webp', c: '#1c2a4e' },
  { n: 'อ.ภาคภูมิ บุญจี๊ด', r: 'ผู้จัดการ', img: EXEC + 'manager-phakphum.webp', c: '#8a1f2b' },
];
const DEPUTIES: Leader[] = [
  { n: 'นายมานิต หอดขุนทด', r: 'ฝ่ายวิชาการและประกันคุณภาพ', img: EXEC + 'deputy-academic-manit.webp', c: '#026451' },
  { n: 'นายทรงพล แม้นชล', r: 'ฝ่ายกิจการนักเรียนนักศึกษา', img: EXEC + 'deputy-student-songphon.webp', c: '#385BF3' },
  { n: 'นางสาวจิดาภา เพ็ชรรัตน์', r: 'ฝ่ายบริหาร', img: EXEC + 'deputy-admin-jidapha.webp', c: '#D6418A' },
  { n: 'นายกอบศักดิ์ เจนวิถี', r: 'ฝ่ายปกครอง', img: EXEC + 'deputy-discipline-kobsak.webp', c: '#B12B25' },
  { n: 'นายพงษ์ศักดิ์ ไสตะภาพ', r: 'ฝ่ายวิจัยและพัฒนาสื่อ', img: EXEC + 'deputy-research-pongsak.webp', c: '#C28A05' },
  { n: 'นายพันธ์จิต อิ่มรอ', r: 'ฝ่ายอาคารสถานที่', img: EXEC + 'deputy-building-phanchit.webp', c: '#2D8FBF' },
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
// changes when the active chapter or timeline milestone changes.
function useStoryMotion(rootRef: RefObject<HTMLElement | null>, reduced: boolean) {
  const [chapter, setChapter] = useState(0);
  const [milestone, setMilestone] = useState(0);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const header = document.querySelector<HTMLElement>('header.nav');
    const chapterNav = root.querySelector<HTMLElement>('.about-chapters');
    const journeyVisual = root.querySelector<HTMLElement>('.about-journey-visual');
    const chapters = Array.from(root.querySelectorAll<HTMLElement>('[data-chapter]'));
    const milestones = Array.from(root.querySelectorAll<HTMLElement>('[data-milestone]'));
    const parallax = Array.from(root.querySelectorAll<HTMLElement>('[data-parallax]'));
    const reveal = Array.from(root.querySelectorAll<HTMLElement>('[data-about-reveal]'));
    let frame = 0;
    let headerHeight = 76;
    let milestoneMarker = 196;
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
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      reveal.forEach((el) => el.classList.remove('about-pending'));
    };
  }, [rootRef, reduced]);
  return { chapter, milestone };
}

function Stat({ target, suffix, label, reduced, useGrouping = true }: { target: number; suffix: string; label: string; reduced: boolean; useGrouping?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) {
      if (el) el.textContent = target.toLocaleString('en-US', { useGrouping });
      return;
    }
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / 1400);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('en-US', { useGrouping });
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: .6 });
    observer.observe(el);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [target, reduced, useGrouping]);
  return <div className="about-stat" data-about-reveal>
    <strong aria-label={`${target.toLocaleString('en-US', { useGrouping })}${suffix}`}><span ref={ref} aria-hidden="true">{target.toLocaleString('en-US', { useGrouping })}</span><span aria-hidden="true" className="about-stat-suffix">{suffix}</span></strong>
    <span>{label}</span>
  </div>;
}

function LeaderPortrait({ item, compact = false, order = 0 }: { item: Leader; compact?: boolean; order?: number }) {
  return <article className={`about-person ${compact ? 'about-person-compact' : ''}`} data-about-reveal style={{ '--about-delay': `${(order % 3) * 70}ms` }}>
    <div className="about-person-photo"><img src={item.img} alt={item.n} loading="lazy" width="480" height="600" /></div>
    <div className="about-person-copy"><span>{item.r}</span><h3>{item.n}</h3></div>
  </article>;
}

export default function AboutStory() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { chapter, milestone } = useStoryMotion(root, reduced);
  const [value, setValue] = useState(0);
  return (
    <main ref={root} className="about-story">
      <section className="about-opening" aria-labelledby="about-title">
        <div className="about-opening-image" data-parallax><img src="/assets/slide-3-innovation.webp" alt="อาคารอำนวยการและคณะบุคลากรของวิทยาลัย EEC" width="2048" height="871" fetchPriority="high" /></div>
        <div className="about-opening-shade" />
        <div className="about-shell about-opening-inner">
          <div className="about-opening-top"><span>ABOUT OUR COLLEGE</span><span>EST. 1995 · LAEMCHABANG</span></div>
          <div className="about-opening-copy">
            <div className="about-eyebrow about-hero-enter">วิทยาลัยเทคโนโลยีอีอีซี เอ็นจิเนีย แหลมฉบัง</div>
            <h1 id="about-title"><span className="about-title-line"><span>สร้างคน<span className="about-title-period">.</span></span></span><span className="about-title-line"><span>สร้างฝีมือ<span className="about-title-period">.</span></span></span><span className="about-title-line"><span>สร้างอนาคต<span className="about-title-period">.</span></span></span></h1>
            <p className="about-hero-enter">กว่า 30 ปีของความตั้งใจ พัฒนาคนให้มีทั้งทักษะและคุณธรรม<br className="about-wide-break" /> พร้อมเติบโตไปกับอุตสาหกรรม EEC</p>
          </div>
          <div className="about-opening-bottom">
            <a href="#our-story" className="about-scroll-link"><span className="about-scroll-icon"><Icon name="arrow" /></span><span>เลื่อนเพื่อรู้จักเรา<small>DISCOVER OUR STORY</small></span></a>
            <div className="about-anniversary"><strong>30<span>+</span></strong><span>ปีแห่งการสร้าง<br />คนคุณภาพ</span></div>
          </div>
        </div>
      </section>

      <nav className="about-chapters" aria-label="เนื้อหาเกี่ยวกับวิทยาลัย">
        <div className="about-reading-progress" aria-hidden="true" />
        <div className="about-shell about-chapter-links">
          {CHAPTERS.map((item, i) => <a key={item.id} href={`#${item.id}`} aria-current={chapter === i ? 'location' : undefined}><span>0{i + 1}</span>{item.label}<Icon name="arrow" /></a>)}
        </div>
      </nav>

      <section className="about-stat-band" aria-label="วิทยาลัยในตัวเลข">
        <div className="about-shell about-stat-grid">
          <Stat target={30} suffix="+" label="ปีแห่งประสบการณ์" reduced={reduced} />
          <Stat target={12000} suffix="+" label="ศิษย์เก่าร่วมสร้างอนาคต" reduced={reduced} />
          <Stat target={18} suffix="" label="สาขาวิชา" reduced={reduced} />
          <Stat target={1995} suffix="" label="ปีที่เริ่มต้นเรื่องราวของเรา" reduced={reduced} useGrouping={false} />
        </div>
      </section>

      <section id="our-story" className="about-journey about-section" data-chapter aria-labelledby="journey-title">
        <div className="about-shell">
          <div className="about-section-heading" data-about-reveal>
            <div><span className="about-eyebrow">01 / OUR JOURNEY</span><h2 id="journey-title">จากก้าวแรก<br /><em>สู่อนาคตที่เราสร้างร่วมกัน</em></h2></div>
            <p>จาก 1 มีนาคม 2538 จนถึงวันนี้<br />เรื่องราวของวิทยาลัยที่เติบโตไปพร้อมกับ<br />คน ชุมชน และอุตสาหกรรมตะวันออก</p>
          </div>
          <div className="about-journey-grid">
            <div className="about-journey-visual">
              <div className="about-journey-frame">
                {TIMELINE.map((item, i) => <img key={item.y} src={item.img} alt="" loading="lazy" className={milestone === i ? 'is-active' : ''} />)}
                <span className="about-journey-count" role="img" aria-label={`ภาพที่ ${milestone + 1} จาก ${TIMELINE.length}`}>{String(milestone + 1).padStart(2, '0')} / {String(TIMELINE.length).padStart(2, '0')}</span>
                <div className="about-journey-stamp"><span>พ.ศ.</span><strong key={TIMELINE[milestone].y}>{TIMELINE[milestone].y}</strong></div>
                <span className="about-image-caption">ภาพบรรยากาศและการเรียนรู้ในวิทยาลัย</span>
              </div>
              <nav className="about-year-links" aria-label="เลือกปีในประวัติวิทยาลัย">{TIMELINE.map((item, i) => <a key={item.y} href={`#year-${item.y}`} aria-current={milestone === i ? 'step' : undefined}>{item.y}</a>)}</nav>
            </div>
            <ol className="about-timeline">
              {TIMELINE.map((item, i) => <li key={item.y} id={`year-${item.y}`} data-milestone className={milestone === i ? 'is-active' : ''}>
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
            <div className="about-value-image" id="about-value-image" role="img" aria-label={`ภาพประกอบปรัชญา ${PHILOSOPHY[value].th}`}>
              {PHILOSOPHY.map((item, i) => <img key={item.num} src={item.img} alt="" loading="lazy" className={value === i ? 'is-active' : ''} />)}
              <div className="about-value-caption" key={value}><span>{PHILOSOPHY[value].num} / 05</span><strong>{PHILOSOPHY[value].en}</strong></div>
            </div>
            <div className="about-values-list" role="group" aria-label="เลือกปรัชญาวิทยาลัย">
              {PHILOSOPHY.map((item, i) => <button key={item.num} type="button" aria-pressed={value === i} aria-controls="about-value-image" onClick={() => setValue(i)} className={value === i ? 'is-active' : ''}>
                <span className="about-value-number">{item.num}</span><span><strong>{item.th}</strong><small>{item.d}</small></span><Icon name="arrow" />
              </button>)}
            </div>
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
        <div className="about-closing-photo" data-parallax><img src="/assets/slide-4-community.webp" alt="บรรยากาศการสำเร็จการศึกษาของนักศึกษา EEC" loading="lazy" /></div>
        <div className="about-shell about-closing-inner" data-about-reveal><span className="about-eyebrow">THE NEXT CHAPTER IS YOURS</span><h2 id="closing-title">เรื่องราวบทต่อไป<br /><em>เริ่มต้นที่คุณ</em></h2><p>ร่วมเป็นส่วนหนึ่งของครอบครัว EEC<br />เปิดรับสมัครนักศึกษาใหม่ ปีการศึกษา 2569</p><div className="about-actions"><a className="about-button" href="/admission/">สมัครเรียนออนไลน์ <Icon name="arrow" /></a><a className="about-button about-button-outline" href="/courses/">ค้นหาหลักสูตรที่ใช่ <Icon name="arrow" /></a></div></div>
      </section>
    </main>
  );
}
