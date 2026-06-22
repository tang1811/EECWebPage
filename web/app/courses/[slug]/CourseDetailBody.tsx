'use client';

// ─────────────────────────────────────────────────────────────
// Course Detail — Web Cinematic
// Ported from prototype course-detail-cinematic.jsx.
// Receives the resolved `course` from the server page; renders
// cinematic scenes per course. Reuses .cine-* + .cd-* styles.
// Internal links use clean routes; assets served from /assets.
// ─────────────────────────────────────────────────────────────

import { useRef, useState, useEffect, useMemo, type RefObject } from 'react';
import { COURSES, getCourseDetail, type Course, type CourseDetail } from './course-data';
import { Icon } from '../../components/chrome';
import GALLERY from '../../../public/assets/courses/depts/gallery.json';
import VIDEOS from '../../../public/assets/courses/videos/videos.json';

const DEPT_GALLERY = GALLERY as Record<string, string[]>;
const DEPT_VIDEO = VIDEOS as Record<string, { src: string; poster: string }>;

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

// ── HERO ────────────────────────────────────────────────────
function CDHero({ course, detail }: { course: Course; detail: CourseDetail }) {
  const ref = useRef<HTMLElement>(null);
  const p = useSceneProgress(ref);
  const scale = 1.05 + p * 0.12;
  const fadeIn = Math.min(1, p * 4);
  const fadeOut = Math.max(0, 1 - Math.max(0, p - 0.75) * 4);
  const opacity = Math.min(fadeIn, fadeOut);
  return (
    <section ref={ref} className="cine-scene cd-hero" style={{ '--dept': course.color || 'var(--green-700)' }}>
      <div className="cine-bg">
        <img src={course.img} alt="" className="cine-bg-img" style={{ transform: `scale(${scale})` }} />
        <div className="cine-tint cd-hero-tint" style={{ background: `linear-gradient(135deg, ${course.color || '#026451'}cc 0%, rgba(0,0,0,0.85) 70%)` }} />
      </div>
      <div className="cine-content cd-hero-content" style={{ opacity }}>
        <div className="cd-crumbs">
          <a href="/">หน้าแรก</a>
          <span>·</span>
          <a href="/courses">หลักสูตร</a>
          <span>·</span>
          <span>{course.code}</span>
        </div>
        <div className="cd-meta">
          <span className="cd-meta-code">{course.code}</span>
          <span className="cd-meta-cat">{course.cat}</span>
          {course.hot && <span className="cd-meta-hot">HOT · รับสมัครเร่งด่วน</span>}
        </div>
        <h1 className="cine-h1 cd-h1"><em>{course.name}</em></h1>
        <p className="cd-overview">{detail.overview}</p>
        <div className="cd-cta">
          <a href="/admission" className="cine-cta-btn primary">สมัครสาขานี้ <span className="cine-cta-arrow">→</span></a>
          <a href="/contact" className="cine-cta-btn ghost">สอบถามเพิ่มเติม</a>
        </div>
      </div>
      <div className="cine-scroll-cue"><span>SCROLL TO EXPLORE</span><div className="cine-scroll-line"><div /></div></div>
    </section>
  );
}

// ── FACTS ──────────────────────────────────────────────────
function CDFacts({ course }: { course: Course }) {
  const ref = useRef<HTMLElement>(null);
  const p = useSceneProgress(ref);
  const isCert = course.code === 'ปวช.';
  const facts = [
    { label: 'ระดับ', value: course.code, sub: isCert ? 'Vocational Cert.' : 'Higher Cert.' },
    { label: 'ระยะเวลา', value: isCert ? '3 ปี' : '2 ปี', sub: isCert ? '6 ภาคเรียน' : '4 ภาคเรียน' },
    { label: 'หน่วยกิต', value: isCert ? '101' : '87', sub: 'หลักสูตร 2567' },
    { label: 'ทวิภาคี', value: '✓', sub: 'ฝึกงานนิคม EEC' },
  ];
  return (
    <section ref={ref} className="cine-scene cd-facts">
      <div className="cd-facts-head" style={{ opacity: Math.min(1, p * 4) }}>
        <div className="cine-stats-eyebrow" style={{ textAlign: 'center', backgroundSize: 'cover', backgroundPosition: 'center center', width: '300px', padding: '2px 0px 0px', margin: '0px' }}><span />QUICK FACTS · ข้อมูลหลักสูตร<span /></div>
      </div>
      <div className="cd-facts-grid">
        {facts.map((f, i) => {
          const localP = Math.max(0, Math.min(1, (p - 0.1 - i * 0.05) * 3));
          return (
            <div key={i} className="cd-fact" style={{ opacity: localP, transform: `translateY(${(1 - localP) * 30}px)` }}>
              <div className="cd-fact-label">{f.label}</div>
              <div className="cd-fact-value">{f.value}</div>
              <div className="cd-fact-sub">{f.sub}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── SKILLS ─────────────────────────────────────────────────
function CDSkills({ course, detail }: { course: Course; detail: CourseDetail }) {
  const ref = useRef<HTMLElement>(null);
  const p = useSceneProgress(ref);
  return (
    <section ref={ref} className="cine-scene cd-skills">
      <div className="cd-skills-head" style={{ opacity: Math.min(1, p * 4) }}>
        <div className="cine-stats-eyebrow"><span />WHAT YOU&apos;LL LEARN · สมรรถนะที่จะได้รับ<span /></div>
        <h2 className="cine-h2"><em>4 ทักษะ</em> ที่ทำให้คุณ<br />เป็นมืออาชีพ</h2>
      </div>
      <div className="cd-skills-grid">
        {detail.skills.map((s, i) => {
          const localP = Math.max(0, Math.min(1, (p - 0.2 - i * 0.06) * 3));
          return (
            <div key={i} className="cd-skill" style={{ opacity: localP, transform: `translateY(${(1 - localP) * 30}px) scale(${0.95 + localP * 0.05})`, '--dept': course.color || 'var(--green-700)' }}>
              <div className="cd-skill-num">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="cd-skill-t">{s.t}</h3>
              <p className="cd-skill-d">{s.d}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── CURRICULUM ─────────────────────────────────────────────
function CDCurriculum({ course }: { course: Course }) {
  const ref = useRef<HTMLElement>(null);
  const p = useSceneProgress(ref);
  const isCert = course.code === 'ปวช.';
  const modules = isCert
    ? [
        { t: 'ทักษะชีวิตและสังคม', c: 22, sub: 'ภาษา · คณิตศาสตร์ · วิทยาศาสตร์ · สังคม · พลศึกษา' },
        { t: 'สมรรถนะวิชาชีพ', c: 71, sub: 'วิชาแกน · วิชาสาขา · โครงงาน · ทวิภาคี' },
        { t: 'สมรรถนะเลือก', c: 8, sub: 'เลือกตามแผนพัฒนาตนเอง' },
        { t: 'กิจกรรมเสริม', c: 0, sub: '6 ภาคเรียน · ลูกเสือ · ชมรม · จิตอาสา' },
      ]
    : [
        { t: 'ทักษะชีวิตและสังคม', c: 21, sub: 'ภาษา · คณิตศาสตร์ · วิทยาศาสตร์ · สังคม' },
        { t: 'สมรรถนะวิชาชีพ', c: 56, sub: 'วิชาแกน · สาขา · ทวิภาคี · โครงงาน' },
        { t: 'สมรรถนะเลือก', c: 6, sub: 'เลือกตามแผนพัฒนาตนเอง' },
        { t: 'กิจกรรมเสริม', c: 0, sub: '4 ภาคเรียน · กิจกรรมพัฒนาผู้เรียน' },
      ];

  const total = modules.reduce((s, m) => s + m.c, 0);
  return (
    <section ref={ref} className="cine-scene cd-curr">
      <div className="cd-curr-head" style={{ opacity: Math.min(1, p * 4) }}>
        <div className="cine-stats-eyebrow"><span />CURRICULUM · โครงสร้างหลักสูตร<span /></div>
        <h2 className="cine-h2">รวม <em>{total} หน่วยกิต</em></h2>
      </div>
      <div className="cd-curr-list">
        {modules.map((m, i) => {
          const localP = Math.max(0, Math.min(1, (p - 0.15 - i * 0.05) * 3));
          return (
            <div key={i} className="cd-curr-row" style={{ opacity: localP, transform: `translateX(${(1 - localP) * -30}px)` }}>
              <div className="cd-curr-c">{m.c || '—'}</div>
              <div>
                <h3 className="cd-curr-t">{m.t}</h3>
                <p className="cd-curr-sub">{m.sub}</p>
              </div>
              <div className="cd-curr-bar"><div style={{ width: `${(m.c / total) * 100}%`, background: course.color || 'var(--green-500)' }} /></div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── CAREERS ────────────────────────────────────────────────
function CDCareers({ course, detail }: { course: Course; detail: CourseDetail }) {
  const ref = useRef<HTMLElement>(null);
  const p = useSceneProgress(ref);
  return (
    <section ref={ref} className="cine-scene cd-careers" style={{ '--dept': course.color || 'var(--green-700)' }}>
      <div className="cine-bg">
        <img src={course.img} alt="" className="cine-bg-img" style={{ transform: `scale(${1 + p * 0.1}) translateY(${(p - 0.5) * 60}px)` }} />
        <div className="cine-tint" style={{ background: `linear-gradient(180deg, rgba(0,0,0,0.6) 0%, ${course.color || '#026451'}aa 80%, rgba(0,0,0,0.85) 100%)`, mixBlendMode: 'multiply' }} />
        <div className="cine-tint" style={{ background: 'rgba(0,0,0,0.45)' }} />
      </div>
      <div className="cd-careers-content" style={{ opacity: Math.min(1, p * 3) }}>
        <div className="cine-stats-eyebrow"><span />CAREER PATHS · เส้นทางอาชีพ<span /></div>
        <h2 className="cine-h2"><em>{detail.careers.length}+ อาชีพ</em><br />รอคุณอยู่ในนิคม EEC</h2>
        <div className="cd-careers-tags">
          {detail.careers.map((c, i) => {
            const localP = Math.max(0, Math.min(1, (p - 0.2 - i * 0.04) * 4));
            return (
              <span key={i} className="cd-career-tag" style={{ opacity: localP, transform: `translateY(${(1 - localP) * 16}px)` }}>{c}</span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── RELATED COURSES ────────────────────────────────────────
function CDRelated({ course }: { course: Course }) {
  const ref = useRef<HTMLElement>(null);
  const p = useSceneProgress(ref);
  const related = useMemo(() => {
    return COURSES.filter((c) => c.slug !== course.slug && c.cat === course.cat).slice(0, 3);
  }, [course.slug, course.cat]);
  return (
    <section ref={ref} className="cine-scene cd-related">
      <div className="cd-related-head" style={{ opacity: Math.min(1, p * 4) }}>
        <div className="cine-stats-eyebrow"><span />EXPLORE MORE · สาขาในสายเดียวกัน<span /></div>
      </div>
      <div className="cd-related-grid">
        {related.map((c, i) => {
          const localP = Math.max(0, Math.min(1, (p - 0.1 - i * 0.08) * 3));
          return (
            <a key={c.slug} href={`/courses/${c.slug}`} className="cd-related-card" style={{ opacity: localP, transform: `translateY(${(1 - localP) * 30}px)`, '--dept': c.color || 'var(--green-700)' }}>
              <div className="cd-related-img">
                <img src={c.img} alt="" loading="lazy" />
                <div className="cd-related-tint" style={{ background: `linear-gradient(180deg, transparent 30%, ${c.color || '#026451'}cc 100%)` }} />
              </div>
              <div className="cd-related-meta">
                <span className="cd-related-code">{c.code}</span>
                <h3 className="cd-related-n">{c.name}</h3>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

// ── CLOSING CTA ────────────────────────────────────────────
function CDClosing({ course }: { course: Course }) {
  const ref = useRef<HTMLElement>(null);
  const p = useSceneProgress(ref);
  const op = Math.min(1, p * 3);
  return (
    <section ref={ref} className="cine-scene cine-closing cd-closing" style={{ '--dept': course.color || 'var(--green-700)' }}>
      <div className="cine-bg">
        <img src={course.img} alt="" className="cine-bg-img" style={{ transform: `scale(${1 + p * 0.1})` }} />
        <div className="cine-tint cine-tint-strong" />
      </div>
      <div className="cine-closing-content">
        <div className="cine-closing-key" style={{ opacity: op }}>READY TO JOIN?</div>
        <h2 className="cine-closing-head" style={{ opacity: op }}>
          เริ่มเรียน <em>{course.name}</em><br />ปีการศึกษา 2569
        </h2>
        <p className="cine-closing-sub" style={{ opacity: op }}>
          สมัครเรียนออนไลน์ 5 นาที · ทีมงานติดต่อกลับใน 24 ชม.
        </p>
        <div className="cine-closing-cta" style={{ opacity: Math.max(0, Math.min(1, (p - 0.3) * 3)) }}>
          <a href="/admission" className="cine-cta-btn primary">สมัครเรียนตอนนี้<span className="cine-cta-arrow">→</span></a>
          <a href="/courses" className="cine-cta-btn ghost">ดูสาขาทั้งหมด</a>
        </div>
      </div>
    </section>
  );
}

// ── BODY ───────────────────────────────────────────────────
// ── Scene: บรรยากาศการเรียน (real department photos + lightbox) ──
function CDGallery({ course, photos }: { course: Course; photos: string[] }) {
  const ref = useRef<HTMLElement>(null);
  const p = useSceneProgress(ref);
  const [active, setActive] = useState<number | null>(null);
  const open = active !== null;

  const close = () => setActive(null);
  const step = (d: number) => setActive((a) => (a === null ? a : (a + d + photos.length) % photos.length));

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
  }, [open, photos.length]);

  return (
    <section ref={ref} className="cine-scene cd-gallery" style={{ '--dept': course.color || 'var(--green-700)' }}>
      <div className="cd-gallery-head" style={{ opacity: Math.min(1, p * 4) }}>
        <span className="cine-eyebrow">บรรยากาศการเรียน</span>
        <h2 className="cine-h2">ห้องเรียน เครื่องมือ<br />และงานจริงของสาขา</h2>
      </div>
      <div className="cd-gallery-grid">
        {photos.map((src, i) => {
          const localP = Math.min(1, Math.max(0, (p - 0.1 - i * 0.04) * 5));
          return (
            <button key={src} type="button"
              className={`cd-gallery-item ${i === 0 ? 'cd-gallery-lead' : ''}`}
              style={{ opacity: localP, transform: `translateY(${(1 - localP) * 28}px)` }}
              onClick={() => setActive(i)}
              aria-label={`ดูรูปขนาดเต็ม ${i + 1}`}>
              <img src={src} alt={`${course.name} — บรรยากาศการเรียน ${i + 1}`} loading="lazy" />
              <span className="cd-gallery-zoom" aria-hidden="true">
                <Icon name="plus" style={{ width: 18, height: 18 }} />
              </span>
            </button>
          );
        })}
      </div>

      {open && (
        <div className="cd-lightbox" role="dialog" aria-modal="true" aria-label="รูปขนาดเต็ม" onClick={close}>
          <button className="cd-lb-close" onClick={close} aria-label="ปิด"><Icon name="close" style={{ width: 26, height: 26 }} /></button>
          {photos.length > 1 && (
            <button className="cd-lb-nav cd-lb-prev" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="รูปก่อนหน้า">
              <Icon name="chevronDown" style={{ width: 30, height: 30 }} />
            </button>
          )}
          <figure className="cd-lb-stage" onClick={(e) => e.stopPropagation()}>
            <img src={photos[active]} alt={`${course.name} — บรรยากาศการเรียน ${active + 1}`} />
            <figcaption className="cd-lb-cap">{course.name} · {active + 1} / {photos.length}</figcaption>
          </figure>
          {photos.length > 1 && (
            <button className="cd-lb-nav cd-lb-next" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="รูปถัดไป">
              <Icon name="chevronDown" style={{ width: 30, height: 30 }} />
            </button>
          )}
        </div>
      )}
    </section>
  );
}

// ── Scene: รีวิวแผนก (department review video) ───────────────
function CDVideo({ course, video }: { course: Course; video: { src: string; poster: string } }) {
  const ref = useRef<HTMLElement>(null);
  const p = useSceneProgress(ref);
  return (
    <section ref={ref} className="cine-scene cd-video" style={{ '--dept': course.color || 'var(--green-700)' }}>
      <div className="cd-video-head" style={{ opacity: Math.min(1, p * 4) }}>
        <span className="cine-eyebrow">รีวิวแผนก</span>
        <h2 className="cine-h2">ดูบรรยากาศจริง<br />ของ{course.name}</h2>
      </div>
      <div className="cd-video-stage" style={{ opacity: Math.min(1, Math.max(0, (p - 0.1) * 4)) }}>
        <video controls preload="none" poster={video.poster} playsInline>
          <source src={video.src} type="video/mp4" />
        </video>
      </div>
    </section>
  );
}

export default function CourseDetailBody({ course }: { course: Course }) {
  const detail = getCourseDetail(course.slug, course);
  const gallery = DEPT_GALLERY[course.slug] ?? [];
  const video = DEPT_VIDEO[course.slug];
  return (
    <main className="cine-main cd-main">
      <CDHero course={course} detail={detail} />
      <CDFacts course={course} />
      <CDSkills course={course} detail={detail} />
      <CDCurriculum course={course} />
      {video && <CDVideo course={course} video={video} />}
      {gallery.length > 0 && <CDGallery course={course} photos={gallery} />}
      <CDCareers course={course} detail={detail} />
      <CDRelated course={course} />
      <CDClosing course={course} />
    </main>
  );
}
