import { useRef, useState, useEffect, type MouseEvent, type ReactNode } from 'react';
import { getCourseDetail, type Course, type CourseDetail, type CoursePhoto } from '../../data/course-data';
import { ONLINE_ADMISSION_ENABLED } from '../../config';
import { Icon } from './chrome-lite';
import GALLERY from '../../../public/assets/courses/depts/gallery.json';
import VIDEOS from '../../../public/assets/courses/videos/videos.json';

const DEPT_GALLERY = GALLERY as Record<string, string[]>;
const DEPT_VIDEO = VIDEOS as Record<string, { src: string; poster: string }>;

type WebkitFullscreenElement = HTMLElement & { webkitRequestFullscreen?: () => void };
type WebkitFullscreenVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

function requestVideoFullscreen(element: HTMLElement, video?: HTMLVideoElement) {
  if (document.fullscreenElement) return;
  if (element.requestFullscreen) {
    void element.requestFullscreen().catch(() => undefined);
    return;
  }
  const webkitElement = element as WebkitFullscreenElement;
  if (webkitElement.webkitRequestFullscreen) {
    webkitElement.webkitRequestFullscreen();
    return;
  }
  (video as WebkitFullscreenVideo | undefined)?.webkitEnterFullscreen?.();
}

function SectionHeading({ label, children }: { label: string; children: ReactNode }) {
  return <header className="cd-section-head"><p className="cine-stats-eyebrow">{label}</p><h2 className="cine-h2">{children}</h2></header>;
}

function CDHero({ course, detail }: { course: Course; detail: CourseDetail }) {
  const hero: CoursePhoto = detail.hero ?? { src: course.img || '/assets/logo.png', alt: `ภาพประกอบสาขา${course.name}` };
  return <section className="cine-scene cd-hero"><div className="cd-hero-shell">
    <div className="cd-hero-content">
      <nav className="cd-crumbs" aria-label="เส้นทางหน้าเว็บ"><a href="/">หน้าแรก</a><span>·</span><a href="/courses/">หลักสูตร</a><span>·</span><span>{course.code}</span></nav>
      <div className="cd-meta"><span className="cd-meta-code">{course.code}</span><span>{course.cat}</span>{course.slug === 'pt-electrical' && <span>หลักสูตรต่อเนื่อง</span>}{course.dualVocational && <span>ทวิภาคี</span>}</div>
      <h1 className="cine-h1 cd-h1"><em>{course.name}</em></h1>
      {detail.sourceName && <p className="cd-source-name">ชื่อในเอกสารแนะนำแผนก: {detail.sourceName}</p>}
      <p className="cd-overview">{detail.overview}</p>
      <div className="cd-cta"><a href={ONLINE_ADMISSION_ENABLED ? '/admission/' : '/contact/'} className="cine-cta-btn primary">{ONLINE_ADMISSION_ENABLED ? 'สมัครเรียน' : 'สอบถามการสมัครเรียน'}<span aria-hidden="true"> →</span></a><a href="#course-learning" className="cine-cta-btn ghost">ดูสิ่งที่จะได้เรียน</a></div>
    </div>
    {hero.src && <figure className={`cd-hero-photo ${hero.kind === 'cutout' ? 'cd-photo-cutout' : ''}`}><img src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} fetchPriority="high" /><figcaption>{hero.alt}</figcaption></figure>}
  </div></section>;
}

function CDFacts({ course, detail }: { course: Course; detail: CourseDetail }) {
  const isCert = course.code === 'ปวช.';
  const isBachelor = course.code === 'ป.ตรี';
  const facts = [
    { label: 'ระดับการศึกษา', value: course.code, sub: isCert ? 'ประกาศนียบัตรวิชาชีพ' : isBachelor ? 'ปริญญาตรี (ต่อเนื่อง)' : 'ประกาศนียบัตรวิชาชีพชั้นสูง' },
    { label: 'ระยะเวลาเรียน', value: isCert ? '3 ปี' : '2 ปี', sub: isBachelor ? 'ปีแรกเรียน · ปีที่ 2 ฝึกงาน' : 'เรียนภาคทฤษฎีและภาคปฏิบัติ' },
    { label: 'วุฒิที่ใช้สมัคร', value: isCert ? 'ม.3' : isBachelor ? 'ปวส.' : 'ปวช. / ม.6', sub: detail.admission ?? (isCert ? 'สำเร็จการศึกษาระดับมัธยมศึกษาปีที่ 3' : 'ปวช. สายตรง หรือ ม.6 / เทียบเท่า สอบถามเงื่อนไขของสาขาที่สนใจ') },
    { label: 'รูปแบบการเรียน', value: detail.schedule ?? (course.dualVocational ? 'ทฤษฎี + ปฏิบัติ / รอบบ่าย หลักสูตรสำหรับคนทำงาน' : 'ทฤษฎี + ปฏิบัติ'), sub: isBachelor ? 'เหมาะกับผู้มีงานประจำ สอบถามตารางของรอบที่สมัคร' : course.dualVocational ? 'สอบถามแผนฝึกและสถานประกอบการของรอบที่สมัคร' : 'สอบถามวันเรียนและรูปแบบฝึกงานกับวิทยาลัย' },
  ];
  return <section className="cine-scene cd-facts" aria-labelledby="course-facts-title"><h2 id="course-facts-title" className="cd-small-heading">ข้อมูลหลักสูตร</h2><dl className="cd-facts-grid">{facts.map((fact) => <div key={fact.label} className="cd-fact"><dt className="cd-fact-label">{fact.label}</dt><dd className="cd-fact-value">{fact.value}</dd><dd className="cd-fact-sub">{fact.sub}</dd></div>)}</dl></section>;
}

function CDSkills({ detail, photos }: { detail: CourseDetail; photos: CoursePhoto[] }) {
  return <section id="course-learning" className="cine-scene cd-skills">
    <SectionHeading label="สิ่งที่จะได้เรียน">ทักษะและความรู้<em>ของสาขานี้</em></SectionHeading>
    <CDGallery skills={detail.skills} photos={photos} />
  </section>;
}

function CDLearning({ detail }: { detail: CourseDetail }) {
  if (!detail.learningPlan?.length && !detail.labs?.length) return null;
  return <section className="cine-scene cd-curr">
    <SectionHeading label="การเรียนและการฝึกปฏิบัติ">เรียนรู้หลักการ<em>พร้อมลงมือทำ</em></SectionHeading>
    {detail.learningPlan && <ol className="cd-curr-list">{detail.learningPlan.map((item, i) => <li key={item.t} className="cd-curr-row"><span className="cd-curr-c" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><div><h3 className="cd-curr-t">{item.t}</h3><p className="cd-curr-sub">{item.d}</p></div></li>)}</ol>}
    {detail.labs && <div className="cd-labs"><h3>ห้องปฏิบัติการและชุดฝึก</h3><ul>{detail.labs.map((lab) => <li key={lab}><Icon name="check" style={{ width: 18, height: 18 }} /><span>{lab}</span></li>)}</ul></div>}
  </section>;
}

function CDGallery({ skills, photos }: { skills: CourseDetail['skills']; photos: CoursePhoto[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLAnchorElement | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const skillPhotos = skills.map((_, index) => photos.length > 0 ? photos[index % photos.length] : undefined);
  const close = () => dialog.current?.close();
  const step = (direction: number) => setActive((current) => current === null ? null : (current + direction + skills.length) % skills.length);
  useEffect(() => {
    if (active === null || !dialog.current) return;
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    if (!element.open) element.showModal();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; };
  }, [active]);
  const openPhoto = (event: MouseEvent<HTMLAnchorElement>, index: number) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault(); trigger.current = event.currentTarget; setActive(index);
  };
  return <>
    <div className="cd-skills-grid">{skills.map((skill, i) => {
      const photo = skillPhotos[i];
      return <article key={skill.t} className="cd-skill">
        <div className="cd-skill-content"><div className="cd-skill-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</div><h3 className="cd-skill-t">{skill.t}</h3><p className="cd-skill-d">{skill.d}</p></div>
        {photo && <figure className="cd-skill-photo"><a className={`cd-gallery-item ${photo.kind === 'cutout' ? 'cd-photo-cutout' : ''}`} href={photo.src} onClick={(event) => openPhoto(event, i)} aria-label={`ดูภาพขนาดเต็ม: ${photo.alt}`}><img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" /><span className="cd-gallery-zoom" aria-hidden="true"><Icon name="plus" style={{ width: 18, height: 18 }} /></span></a></figure>}
      </article>;
    })}</div>
    <dialog ref={dialog} className="cd-photo-dialog" aria-label="ภาพแนะนำแผนกขนาดเต็ม"
      onClose={() => { setActive(null); trigger.current?.focus({ preventScroll: true }); }}
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
        if (event.key === 'Tab') {
          const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('button');
          const first = buttons[0];
          const last = buttons[buttons.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        }
      }}>
      {active !== null && skillPhotos[active] && <div className="cd-dialog-content"><button type="button" className="cd-dialog-close" onClick={close} aria-label="ปิดภาพ">×</button><figure className="cd-dialog-photo"><img src={skillPhotos[active].src} alt={skillPhotos[active].alt} /><figcaption aria-live="polite">{skills[active].t} · {active + 1} / {skills.length}</figcaption></figure>{skills.length > 1 && <div className="cd-dialog-controls"><button type="button" onClick={() => step(-1)} aria-label="ภาพก่อนหน้า">← ก่อนหน้า</button><button type="button" onClick={() => step(1)} aria-label="ภาพถัดไป">ถัดไป →</button></div>}</div>}
    </dialog>
  </>;
}

function CDVideo({ course, detail }: { course: Course; detail: CourseDetail }) {
  const [play, setPlay] = useState(false);
  const [mp4Started, setMp4Started] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const mp4 = DEPT_VIDEO[course.slug];
  const id = detail.video;
  if (!id && !mp4) return null;
  const playYouTube = () => {
    if (frame.current) requestVideoFullscreen(frame.current);
    setPlay(true);
  };
  const playMp4 = () => {
    if (!stage.current || !video.current) return;
    requestVideoFullscreen(stage.current, video.current);
    setMp4Started(true);
    void video.current.play().catch(() => undefined);
  };
  return <section className="cine-scene cd-video"><SectionHeading label="วิดีโอแนะนำแผนก">รู้จัก{course.name}</SectionHeading>
    {id ? <div ref={frame} className="cd-video-frame">{play ? <iframe className="cd-video-embed" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={`วิดีโอแนะนำแผนก${course.name}`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen /> : <button type="button" className="cd-video-poster" onClick={playYouTube} aria-label={`เล่นวิดีโอแนะนำแผนก${course.name}แบบเต็มหน้าจอ`}><img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" /><span className="cd-video-play" aria-hidden="true">▶</span></button>}</div> : mp4 && <div ref={stage} className="cd-video-stage"><video ref={video} controls preload="none" poster={mp4.poster} playsInline aria-label={`วิดีโอแนะนำแผนก${course.name}`}><source src={mp4.src} type="video/mp4" /></video>{!mp4Started && <button type="button" className="cd-video-poster cd-video-local-poster" onClick={playMp4} aria-label={`เล่นวิดีโอแนะนำแผนก${course.name}แบบเต็มหน้าจอ`}><img src={mp4.poster} alt="" /><span className="cd-video-play" aria-hidden="true">▶</span></button>}</div>}
  </section>;
}

function CDFee({ detail }: { detail: CourseDetail }) {
  if (!detail.fees) return null;
  const fees = detail.fees;
  return <section className="cine-scene cd-fees"><SectionHeading label="ปริญญาตรีต่อเนื่อง">ค่าใช้จ่าย<em>ตามเอกสารแนะนำหลักสูตร</em></SectionHeading><div className="cd-fee-card"><p>ค่าใช้จ่ายรวมตลอดหลักสูตร 2 ปี</p><p className="cd-fee-total">{fees.total.toLocaleString('th-TH')} <span>บาท</span></p><ul><li>แบ่งชำระ {fees.installments} งวด</li><li>วิชาปรับพื้นฐานเพิ่ม {fees.foundation.toLocaleString('th-TH')} บาท เฉพาะผู้ที่ต้องเรียน</li></ul><p className="cd-fee-note">{fees.note}</p><a href="/contact/">สอบถามค่าใช้จ่ายรอบปัจจุบัน →</a></div></section>;
}

function CDCareers({ detail }: { detail: CourseDetail }) {
  return <section className="cine-scene cd-careers"><div className="cd-careers-content"><SectionHeading label="เส้นทางอาชีพ">นำทักษะไปใช้<em>ในงานที่สนใจ</em></SectionHeading><ul className="cd-careers-tags">{detail.careers.map((career) => <li key={career} className="cd-career-tag">{career}</li>)}</ul></div></section>;
}

export default function CourseDetailBody({ course }: { course: Course }) {
  const detail = getCourseDetail(course.slug, course);
  const gallery = detail.gallery ?? (DEPT_GALLERY[course.slug] ?? []).map((src, i) => ({ src, alt: `${course.name} · ภาพการเรียน ${i + 1}` }));
  return <main className="cine-main cd-main cd-department" style={{ '--dept': course.color || '#0aa183' }}>
    <CDHero course={course} detail={detail} /><CDFacts course={course} detail={detail} /><CDSkills detail={detail} photos={gallery} /><CDLearning detail={detail} />
    <CDVideo course={course} detail={detail} /><CDFee detail={detail} /><CDCareers detail={detail} />
    {detail.source && <aside className="cd-source"><p>ข้อมูลการเรียนและห้องปฏิบัติการอ้างอิงจากเอกสารแนะนำแผนกของวิทยาลัย</p><a href={`${detail.source.url}#${detail.source.pages[0]}`} target="_blank" rel="noreferrer">ดูเอกสารแนะนำแผนก (หน้า {detail.source.pages.join(', ')}) ↗</a></aside>}
    <section className="cine-scene cd-closing"><div className="cd-closing-inner"><p className="cine-stats-eyebrow">วางแผนเรียนต่อ</p><h2 className="cine-h2">สนใจเรียน{course.name}</h2><p>สอบถามคุณสมบัติ วันเรียน ค่าใช้จ่าย และรอบรับสมัครกับวิทยาลัย</p><div className="cd-cta"><a href="/contact/" className="cine-cta-btn primary">ติดต่อสอบถาม →</a><a href="/courses/" className="cine-cta-btn ghost">ดูหลักสูตรอื่น ๆ</a><a href="tel:038494066" className="cine-cta-btn ghost">โทร 038 494 066</a></div></div></section>
  </main>;
}
